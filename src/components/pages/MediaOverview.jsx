import './MediaOverview.css'

function MediaOverview({ mediaInfo, language }) {
  const translations = {
    zh: {
      title: '媒体信息概述',
      fileName: '文件名',
      fileSize: '文件大小',
      fileType: '文件类型',
      duration: '时长',
      resolution: '分辨率',
      aspectRatio: '宽高比',
      videoCodec: '视频编解码器',
      audioCodec: '音频编解码器',
      frameRate: '帧率',
      bitrate: '比特率',
      sampleRate: '采样率',
      lastModified: '最后修改时间'
    },
    en: {
      title: 'Media Overview',
      fileName: 'File Name',
      fileSize: 'File Size',
      fileType: 'File Type',
      duration: 'Duration',
      resolution: 'Resolution',
      aspectRatio: 'Aspect Ratio',
      videoCodec: 'Video Codec',
      audioCodec: 'Audio Codec',
      frameRate: 'Frame Rate',
      bitrate: 'Bitrate',
      sampleRate: 'Sample Rate',
      lastModified: 'Last Modified'
    }
  }

  const t = translations[language]

  const infoItems = [
    { label: t.fileName, value: mediaInfo.fileName, icon: '📄' },
    { label: t.fileSize, value: mediaInfo.fileSize, icon: '💾' },
    { label: t.fileType, value: mediaInfo.fileType, icon: '🏷️' },
    { label: t.duration, value: mediaInfo.duration, icon: '⏱️' },
    { label: t.resolution, value: mediaInfo.resolution, icon: '📐' },
    { label: t.aspectRatio, value: mediaInfo.aspectRatio, icon: '📏' },
    { label: t.videoCodec, value: mediaInfo.videoCodec, icon: '🎥' },
    { label: t.audioCodec, value: mediaInfo.audioCodec, icon: '🔊' },
    { label: t.frameRate, value: mediaInfo.frameRate, icon: '🎞️' },
    { label: t.bitrate, value: mediaInfo.bitrate, icon: '📊' },
    { label: t.sampleRate, value: mediaInfo.sampleRate, icon: '🎵' },
    { label: t.lastModified, value: mediaInfo.lastModified, icon: '📅' }
  ]

  return (
    <div className="media-overview">
      <h2 className="page-title">{t.title}</h2>
      <div className="overview-grid">
        {infoItems.map((item, index) => (
          item.value && (
            <div key={index} className="overview-item">
              <div className="item-header">
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </div>
              <div className="item-value">{item.value}</div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default MediaOverview

