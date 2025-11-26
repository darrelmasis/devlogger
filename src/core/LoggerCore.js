import { getIsProd, detectEnv } from '../utils/env'

class LoggerCore {
  constructor() {
    this.listeners = []
    this.logs = [] // Almacena historial de logs para suscriptores tardíos
    // Eliminado: this.isProd - verificamos en tiempo de ejecución para cada log
  }

  subscribe(callback) {
    this.listeners.push(callback)
    // Retorna una función para desuscribir
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  getLogs() {
    // Retorna una copia del historial de logs
    return [...this.logs]
  }

  emit(logEntry) {
    this.listeners.forEach(listener => listener(logEntry))
  }

  addLog(level, ...args) {
    // Verifica el estado de producción en tiempo de ejecución para cada log
    const isProd = getIsProd()
    
    // Convierte los niveles personalizados a métodos válidos de console
    const consoleMethod = level === 'success' || level === 'info' ? 'log' :
                         level === 'force' ? 'log' :
                         level === 'warn' ? 'warn' :
                         level === 'error' ? 'error' : 'log'
    
    // En producción: solo log.force() va a la consola, nada a la visualización
    if (isProd) {
      if (level === 'force') {
        // Los logs forzados siempre van a la consola, incluso en producción
        console[consoleMethod](...args)
      }
      // No emitir a la visualización en producción
      return
    }
    
    // En desarrollo: todos los logs van a la consola Y a la visualización
    // Pasa los argumentos directamente a console para mantener la inspección de objetos
    console[consoleMethod](...args)
    
    // Para mostrar en pantalla, convierte objetos a un formato legible
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          // Maneja referencias circulares
          const seen = new WeakSet()
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return '[Circular]'
              }
              seen.add(value)
            }
            return value
          }, 2)
        } catch (e) {
          return `[Objeto: ${Object.prototype.toString.call(arg)}]`
        }
      }
      return String(arg)
    }).join(' ')
    
    // Crea la entrada del log con marca de tiempo
    const logEntry = {
      level,
      message,
      data: args,
      timestamp: new Date()
    }
    
    // Guarda en el historial (solo en desarrollo)
    this.logs.push(logEntry)
    
    // Emite el evento a todos los suscriptores (solo en desarrollo)
    this.emit(logEntry)
  }

  clear() {
    console.clear()
    this.logs = [] // Limpia el historial
    this.emit({ type: 'clear' })
  }
}

// Crea una instancia única (singleton)
const loggerCore = new LoggerCore()

// Crea la función log con métodos adicionales
const log = (...args) => loggerCore.addLog('info', ...args)

log.success = (...args) => loggerCore.addLog('success', '[SUCCESS]', ...args)
log.info    = (...args) => loggerCore.addLog('info', '[INFO]', ...args)
log.warn    = (...args) => loggerCore.addLog('warn', '[WARN]', ...args)
log.error   = (...args) => loggerCore.addLog('error', '[ERROR]', ...args)
log.force   = (...args) => loggerCore.addLog('force', '[FORCE]', ...args)
log.clear   = () => loggerCore.clear()

// Hace que log.env sea un getter para que siempre devuelva el entorno actual dinámicamente
Object.defineProperty(log, 'env', {
  get: () => detectEnv(),
  enumerable: true,
  configurable: false
})

// Exporta tanto la función log como la instancia del core para uso interno
export { log, loggerCore }
