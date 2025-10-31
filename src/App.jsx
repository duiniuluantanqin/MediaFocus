import { useState, useRef, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [mediaInfo, setMediaInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(true)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState('')
  const ffmpegRef = useRef(new FFmpeg())

  useEffect(() => {
    loadFFmpeg()
  }, [])

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMediaInfo(null)
      setError(null)
    }
  }

  const parseMediaInfo = async () => {
    if (!file) {
      setError('Please select a media file first')
      return
    }

    const ffmpeg = ffmpegRef.current
    setLoading(true)
    setError(null)
    setProgress('Reading file...')
    
    const capturedLogs = []

    try {
      // Set up log capture
      ffmpeg.on('log', ({ message }) => {
        capturedLogs.push(message)
      })

      const fileName = file.name
      await ffmpeg.writeFile(fileName, await fetchFile(file))
      
      setProgress('Analyzing media with FFmpeg...')
      
      // Run ffprobe-like command to get media information
      await ffmpeg.exec([
        '-i', fileName,
        '-f', 'null',
        '-'
      ])

      // Parse FFmpeg logs for media information
      const info = parseFFmpegLogs(capturedLogs, file)
      
      setMediaInfo(info)
      setProgress('Complete!')
      
      // Clean up
      await ffmpeg.deleteFile(fileName)
    } catch (err) {
      console.error('Error parsing media:', err)
      // Even on "error", FFmpeg outputs useful info in logs
      const info = parseFFmpegLogs(capturedLogs, file)
      setMediaInfo(info)
      setProgress('Analysis complete!')
    } finally {
      setLoading(false)
    }
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
    }

    // Extract video stream info
    const videoMatch = logText.match(/Stream #\d+:\d+.*Video: (\w+).*?(\d{3,5})x(\d{3,5})/)
    if (videoMatch) {
      info.videoCodec = videoMatch[1]
      info.width = parseInt(videoMatch[2])
      info.height = parseInt(videoMatch[3])
      info.resolution = `${info.width}x${info.height}`
      info.aspectRatio = calculateAspectRatio(info.width, info.height)
    }

    // Extract video bitrate
    const bitrateMatch = logText.match(/bitrate: (\d+) kb\/s/)
    if (bitrateMatch) {
      info.bitrate = `${bitrateMatch[1]} kb/s`
    }

    // Extract audio stream info
    const audioMatch = logText.match(/Stream #\d+:\d+.*Audio: (\w+).*?(\d+) Hz/)
    if (audioMatch) {
      info.audioCodec = audioMatch[1]
      info.sampleRate = `${audioMatch[2]} Hz`
    }

    // Extract frame rate
    const fpsMatch = logText.match(/(\d+(?:\.\d+)?) fps/)
    if (fpsMatch) {
      info.frameRate = `${fpsMatch[1]} fps`
    }

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

  const resetApp = () => {
    setFile(null)
    setMediaInfo(null)
    setError(null)
    setProgress('')
  }

  if (loadingFFmpeg) {
    return (
      <div className="app">
        <div className="container">
          <h1>Media Info Parser</h1>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading FFmpeg WASM...</p>
            <p className="loading-note">This may take a few moments on first load</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📹 Media Info Parser</h1>
          <p className="subtitle">Parse media file information using FFmpeg WebAssembly</p>
        </header>

        <div className="upload-section">
          <label htmlFor="file-upload" className="file-label">
            <span className="file-icon">📁</span>
            <span>{file ? file.name : 'Choose a media file'}</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {file && !mediaInfo && (
          <div className="action-section">
            <button
              onClick={parseMediaInfo}
              disabled={loading}
              className="parse-button"
            >
              {loading ? 'Analyzing...' : 'Parse Media Info'}
            </button>
          </div>
        )}

        {loading && (
          <div className="progress-section">
            <div className="spinner"></div>
            <p>{progress}</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <p>❌ {error}</p>
          </div>
        )}

        {mediaInfo && (
          <div className="info-section">
            <div className="info-header">
              <h2>Media Information</h2>
              <button onClick={resetApp} className="reset-button">
                Parse Another File
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">File Name:</span>
                <span className="info-value">{mediaInfo.fileName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">File Size:</span>
                <span className="info-value">{mediaInfo.fileSize}</span>
              </div>
              <div className="info-item">
                <span className="info-label">File Type:</span>
                <span className="info-value">{mediaInfo.fileType}</span>
              </div>
              {mediaInfo.duration && (
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{mediaInfo.duration}</span>
                </div>
              )}
              {mediaInfo.resolution && (
                <div className="info-item">
                  <span className="info-label">Resolution:</span>
                  <span className="info-value">{mediaInfo.resolution}</span>
                </div>
              )}
              {mediaInfo.aspectRatio && (
                <div className="info-item">
                  <span className="info-label">Aspect Ratio:</span>
                  <span className="info-value">{mediaInfo.aspectRatio}</span>
                </div>
              )}
              {mediaInfo.videoCodec && (
                <div className="info-item">
                  <span className="info-label">Video Codec:</span>
                  <span className="info-value">{mediaInfo.videoCodec}</span>
                </div>
              )}
              {mediaInfo.audioCodec && (
                <div className="info-item">
                  <span className="info-label">Audio Codec:</span>
                  <span className="info-value">{mediaInfo.audioCodec}</span>
                </div>
              )}
              {mediaInfo.frameRate && (
                <div className="info-item">
                  <span className="info-label">Frame Rate:</span>
                  <span className="info-value">{mediaInfo.frameRate}</span>
                </div>
              )}
              {mediaInfo.bitrate && (
                <div className="info-item">
                  <span className="info-label">Bitrate:</span>
                  <span className="info-value">{mediaInfo.bitrate}</span>
                </div>
              )}
              {mediaInfo.sampleRate && (
                <div className="info-item">
                  <span className="info-label">Sample Rate:</span>
                  <span className="info-value">{mediaInfo.sampleRate}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Last Modified:</span>
                <span className="info-value">{mediaInfo.lastModified}</span>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Built with React & FFmpeg WASM</p>
          <p className="footer-note">Powered by FFmpeg WebAssembly for advanced media analysis</p>
        </footer>
      </div>
    </div>
  )
}

export default App
