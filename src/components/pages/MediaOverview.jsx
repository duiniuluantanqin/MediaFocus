import './MediaOverview.css'

function MediaOverview({ mediaInfo, language }) {
  const translations = {
    zh: {
      title: '媒体信息概述',
      general: '综述',
      video: '视频信息',
      audio: '音频信息',
      fileName: '文件名',
      fileSize: '文件大小',
      fileType: '文件类型',
      duration: '时长',
      bitrate: '比特率',
      lastModified: '最后修改时间',
      videoCodec: '视频编解码器',
      resolution: '分辨率',
      aspectRatio: '宽高比',
      frameRate: '帧率',
      width: '宽度',
      height: '高度',
      audioCodec: '音频编解码器',
      sampleRate: '采样率',
      channels: '声道',
      audioBitrate: '音频比特率'
    },
    en: {
      title: 'Media Overview',
      general: 'General',
      video: 'Video Information',
      audio: 'Audio Information',
      fileName: 'File Name',
      fileSize: 'File Size',
      fileType: 'File Type',
      duration: 'Duration',
      bitrate: 'Bitrate',
      lastModified: 'Last Modified',
      videoCodec: 'Video Codec',
      resolution: 'Resolution',
      aspectRatio: 'Aspect Ratio',
      frameRate: 'Frame Rate',
      width: 'Width',
      height: 'Height',
      audioCodec: 'Audio Codec',
      sampleRate: 'Sample Rate',
      channels: 'Channels',
      audioBitrate: 'Audio Bitrate'
    }
  }

  const t = translations[language]

  // General information
  const generalItems = [
    { label: t.fileName, value: mediaInfo.fileName },
    { label: t.fileSize, value: mediaInfo.fileSize },
    { label: t.fileType, value: mediaInfo.fileType },
    { label: t.duration, value: mediaInfo.duration },
    { label: t.bitrate, value: mediaInfo.bitrate },
    { label: t.lastModified, value: mediaInfo.lastModified },
    { label: language === 'zh' ? '容器格式' : 'Container', value: mediaInfo.container },
    { label: language === 'zh' ? '开始时间' : 'Start Time', value: mediaInfo.startTime },
    { label: language === 'zh' ? '标题' : 'Title', value: mediaInfo.title },
    { label: language === 'zh' ? '编码器' : 'Encoder', value: mediaInfo.encoder }
  ]

  // Video information (including decoded image info)
  const videoItems = [
    { label: language === 'zh' ? '视频流' : 'Video Stream', value: mediaInfo.videoStream },
    { label: t.videoCodec, value: mediaInfo.videoCodec },
    { label: language === 'zh' ? '编码配置' : 'Codec Profile', value: mediaInfo.codecProfile },
    { label: t.resolution, value: mediaInfo.resolution },
    { label: t.width, value: mediaInfo.width ? `${mediaInfo.width}px` : '' },
    { label: t.height, value: mediaInfo.height ? `${mediaInfo.height}px` : '' },
    { label: language === 'zh' ? '总像素' : 'Total Pixels', value: mediaInfo.width && mediaInfo.height ? `${(mediaInfo.width * mediaInfo.height / 1000000).toFixed(2)}M` : '' },
    { label: t.aspectRatio, value: mediaInfo.aspectRatio },
    { label: 'SAR', value: mediaInfo.sar },
    { label: 'DAR', value: mediaInfo.dar },
    { label: t.frameRate, value: mediaInfo.frameRate },
    { label: language === 'zh' ? '视频比特率' : 'Video Bitrate', value: mediaInfo.videoBitrate },
    { label: language === 'zh' ? '像素格式' : 'Pixel Format', value: mediaInfo.pixelFormat },
    { label: language === 'zh' ? '色彩空间' : 'Color Space', value: mediaInfo.colorSpace },
    { label: language === 'zh' ? '色彩范围' : 'Color Range', value: mediaInfo.colorRange },
    { label: language === 'zh' ? '位深度' : 'Bit Depth', value: mediaInfo.bitDepth },
    { label: 'TBR', value: mediaInfo.tbr },
    { label: 'TBN', value: mediaInfo.tbn },
    { label: 'TBC', value: mediaInfo.tbc },
    { label: language === 'zh' ? '视频语言' : 'Video Language', value: mediaInfo.videoLanguage }
  ]

  // Audio information (including all decoded info)
  const audioItems = [
    { label: language === 'zh' ? '音频流' : 'Audio Stream', value: mediaInfo.audioStream },
    { label: t.audioCodec, value: mediaInfo.audioCodec },
    { label: language === 'zh' ? '音频编码配置' : 'Audio Codec Profile', value: mediaInfo.audioCodecProfile },
    { label: t.sampleRate, value: mediaInfo.sampleRate },
    { label: language === 'zh' ? '采样格式' : 'Sample Format', value: mediaInfo.audioSampleFormat },
    { label: language === 'zh' ? '音频位深度' : 'Audio Bit Depth', value: mediaInfo.audioBitDepth },
    { label: t.channels, value: mediaInfo.channels },
    { label: language === 'zh' ? '声道数' : 'Channel Count', value: mediaInfo.channelCount },
    { label: language === 'zh' ? '声道布局' : 'Channel Layout', value: mediaInfo.channelLayout },
    { label: t.audioBitrate, value: mediaInfo.audioBitrate },
    { label: language === 'zh' ? '音频语言' : 'Audio Language', value: mediaInfo.audioLanguage }
  ]

  const renderSection = (title, items) => {
    return (
      <div className="info-section">
        <h3 className="section-title">{title}</h3>
        <ul className="info-list">
          {items.map((item, index) => (
            <li key={index} className="info-item">
              <span className="info-label">{item.label}</span>
              <span className="info-value">{item.value || '-'}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="media-overview">
      <h2 className="page-title">{t.title}</h2>
      <div className="overview-content">
        {renderSection(t.general, generalItems)}
        {renderSection(t.video, videoItems)}
        {renderSection(t.audio, audioItems)}
      </div>
    </div>
  )
}

export default MediaOverview

