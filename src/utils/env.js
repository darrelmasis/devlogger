/**
 * Detecta el entorno actual en TIEMPO DE EJECUCIÓN.
 * 
 * IMPORTANTE: Para librerías, no podemos confiar en import.meta.env porque esos valores
 * se reemplazan en el tiempo de compilación de la librería, no en el del consumidor.
 * Esto significa que cualquier chequeo import.meta.env.* siempre devolverá el valor de cuando se construyó la librería.
 * 
 * En su lugar, usamos detección en tiempo de ejecución basada en el navegador usando window.location.hostname.
 * 
 * @returns {'development' | 'production'} Entorno actual
 */

// INICIALIZACIÓN: Establecer simulación automática para GitHub Pages
// Esto debe ejecutarse ANTES de que los componentes de React se monten
if (typeof window !== 'undefined') {
  const isGitHubPages = window.location.hostname.includes('github.io');
  const hasSimulation = localStorage.getItem('devlogger-simulated-env');
  
  // Si estamos en GitHub Pages y NO hay simulación configurada,
  // establecer 'development' por defecto para mostrar la demo
  // Nota: Si el usuario eligió 'auto', respetamos esa decisión
  if (isGitHubPages && hasSimulation === null) {
    localStorage.setItem('devlogger-simulated-env', 'development');
  }
}

export const detectEnv = () => {
  // Primero verifica si hay un entorno simulado en localStorage (para demo)
  if (typeof window !== 'undefined') {
    const simulatedEnv = localStorage.getItem('devlogger-simulated-env');
    
    // Si el usuario eligió explícitamente 'auto', saltamos la simulación
    if (simulatedEnv === 'auto') {
      // No hacer nada, continuar con la detección automática normal
    } else if (simulatedEnv === 'development' || simulatedEnv === 'production') {
      return simulatedEnv;
    }
  }

  // Detección basada en navegador en tiempo de ejecución
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    
    // Indicadores de desarrollo - localhost e IPs locales
    if (host === 'localhost' || 
        host === '127.0.0.1' || 
        host.startsWith('192.168.') ||
        host.startsWith('10.') ||
        host.endsWith('.local')) {
      return 'development'
    }
    
    // Verifica indicadores comunes de desarrollo/preview/staging en el hostname
    if (host.includes('localhost') || 
        host.includes('dev.') || 
        host.includes('-dev.') ||
        host.includes('.dev-') ||
        host.includes('preview') ||
        host.includes('staging') ||
        host.includes('-test.') ||
        host.includes('.test')) {
      return 'development'
    }
    
    // Todo lo demás es producción
    return 'production'
  }
  
  // SSR o entorno no navegador - por defecto desarrollo por seguridad
  // (mejor mostrar logs que ocultarlos en desarrollo)
  return 'development'
}

/**
 * Función auxiliar para verificar si el entorno actual es producción.
 * Llama a esto en tiempo de ejecución, no en la inicialización del módulo.
 * 
 * @returns {boolean} True si está en entorno de producción
 */
export const getIsProd = () => detectEnv() === 'production'
