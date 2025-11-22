import { useState, useEffect, useRef } from 'react'
import { useLoggerContext } from '../context/LoggerContext'
import { log } from '../core/LoggerCore'
import { JsonView } from './JsonView'
import { formatTime } from '../utils/utils'
import '../styles/logger.scss'
import Icon from './Icons'
import LogoLight from '../assets/dev-logger-dark.svg'
import LogoDark from '../assets/dev-logger.svg'



const LogItem = ({ log, isDarkMode, isLast, isExpanded, onToggle }) => {
  const [copied, setCopied] = useState(false)

  const copyLog = (e) => {
    e.stopPropagation()
    const textToCopy = log.message
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const themeClass = isDarkMode ? 'logger-dark' : 'logger-light'
  const levelClass = `logger-${log.level || 'info'}`
  const lastClass = isLast ? 'logger-item-last' : ''
  const expandedClass = isExpanded ? 'logger-item-expanded' : ''

  return (
    <div 
      onClick={onToggle}
      className={`logger-item ${levelClass} ${themeClass} ${lastClass} ${expandedClass}`}
    >
      

      <div className={`logger-timestamp ${themeClass}`}>
        [{formatTime(log.timestamp)}]
      </div>

      <div className="logger-log-content">
        {log.data && log.data.length > 0 ? (
          log.data.map((item, itemIdx) => (
            <span key={itemIdx}>
              {typeof item === 'object' && item !== null ? (
                <JsonView 
                  data={item} 
                  isDarkMode={isDarkMode} 
                  collapsed={!isExpanded}
                  onToggle={onToggle}
                />
              ) : (
                <span>{String(item)}</span>
              )}
              {itemIdx < log.data.length - 1 ? ' ' : ''}
            </span>
          ))
        ) : (
          <pre>{log.message}</pre>
        )}
      </div>

      <button
        onClick={copyLog}
        className={`logger-copy-btn ${themeClass}`}
      >
        {copied ?
          <Icon name="check" size="sm" /> :
          <Icon name="copy" size="sm" />}
      </button>
    </div>
  )
}

export const LoggerDisplay = () => {
  const { logs, isProd } = useLoggerContext()
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedExpanded = localStorage.getItem('logger-expanded')
    return savedExpanded ? savedExpanded === 'true' : false
  })
  const [isPinned, setIsPinned] = useState(() => {
    const savedPinned = localStorage.getItem('logger-pinned')
    return savedPinned ? savedPinned === 'true' : false
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('logger-theme')
    return savedTheme ? savedTheme === 'dark' : true
  })
  const [expandedLogIndex, setExpandedLogIndex] = useState(null)
  const panelRef = useRef(null)
  const contentRef = useRef(null)

  // Don't render in production
  if (isProd) {
    return null
  }

  useEffect(() => {
    localStorage.setItem('logger-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('logger-pinned', isPinned.toString())
  }, [isPinned])

  useEffect(() => {
    localStorage.setItem('logger-expanded', isExpanded.toString())
  }, [isExpanded])

  useEffect(() => {
    if (logs.length > 0 && !isExpanded) {
      // Optional: auto-expand logic
    }
  }, [logs.length, isExpanded])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (contentRef.current && isExpanded) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [logs, isExpanded])

  // Click outside to minimize (only if not pinned)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && isExpanded && !isPinned) {
        setIsExpanded(false)
      }
    }

    if (isExpanded && !isPinned) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, isPinned])

  const hasLogs = logs.length > 0
  const themeClass = isDarkMode ? 'logger-dark' : 'logger-light'

  if (!isExpanded) {
    const statusClass = hasLogs ? 'has-logs' : 'no-logs'
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className={`logger-collapsed ${statusClass} ${themeClass}`}
        title={hasLogs ? `${logs.length} log(s)` : 'Logger'}
      >
        {hasLogs ? logs.length : <Icon name="terminal" size="md" />}
      </div>
    )
  }

  return (
    <div ref={panelRef} className={`logger-panel ${themeClass}`}>
      <div 
        className={`logger-header ${themeClass}`}
        onClick={() => setIsExpanded(false)}
        style={{ cursor: 'pointer' }}
      >
        <span className="logger-title">
          <img 
            src={isDarkMode ? LogoDark : LogoLight} 
            alt="Dev Logger" 
            className="logger-logo" 
          />
          <span>({logs.length})</span>
        </span>
        <div className="logger-buttons">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsPinned(!isPinned)
            }}
            className={`logger-btn ${themeClass}`}
            title={isPinned ? 'Desfijar panel' : 'Fijar panel'}
          >
            {isPinned ? <Icon name="lock" size="sm" /> : <Icon name="lock-open" size="sm" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsDarkMode(!isDarkMode)
            }}
            className={`logger-btn ${themeClass}`}
            title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDarkMode ? <Icon name="sun-bright" size="sm" /> : <Icon name="moon-stars" size="sm" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              log.clear()
            }}
            className={`logger-btn logger-btn-clear ${themeClass}`}
            title="Limpiar todos los logs"
          >
            <Icon name="broom-wide" size="sm" />
          </button>
          <div className={`logger-btn-minimize-container ${themeClass}`}>
            <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}
            className={`logger-btn logger-btn-minimize ${themeClass}`}
            title="Minimizar"
          >
            <Icon name="window-minimize" size="sm" />
          </button>
          </div>
        </div>
      </div>

      <div ref={contentRef} className={`logger-content ${themeClass}`}>
        {logs.length === 0 ? (
          <div className={`logger-empty ${themeClass}`}>
            <div className="empty-screen">
              <Icon name="empty-set" size="2xl" style="light" color="#333" />
            </div>
          </div>
        ) : (
          logs.map((log, idx) => (
            <LogItem 
              key={idx} 
              log={log} 
              isDarkMode={isDarkMode} 
              isLast={idx === logs.length - 1}
              isExpanded={expandedLogIndex === idx}
              onToggle={() => setExpandedLogIndex(expandedLogIndex === idx ? null : idx)}
            />
          ))
        )}
      </div>
    </div>
  )
}
