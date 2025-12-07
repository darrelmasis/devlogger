import { useState, useEffect, useRef } from 'react'
import { useLoggerContext } from '../context/LoggerContext'
import { log } from '../core/LoggerCore'
import { JsonView } from './JsonView'
import { formatTime } from '../utils/utils'
import { getClosestCorner, getBubblePosition, getPanelPosition, convertDragPosition } from '../utils/positioning'
import '../styles/logger.scss'
import Icon from './Icons'
import LogoLight from '../assets/dev-logger-dark.svg'
import LogoDark from '../assets/dev-logger.svg'

// Función auxiliar para crear una clave única para agrupar logs
const getLogKey = (log) => {
  let dataString
  
  if (log.data && log.data.length > 0) {
    try {
      // Intenta convertir los datos a string
      dataString = JSON.stringify(log.data)
    } catch (error) {
      // Si hay referencia circular u otro error, usa el mensaje procesado como respaldo
      // log.message ya maneja referencias circulares gracias a LoggerCore
      dataString = log.message
    }
  } else {
    dataString = log.message
  }
  
  return `${log.level || 'info'}:${dataString}`
}

// Función para agrupar logs idénticos
const groupLogs = (logs) => {
  const groups = []
  const groupMap = new Map()

  logs.forEach((log) => {
    const key = getLogKey(log)
    
    if (groupMap.has(key)) {
      // Agregar al grupo existente
      const groupIndex = groupMap.get(key)
      groups[groupIndex].logs.push(log)
      groups[groupIndex].count++
    } else {
      // Crear nuevo grupo
      const newGroup = {
        key,
        logs: [log],
        count: 1,
        level: log.level,
        message: log.message,
        data: log.data,
        timestamp: log.timestamp // Mantiene la primera marca de tiempo para mostrar
      }
      groupMap.set(key, groups.length)
      groups.push(newGroup)
    }
  })

  return groups
}

const LogItem = ({ logGroup, isDarkMode, isLast, isExpanded, onToggle }) => {
  const [copied, setCopied] = useState(false)
  const log = logGroup.logs[0] // Usa el primer log para mostrar

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
        {logGroup.count > 1 && (
          <span className="logger-group-count">
            ×{logGroup.count}
          </span>
        )}
      </div>

      <div className="logger-log-content">
        {log.data && log.data.length > 0 ? (
          <div className="logger-data-container">
            {log.data.map((item, itemIdx) => {
              const isObject = typeof item === 'object' && item !== null
              return (
                <span key={itemIdx} className={isObject ? 'logger-data-item-block' : 'logger-data-item-inline'}>
                  {isObject ? (
                    <JsonView 
                      data={item} 
                      isDarkMode={isDarkMode} 
                      collapsed={!isExpanded}
                      onToggle={onToggle}
                    />
                  ) : (
                    <span>{String(item)}</span>
                  )}
                  {!isObject && itemIdx < log.data.length - 1 && ' '}
                </span>
              )
            })}
          </div>
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
    if (isProd) return false
    const savedExpanded = localStorage.getItem('logger-expanded')
    return savedExpanded ? savedExpanded === 'true' : false
  })
  const [isPinned, setIsPinned] = useState(() => {
    if (isProd) return false
    const savedPinned = localStorage.getItem('logger-pinned')
    return savedPinned ? savedPinned === 'true' : false
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (isProd) return true
    const savedTheme = localStorage.getItem('logger-theme')
    return savedTheme ? savedTheme === 'dark' : true
  })
  const [expandedLogIndex, setExpandedLogIndex] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState(null) // Posición temporal durante drag de burbuja
  const [panelDragPosition, setPanelDragPosition] = useState(null) // Posición temporal durante drag de panel
  const [corner, setCorner] = useState(() => {
    if (isProd) return 'bottom-right'
    const savedCorner = localStorage.getItem('logger-corner')
    return savedCorner || 'bottom-right'
  })
  
  const contentRef = useRef(null)
  const bubbleRef = useRef(null)
  const panelRef = useRef(null)
  const dragStartPosRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)


  // Actualizar posición cuando cambia la esquina
  useEffect(() => {
    if (isExpanded && panelRef.current) {
      panelRef.current.style.opacity = '1'
    }
  }, [corner, isExpanded])

  // Agrupa logs para mostrar
  const groupedLogs = groupLogs(logs)

  // Función para copiar todos los logs
  const copyAllLogs = (e) => {
    e.stopPropagation()
    const allLogsText = logs.map((log) => {
      const timestamp = formatTime(log.timestamp)
      return `[${timestamp}] ${log.message}`
    }).join('\n')
    
    navigator.clipboard.writeText(allLogsText).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    })
  }

  // Drag & drop con preview visual
  const handleBubbleDragStart = (e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    
    dragStartPosRef.current = { x: clientX, y: clientY }
    isDraggingRef.current = false
    
    const handleMove = (moveEvent) => {
      const moveClientX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX
      const moveClientY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY

      const deltaX = Math.abs(moveClientX - dragStartPosRef.current.x)
      const deltaY = Math.abs(moveClientY - dragStartPosRef.current.y)
      
      if (!isDraggingRef.current && (deltaX > 5 || deltaY > 5)) {
        isDraggingRef.current = true
        setIsDragging(true)
        // Prevenir selección de texto durante el drag
        document.body.style.userSelect = 'none'
      }

      if (isDraggingRef.current) {
        moveEvent.preventDefault()
        
        // Calcular posición de la burbuja siguiendo el cursor
        const bubbleSize = window.innerWidth <= 480 ? 56 : 50
        const left = moveClientX - (bubbleSize / 2)
        const top = moveClientY - (bubbleSize / 2)
        
        // Aplicar límites
        const minMargin = 8
        const maxLeft = window.innerWidth - bubbleSize - minMargin
        const maxTop = window.innerHeight - bubbleSize - minMargin
        
        const boundedLeft = Math.max(minMargin, Math.min(left, maxLeft))
        const boundedTop = Math.max(minMargin, Math.min(top, maxTop))
        
        setDragPosition({ left: boundedLeft, top: boundedTop })
      }
    }
    
    const handleEnd = (endEvent) => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
      
      if (isDraggingRef.current) {
        const finalX = endEvent.type.includes('touch') 
          ? (endEvent.changedTouches?.[0]?.clientX || dragStartPosRef.current.x)
          : endEvent.clientX
        const finalY = endEvent.type.includes('touch')
          ? (endEvent.changedTouches?.[0]?.clientY || dragStartPosRef.current.y)
          : endEvent.clientY
        
        const closestCorner = getClosestCorner(finalX, finalY)
        
        // Actualizar esquina inmediatamente
        setCorner(closestCorner)
        localStorage.setItem('logger-corner', closestCorner)
        
        // Restaurar selección de texto
        document.body.style.userSelect = ''
        
        // Limpiar dragPosition después de un pequeño delay
        setTimeout(() => {
          setDragPosition(null)
          setIsDragging(false)
          isDraggingRef.current = false
        }, 50)
      } else {
        setIsExpanded(true)
      }
    }
    
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
  }

  // Drag & drop del panel (desde el header)
  const handlePanelDragStart = (e) => {
    // Solo permitir drag desde el header, no desde botones
    if (e.target.closest('button')) return
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    
    dragStartPosRef.current = { x: clientX, y: clientY }
    isDraggingRef.current = false
    
    const handleMove = (moveEvent) => {
      const moveClientX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX
      const moveClientY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY

      const deltaX = Math.abs(moveClientX - dragStartPosRef.current.x)
      const deltaY = Math.abs(moveClientY - dragStartPosRef.current.y)
      
      if (!isDraggingRef.current && (deltaX > 5 || deltaY > 5)) {
        isDraggingRef.current = true
        setIsDragging(true)
        // Prevenir selección de texto durante el drag
        document.body.style.userSelect = 'none'
      }

      if (isDraggingRef.current) {
        moveEvent.preventDefault()
        
        // Calcular posición del panel siguiendo el cursor
        const isMobile = window.innerWidth <= 480
        const panelWidth = isMobile ? window.innerWidth - 16 : 400
        
        // Centrar el panel en el cursor (horizontalmente)
        const left = moveClientX - (panelWidth / 2)
        
        // Aplicar límites solo para evitar que se salga de la pantalla
        const minMargin = 8
        const maxLeft = window.innerWidth - panelWidth - minMargin
        const boundedLeft = Math.max(minMargin, Math.min(left, maxLeft))
        
        // Si el panel está en una esquina bottom, usar bottom en lugar de top
        const isCurrentlyBottom = corner === 'bottom-left' || corner === 'bottom-right'
        
        if (isCurrentlyBottom) {
          const bottom = window.innerHeight - moveClientY - 50
          const maxBottom = window.innerHeight - 100
          const boundedBottom = Math.max(minMargin, Math.min(bottom, maxBottom))
          setPanelDragPosition({ bottom: boundedBottom, left: boundedLeft })
        } else {
          const top = moveClientY - 50 // Offset para que el cursor esté en el header
          const maxTop = window.innerHeight - 100 // Dejar al menos 100px del panel visible
          const boundedTop = Math.max(minMargin, Math.min(top, maxTop))
          setPanelDragPosition({ top: boundedTop, left: boundedLeft })
        }
      }
    }
    
    const handleEnd = (endEvent) => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
      
      if (isDraggingRef.current) {
        const finalX = endEvent.type.includes('touch') 
          ? (endEvent.changedTouches?.[0]?.clientX || dragStartPosRef.current.x)
          : endEvent.clientX
        const finalY = endEvent.type.includes('touch')
          ? (endEvent.changedTouches?.[0]?.clientY || dragStartPosRef.current.y)
          : endEvent.clientY
        
        const closestCorner = getClosestCorner(finalX, finalY)
        
        // Convertir panelDragPosition para que use las mismas propiedades que la esquina destino
        const convertedPosition = convertDragPosition(panelDragPosition, closestCorner)
        if (convertedPosition) {
          setPanelDragPosition(convertedPosition)
        }
        
        // Actualizar esquina después de convertir la posición
        setTimeout(() => {
          setCorner(closestCorner)
          localStorage.setItem('logger-corner', closestCorner)
        }, 10)
        
        // Restaurar selección de texto
        document.body.style.userSelect = ''
        
        // Limpiar panelDragPosition después de un pequeño delay
        setTimeout(() => {
          setPanelDragPosition(null)
          setIsDragging(false)
          isDraggingRef.current = false
        }, 350)
      }
    }
    
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
  }


  useEffect(() => {
    if (isProd) return
    localStorage.setItem('logger-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode, isProd])

  useEffect(() => {
    if (isProd) return
    localStorage.setItem('logger-pinned', isPinned.toString())
  }, [isPinned, isProd])

  useEffect(() => {
    if (isProd) return
    localStorage.setItem('logger-expanded', isExpanded.toString())
  }, [isExpanded, isProd])

  useEffect(() => {
    if (isProd) return
    if (logs.length > 0 && !isExpanded) {
      // Opcional: lógica de auto-expansión
    }
  }, [logs.length, isExpanded, isProd])

  // Auto-scroll al final cuando llegan nuevos logs
  useEffect(() => {
    if (isProd) return
    if (contentRef.current && isExpanded) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [logs, isExpanded, isProd])

  // Clic fuera para minimizar (solo si no está fijado)
  useEffect(() => {
    if (isProd) return
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
  }, [isExpanded, isPinned, isProd])

  // No renderizar en producción - retorna null después de todos los hooks
  if (isProd) {
    return null
  }

  const hasLogs = logs.length > 0
  const themeClass = isDarkMode ? 'logger-dark' : 'logger-light'
  
  // Usar dragPosition si está arrastrando, sino usar la posición de esquina
  const bubblePosition = dragPosition || getBubblePosition(corner)
  const panelPosition = getPanelPosition(corner)

  return (
    <>
      {/* Burbuja */}
      <div 
        ref={bubbleRef}
        onMouseDown={handleBubbleDragStart}
        onTouchStart={handleBubbleDragStart}
        className={`logger-collapsed ${themeClass} ${isDragging ? 'logger-dragging' : ''}`}
        style={{
          position: 'fixed',
          ...bubblePosition,
          cursor: isDragging ? 'grabbing' : 'pointer',
          display: isExpanded ? 'none' : 'flex',
          userSelect: 'none',
          transition: isDragging ? 'none' : 'all 0.3s ease-out'
        }}
        title={hasLogs ? `${groupedLogs.length} grupo(s) de logs` : 'Logger'}
      >
        <Icon name="code-simple" size="md" />
        {hasLogs && (
          <span className={`logger-badge ${themeClass}`}>
            {groupedLogs.length > 99 ? '99+' : groupedLogs.length}
          </span>
        )}
      </div>

      {/* Panel - solo renderizado cuando está expandido */}
      {isExpanded && (
        <div 
          ref={panelRef}
          className={`logger-panel ${themeClass}`}
          style={{
            position: 'fixed',
            ...(panelDragPosition || panelPosition),
            transition: isDragging ? 'none' : 'all 0.3s ease-out'
          }}
        >
      <div 
        className={`logger-header ${themeClass}`}
        onMouseDown={handlePanelDragStart}
        onTouchStart={handlePanelDragStart}
        style={{ cursor: isDragging ? 'grabbing' : 'move', userSelect: 'none' }}
      >
        <span className="logger-title">
          <img 
            src={isDarkMode ? LogoDark : LogoLight} 
            alt="Dev Logger" 
            className="logger-logo" 
          />
          <span>({groupedLogs.length})</span>
        </span>
        <div className="logger-buttons">
          {/* Grupo 1: Acciones sobre contenido */}
          <button
            onClick={copyAllLogs}
            disabled={logs.length === 0}
            className={`logger-btn ${themeClass} ${logs.length === 0 ? 'logger-btn-disabled' : ''}`}
            title={logs.length === 0 ? 'No hay logs para copiar' : 'Copiar todos los logs'}
          >
            {copiedAll ? <Icon name="check" size="sm" /> : <Icon name="copy" size="sm" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              log.clear()
            }}
            disabled={logs.length === 0}
            className={`logger-btn logger-btn-clear ${themeClass} ${logs.length === 0 ? 'logger-btn-disabled' : ''}`}
            title={logs.length === 0 ? 'No hay logs para limpiar' : 'Limpiar todos los logs'}
          >
            <Icon name="broom-wide" size="sm" />
          </button>

          {/* Separador */}
          <div className={`logger-btn-separator ${themeClass}`}></div>

          {/* Grupo 2: Configuración de vista */}
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
              setIsPinned(!isPinned)
            }}
            className={`logger-btn ${themeClass}`}
            title={isPinned ? 'Desfijar panel' : 'Fijar panel'}
          >
            {isPinned ? <Icon name="lock" size="sm" /> : <Icon name="lock-open" size="sm" />}
          </button>

          {/* Separador */}
          <div className={`logger-btn-separator ${themeClass}`}></div>

          {/* Grupo 3: Control de ventana */}
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

      <div ref={contentRef} className={`logger-content ${themeClass}`}>
        {logs.length === 0 ? (
          <div className={`logger-empty ${themeClass}`}>
            <div className="empty-screen">
              <Icon name="empty-set" size="2xl" style="light" family="classics" />
            </div>
          </div>
        ) : (
          groupedLogs.map((logGroup, idx) => (
            <LogItem 
              key={logGroup.key} 
              logGroup={logGroup} 
              isDarkMode={isDarkMode} 
              isLast={idx === groupedLogs.length - 1}
              isExpanded={expandedLogIndex === idx}
              onToggle={() => setExpandedLogIndex(expandedLogIndex === idx ? null : idx)}
            />
          ))
        )}
      </div>
    </div>
    )}
    </>
  )
}
