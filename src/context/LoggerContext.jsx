import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { loggerCore } from '../core/LoggerCore'
import { getIsProd } from '../utils/env'

const LoggerContext = createContext()

export const LoggerProvider = ({ children }) => {
  // Inicializa con los logs que ya existen (captura logs tempranos)
  const [logs, setLogs] = useState(() => loggerCore.getLogs())
  
  // Llama a getIsProd directamente - es una verificación rápida en tiempo de ejecución
  // No es necesario memorizar ya que el entorno no cambiará durante la vida de la app
  const isProd = getIsProd()

  // Re-sincroniza con loggerCore para capturar logs emitidos durante el render inicial
  // Esto asegura que los logs agregados antes de que se establezca la suscripción sean capturados
  useEffect(() => {
    if (isProd) return
    
    // Re-sincroniza con loggerCore para capturar cualquier log agregado durante el render inicial
    const existingLogs = loggerCore.getLogs()
    if (existingLogs.length > 0) {
      setLogs(existingLogs)
    }
  }, [isProd]) // Se ejecuta solo una vez al montar

  // Se suscribe a los eventos del logger
  useEffect(() => {
    // No suscribirse a logs en producción (excepto logs forzados)
    if (isProd) return
    
    const unsubscribe = loggerCore.subscribe((logEntry) => {
      // Usa queueMicrotask para diferir actualizaciones de estado y evitar warning de React
      // sobre actualizar un componente mientras se renderiza otro
      queueMicrotask(() => {
        if (logEntry.type === 'clear') {
          setLogs([])
        } else {
          // En producción, solo agregar logs forzados
          // Pero como ya retornamos si esProd, esto no debería ejecutarse
          setLogs(prev => [...prev, logEntry])
        }
      })
    })

    // Limpia la suscripción al desmontar el componente
    return unsubscribe
  }, [isProd])

  // Captura errores JavaScript no manejados
  useEffect(() => {
    if (isProd) return

    const handleError = (event) => {
      // Evita el manejo de errores por defecto del navegador
      event.preventDefault()
      
      const errorMessage = event.error 
        ? event.error.stack || event.error.message 
        : event.message

      loggerCore.addLog('error',
        'Error No Capturado:',
        errorMessage,
        event.filename ? `en ${event.filename}:${event.lineno}:${event.colno}` : ''
      )
      
      return true
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [isProd])

  // Captura rechazos de promesas no manejados
  useEffect(() => {
    if (isProd) return

    const handleRejection = (event) => {
      event.preventDefault()
      
      const reason = event.reason?.stack || event.reason?.message || event.reason

      loggerCore.addLog('error',
        'Promesa No Manejada:',
        reason
      )
    }

    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [isProd])

  // Memoriza el valor del contexto para evitar renders innecesarios
  const contextValue = useMemo(() => ({ 
    logs,
    isProd 
  }), [logs, isProd])

  return (
    <LoggerContext.Provider value={contextValue}>
      {children}
    </LoggerContext.Provider>
  )
}

// Hook para acceder al contexto del logger desde componentes internos
export const useLoggerContext = () => useContext(LoggerContext)
