import { useRef, useEffect, useState } from 'react'
import './BitrateChart.css'

function BitrateChart({ frameData, language }) {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)

  const translations = {
    zh: {
      title: '码率折线图',
      noData: '暂无码率数据',
      zoomIn: '放大',
      zoomOut: '缩小',
      reset: '重置',
      bitrate: '码率 (kbps)',
      frame: '帧'
    },
    en: {
      title: 'Bitrate Chart',
      noData: 'No bitrate data available',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset',
      bitrate: 'Bitrate (kbps)',
      frame: 'Frame'
    }
  }

  const t = translations[language]

  useEffect(() => {
    if (!frameData || frameData.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart dimensions
    const width = rect.width
    const height = rect.height
    const padding = 50
    const chartWidth = (width - padding * 2) * zoom
    const chartHeight = height - padding * 2

    // Get bitrate values from frame data
    const bitrateValues = frameData.map((frame) => {
      // Extract numeric bitrate value
      if (frame.bitrate && typeof frame.bitrate === 'string') {
        const match = frame.bitrate.match(/(\d+)/)
        return match ? parseInt(match[1]) : 0
      }
      // Calculate from size if available
      if (frame.sizeBytes) {
        // Assume 30fps for estimation
        return Math.round((frame.sizeBytes * 8 * 30) / 1000)
      }
      return 0
    })

    const maxBitrate = Math.max(...bitrateValues)
    const minBitrate = Math.min(...bitrateValues)

    // Draw axes
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(padding + chartWidth, height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
    ctx.lineWidth = 0.5
    ctx.setLineDash([5, 5])
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Draw bitrate line
    ctx.strokeStyle = '#667eea'
    ctx.lineWidth = 2
    ctx.beginPath()

    bitrateValues.forEach((bitrate, index) => {
      const x = padding + (index / (bitrateValues.length - 1)) * chartWidth
      const normalizedValue = (bitrate - minBitrate) / (maxBitrate - minBitrate)
      const y = height - padding - normalizedValue * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw area under line
    ctx.fillStyle = 'rgba(102, 126, 234, 0.1)'
    ctx.lineTo(padding + chartWidth, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
    ctx.font = '12px sans-serif'
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minBitrate + ((maxBitrate - minBitrate) / 5) * (5 - i)
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(Math.round(value).toString(), 5, y + 5)
    }

    // X-axis labels
    ctx.fillText('0', padding - 10, height - padding + 20)
    ctx.fillText(bitrateValues.length.toString(), padding + chartWidth - 20, height - padding + 20)

  }, [frameData, zoom])

  if (!frameData || frameData.length === 0) {
    return (
      <div className="bitrate-chart">
        <h2 className="page-title">{t.title}</h2>
        <div className="no-data">
          <span className="no-data-icon">📈</span>
          <p>{t.noData}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bitrate-chart">
      <div className="chart-header">
        <h2 className="page-title">{t.title}</h2>
        <div className="chart-controls">
          <button className="control-btn" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
            🔍+ {t.zoomIn}
          </button>
          <button className="control-btn" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
            🔍- {t.zoomOut}
          </button>
          <button className="control-btn" onClick={() => setZoom(1)}>
            ↺ {t.reset}
          </button>
        </div>
      </div>
      <div className="chart-container" style={{ overflowX: zoom > 1 ? 'auto' : 'hidden' }}>
        <canvas ref={canvasRef} className="chart-canvas"></canvas>
      </div>
    </div>
  )
}

export default BitrateChart

