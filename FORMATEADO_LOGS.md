# 📝 Formateado Visual de Logs - Sintaxis y Estilos

Este documento explica cómo se formatean y muestran los logs en el panel visual de `@darelmasis/devlogger`.

## 🎨 Estructura Visual de un Log

Cada log en el panel tiene la siguiente estructura:

```
┌─────────────────────────────────────────┐
│ [14:30:45]                              │ ← Timestamp (gris, 10px)
│                                         │
│ Contenido del log aquí...               │ ← Contenido (color según nivel)
│                                         │
│                    [📋]                │ ← Botón copiar (esquina superior derecha)
└─────────────────────────────────────────┘
```

## 📋 Componentes del Formateado

### 1. Timestamp
- **Formato**: `[HH:MM:SS]`
- **Estilo**: 
  - Fuente: `monospace`
  - Tamaño: `10px`
  - Color: Gris (`#888888` dark / `#999999` light)
  - Posición: Parte superior del log

**Ejemplo visual:**
```
[14:30:45]
```

### 2. Contenido del Log

El contenido se formatea de diferentes maneras según el tipo de dato:

#### A. Strings y Primitivos
- Se muestran directamente como texto
- Sin formato especial
- Color según el nivel del log

**Ejemplo:**
```javascript
log('Hola mundo')
// Muestra: Hola mundo
```

#### B. Objetos y Arrays
- Se renderizan usando `JsonView` con sintaxis JSON coloreada
- Son colapsables/expandibles
- Tienen colores diferentes según el tipo de dato

**Sintaxis JSON:**

**Strings:**
- Formato: `"texto"`
- Color Dark: `#ce9178` (naranja)
- Color Light: `#a31515` (rojo)

**Numbers:**
- Formato: `123` o `123.45`
- Color Dark: `#b5cea8` (verde claro)
- Color Light: `#098658` (verde)

**Booleans:**
- Formato: `true` o `false`
- Color Dark: `#569cd6` (azul)
- Color Light: `#0000ff` (azul)

**Null/Undefined:**
- Formato: `null` o `undefined`
- Color Dark: `#999999` (gris)
- Color Light: `#666666` (gris)

**Keys (claves de objetos):**
- Formato: `"clave"`
- Color Dark: `#9cdcfe` (azul claro)
- Color Light: `#0451a5` (azul oscuro)

**Arrays Colapsados:**
- Formato: `▶ [3] Array`
- Color: Gris (`#888888` dark / `#666666` light)

**Arrays Expandidos:**
```
▼ [
  "item1",
  "item2",
  "item3"
]
```

**Objetos Colapsados:**
- Formato: `▶ {3} Object`
- Color: Gris (`#888888` dark / `#666666` light)

**Objetos Expandidos:**
```
▼ {
  "nombre": "Juan",
  "edad": 30,
  "activo": true
}
```

### 3. Colores por Nivel de Log

Los logs tienen diferentes colores según su nivel:

| Nivel | Color Dark | Color Light | Prefijo |
|-------|------------|-------------|---------|
| `success` | `#5dff5d` (verde brillante) | `#1b7a1b` (verde oscuro) | `[SUCCESS]` |
| `info` | `#4db8ff` (azul) | `#0d47a1` (azul oscuro) | `[INFO]` |
| `warn` | `#ffb84d` (naranja) | `#d84315` (naranja oscuro) | `[WARN]` |
| `error` | `#ff5252` (rojo) | `#b71c1c` (rojo oscuro) | `[ERROR]` |
| `force` | `#ce93ff` (morado) | `#4a148c` (morado oscuro) | `[FORCE]` |

## 🔍 Flujo de Formateado

### Paso 1: Creación del Log (LoggerCore.js)

```javascript
addLog(level, ...args) {
  // 1. Convierte argumentos a string para el mensaje
  const message = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      // Usa JSON.stringify con manejo de referencias circulares
      return JSON.stringify(arg, (key, value) => {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
        return value
      }, 2)
    }
    return String(arg)
  }).join(' ')
  
  // 2. Crea la entrada del log
  const logEntry = {
    level,        // 'info', 'success', 'warn', 'error', 'force'
    message,      // String formateado (para copiar)
    data: args,   // Datos originales (para renderizar)
    timestamp: new Date()
  }
}
```

### Paso 2: Renderizado (LoggerDisplay.jsx)

```javascript
// Si hay datos originales (log.data)
if (log.data && log.data.length > 0) {
  log.data.map((item, itemIdx) => {
    if (typeof item === 'object' && item !== null) {
      // Renderiza con JsonView (sintaxis JSON coloreada)
      return <JsonView data={item} isDarkMode={isDarkMode} />
    } else {
      // Renderiza como string simple
      return <span>{String(item)}</span>
    }
  })
} else {
  // Si no hay datos, muestra el mensaje formateado
  return <pre>{log.message}</pre>
}
```

### Paso 3: Formateado JSON (JsonView.jsx)

```javascript
// Strings
if (type === 'string') {
  return <span className="json-string">"{data}"</span>
}

// Numbers
if (type === 'number') {
  return <span className="json-number">{data}</span>
}

// Booleans
if (type === 'boolean') {
  return <span className="json-boolean">{String(data)}</span>
}

// Arrays
if (Array.isArray(data)) {
  if (isCollapsed) {
    return <span className="json-collapsed">[{data.length}] Array</span>
  } else {
    return (
      <>
        [
        <div className="json-indent">
          {data.map(item => <JsonView data={item} />)}
        </div>
        ]
      </>
    )
  }
}

// Objects
if (type === 'object') {
  if (isCollapsed) {
    return <span className="json-collapsed">{'{'}{entries.length}{'}'} Object</span>
  } else {
    return (
      <>
        {'{'}
        <div className="json-indent">
          {entries.map(([key, value]) => (
            <div>
              <span className="json-key">"{key}"</span>: <JsonView data={value} />
            </div>
          ))}
        </div>
        {'}'}
      </>
    )
  }
}
```

## 🎯 Ejemplos Visuales

### Ejemplo 1: Log Simple
```javascript
log('Usuario autenticado')
```

**Renderizado:**
```
[14:30:45]
Usuario autenticado
```
Color: Azul (`#4db8ff` dark)

### Ejemplo 2: Log con Objeto
```javascript
log({ nombre: 'Juan', edad: 30, activo: true })
```

**Renderizado (colapsado):**
```
[14:30:45]
▶ {3} Object
```

**Renderizado (expandido):**
```
[14:30:45]
▼ {
  "nombre": "Juan",
  "edad": 30,
  "activo": true
}
```

### Ejemplo 3: Log con Array
```javascript
log([1, 2, 3, 'texto', true])
```

**Renderizado (colapsado):**
```
[14:30:45]
▶ [5] Array
```

**Renderizado (expandido):**
```
[14:30:45]
▼ [
  1,
  2,
  3,
  "texto",
  true
]
```

### Ejemplo 4: Log Múltiple
```javascript
log('Usuario:', { nombre: 'Juan' }, 'Edad:', 30)
```

**Renderizado:**
```
[14:30:45]
Usuario: ▶ {1} Object Edad: 30
```

**Renderizado (expandido):**
```
[14:30:45]
Usuario: ▼ {
  "nombre": "Juan"
} Edad: 30
```

### Ejemplo 5: Log con Niveles
```javascript
log.success('Operación exitosa')
log.warn('Advertencia')
log.error('Error crítico')
```

**Renderizado:**
```
[14:30:45]
[SUCCESS] Operación exitosa    ← Verde (#5dff5d)

[14:30:46]
[WARN] Advertencia             ← Naranja (#ffb84d)

[14:30:47]
[ERROR] Error crítico          ← Rojo (#ff5252)
```

## 🎯 Detalles Técnicos del Formateado

### Estructura de Clases CSS

```scss
.json-view {
  font-family: monospace;
  display: inline-block;
  
  .json-arrow {
    // Icono de flecha (chevron-down/right)
    cursor: pointer;
    margin-right: 4px;
  }
  
  .json-indent {
    // Indentación para objetos/arrays anidados
    margin-left: 16px;
  }
  
  .json-collapsed {
    // Texto colapsado (ej: "{3} Object")
    cursor: pointer;
  }
}
```

### Flujo de Renderizado

1. **LoggerCore** crea `logEntry` con:
   - `level`: Nivel del log
   - `message`: String formateado (para copiar)
   - `data`: Array con argumentos originales
   - `timestamp`: Fecha del log

2. **LoggerDisplay** recibe `logEntry` y:
   - Muestra timestamp
   - Itera sobre `log.data`
   - Si es objeto → usa `JsonView`
   - Si es primitivo → muestra como string

3. **JsonView** renderiza:
   - Detecta tipo de dato
   - Aplica clase CSS correspondiente
   - Si es objeto/array → permite colapsar/expandir
   - Aplica colores según tema (dark/light)

## 🛠️ Personalización del Formateado

### Modificar Colores

Los colores se definen en `src/styles/logger.scss`:

```scss
// Colores de niveles
$success-dark: #5dff5d;
$info-dark: #4db8ff;
$warn-dark: #ffb84d;
$error-dark: #ff5252;
$force-dark: #ce93ff;

// Colores JSON
$json-dark-string: #ce9178;
$json-dark-number: #b5cea8;
$json-dark-boolean: #569cd6;
$json-dark-key: #9cdcfe;
$json-dark-null: #999999;
```

### Modificar Formato de Timestamp

En `src/utils/utils.js`:

```javascript
export const formatTime = (date) => {
  // Cambiar formato aquí
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
```

### Modificar Sintaxis JSON

En `src/components/JsonView.jsx`, puedes cambiar:
- El formato de strings (agregar/remover comillas)
- El formato de números (agregar separadores)
- El formato de objetos/arrays colapsados
- La indentación

## 📊 Características del Formateado

### ✅ Ventajas Actuales

1. **Sintaxis JSON Coloreada**: Similar a DevTools del navegador
2. **Colapsable/Expandible**: Objetos y arrays se pueden colapsar
3. **Manejo de Referencias Circulares**: Muestra `[Circular]` en lugar de crashear
4. **Colores por Tipo**: Diferentes colores para strings, numbers, booleans, etc.
5. **Colores por Nivel**: Diferentes colores según el nivel del log
6. **Temas**: Soporte para tema claro y oscuro

### 🔄 Posibles Mejoras

1. **Syntax Highlighting Avanzado**: Resaltar código JavaScript/TypeScript
2. **Formateado de Fechas**: Mostrar fechas de manera más legible
3. **Formateado de Números**: Separadores de miles, porcentajes
4. **Formateado de URLs**: Hacer clicables y parsear
5. **Formateado de Errores**: Stack traces más legibles
6. **Búsqueda y Filtrado**: Buscar dentro de los logs
7. **Exportación**: Exportar logs en diferentes formatos

## 🎨 Estilos CSS Relacionados

### Clases Principales

- `.logger-item` - Contenedor del log
- `.logger-timestamp` - Timestamp del log
- `.logger-log-content` - Contenido del log
- `.json-view` - Vista JSON
- `.json-string` - String en JSON
- `.json-number` - Número en JSON
- `.json-boolean` - Boolean en JSON
- `.json-key` - Clave de objeto
- `.json-null` - Null/undefined
- `.json-collapsed` - Vista colapsada
- `.json-indent` - Indentación

### Clases por Nivel

- `.logger-success` - Log de éxito
- `.logger-info` - Log informativo
- `.logger-warn` - Log de advertencia
- `.logger-error` - Log de error
- `.logger-force` - Log forzado

## 💡 Tips de Uso

1. **Usa objetos para datos complejos**: Se renderizan mejor que strings
2. **Combina tipos**: Puedes mezclar strings, objetos y números
3. **Usa niveles apropiados**: Diferentes colores ayudan a identificar rápidamente
4. **Expande objetos grandes**: Click para expandir y ver detalles
5. **Copia logs**: Usa el botón de copiar para compartir logs

## 🔍 Debugging del Formateado

Si un log no se muestra correctamente:

1. Verifica que `log.data` tenga los datos originales
2. Verifica que `log.message` tenga el string formateado
3. Revisa la consola del navegador para errores
4. Verifica que los estilos CSS estén cargados
5. Verifica que el tema (dark/light) esté aplicado correctamente
