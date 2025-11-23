import { getIsProd, detectEnv } from '../utils/env'

class LoggerCore {
  constructor() {
    this.listeners = []
    // Removed: this.isProd - we check at runtime for each log instead
  }

  subscribe(callback) {
    this.listeners.push(callback)
    // Retorna una función para desuscribir
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  emit(logEntry) {
    this.listeners.forEach(listener => listener(logEntry))
  }

  addLog(level, ...args) {
    // Check production status at runtime for each log
    const isProd = getIsProd()
    
    // Convierte los niveles personalizados a métodos válidos de console
    const consoleMethod = level === 'success' || level === 'info' ? 'log' :
                         level === 'force' ? 'log' :
                         level === 'warn' ? 'warn' :
                         level === 'error' ? 'error' : 'log'
    
    // In production: only log.force() goes to console, nothing to visual display
    if (isProd) {
      if (level === 'force') {
        // Force logs always go to console, even in production
        console[consoleMethod](...args)
      }
      // Don't emit to visual display in production
      return
    }
    
    // In development: all logs go to console AND visual display
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
    
    // Emite el evento a todos los suscriptores (only in development)
    this.emit(logEntry)
  }

  clear() {
    console.clear()
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

// Make log.env a getter so it always returns the current environment dynamically
Object.defineProperty(log, 'env', {
  get: () => detectEnv(),
  enumerable: true,
  configurable: false
})

// Exporta tanto la función log como la instancia del core para uso interno
export { log, loggerCore }
