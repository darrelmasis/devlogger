import { useState, useEffect, useRef } from 'react'
import { useLoggerContext } from '../context/LoggerContext'
import { log } from '../core/LoggerCore'
import { JsonView } from './JsonView'
import '../styles/logger.scss'

// Función auxiliar para formatear la hora
const formatTime = (date) => {
  if (!date) return '00:00:00'
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const LogItem = ({ log, isDarkMode, isLast }) => {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyLog = (e) => {
    e.stopPropagation()
    const textToCopy = log.message
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const toggleExpand = () => setExpanded(!expanded)

  const themeClass = isDarkMode ? 'logger-dark' : 'logger-light'
  const levelClass = `logger-${log.level || 'info'}`
  const lastClass = isLast ? 'logger-item-last' : ''
  const expandedClass = expanded ? 'logger-item-expanded' : ''

  return (
    <div 
      onClick={toggleExpand}
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
                  collapsed={!expanded}
                  onToggle={toggleExpand}
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
        {copied ? '✓' : '📋'}
      </button>
    </div>
  )
}

export const LoggerDisplay = () => {
  const { logs, isProd } = useLoggerContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('logger-theme')
    return savedTheme ? savedTheme === 'dark' : true
  })
  const panelRef = useRef(null)

  // Don't render in production
  if (isProd) {
    return null
  }

  useEffect(() => {
    localStorage.setItem('logger-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    if (logs.length > 0 && !isExpanded) {
      // Optional: auto-expand logic
    }
  }, [logs.length, isExpanded])

  // Click outside to minimize
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

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
        {hasLogs ? logs.length : '📋'}
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
        <span className="logger-title">Logger ({logs.length})</span>
        <div className="logger-buttons">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsDarkMode(!isDarkMode)
            }}
            className={`logger-btn ${themeClass}`}
            title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              log.clear()
            }}
            className={`logger-btn logger-btn-clear ${themeClass}`}
            title="Limpiar todos los logs"
          >
            🗑️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}
            className={`logger-btn logger-btn-minimize ${themeClass}`}
            title="Minimizar"
          >
            −
          </button>
        </div>
      </div>

      <div className={`logger-content ${themeClass}`}>
        {logs.length === 0 ? (
          <div className={`logger-empty ${themeClass}`}>
            Sin logs aún...
          </div>
        ) : (
          logs.map((log, idx) => (
            <LogItem 
              key={idx} 
              log={log} 
              isDarkMode={isDarkMode} 
              isLast={idx === logs.length - 1}
            />
          ))
        )}
      </div>
    </div>
  )
}
