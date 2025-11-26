# @darelmasis/devlogger

> Librería React ligera para logging visual en desarrollo con panel flotante interactivo

[![npm version](https://img.shields.io/npm/v/@darelmasis/devlogger.svg)](https://www.npmjs.com/package/@darelmasis/devlogger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una solución moderna y elegante para debugging en React que combina logging en consola con un panel visual interactivo. Se desactiva automáticamente en producción para mantener tu aplicación limpia.

## Características

- **Panel visual collapsable** - Interfaz flotante no invasiva que se minimiza en un círculo
- **Efecto translúcido** - Panel con backdrop blur para un aspecto moderno y elegante
- **Panel fijable** - Fija el panel para que no se cierre al hacer click fuera
- **Persistencia de estado** - Recuerda tema, estado fijado y si estaba abierto/cerrado
- **Click fuera para minimizar** - Cierra automáticamente el panel al hacer click fuera (si no está fijado)
- **Scroll automático** - Desplazamiento suave al último log cuando llega uno nuevo
- **Acordeón de logs** - Solo un log expandido a la vez para mejor enfoque
- **Agrupación de logs** - Logs idénticos se agrupan automáticamente con contador (×N)
- **Tema claro/oscuro** - Alterna entre temas con persistencia en localStorage
- **Objetos JSON interactivos** - Expande y colapsa objetos complejos como en DevTools
- **Copiar logs** - Copia cualquier log al clipboard con un click
- **Limpiar logs** - Elimina todos los logs fácilmente
- **Auto-detección de entorno** - Se desactiva automáticamente en producción
- **Simulación de entorno** - Simula production/development para testing sin deploy
- **Captura automática de errores** - Captura errores no manejados, promesas rechazadas y más
- **Ligera** - Solo ~18KB (gzipped: ~5KB)
- **Manejo de objetos circulares** - Soporta objetos complejos como `window`
- **Colores de alto contraste** - Success (verde), Info (azul), Warning (naranja), Error (rojo), Force (morado)

## Instalación

```bash
npm install @darelmasis/devlogger
```

## Uso Rápido

### 1. Configuración Básica

Envuelve tu aplicación con `LoggerProvider` y agrega el componente `LoggerDisplay`:

```jsx
import { LoggerProvider, LoggerDisplay } from '@darelmasis/devlogger'

function App() {
  return (
    <LoggerProvider>
      <YourApp />
      <LoggerDisplay />
    </LoggerProvider>
  )
}
```

### 2. Logging en Cualquier Lugar

Importa `log` directamente y úsalo en **cualquier lugar** - componentes, funciones, servicios, etc.:

```jsx
import { log } from '@darelmasis/devlogger'

function MyComponent() {
  // ✅ Funciona en el cuerpo del componente (NO causa re-renders)
  log('Componente renderizando')

  const handleAction = () => {
    // Logging simple (por defecto es info - azul)
    log('Usuario conectado')
    
    // Múltiples argumentos
    log('Valor:', value, 'Estado:', status)
    
    // Objetos complejos
    log({ user: { name: 'Juan', age: 30 } })
    
    // Diferentes niveles
    log.success('Operación completada exitosamente')
    log.info('Información del sistema')
    log.warn('Advertencia: Límite alcanzado')
    log.error('Error al procesar datos')
    
    // Forzar en producción (morado)
    log.force('Este mensaje se muestra siempre')
  }

  return <button onClick={handleAction}>Ejecutar</button>
}

// ✅ También funciona en funciones normales
export function fetchData() {
  log.info('Fetching data...')
  // ...
}
```

## API Completa

### `LoggerProvider`

Componente proveedor que debe envolver tu aplicación.

```jsx
<LoggerProvider>
  {children}
</LoggerProvider>
```

**Props:**
- `children` (ReactNode) - Componentes hijos

### `LoggerDisplay`

Componente visual que muestra los logs en un panel flotante interactivo.

```jsx
<LoggerDisplay />
```

**Características del panel:**
- **Estado colapsado**: Círculo pequeño en la esquina inferior derecha
  - Gris cuando no hay logs
  - Verde cuando hay logs (muestra el contador)
  - Click para expandir
- **Estado expandido**: Panel completo con:
  - Header con contador de logs (click en el header para minimizar)
  - Botón para alternar tema claro/oscuro
  - Botón para limpiar todos los logs
  - Botón para minimizar
  - Área scrolleable con todos los logs
  - Botón de copiar en cada log
- **Colores por nivel**:
  - Verde (#4caf50): `log.success()`
  - Azul (#2196f3): `log()` y `log.info()`
  - Naranja (#ff9800): `log.warn()`
  - Rojo (#f44336): `log.error()`
  - Morado (#9c27b0): `log.force()`

### `log`

Función principal de logging que se puede usar en **cualquier lugar** sin causar re-renders.

#### `log(...args)`

Función principal para logging. **Por defecto es nivel info (azul)**. Acepta múltiples argumentos de cualquier tipo.

```jsx
import { log } from '@dmasis/logger'

// Strings (nivel info - azul)
log('Mensaje simple')

// Múltiples argumentos
log('Usuario:', user, 'Edad:', age)

// Objetos (se muestran interactivos y collapsables)
log({ name: 'Juan', data: { age: 30, city: 'Madrid' } })

// Arrays
log([1, 2, 3, 4, 5])

// Objetos complejos (maneja referencias circulares)
log(window)
log(document)
```

#### `log.success(...args)`

Registra un mensaje de éxito con prefijo `[SUCCESS]` (color verde #4caf50).

```jsx
log.success('Operación completada exitosamente')
log.success('Usuario registrado:', userData)
```

#### `log.info(...args)`

Registra un mensaje informativo con prefijo `[INFO]` (color azul #2196f3).

```jsx
log.info('Operación completada exitosamente')
log.info('Usuario autenticado:', userData)
```

#### `log.warn(...args)`

Registra una advertencia con prefijo `[WARN]` (color naranja #ff9800).

```jsx
log.warn('Límite de intentos alcanzado')
log.warn('Configuración faltante:', missingConfig)
```

#### `log.error(...args)`

Registra un error con prefijo `[ERROR]` (color rojo #f44336).

```jsx
log.error('Error al procesar datos')
log.error('Error:', error.message)
```

#### `log.force(...args)`

Registra un mensaje que se muestra **incluso en producción** con prefijo `[FORCE]` (color morado #9c27b0).

```jsx
log.force('Mensaje crítico que debe mostrarse siempre')
```

⚠️ **Advertencia**: Usa con precaución. Este método se ejecuta en producción.

#### `log.env`

Propiedad que retorna el entorno actual.

```jsx
import { log } from '@dmasis/logger'

console.log(log.env) // 'development' o 'production'

if (log.env === 'development') {
  // Código solo para desarrollo
}
```

#### `log.clear()`

Función para limpiar todos los logs programáticamente.

```jsx
import { log } from '@dmasis/logger'

log.clear() // Elimina todos los logs
```

## Detección de Entorno

La librería detecta automáticamente el entorno usando la siguiente prioridad:

1. Variable `VITE_APP_ENV` (si está definida)
2. Variable `import.meta.env.MODE` de Vite
3. Hostname del navegador:
   - `localhost` o `127.0.0.1` → `development`
   - Otros → `production`
4. Por defecto: `development`

### Configuración manual del entorno

Si usas Vite, puedes configurar el entorno en tu `.env`:

```bash
# .env.development
VITE_APP_ENV=development

# .env.production
VITE_APP_ENV=production
```

## Características Avanzadas

### Objetos JSON Collapsables

Los objetos se muestran de forma interactiva, similar a las DevTools del navegador:

```jsx
const complexObject = {
  user: {
    name: 'Juan',
    profile: {
      age: 30,
      address: {
        city: 'Madrid',
        country: 'España'
      }
    }
  },
  items: [1, 2, 3, 4, 5]
}

log(complexObject)
```

- ▶ Click en las flechas para expandir/colapsar
- Objetos anidados comienzan colapsados
- Muestra contadores: `{X keys}` o `[X items]`
- Colores tipo VS Code para diferentes tipos

### Manejo de Referencias Circulares

La librería maneja correctamente objetos con referencias circulares:

```jsx
log(window) // ✅ Funciona correctamente
log(document) // ✅ Funciona correctamente

const circular = { a: 1 }
circular.self = circular
log(circular) // ✅ Muestra [Circular] en las referencias
```

### Copiar Logs

Cada log tiene un botón de copiar que:
- Copia el contenido al clipboard
- Muestra confirmación durante 2 segundos
- Funciona con objetos (copia el JSON formateado)

## Exports

```javascript
export { 
  LoggerProvider,  // Proveedor del contexto
  LoggerDisplay,   // Componente visual
  log              // Función de logging (úsala en cualquier lugar)
}
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Lint
npm run lint

# Preview del build
npm run preview
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT © [Darel Masis](https://github.com/darrelmasis)

## Links

- [NPM Package](https://www.npmjs.com/package/@darelmasis/devlogger)
- [GitHub Repository](https://github.com/darrelmasis/logger)
- [Report Issues](https://github.com/darrelmasis/logger/issues)

---

Hecho por [Darel Masis](https://github.com/darrelmasis)
