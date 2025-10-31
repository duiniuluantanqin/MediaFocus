import { useState } from 'react'
import './Header.css'

function Header({ onOpenFile, theme, onThemeToggle, language, onLanguageToggle }) {
  const [showAbout, setShowAbout] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const translations = {
    zh: {
      openFile: '打开文件',
      login: '登录',
      about: '关于',
      theme: theme === 'light' ? '深色模式' : '浅色模式',
      language: 'English',
      aboutTitle: '关于 MediaFocus',
      aboutContent: 'MediaFocus 是一个基于 React 和 FFmpeg WebAssembly 构建的网页版媒体信息解析工具。',
      close: '关闭',
      loginTitle: '用户登录',
      username: '用户名',
      password: '密码',
      loginButton: '登录',
      cancel: '取消'
    },
    en: {
      openFile: 'Open File',
      login: 'Login',
      about: 'About',
      theme: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      language: '中文',
      aboutTitle: 'About MediaFocus',
      aboutContent: 'MediaFocus is a web-based media information parsing tool built with React and FFmpeg WebAssembly.',
      close: 'Close',
      loginTitle: 'User Login',
      username: 'Username',
      password: 'Password',
      loginButton: 'Login',
      cancel: 'Cancel'
    }
  }

  const t = translations[language]

  const handleFileClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*,audio/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        onOpenFile(file)
      }
    }
    input.click()
  }

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">📹</span>
            <span className="logo-text">MediaFocus</span>
          </div>
          <nav className="header-menu">
            <button className="menu-item" onClick={handleFileClick}>
              <span className="menu-icon">📁</span>
              {t.openFile}
            </button>
          </nav>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setShowLogin(true)}>
            <span className="btn-icon">👤</span>
            {t.login}
          </button>
          <button className="header-btn" onClick={() => setShowAbout(true)}>
            <span className="btn-icon">ℹ️</span>
            {t.about}
          </button>
          <button className="header-btn" onClick={onThemeToggle}>
            <span className="btn-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            {t.theme}
          </button>
          <button className="header-btn" onClick={onLanguageToggle}>
            <span className="btn-icon">🌐</span>
            {t.language}
          </button>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutContent}</p>
            <div className="modal-footer">
              <button className="modal-btn" onClick={() => setShowAbout(false)}>
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t.loginTitle}</h2>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>{t.username}</label>
                <input type="text" placeholder={t.username} />
              </div>
              <div className="form-group">
                <label>{t.password}</label>
                <input type="password" placeholder={t.password} />
              </div>
              <div className="modal-footer">
                <button className="modal-btn modal-btn-primary" type="submit">
                  {t.loginButton}
                </button>
                <button className="modal-btn" onClick={() => setShowLogin(false)}>
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Header

