# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.4.0] - 2025-11-25

### Agregado ✨
- **Simulación de entorno**: Ahora es posible simular diferentes entornos (development/production) mediante localStorage
  - Útil para testing y demos sin necesidad de deploy
  - Se puede activar/desactivar desde la aplicación demo
  - Persiste entre recargas de página

### Mejorado 🚀
- **Estilos refactorizados**: Eliminados todos los colores hardcodeados del contador de agrupación de logs
  - Ahora usa variables SCSS para mejor mantenibilidad
  - Clase `.logger-group-count` con estilos consistentes para temas claro/oscuro
  - Mejor integración con el sistema de temas existente
- **Detección de entorno mejorada**: La función `detectEnv()` ahora verifica localStorage primero
  - Permite override temporal del entorno detectado automáticamente
  - Útil para pruebas y desarrollo

### Técnico 🔧
- Refactorización completa de `logger.scss` con mejor organización de variables
- Eliminados estilos inline del componente `LoggerDisplay`
- Mejorada la documentación de código con comentarios en español

### Sin Breaking Changes ⚠️
Todos los cambios son internos y no afectan la API pública del paquete. No se requiere migración.

## [0.3.9] - 2025-11-23

### Corregido 🔧
- **LoggerDisplay en producción**: Componente ahora retorna `null` correctamente en producción, no se renderiza
- **LoggerCore en producción**: En producción solo `log.force()` va a consola, ningún log se emite al contexto visual
- **LoggerContext en producción**: No se suscribe a logs en producción, evitando trabajo innecesario
- **Hooks optimizados**: Los hooks en LoggerDisplay hacen early return en producción para evitar trabajo innecesario

## [0.3.8] - 2025-11-23

### Corregido 🔧
- **CRÍTICO: Detección de entorno en producción**: Corregido bug donde el entorno se detectaba en tiempo de build en lugar de runtime
  - Antes: La librería siempre detectaba `development` porque se compilaba localmente
  - Ahora: Detección basada en hostname en tiempo de ejecución usando `window.location.hostname`
  - Display ahora se oculta correctamente en producción (ej: Vercel, Netlify)
  - Logs normales ahora se suprimen correctamente en producción (solo `.force` logs aparecen)
- **LoggerDisplay en producción**: Componente ahora retorna `null` correctamente en producción, no se renderiza
- **LoggerCore en producción**: En producción solo `log.force()` va a consola, ningún log se emite al contexto visual
- **LoggerContext en producción**: No se suscribe a logs en producción, evitando trabajo innecesario
- **Variables de entorno**: Eliminadas todas las verificaciones de `import.meta.env.*` que no funcionan en librerías
- **log.env dinámico**: Convertido `log.env` de propiedad estática a getter dinámico que retorna el entorno actual

### Mejorado
- **Detección de entorno más robusta**: Ahora detecta múltiples patrones de desarrollo:
  - IPs locales: `localhost`, `127.0.0.1`, `192.168.*`, `10.*`, `*.local`
  - Subdominios comunes: `dev.`, `-dev.`, `.dev-`, `preview`, `staging`, `test`
  - Todo lo demás se considera producción
- **Documentación mejorada**: Agregados comentarios explicando por qué `import.meta.env` no funciona en librerías
- **Hooks optimizados**: Los hooks en LoggerDisplay hacen early return en producción para evitar trabajo innecesario

### Técnico
- `env.js`: Reescrito para usar solo detección basada en browser runtime
- `LoggerCore.js`: Ahora verifica `isProd` dinámicamente en cada llamada a `addLog()`
- `LoggerContext.jsx`: Actualizado para usar `getIsProd()` en lugar de `useMemo` con deps vacías

## [0.3.6] - 2025-01-XX

### Mejorado
- **Badge de notificación**: Badge verde profesional en la burbuja colapsada que muestra el número de logs
- **Burbuja colapsada**: La burbuja ahora siempre muestra el icono y mantiene su color de fondo constante
- **Variables SCSS**: Eliminados colores hardcodeados, ahora todo usa variables predefinidas
- **Diseño del badge**: Badge con gradiente, sombras elegantes y efecto hover sutil

### Corregido
- **Formateado de logs**: Múltiples argumentos ahora aparecen en la misma línea (ej: `[INFO] Mensaje`)
- **Orientación de iconos**: Iconos de objetos/arrays ahora muestran correctamente ▶ cuando están cerrados y ▼ cuando están abiertos
- **Expansión de items**: Los logs ahora se expanden hacia abajo en lugar de hacia arriba
- **LoggerContext**: Corregido uso incorrecto de `addLog` con arrays en captura de errores
- **Ruta portable**: Script de procesamiento de iconos ahora usa rutas relativas en lugar de hardcodeadas

## [0.3.5] - 2025-01-XX

### Corregido
- **Formateado de logs**: Múltiples argumentos ahora aparecen en la misma línea (ej: `[INFO] Mensaje`)
- **Orientación de iconos**: Iconos de objetos/arrays ahora muestran correctamente ▶ cuando están cerrados y ▼ cuando están abiertos
- **Expansión de items**: Los logs ahora se expanden hacia abajo en lugar de hacia arriba
- **LoggerContext**: Corregido uso incorrecto de `addLog` con arrays en captura de errores
- **Ruta portable**: Script de procesamiento de iconos ahora usa rutas relativas en lugar de hardcodeadas

### Mejorado
- **Layout de logs**: Mejorado el layout para que strings aparezcan en línea y objetos en bloque
- **Estilos JSON**: Agregados estilos faltantes para `json-arrow` y `json-indent`

## [0.3.2] - 2025-11-22

### Mejorado
- **Bundle optimizado**: Configuración explícita de minificación con esbuild
- **Build mejorado**: Target ES2015 para mejor compatibilidad
- **Código compacto**: Opciones de generación de código optimizadas

## [0.3.1] - 2025-11-22

### Mejorado
- **Documentación más profesional**: Reducido significativamente el uso de emojis en README y CHANGELOG
- **Mejor legibilidad**: Documentación más limpia y fácil de escanear
- **Aspecto profesional**: Eliminados emojis innecesarios manteniendo claridad

## [0.3.0] - 2025-11-22

### Agregado
- **Iconos SVG personalizados**: Implementado componente `Icons.jsx` con iconos SVG optimizados
- **Directorio de assets**: Agregado directorio `src/assets/` con iconos SVG
- **Script de procesamiento de iconos**: Nuevo script `process-icons.js` para gestionar iconos

### Mejorado
- **Interfaz visual moderna**: Reemplazados todos los emojis por iconos SVG profesionales
- **Mejor experiencia visual**: Iconos más nítidos y consistentes en todos los tamaños
- **Iconos personalizables**: Sistema de iconos que permite fácil personalización

### Cambiado
- **LoggerDisplay**: Actualizado para usar iconos SVG en lugar de emojis
- **Configuración de Vite**: Agregado soporte para SVGR con `vite-plugin-svgr`
- **Build optimizado**: Configuración mejorada para incluir assets SVG en el bundle

### Dependencias
- Agregado `vite-plugin-svgr` para soporte de SVG como componentes React

## [0.2.0] - 2025-11-22

### Agregado
- **Panel fijable**: Nuevo botón para fijar el panel y evitar que se cierre al hacer click fuera
- **Persistencia completa**: El panel ahora recuerda su estado (abierto/cerrado, fijado, tema) entre recargas
- **Scroll automático**: Desplazamiento suave al último log cuando llega uno nuevo
- **Acordeón de logs**: Solo un log puede estar expandido a la vez para mejor enfoque
- **Captura automática de errores**: Captura automática de:
  - Errores JavaScript no capturados (`window.onerror`)
  - Promesas rechazadas no manejadas (`unhandledrejection`)
  - Errores de tipo (TypeError, ReferenceError, etc.)
- **Función utilitaria**: Movida `formatTime` a `utils/utils.js` para mejor organización

### Mejorado
- **Efecto translúcido**: Agregado `backdrop-filter: blur(10px)` para efecto glassmorphism
- **Contraste de colores**: Mejorados todos los colores de logs para mejor legibilidad:
  - Modo oscuro: Colores más brillantes y vibrantes
  - Modo claro: Colores más oscuros para mejor contraste
- **Fondos modo oscuro**: Fondos más oscuros (88% opacidad) para mejor contraste
- **Botón de copiar**: Ahora con opacidad 1 y fondo transparente hasta hover
- **Estados hover y expandido**: Fondos diferenciados para items expandidos y hover

### Cambiado
- **Click fuera para minimizar**: Ahora respeta el estado de "fijado"
- **Nombre del paquete**: Renombrado de `@dmasis/logger` a `@darelmasis/devlogger`

### Corregido
- Prevención de loops infinitos en captura de errores
- Duplicación de código en `App.jsx`

## [0.1.1] - 2025-11-22

### Agregado
- Efecto translúcido con backdrop blur
- Click fuera para minimizar el panel

### Mejorado
- Estados hover en items de log
- Estilos visuales del panel

## [0.1.0] - 2025-11-22

### Inicial
- Lanzamiento inicial del logger
- Panel visual collapsable
- Tema claro/oscuro
- Objetos JSON interactivos
- Copiar logs al clipboard
- Auto-detección de entorno
- Soporte para objetos circulares
- Colores por nivel de log

---

[0.3.9]: https://github.com/darrelmasis/devlogger/compare/v0.3.8...v0.3.9
[0.3.8]: https://github.com/darrelmasis/devlogger/compare/v0.3.7...v0.3.8
[0.3.6]: https://github.com/darrelmasis/devlogger/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/darrelmasis/devlogger/compare/v0.3.4...v0.3.5
[0.3.2]: https://github.com/darrelmasis/logger/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/darrelmasis/logger/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/darrelmasis/logger/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/darrelmasis/logger/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/darrelmasis/logger/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/darrelmasis/logger/releases/tag/v0.1.0
