import { useState } from 'react'
import { log } from './core/LoggerCore'
import './App.css';

// ✅ Prueba: log en el cuerpo del componente (NO debe causar re-renders infinitos)
log.info('Componente App renderizando')

function App() {
  const [count, setCount] = useState(0)

  // ✅ Prueba: log en el cuerpo del componente
  log.warn(`App renderizado con count: ${count}`)

  const handleClick = () => {
    setCount(c => c + 1)
    log.success(`¡Botón clickeado! Nuevo count: ${count + 1}`)
  }

  const testAllLevels = () => {
    log('Mensaje de log por defecto')
    log.info('Mensaje de información')
    log.success('Mensaje de éxito')
    log.warn('Mensaje de advertencia')
    log.error('Mensaje de error')
    log.force('Mensaje forzado (se muestra en producción)')
    
    // Prueba de objetos
    log({ usuario: { nombre: 'Prueba', edad: 30 } })
    
    // Prueba de arrays
    log([1, 2, 3, 4, 5])
    
    // Prueba de referencias circulares
    const circular = { a: 1 }
    circular.self = circular
    log(circular)
  }

  const testUncaughtError = () => {
    // Esto será capturado automáticamente por el logger
    setTimeout(() => {
      throw new Error('¡Esta es una prueba de error no capturado!')
    }, 100)
    log.info('Error no capturado aparecerá en 100ms...')
  }

  const testPromiseRejection = () => {
    // Esto será capturado automáticamente por el logger
    Promise.reject(new Error('¡Prueba de rechazo de promesa no manejado!'))
    log.info('Rechazo de promesa activado...')
  }

  const testAsyncError = async () => {
    log.info('Probando error async...')
    // Simular una operación async que falla
    await new Promise(resolve => setTimeout(resolve, 100))
    throw new Error('¡Error de función async!')
  }

  const testFetchError = () => {
    // Esto fallará y será capturado automáticamente
    fetch('https://invalid-url-that-does-not-exist-12345.com/api')
      .then(res => res.json())
    log.info('Error de fetch activado (fallará)...')
  }

  const testUndefinedErrors = () => {
    log.info('Probando errores de undefined/null...')
    setTimeout(() => {
      // Estos serán capturados automáticamente
      const obj = undefined
      obj.property // TypeError: No se puede leer propiedad de undefined
    }, 100)
  }

  const testNullError = () => {
    log.info('Probando error de null...')
    setTimeout(() => {
      const data = null
      data.method() // TypeError: No se puede leer propiedad 'method' de null
    }, 100)
  }

  const testReferenceError = () => {
    log.info('Probando error de referencia...')
    setTimeout(() => {
      variableNoExistente.hacerAlgo() // ReferenceError
    }, 100)
  }

  const testLogGrouping = () => {
    log.clear()
    log.info('Test message 1')
    log.info('Test message 1')
    log.info('Test message 1')
    log.warn('Warning message')
    log.warn('Warning message')
    log.error('Error message')
    log.info('Different message')
    log.success('Success message')
    log.success('Success message')
  }

  const clearAllLogs = () => {
    log.clear()
  }

  return (
    <div className="App">
      <h1>Pruebas de @darelmasis/devlogger</h1>
      
      <div className="card">
        <h3>Pruebas Básicas</h3>
        <button onClick={handleClick}>
          Contador: {count}
        </button>
        
        <button onClick={testAllLevels} style={{ marginLeft: '10px' }}>
          Probar Todos los Niveles
        </button>
        
        <button onClick={testLogGrouping} style={{ marginLeft: '10px' }}>
          Probar Agrupación de Logs
        </button>
        
        <button onClick={clearAllLogs} style={{ marginLeft: '10px' }}>
          Limpiar Logs
        </button>
      </div>

      <div className="card">
        <h3>Pruebas de Captura Automática de Errores</h3>
        <button onClick={testUncaughtError}>
          Probar Error No Capturado
        </button>
        
        <button onClick={testPromiseRejection} style={{ marginLeft: '10px' }}>
          Probar Rechazo de Promesa
        </button>
        
        <button onClick={() => testAsyncError()} style={{ marginLeft: '10px' }}>
          Probar Error Async
        </button>
        
        <button onClick={testFetchError} style={{ marginLeft: '10px' }}>
          Probar Error de Fetch
        </button>
      </div>

      <div className="card">
        <h3>Errores Comunes de JavaScript</h3>
        <button onClick={testUndefinedErrors}>
          Probar Error de Undefined
        </button>
        
        <button onClick={testNullError} style={{ marginLeft: '10px' }}>
          Probar Error de Null
        </button>
        
        <button onClick={testReferenceError} style={{ marginLeft: '10px' }}>
          Probar Error de Referencia
        </button>
      </div>

      <div className="info">
        <p>✅ Revisa la consola y el panel del logger</p>
        <p>✅ Sin re-renders infinitos</p>
        <p>✅ Captura automática de errores habilitada</p>
        <p>Entorno: <strong>{log.env}</strong></p>
      </div>
    </div>
  )
}

export default App
