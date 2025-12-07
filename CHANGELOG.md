# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.5.0] - 2025-12-07

### Agregado ✨
- **Panel draggable**: Ahora puedes arrastrar el panel desde su header para reposicionarlo
  - Drag & drop fluido con feedback visual en tiempo real
  - Animación diagonal suave al soltar
  - El panel se mueve contigo mientras arrastras
- **Posicionamiento inteligente bidireccional**:
  - Conversión automática de coordenadas según la esquina destino
  - Animación diagonal perfecta en todas las direcciones (arriba ⬆️ y abajo ⬇️)
  - El panel crece hacia arriba en esquinas bottom, hacia abajo en esquinas top
- **Prevención de selección de texto durante drag**:
  - No se selecciona texto del body mientras arrastras
  - Burbuja y header del panel tienen `userSelect: none`
  - Experiencia de drag más limpia y profesional
- **Documentación completa**:
  - Nueva sección en README sobre posicionamiento draggable
  - Características detalladas del sistema de 4 esquinas
  - Ejemplos de uso y comportamiento

### Mejorado 🚀
- **Refactorización completa del código**:
  - Extraídas funciones de posicionamiento a `src/utils/positioning.js`
  - Eliminadas 52 líneas de código duplicado en LoggerDisplay
  - Mejor organización y separación de responsabilidades
  - Código más mantenible y testeable
- **Posicionamiento optimizado**:
  - Panel usa `bottom` para esquinas bottom (crece hacia arriba correctamente)
  - Panel usa `top` para esquinas top (crece hacia abajo correctamente)
  - Límites mejorados para evitar que el panel se salga de la pantalla
  - Drag inteligente que usa las mismas propiedades que la posición actual
- **Animaciones suaves en todas las direcciones**:
  - Transición CSS de 300ms con `ease-out`
  - Se desactiva durante el drag para seguimiento fluido del cursor
  - Se activa al soltar para animación suave a la esquina

### Eliminado 🗑️
- **Botón de restaurar posición**: Eliminado del header del panel
  - Simplifica la interfaz
  - El drag & drop hace innecesaria esta función

### Técnico 🔧
- Creado módulo `src/utils/positioning.js` con utilidades:
  - `getClosestCorner(x, y)` - Detecta esquina más cercana
  - `getBubblePosition(corner)` - Calcula posición de burbuja
  - `getPanelPosition(corner)` - Calcula posición de panel
  - `convertDragPosition(dragPos, corner)` - Convierte coordenadas para animación
- Simplificada lógica de conversión de drag position
- Eliminada dependencia de Floating UI (ya removida en 0.4.7)
- Bundle: 106.29 kB (gzip: 20.94 kB)

## [0.4.7] - 2025-12-06

### Agregado ✨
- **Sistema de 4 esquinas**: La burbuja del logger ahora puede posicionarse en cualquiera de las 4 esquinas de la pantalla
  - Auto-snap a la esquina más cercana al soltar
  - Persistencia de la posición seleccionada en localStorage
  - Botón de reset para volver a la posición por defecto (bottom-right)
- **Drag & Drop visual**: Preview en tiempo real mientras arrastras la burbuja
  - La burbuja sigue al cursor durante el arrastre
  - Animación suave al soltar hacia la esquina más cercana
  - Límites de pantalla para evitar que la burbuja se salga
  - Detección inteligente de drag vs click (umbral de 5px)

### Mejorado 🚀
- **Panel posicionado sobre la burbuja**: El panel ahora se abre en la misma esquina que la burbuja, cubriéndola
  - Mejor uso del espacio en pantalla
  - Comportamiento más intuitivo y predecible
- **Animaciones CSS optimizadas**: Transiciones suaves usando solo `top/left` para compatibilidad
  - Animación de 300ms con curva `ease-out`
  - Sin parpadeos ni saltos visuales
  - Funciona correctamente en todas las esquinas
- **Header del panel simplificado**: 
  - Eliminado color de fondo del header para diseño más limpio
  - Agregado `overflow: hidden` al panel para border-radius automático
  - Solo borde inferior en el header para separación visual

### Corregido 🔧
- **Transiciones CSS**: Corregido problema donde las animaciones solo funcionaban en top-left
  - Todas las posiciones ahora usan `top/left` en lugar de mezclar con `bottom/right`
  - CSS puede animar correctamente entre posiciones
- **Parpadeo al soltar**: Eliminado parpadeo visual al cambiar de esquina
  - Orden correcto de actualización de estados
  - Timing optimizado para transiciones suaves

### Técnico 🔧
- Eliminada dependencia de Floating UI (simplificación del código)
- Posicionamiento manual con cálculos simples y predecibles
- Uso consistente de `top/left` para todas las posiciones
- Estado `dragPosition` para preview durante drag
- Función `getClosestCorner()` para cálculo de esquina más cercana

## [0.4.6] - 2025-12-02

### Agregado ✨
- **Botón de copiar todos los logs**: Nuevo botón en el header que copia todos los logs al portapapeles
  - Se deshabilita automáticamente cuando no hay logs
  - Muestra ícono de confirmación al copiar exitosamente
  - Formato: `[timestamp] [LEVEL] mensaje`

### Mejorado 🚀
- **Reorganización semántica de botones**: Botones agrupados lógicamente con separadores visuales
  - Grupo 1: Acciones sobre contenido (Copiar, Limpiar)
  - Grupo 2: Configuración de vista (Tema, Fijar)
  - Grupo 3: Control de ventana (Minimizar)
  - Separadores visuales entre grupos para mejor UX
- **Tooltips nativos del navegador**: Todos los botones ahora muestran tooltips descriptivos
  - Tooltips dinámicos según el estado del botón
  - Configurados con `pointer-events: none` en iconos para permitir hover correcto
- **Botón de limpiar mejorado**: Ahora se deshabilita cuando no hay logs
  - Mismo comportamiento que el botón de copiar
  - Tooltip dinámico según disponibilidad de logs

### Corregido 🔧
- **Alineación de flecha JSON**: Corregida alineación vertical de la flecha con el contenido colapsado
  - Cambio de `vertical-align: top` a `vertical-align: middle`
  - Mejor consistencia visual en objetos y arrays colapsados
- **Duplicación de nivel en copiar**: Eliminada duplicación del nivel de log al copiar todos los logs
  - Antes: `[14:59:12] [WARN] [WARN] mensaje`
  - Ahora: `[14:59:12] [WARN] mensaje`
- **Overflow del panel**: Cambiado de `hidden` a `visible` para permitir tooltips nativos
  - Los tooltips del navegador ahora se muestran correctamente

### Técnico 🔧
- Agregada clase `.logger-btn-separator` para separadores visuales
- Eliminado contenedor especial `.logger-btn-minimize-container`
- Optimización de eventos de mouse con `pointer-events: none` en iconos

## [0.4.4] - 2025-11-25

### Mejorado 🚀
- **UI de Guía de Inicio Rápido**:
  - Eliminado ancho máximo para ocupar todo el espacio disponible
  - Botón de copiar movido al encabezado para dar más espacio al código
  - Reducido padding y tamaño de fuente del código para mejor legibilidad
  - Diseño más compacto y profesional

## [0.4.3] - 2025-11-25

### Mejorado 🚀
- **Guía de inicio rápido mejorada**: 
  - Bloques de código con mejor formato y espaciado
  - Botón de copiar al portapapeles para cada paso
  - Diseño más limpio y legible
- **Versiones sincronizadas**: Demo actualizada a v0.4.3 para coincidir con el paquete npm

## [0.4.2] - 2025-11-25

### Mejorado 🚀
- **Guía de inicio rápido en demo**: Agregada sección de inicio rápido con 3 pasos
  - Paso 1: Instalación del paquete
  - Paso 2: Configuración en la aplicación
  - Paso 3: Uso en cualquier lugar
  - Estilos profesionales con números graduales y código destacado
- **Versiones actualizadas en demo**: Botón CTA y footer ahora muestran v0.4.1

## [0.4.1] - 2025-11-25

### Mejorado 🚀
- **Demo de GitHub Pages**: Configurada demo pública en https://darrelmasis.github.io/devlogger/
  - Header CTA con versión y botones de instalación/repositorio
  - Botones igualados en altura para mejor apariencia
  - Simulación automática de entorno 'development' en GitHub Pages
- **Documentación mejorada**: README actualizado con enlace a demo en vivo
  - Lista de características simplificada y reorganizada
  - Enlaces corregidos al repositorio correcto
  - Documentación de detección de entorno actualizada

### Corregido 🔧
- **Lógica de auto-detección**: Uso de valor 'auto' en lugar de eliminar localStorage
  - Evita loops infinitos en la simulación de entorno
  - Los usuarios pueden volver a auto-detección sin problemas

### Técnico
- Agregado `vite.config.demo.js` para build de demo separado
- Scripts `build:demo`, `preview:demo` y `deploy` para GitHub Pages
- Directorios `dist-demo/` agregado a `.gitignore`

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
