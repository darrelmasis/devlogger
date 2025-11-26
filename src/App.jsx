import { useState } from 'react';
import { log } from './core/LoggerCore';
import './App.css';
import LogoLight from './assets/dev-logger.svg';
import LogoDark from './assets/dev-logger-dark.svg';

// ✅ Prueba: log en el cuerpo del componente (NO debe causar re-renders infinitos)
log.info('Componente App renderizando');

function App() {
  const [count, setCount] = useState(0);
  const [simulatedEnv, setSimulatedEnv] = useState(() => {
    // La lógica de simulación automática en GitHub Pages
    // está en env.js y se ejecuta antes de que React se monte
    return localStorage.getItem('devlogger-simulated-env') || 'auto';
  });
  const [copiedStep, setCopiedStep] = useState(null);

  // Get current environment (simulated or real)
  const currentEnv = simulatedEnv || log.env;

  const handleEnvChange = (e) => {
    const value = e.target.value;
    // Siempre establecemos un valor en localStorage
    setSimulatedEnv(value);
    localStorage.setItem('devlogger-simulated-env', value);
    window.location.reload();
  };

  const copyToClipboard = (text, stepNumber) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStep(stepNumber);
      setTimeout(() => setCopiedStep(null), 2000);
    });
  };

  // ✅ Prueba: log en el cuerpo del componente
  log.warn(`App renderizado con count: ${count}`);

  const handleClick = () => {
    setCount((c) => c + 1);
    log.success(`¡Botón clickeado! Nuevo count: ${count + 1}`);
  };

  const testAllLevels = () => {
    log('🚀 Iniciando aplicación...');
    log.info('📊 Cargando datos del usuario desde la API');
    log.success('✅ Usuario autenticado correctamente: admin@example.com');
    log.warn('⚠️ La sesión expirará en 5 minutos');
    log.error('❌ Error al cargar el módulo de pagos');
    log.force('🔒 [PRODUCCIÓN] Intento de acceso no autorizado detectado');
    
    // Objetos complejos
    log.info('Datos del usuario:', {
      id: 12345,
      nombre: 'Ana García',
      rol: 'Administrador',
      permisos: ['lectura', 'escritura', 'admin'],
      configuracion: {
        tema: 'oscuro',
        idioma: 'es',
        notificaciones: true
      }
    });
    
    // Arrays
    log.info('Productos en carrito:', [
      { id: 1, nombre: 'Laptop', precio: 1299.99, cantidad: 1 },
      { id: 2, nombre: 'Mouse', precio: 29.99, cantidad: 2 },
      { id: 3, nombre: 'Teclado', precio: 89.99, cantidad: 1 }
    ]);
    
    // Referencias circulares
    const usuario = { 
      nombre: 'Carlos',
      edad: 28,
      empresa: { nombre: 'TechCorp' }
    };
    usuario.empresa.fundador = usuario; // Referencia circular
    log.warn('⚠️ Objeto con referencia circular:', usuario);
  };

  const testUncaughtError = () => {
    log.info('🧪 Simulando error no capturado...');
    setTimeout(() => {
      throw new Error('💥 Error crítico: No se pudo conectar con el servidor de base de datos');
    }, 100);
  };

  const testPromiseRejection = () => {
    log.info('🧪 Simulando rechazo de promesa...');
    Promise.reject(new Error('🔴 Fallo en la autenticación: Token inválido o expirado'));
  };

  const testAsyncError = async () => {
    log.info('🧪 Simulando error en función async...');
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('⚡ Error en operación asíncrona: Timeout al procesar el pago');
  };

  const testFetchError = () => {
    log.info('🧪 Simulando error de red...');
    fetch('https://api-inexistente-12345.com/usuarios')
      .then((res) => res.json())
      .catch((error) => {
        log.error('🌐 Error de red capturado:', error.message);
      });
  };

  const testUndefinedErrors = () => {
    log.info('🧪 Simulando error de undefined...');
    setTimeout(() => {
      const config = undefined;
      // @ts-ignore
      config.apiKey; // TypeError
    }, 100);
  };

  const testNullError = () => {
    log.info('🧪 Simulando error de null...');
    setTimeout(() => {
      const respuesta = null;
      // @ts-ignore
      respuesta.datos.usuario; // TypeError
    }, 100);
  };

  const testReferenceError = () => {
    log.info('🧪 Simulando error de referencia...');
    setTimeout(() => {
      // @ts-ignore
      funcionQueNoExiste(); // ReferenceError
    }, 100);
  };

  const testLogGrouping = () => {
    log.clear();
    log.info('🔄 Iniciando sincronización...');
    log.info('🔄 Iniciando sincronización...');
    log.info('🔄 Iniciando sincronización...');
    log.success('✅ Archivo guardado correctamente');
    log.success('✅ Archivo guardado correctamente');
    log.warn('⚠️ Memoria RAM al 85%');
    log.warn('⚠️ Memoria RAM al 85%');
    log.warn('⚠️ Memoria RAM al 85%');
    log.error('❌ Error de conexión');
    log.info('📡 Reconectando al servidor...');
  };

  const clearAllLogs = () => {
    log.clear();
  };

  return (
    <div className="demo-container">
      <header className="demo-header">
        <img src={LogoLight} alt="Dev Logger" className="demo-logo demo-logo-light" />
        <img src={LogoDark} alt="Dev Logger" className="demo-logo demo-logo-dark" />
        
        <h1>DevLogger Demo</h1>
        <p>Explora los niveles de log, agrupación y captura automática de errores.</p>
        
        <div className="demo-cta-buttons">
          <a 
            href="https://www.npmjs.com/package/@darelmasis/devlogger" 
            target="_blank" 
            rel="noopener noreferrer"
            className="demo-cta-primary"
          >
            <span className="demo-cta-icon">📦</span>
            <span className="demo-cta-text">
              <span className="demo-cta-label">Instalar v0.4.3 (latest)</span>
              <span className="demo-cta-command">npm install @darelmasis/devlogger</span>
            </span>
          </a>
          <a 
            href="https://github.com/darrelmasis/devlogger" 
            target="_blank" 
            rel="noopener noreferrer"
            className="demo-cta-secondary"
          >
            🔗 Ver Repositorio
          </a>
        </div>
        
        <div className="demo-env-controls">
          <div className="demo-env-badge">
            Entorno actual: <strong>{currentEnv}</strong>
            {simulatedEnv && <span className="demo-simulated-tag">(simulado)</span>}
          </div>
          <select 
            value={simulatedEnv} 
            onChange={handleEnvChange}
            className="demo-env-select"
          >
            <option value="auto">Auto-detectar</option>
            <option value="development">Development</option>
            <option value="production">Production</option>
          </select>
        </div>
      </header>

      <section className="demo-quick-start">
        <h2>🚀 Inicio Rápido</h2>
        <div className="demo-steps">
          <div className="demo-step">
            <div className="demo-step-header">
              <div className="demo-step-number">1</div>
              <h3>Instalar paquete</h3>
            </div>
            <div className="demo-code-block">
              <code>npm install @darelmasis/devlogger</code>
              <button 
                className="demo-copy-btn"
                onClick={() => copyToClipboard('npm install @darelmasis/devlogger', 1)}
                title="Copiar comando"
              >
                {copiedStep === 1 ? '✓' : '📋'}
              </button>
            </div>
          </div>
          
          <div className="demo-step">
            <div className="demo-step-header">
              <div className="demo-step-number">2</div>
              <h3>Configurar en tu App</h3>
            </div>
            <div className="demo-code-block">
              <code>{'import { LoggerProvider, LoggerDisplay } from "@darelmasis/devlogger"\n\nfunction App() {\n  return (\n    <LoggerProvider>\n      <YourApp />\n      <LoggerDisplay />\n    </LoggerProvider>\n  )\n}'}</code>
              <button 
                className="demo-copy-btn"
                onClick={() => copyToClipboard('import { LoggerProvider, LoggerDisplay } from "@darelmasis/devlogger"\n\nfunction App() {\n  return (\n    <LoggerProvider>\n      <YourApp />\n      <LoggerDisplay />\n    </LoggerProvider>\n  )\n}', 2)}
                title="Copiar código"
              >
                {copiedStep === 2 ? '✓' : '📋'}
              </button>
            </div>
          </div>
          
          <div className="demo-step">
            <div className="demo-step-header">
              <div className="demo-step-number">3</div>
              <h3>Usar en cualquier lugar</h3>
            </div>
            <div className="demo-code-block">
              <code>{'import { log } from "@darelmasis/devlogger"\n\nlog.info("¡Funciona!")\nlog.success("Usuario registrado")\nlog.error("Error al guardar")'}</code>
              <button 
                className="demo-copy-btn"
                onClick={() => copyToClipboard('import { log } from "@darelmasis/devlogger"\n\nlog.info("¡Funciona!")\nlog.success("Usuario registrado")\nlog.error("Error al guardar")', 3)}
                title="Copiar código"
              >
                {copiedStep === 3 ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-cards-wrapper">
        <div className="demo-card">
          <h3>Pruebas Básicas</h3>
          <button onClick={handleClick} className="demo-btn">Contador: {count}</button>
          <button onClick={testAllLevels} className="demo-btn">
            Probar Todos los Niveles
          </button>
          <button onClick={testLogGrouping} className="demo-btn">
            Probar Agrupación de Logs
          </button>
          <button onClick={clearAllLogs} className="demo-btn">
            Limpiar Logs
          </button>
        </div>

        <div className="demo-card">
          <h3>Captura Automática de Errores</h3>
          <button onClick={testUncaughtError} className="demo-btn">Probar Error No Capturado</button>
          <button onClick={testPromiseRejection} className="demo-btn">
            Probar Rechazo de Promesa
          </button>
          <button onClick={testAsyncError} className="demo-btn">
            Probar Error Async
          </button>
          <button onClick={testFetchError} className="demo-btn">
            Probar Error de Fetch
          </button>
        </div>

        <div className="demo-card">
          <h3>Errores Comunes de JavaScript</h3>
          <button onClick={testUndefinedErrors} className="demo-btn">Probar Error de Undefined</button>
          <button onClick={testNullError} className="demo-btn">
            Probar Error de Null
          </button>
          <button onClick={testReferenceError} className="demo-btn">
            Probar Error de Referencia
          </button>
        </div>

        <div className="demo-info">
          <p>✅ Revisa la consola y el panel del logger</p>
          <p>✅ Sin re‑renders infinitos</p>
          <p>✅ Captura automática de errores habilitada</p>
        </div>
      </section>

      <footer className="demo-footer">
        <div className="demo-footer-content">
          <div className="demo-footer-section">
            <h4>Enlaces</h4>
            <a href="https://www.npmjs.com/package/@darelmasis/devlogger" target="_blank" rel="noopener noreferrer">
              📦 NPM Package
            </a>
            <a href="https://github.com/darrelmasis/devlogger" target="_blank" rel="noopener noreferrer">
              🔗 GitHub Repository
            </a>
            <a href="https://github.com/darrelmasis/devlogger/issues" target="_blank" rel="noopener noreferrer">
              🐛 Report Issues
            </a>
          </div>

          <div className="demo-footer-section">
            <h4>Autor</h4>
            <p>Creado por <strong>Darel Masis</strong></p>
            <a href="mailto:darrelmasis@gmail.com">✉️ darrelmasis@gmail.com</a>
          </div>

          <div className="demo-footer-section">
            <h4>Colabora</h4>
            <p>¡Las contribuciones son bienvenidas!</p>
            <a href="https://github.com/darrelmasis/devlogger/fork" target="_blank" rel="noopener noreferrer">
              🍴 Fork en GitHub
            </a>
            <a href="https://github.com/darrelmasis/devlogger/pulls" target="_blank" rel="noopener noreferrer">
              🔀 Pull Requests
            </a>
          </div>
        </div>

        <div className="demo-footer-bottom">
          <p>© 2025 DevLogger • Licencia MIT • v0.4.3</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
