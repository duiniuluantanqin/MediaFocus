import { useRef, useEffect, useState } from 'react'
import './TimestampChart.css'

function TimestampChart({ frameData, language }) {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)

  const translations = {
    zh: {
      title: '时间戳点阵图',
      noData: '暂无时间戳数据',
      zoomIn: '放大',
      zoomOut: '缩小',
      reset: '重置',
      iFrame: 'I帧',
      pFrame: 'P帧',
      bFrame: 'B帧'
    },
    en: {
      title: 'Timestamp Dot Chart',
      noData: 'No timestamp data available',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset',
      iFrame: 'I-Frame',
      pFrame: 'P-Frame',
      bFrame: 'B-Frame'
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
    canvas.width = rect.width * dpr * zoom
    canvas.height = rect.height * dpr * zoom
    ctx.scale(dpr * zoom, dpr * zoom)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    const width = rect.width
    const height = rect.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Draw axes
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw dots
    const maxFrames = frameData.length
    const dotSize = 4

    frameData.forEach((frame, index) => {
      const x = padding + (index / maxFrames) * chartWidth
      const y = height - padding - (index % 100) * (chartHeight / 100)

      // Color based on frame type
      let color = '#999'
      if (frame.type === 'I') color = '#1976d2'
      else if (frame.type === 'P') color = '#7b1fa2'
      else if (frame.type === 'B') color = '#f57c00'

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, dotSize, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
    ctx.font = '12px sans-serif'
    ctx.fillText('0', padding - 20, height - padding + 5)
    ctx.fillText(maxFrames.toString(), width - padding, height - padding + 20)

  }, [frameData, zoom])

  if (!frameData || frameData.length === 0) {
    return (
      <div className="timestamp-chart">
        <h2 className="page-title">{t.title}</h2>
        <div className="no-data">
          <span className="no-data-icon">⏱️</span>
          <p>{t.noData}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="timestamp-chart">
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
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot i-frame"></span>
          <span>{t.iFrame}</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot p-frame"></span>
          <span>{t.pFrame}</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot b-frame"></span>
          <span>{t.bFrame}</span>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={canvasRef} className="chart-canvas"></canvas>
      </div>
    </div>
  )
}

export default TimestampChart

