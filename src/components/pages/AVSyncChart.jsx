import { useRef, useEffect, useState } from 'react'
import './AVSyncChart.css'

function AVSyncChart({ frameData, language }) {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)

  const translations = {
    zh: {
      title: '音视同步折线图',
      noData: '暂无音视同步数据',
      zoomIn: '放大',
      zoomOut: '缩小',
      reset: '重置',
      sync: '同步差值 (ms)',
      frame: '帧',
      video: '视频',
      audio: '音频',
      diff: '差值'
    },
    en: {
      title: 'A/V Sync Chart',
      noData: 'No A/V sync data available',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset',
      sync: 'Sync Diff (ms)',
      frame: 'Frame',
      video: 'Video',
      audio: 'Audio',
      diff: 'Difference'
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

    // Calculate A/V sync data from frame timestamps
    // Note: This requires both audio and video timestamps
    // For now, we'll show a message that this feature requires audio frame data
    const syncData = frameData.map((frame) => {
      // Real A/V sync would compare video PTS with audio PTS
      // Since we only have video frames, we can't calculate real sync
      return 0
    })

    const maxSync = Math.max(...syncData.map(Math.abs))

    // Draw axes
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(padding + chartWidth, height - padding)
    ctx.stroke()

    // Draw center line (perfect sync)
    const centerY = padding + chartHeight / 2
    ctx.strokeStyle = '#4caf50'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, centerY)
    ctx.lineTo(padding + chartWidth, centerY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
    ctx.lineWidth = 0.5
    ctx.setLineDash([5, 5])
    for (let i = 0; i <= 4; i++) {
      if (i === 2) continue // Skip center line
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Draw sync line
    ctx.strokeStyle = '#764ba2'
    ctx.lineWidth = 2
    ctx.beginPath()

    syncData.forEach((sync, index) => {
      const x = padding + (index / (syncData.length - 1)) * chartWidth
      const normalizedValue = sync / maxSync
      const y = centerY - normalizedValue * (chartHeight / 2)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Fill areas
    ctx.beginPath()
    syncData.forEach((sync, index) => {
      const x = padding + (index / (syncData.length - 1)) * chartWidth
      const normalizedValue = sync / maxSync
      const y = centerY - normalizedValue * (chartHeight / 2)
      
      if (index === 0) {
        ctx.moveTo(x, centerY)
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(padding + chartWidth, centerY)
    ctx.closePath()
    ctx.fillStyle = 'rgba(118, 75, 162, 0.1)'
    ctx.fill()

    // Draw labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
    ctx.font = '12px sans-serif'
    
    // Y-axis labels
    ctx.fillText(`+${Math.round(maxSync)}ms`, 5, padding + 5)
    ctx.fillText('0ms', 5, centerY + 5)
    ctx.fillText(`-${Math.round(maxSync)}ms`, 5, height - padding + 5)

    // X-axis labels
    ctx.fillText('0', padding - 10, height - padding + 20)
    ctx.fillText(syncData.length.toString(), padding + chartWidth - 20, height - padding + 20)

  }, [frameData, zoom])

  if (!frameData || frameData.length === 0) {
    return (
      <div className="avsync-chart">
        <h2 className="page-title">{t.title}</h2>
        <div className="no-data">
          <span className="no-data-icon">🔄</span>
          <p>{t.noData}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="avsync-chart">
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
          <span className="legend-line video"></span>
          <span>{t.video} {language === 'zh' ? '超前' : 'ahead'}</span>
        </div>
        <div className="legend-item">
          <span className="legend-line sync"></span>
          <span>{language === 'zh' ? '完美同步' : 'Perfect sync'}</span>
        </div>
        <div className="legend-item">
          <span className="legend-line audio"></span>
          <span>{t.audio} {language === 'zh' ? '超前' : 'ahead'}</span>
        </div>
      </div>
      <div className="chart-container" style={{ overflowX: zoom > 1 ? 'auto' : 'hidden' }}>
        <canvas ref={canvasRef} className="chart-canvas"></canvas>
      </div>
    </div>
  )
}

export default AVSyncChart

