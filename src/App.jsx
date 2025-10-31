import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [mediaInfo, setMediaInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

    setLoading(true)
    setError(null)

    try {
      const fileURL = URL.createObjectURL(file)
      const isVideo = file.type.startsWith('video/')
      const isAudio = file.type.startsWith('audio/')

      const info = {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.type || 'Unknown',
        mimeType: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      }

      // For video files, try to extract metadata
      if (isVideo || isAudio) {
        const mediaElement = isVideo ? document.createElement('video') : document.createElement('audio')
        mediaElement.preload = 'metadata'
        
        await new Promise((resolve) => {
          mediaElement.onloadedmetadata = () => {
            if (mediaElement.duration && mediaElement.duration !== Infinity) {
              info.duration = formatDuration(mediaElement.duration)
            }
            
            if (isVideo) {
              info.width = mediaElement.videoWidth || 'N/A'
              info.height = mediaElement.videoHeight || 'N/A'
              if (mediaElement.videoWidth && mediaElement.videoHeight) {
                info.resolution = `${mediaElement.videoWidth}x${mediaElement.videoHeight}`
                info.aspectRatio = calculateAspectRatio(mediaElement.videoWidth, mediaElement.videoHeight)
              }
            }
            
            resolve()
          }
          
          mediaElement.onerror = () => {
            resolve() // Continue even if metadata loading fails
          }
          
          mediaElement.src = fileURL
        })
        
        URL.revokeObjectURL(fileURL)
      }

      setMediaInfo(info)
    } catch (err) {
      console.error('Error parsing media:', err)
      // Still show basic info on error
      const basicInfo = {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.type || 'Unknown',
        mimeType: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
        note: 'Basic file information only'
      }
      setMediaInfo(basicInfo)
    } finally {
      setLoading(false)
    }
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
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📹 Media Info Parser</h1>
          <p className="subtitle">Parse media file information using Web APIs</p>
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
            <p>Analyzing media file...</p>
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
              {mediaInfo.mimeType && (
                <div className="info-item">
                  <span className="info-label">MIME Type:</span>
                  <span className="info-value">{mediaInfo.mimeType}</span>
                </div>
              )}
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
              <div className="info-item">
                <span className="info-label">Last Modified:</span>
                <span className="info-value">{mediaInfo.lastModified}</span>
              </div>
              {mediaInfo.note && (
                <div className="info-item info-note">
                  <span className="info-label">Note:</span>
                  <span className="info-value">{mediaInfo.note}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Built with React & Web APIs</p>
          <p className="footer-note">Using HTML5 Media APIs for metadata extraction</p>
        </footer>
      </div>
    </div>
  )
}

export default App
