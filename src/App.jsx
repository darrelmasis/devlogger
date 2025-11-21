import { useLogger } from "@dmasis/logger"

function App() {
  const { log } = useLogger()

  log.error("Hello World")

  const handleAction = () => {
    log('Mensaje simple')
    log.info('Acción ejecutada correctamente')
    log.warn('Advertencia: Esto podría causar problemas')
    log.error('Error al procesar datos')
    log.force('Este mensaje se muestra incluso en producción')
  }

  return (
    <div>
      <h1>Logger</h1>
      <button onClick={handleAction}>Ejecutar</button>
    </div>
  )
}

export default App
