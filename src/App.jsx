import { useState, useRef, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App() {
  const [file, setFile] = useState(null)
  const [mediaInfo, setMediaInfo] = useState(null)
  const [frameData, setFrameData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(true)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState('')
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('zh')
  const ffmpegRef = useRef(new FFmpeg())

  useEffect(() => {
    loadFFmpeg()
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedLanguage = localStorage.getItem('language') || 'zh'
    setTheme(savedTheme)
    setLanguage(savedLanguage)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current
    try {
      setLoadingFFmpeg(true)
      
      ffmpeg.on('log', ({ message }) => {
        console.log(message)
      })

      ffmpeg.on('progress', ({ progress: prog }) => {
        setProgress(`Processing: ${Math.round(prog * 100)}%`)
      })

      // Load FFmpeg from local public directory
      const baseURL = window.location.origin + '/ffmpeg'
      await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        workerURL: `${baseURL}/ffmpeg-core.worker.js`,
      })
      
      setLoadingFFmpeg(false)
      setError(null)
    } catch (err) {
      console.error('Failed to load FFmpeg:', err)
      setError('Failed to load FFmpeg. Please refresh the page.')
      setLoadingFFmpeg(false)
    }
  }

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile)
      setMediaInfo(null)
      setFrameData([])
      setError(null)
      parseMediaInfo(selectedFile)
    }
  }

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const handleLanguageToggle = () => {
    setLanguage(prevLang => prevLang === 'zh' ? 'en' : 'zh')
  }

  const parseMediaInfo = async (fileToProcess) => {
    const targetFile = fileToProcess || file
    if (!targetFile) {
      setError('Please select a media file first')
      return
    }

    const ffmpeg = ffmpegRef.current
    setLoading(true)
    setError(null)
    setProgress(language === 'zh' ? '正在读取文件...' : 'Reading file...')

    const capturedLogs = []
    const fileName = targetFile.name

    try {
      console.log('Starting media analysis for:', fileName)

      // Set up log capture
      const logHandler = ({ message }) => {
        capturedLogs.push(message)
        console.log('[FFmpeg]', message)
      }

      ffmpeg.on('log', logHandler)

      console.log('Writing file to FFmpeg virtual filesystem...')
      await ffmpeg.writeFile(fileName, await fetchFile(targetFile))
      console.log('File written successfully')

      setProgress(language === 'zh' ? '正在分析媒体信息...' : 'Analyzing media info...')

      // Simple probe: just read the file info without processing
      console.log('Running FFmpeg probe command...')
      try {
        await ffmpeg.exec(['-i', fileName])
      } catch (e) {
        // FFmpeg returns error code when no output is specified, but logs are captured
        console.log('FFmpeg exec completed (expected error for probe)')
      }

      console.log('Parsing logs, total entries:', capturedLogs.length)

      // Parse FFmpeg logs for media information
      const info = parseFFmpegLogs(capturedLogs, targetFile)
      setMediaInfo(info)

      console.log('Media info parsed:', info)

      // Analyze all frames using showinfo filter
      setProgress(language === 'zh' ? '正在分析帧信息...' : 'Analyzing frames...')
      const frames = await analyzeAllFrames(ffmpeg, fileName, info)
      setFrameData(frames)
      console.log('Frame data analyzed:', frames.length, 'frames')

      setProgress(language === 'zh' ? '分析完成！' : 'Complete!')

      // Clean up
      console.log('Cleaning up...')
      await ffmpeg.deleteFile(fileName)

      // Remove log handler
      ffmpeg.off('log', logHandler)

      console.log('Analysis complete!')
    } catch (err) {
      console.error('Error parsing media:', err)
      console.error('Error stack:', err.stack)

      // Even on error, try to parse what we have
      const info = parseFFmpegLogs(capturedLogs, targetFile)
      setMediaInfo(info)

      // Try to analyze frames even if basic analysis failed
      try {
        console.log('Attempting frame analysis despite error...')
        const frames = await analyzeAllFrames(ffmpeg, fileName, info)
        setFrameData(frames)
      } catch (frameErr) {
        console.error('Frame analysis also failed:', frameErr)
        setFrameData([])
      }

      setProgress(language === 'zh' ? '分析完成！' : 'Analysis complete!')
    } finally {
      setLoading(false)
    }
  }

  const analyzeAllFrames = async (ffmpeg, fileName, mediaInfo) => {
    const frameLogs = []
    let lastFrameCount = 0
    let estimatedTotalFrames = 1000 // Default estimate

    // Try to estimate total frames from media info
    if (mediaInfo.duration && mediaInfo.frameRate) {
      const durationMatch = mediaInfo.duration.match(/(\d+):(\d+)/)
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1])
        const seconds = parseInt(durationMatch[2])
        const totalSeconds = minutes * 60 + seconds
        const fps = parseFloat(mediaInfo.frameRate)
        estimatedTotalFrames = Math.round(totalSeconds * fps)
        console.log(`Estimated total frames: ${estimatedTotalFrames}`)
      }
    }

    try {
      console.log('Starting full frame analysis for entire file...')

      // Clear previous log handler and set up new one for frame analysis
      const frameLogHandler = ({ message }) => {
        frameLogs.push(message)
        // Update progress for every 50 frames
        if (message.includes('Parsed_showinfo')) {
          const frameMatch = message.match(/n:\s*(\d+)/)
          if (frameMatch) {
            const frameNum = parseInt(frameMatch[1])
            if (frameNum % 50 === 0 && frameNum !== lastFrameCount) {
              lastFrameCount = frameNum
              const percentage = Math.min(Math.round((frameNum / estimatedTotalFrames) * 100), 99)
              setProgress(`${percentage}%`)
              console.log(`Processing frame ${frameNum}... (${percentage}%)`)
            }
          }
        }
      }

      ffmpeg.on('log', frameLogHandler)

      // Use showinfo filter to get detailed frame information
      // Process entire file without time limit
      console.log('Executing FFmpeg with showinfo filter...')

      try {
        await ffmpeg.exec([
          '-i', fileName,
          '-vf', 'showinfo',  // Show detailed frame info
          '-an',              // Disable audio
          '-f', 'null',       // No output file
          '-'
        ])
      } catch (e) {
        // FFmpeg may return error code but logs are captured
        console.log('FFmpeg frame analysis completed')
      }

      // Remove frame log handler
      ffmpeg.off('log', frameLogHandler)

      console.log(`Captured ${frameLogs.length} log entries, parsing frames...`)

      // Parse frame data from logs
      const frames = parseShowinfoLogs(frameLogs)

      console.log(`Successfully parsed ${frames.length} frames`)

      return frames
    } catch (err) {
      console.error('Error analyzing frames:', err)
      return []
    }
  }

  const parseShowinfoLogs = (logs) => {
    const frames = []

    // showinfo filter outputs frame information in this format:
    // [Parsed_showinfo_0 @ ...] n:0 pts:0 pts_time:0 pos:... fmt:... sar:... s:...x... i:P iskey:1 type:I ...

    for (const log of logs) {
      if (log.includes('Parsed_showinfo')) {
        const frameInfo = {}

        // Extract frame number
        const nMatch = log.match(/n:\s*(\d+)/)
        if (nMatch) frameInfo.number = parseInt(nMatch[1])

        // Extract PTS time (timestamp)
        const ptsTimeMatch = log.match(/pts_time:\s*([\d.]+)/)
        if (ptsTimeMatch) {
          frameInfo.timestamp = parseFloat(ptsTimeMatch[1]).toFixed(3) + 's'
          frameInfo.pts_time = parseFloat(ptsTimeMatch[1])
        }

        // Extract frame type (I, P, B)
        const typeMatch = log.match(/type:\s*([IPB])/)
        if (typeMatch) {
          frameInfo.type = typeMatch[1]
        }

        // Extract picture type (alternative)
        const pictTypeMatch = log.match(/pict_type:\s*([IPB])/)
        if (pictTypeMatch && !frameInfo.type) {
          frameInfo.type = pictTypeMatch[1]
        }

        // Extract key frame info
        const iskeyMatch = log.match(/iskey:\s*(\d+)/)
        if (iskeyMatch) {
          frameInfo.isKey = iskeyMatch[1] === '1'
        }

        // Extract packet size if available
        const sizeMatch = log.match(/pkt_size:\s*(\d+)/)
        if (sizeMatch) {
          const bytes = parseInt(sizeMatch[1])
          frameInfo.size = formatFileSize(bytes)
          frameInfo.sizeBytes = bytes
        }

        // Calculate bitrate if we have size and timestamp
        if (frameInfo.sizeBytes && frameInfo.number !== undefined && frameInfo.number > 0) {
          // Estimate bitrate based on frame size (bits per second)
          const bitsPerSecond = (frameInfo.sizeBytes * 8) / (1 / 30) // Assume 30fps
          frameInfo.bitrate = Math.round(bitsPerSecond / 1000) + ' kbps'
        }

        // Only add if we have valid frame data
        if (frameInfo.number !== undefined) {
          // Set default values if not found
          if (!frameInfo.type) frameInfo.type = 'P'
          if (!frameInfo.timestamp) frameInfo.timestamp = (frameInfo.number / 30).toFixed(3) + 's'
          if (!frameInfo.size) frameInfo.size = 'N/A'
          if (!frameInfo.bitrate) frameInfo.bitrate = 'N/A'
          if (frameInfo.isKey === undefined) frameInfo.isKey = frameInfo.type === 'I'

          frames.push(frameInfo)
        }
      }
    }

    return frames
  }

  const parseFFmpegLogs = (logMessages, file) => {
    const info = {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type || 'Unknown',
      lastModified: new Date(file.lastModified).toLocaleString(),
    }

    // Parse FFmpeg output for metadata
    const logText = logMessages.join('\n')

    // Extract duration
    const durationMatch = logText.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/)
    if (durationMatch) {
      const hours = parseInt(durationMatch[1])
      const minutes = parseInt(durationMatch[2])
      const seconds = parseFloat(durationMatch[3])
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      info.duration = formatDuration(totalSeconds)
      info.durationSeconds = totalSeconds
    }

    // Extract start time
    const startMatch = logText.match(/start: ([\d.]+)/)
    if (startMatch) {
      info.startTime = `${parseFloat(startMatch[1]).toFixed(3)}s`
    }

    // Extract overall bitrate
    const bitrateMatch = logText.match(/bitrate: (\d+) kb\/s/)
    if (bitrateMatch) {
      info.bitrate = `${bitrateMatch[1]} kb/s`
    }

    // Extract video stream info - more detailed
    const videoStreamMatch = logText.match(/Stream #(\d+:\d+)(?:\((\w+)\))?: Video: ([^\n]+)/)
    if (videoStreamMatch) {
      info.videoStream = videoStreamMatch[1]
      if (videoStreamMatch[2]) info.videoLanguage = videoStreamMatch[2]

      const fullVideoLine = videoStreamMatch[3]
      const codecMatch = fullVideoLine.match(/^(\w+)/)
      if (codecMatch) info.videoCodec = codecMatch[1]

      // Extract codec profile
      const profileMatch = fullVideoLine.match(/\(([^)]+)\)/)
      if (profileMatch) info.codecProfile = profileMatch[1]

      // Extract pixel format - more comprehensive
      const pixFmtMatch = fullVideoLine.match(/,\s*(\w+)\s*(?:\(|,)/)
      if (pixFmtMatch) info.pixelFormat = pixFmtMatch[1]

      // Extract color space
      const colorSpaceMatch = fullVideoLine.match(/(bt\d+|smpte\d+)/i)
      if (colorSpaceMatch) info.colorSpace = colorSpaceMatch[1]

      // Extract color range
      const colorRangeMatch = fullVideoLine.match(/(tv|pc|limited|full)/i)
      if (colorRangeMatch) info.colorRange = colorRangeMatch[1]

      // Extract bit depth
      const bitDepthMatch = fullVideoLine.match(/(\d+)\s*bit/)
      if (bitDepthMatch) info.bitDepth = `${bitDepthMatch[1]} bit`
    }

    // Extract resolution
    const resolutionMatch = logText.match(/(\d{3,5})x(\d{3,5})/)
    if (resolutionMatch) {
      info.width = parseInt(resolutionMatch[1])
      info.height = parseInt(resolutionMatch[2])
      info.resolution = `${info.width}x${info.height}`
      info.aspectRatio = calculateAspectRatio(info.width, info.height)
    }

    // Extract SAR (Sample Aspect Ratio)
    const sarMatch = logText.match(/SAR (\d+:\d+)/)
    if (sarMatch) {
      info.sar = sarMatch[1]
    }

    // Extract DAR (Display Aspect Ratio)
    const darMatch = logText.match(/DAR (\d+:\d+)/)
    if (darMatch) {
      info.dar = darMatch[1]
    }

    // Extract frame rate
    const fpsMatch = logText.match(/(\d+(?:\.\d+)?) fps/)
    if (fpsMatch) {
      info.frameRate = `${fpsMatch[1]} fps`
      info.fps = parseFloat(fpsMatch[1])
    }

    // Extract tbr, tbn, tbc
    const tbrMatch = logText.match(/(\d+(?:\.\d+)?) tbr/)
    if (tbrMatch) info.tbr = `${tbrMatch[1]} tbr`

    const tbnMatch = logText.match(/(\d+(?:\.\d+)?k?) tbn/)
    if (tbnMatch) info.tbn = `${tbnMatch[1]} tbn`

    const tbcMatch = logText.match(/(\d+(?:\.\d+)?) tbc/)
    if (tbcMatch) info.tbc = `${tbcMatch[1]} tbc`

    // Extract video bitrate if available separately
    const vBitrateMatch = logText.match(/Video:.*?(\d+) kb\/s/)
    if (vBitrateMatch) {
      info.videoBitrate = `${vBitrateMatch[1]} kb/s`
    }

    // Extract audio stream info - more detailed
    const audioStreamMatch = logText.match(/Stream #(\d+:\d+)(?:\((\w+)\))?: Audio: ([^\n]+)/)
    if (audioStreamMatch) {
      info.audioStream = audioStreamMatch[1]
      if (audioStreamMatch[2]) info.audioLanguage = audioStreamMatch[2]

      const fullAudioLine = audioStreamMatch[3]
      const codecMatch = fullAudioLine.match(/^(\w+)/)
      if (codecMatch) info.audioCodec = codecMatch[1]

      // Extract audio codec profile
      const audioProfileMatch = fullAudioLine.match(/\(([^)]+)\)/)
      if (audioProfileMatch) info.audioCodecProfile = audioProfileMatch[1]
    }

    // Extract sample rate
    const sampleRateMatch = logText.match(/(\d+) Hz/)
    if (sampleRateMatch) {
      info.sampleRate = `${sampleRateMatch[1]} Hz`
      info.sampleRateValue = parseInt(sampleRateMatch[1])
    }

    // Extract channels - more detailed
    const channelsMatch = logText.match(/(mono|stereo|5\.1|7\.1|5\.1\(side\)|7\.1\(wide\)|\d+\.\d+ channels?|\d+ channels?)/)
    if (channelsMatch) {
      info.channels = channelsMatch[1]
      // Parse channel count
      if (channelsMatch[1] === 'mono') info.channelCount = 1
      else if (channelsMatch[1] === 'stereo') info.channelCount = 2
      else if (channelsMatch[1].includes('5.1')) info.channelCount = 6
      else if (channelsMatch[1].includes('7.1')) info.channelCount = 8
    }

    // Extract channel layout
    const channelLayoutMatch = logText.match(/Audio:.*?(\d+) channels?,\s*(\w+)/)
    if (channelLayoutMatch) {
      info.channelLayout = channelLayoutMatch[2]
    }

    // Extract audio bitrate
    const aBitrateMatch = logText.match(/Audio:.*?(\d+) kb\/s/)
    if (aBitrateMatch) {
      info.audioBitrate = `${aBitrateMatch[1]} kb/s`
    }

    // Extract audio sample format
    const audioSampleFmtMatch = logText.match(/Audio:.*?,\s*(fltp|s16|s32|u8|flt|dbl|s16p|s32p|u8p|fltp|dblp)/)
    if (audioSampleFmtMatch) {
      info.audioSampleFormat = audioSampleFmtMatch[1]
    }

    // Extract bit depth for audio
    const audioBitDepthMatch = logText.match(/Audio:.*?(\d+)\s*bit/)
    if (audioBitDepthMatch) {
      info.audioBitDepth = `${audioBitDepthMatch[1]} bit`
    }

    // Extract container format
    const formatMatch = logText.match(/Input #\d+, ([^,]+),/)
    if (formatMatch) {
      info.container = formatMatch[1]
    }

    // Extract metadata
    const titleMatch = logText.match(/title\s*:\s*(.+)$/m)
    if (titleMatch) info.title = titleMatch[1].trim()

    const encoderMatch = logText.match(/encoder\s*:\s*(.+)$/m)
    if (encoderMatch) info.encoder = encoderMatch[1].trim()

    return info
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`
  }

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateAspectRatio = (width, height) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(width, height)
    return `${width / divisor}:${height / divisor}`
  }

  if (loadingFFmpeg) {
    return (
      <div className="app loading-app">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>MediaFocus</h2>
          <p>{language === 'zh' ? '正在加载 FFmpeg WASM...' : 'Loading FFmpeg WASM...'}</p>
          <p className="loading-note">
            {language === 'zh' ? '首次加载可能需要几秒钟' : 'This may take a few moments on first load'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        onOpenFile={handleFileChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        language={language}
        onLanguageToggle={handleLanguageToggle}
      />
      <Sidebar
        mediaInfo={mediaInfo}
        frameData={frameData}
        language={language}
      />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>
            <p>{progress}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-toast">
          <p>❌ {error}</p>
        </div>
      )}
    </div>
  )
}

export default App
