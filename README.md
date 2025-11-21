# Logger

Una librería React ligera para logging visual en desarrollo. Muestra logs en tiempo real en un panel flotante y se desactiva automáticamente en producción.

## 🚀 Instalación

```bash
npm install @darelmasis/logger
```

## 📖 Uso

### 1. Configuración Básica

Envuelve tu aplicación con `LoggerProvider` y agrega el componente `LoggerDisplay`:

```jsx
import { LoggerProvider, LoggerDisplay } from '@darelmasis/logger'

function App() {
  return (
    <LoggerProvider>
      <YourApp />
      <LoggerDisplay />
    </LoggerProvider>
  )
}
```

### 2. Logging en Componentes

Usa el hook `useLogger` para acceder a las funciones de logging:

```jsx
import { useLogger } from '@darelmasis/logger'

function MyComponent() {
  const { log } = useLogger()

  const handleAction = () => {
    log('Mensaje simple')
    log.info('Acción ejecutada correctamente')
    log.warn('Advertencia: Esto podría causar problemas')
    log.error('Error al procesar datos')
    log.force('Este mensaje se muestra incluso en producción')
  }

  return <button onClick={handleAction}>Ejecutar</button>
}
```

## 🎯 API

### `LoggerProvider`

Componente proveedor que debe envolver tu aplicación.

**Props:** `children` (ReactNode)

### `LoggerDisplay`

Componente visual que muestra los logs en un panel flotante en la esquina inferior derecha.

**Características:**
- Panel flotante con fondo semi-transparente
- Scroll automático
- Colores diferenciados por nivel de log
- Solo visible en desarrollo (a menos que uses `force`)

### `useLogger()`

Hook que retorna un objeto con las siguientes propiedades:

#### `log(...args)`
Función principal que puede ser llamada directamente para registrar mensajes simples.

```jsx
log('Usuario conectado')
log('Valor:', value, 'Estado:', status)
```

#### `log.info(message)`
Registra un mensaje informativo (verde).

#### `log.warn(message)`
Registra una advertencia (naranja).

#### `log.error(message)`
Registra un error (rojo).

#### `log.force(message)`
Registra un mensaje que se muestra **incluso en producción** (blanco).

#### `log.env`
Retorna el entorno actual: `'development'` o `'production'`.

## 🔧 Detección de Entorno

La librería detecta automáticamente el entorno usando:

1. Variable `VITE_APP_ENV` (si está definida)
2. Variable `import.meta.env.MODE` de Vite
3. Hostname del navegador (`localhost`/`127.0.0.1` = development)
4. Por defecto: `development`

## 📦 Exports

```javascript
export { LoggerProvider, LoggerDisplay, useLogger }
```

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 📄 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o PR.
