import { useState } from 'react'
import './FrameList.css'

function FrameList({ frameData, language }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const translations = {
    zh: {
      title: '帧信息列表',
      frameNumber: '帧号',
      frameType: '帧类型',
      timestamp: '时间戳',
      size: '大小',
      bitrate: '比特率',
      noData: '暂无帧数据',
      page: '页',
      of: '共',
      previous: '上一页',
      next: '下一页'
    },
    en: {
      title: 'Frame List',
      frameNumber: 'Frame #',
      frameType: 'Type',
      timestamp: 'Timestamp',
      size: 'Size',
      bitrate: 'Bitrate',
      noData: 'No frame data available',
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next'
    }
  }

  const t = translations[language]

  if (!frameData || frameData.length === 0) {
    return (
      <div className="frame-list">
        <h2 className="page-title">{t.title}</h2>
        <div className="no-data">
          <span className="no-data-icon">🎞️</span>
          <p>{t.noData}</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(frameData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFrames = frameData.slice(startIndex, endIndex)

  return (
    <div className="frame-list">
      <h2 className="page-title">{t.title}</h2>
      <div className="frame-table-container">
        <table className="frame-table">
          <thead>
            <tr>
              <th>{t.frameNumber}</th>
              <th>{t.frameType}</th>
              <th>{t.timestamp}</th>
              <th>{t.size}</th>
              <th>{t.bitrate}</th>
            </tr>
          </thead>
          <tbody>
            {currentFrames.map((frame, index) => (
              <tr key={startIndex + index} className={`frame-row frame-type-${frame.type?.toLowerCase()}`}>
                <td>{startIndex + index + 1}</td>
                <td>
                  <span className={`frame-type-badge ${frame.type?.toLowerCase()}`}>
                    {frame.type || 'N/A'}
                  </span>
                </td>
                <td>{frame.timestamp || 'N/A'}</td>
                <td>{frame.size || 'N/A'}</td>
                <td>{frame.bitrate || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t.previous}
          </button>
          <span className="pagination-info">
            {t.page} {currentPage} {t.of} {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  )
}

export default FrameList

