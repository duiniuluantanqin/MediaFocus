import { useState } from 'react'
import './Sidebar.css'
import MediaOverview from './pages/MediaOverview'
import FrameList from './pages/FrameList'
import TimestampChart from './pages/TimestampChart'
import BitrateChart from './pages/BitrateChart'
import AVSyncChart from './pages/AVSyncChart'

function Sidebar({ mediaInfo, frameData, language }) {
  const [activeTab, setActiveTab] = useState('overview')

  const translations = {
    zh: {
      overview: '媒体概述',
      frames: '帧信息',
      timestamp: '时间戳',
      bitrate: '码率',
      avsync: '音视同步',
      noFile: '请先打开一个媒体文件'
    },
    en: {
      overview: 'Overview',
      frames: 'Frames',
      timestamp: 'Timestamp',
      bitrate: 'Bitrate',
      avsync: 'A/V Sync',
      noFile: 'Please open a media file first'
    }
  }

  const t = translations[language]

  const tabs = [
    { id: 'overview', label: t.overview, icon: '📊' },
    { id: 'frames', label: t.frames, icon: '🎞️' },
    { id: 'timestamp', label: t.timestamp, icon: '⏱️' },
    { id: 'bitrate', label: t.bitrate, icon: '📈' },
    { id: 'avsync', label: t.avsync, icon: '🔄' }
  ]

  const renderContent = () => {
    if (!mediaInfo) {
      return (
        <div className="no-file-message">
          <span className="no-file-icon">📁</span>
          <p>{t.noFile}</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return <MediaOverview mediaInfo={mediaInfo} language={language} />
      case 'frames':
        return <FrameList frameData={frameData} language={language} />
      case 'timestamp':
        return <TimestampChart frameData={frameData} language={language} />
      case 'bitrate':
        return <BitrateChart frameData={frameData} language={language} />
      case 'avsync':
        return <AVSyncChart frameData={frameData} language={language} />
      default:
        return null
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default Sidebar

