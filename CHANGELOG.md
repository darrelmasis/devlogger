# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.3.0] - 2025-11-22

### ✨ Agregado
- **Iconos SVG personalizados**: Implementado componente `Icons.jsx` con iconos SVG optimizados
- **Directorio de assets**: Agregado directorio `src/assets/` con iconos SVG
- **Script de procesamiento de iconos**: Nuevo script `process-icons.js` para gestionar iconos

### 🎨 Mejorado
- **Interfaz visual moderna**: Reemplazados todos los emojis por iconos SVG profesionales
- **Mejor experiencia visual**: Iconos más nítidos y consistentes en todos los tamaños
- **Iconos personalizables**: Sistema de iconos que permite fácil personalización

### 🔧 Cambiado
- **LoggerDisplay**: Actualizado para usar iconos SVG en lugar de emojis
- **Configuración de Vite**: Agregado soporte para SVGR con `vite-plugin-svgr`
- **Build optimizado**: Configuración mejorada para incluir assets SVG en el bundle

### 📦 Dependencias
- Agregado `vite-plugin-svgr` para soporte de SVG como componentes React

## [0.2.0] - 2025-11-22

### ✨ Agregado
- **Panel fijable**: Nuevo botón 📌 para fijar el panel y evitar que se cierre al hacer click fuera
- **Persistencia completa**: El panel ahora recuerda su estado (abierto/cerrado, fijado, tema) entre recargas
- **Scroll automático**: Desplazamiento suave al último log cuando llega uno nuevo
- **Acordeón de logs**: Solo un log puede estar expandido a la vez para mejor enfoque
- **Captura automática de errores**: Captura automática de:
  - Errores JavaScript no capturados (`window.onerror`)
  - Promesas rechazadas no manejadas (`unhandledrejection`)
  - Errores de tipo (TypeError, ReferenceError, etc.)
- **Función utilitaria**: Movida `formatTime` a `utils/utils.js` para mejor organización

### 🎨 Mejorado
- **Efecto translúcido**: Agregado `backdrop-filter: blur(10px)` para efecto glassmorphism
- **Contraste de colores**: Mejorados todos los colores de logs para mejor legibilidad:
  - Modo oscuro: Colores más brillantes y vibrantes
  - Modo claro: Colores más oscuros para mejor contraste
- **Fondos modo oscuro**: Fondos más oscuros (88% opacidad) para mejor contraste
- **Botón de copiar**: Ahora con opacidad 1 y fondo transparente hasta hover
- **Estados hover y expandido**: Fondos diferenciados para items expandidos y hover

### 🔧 Cambiado
- **Click fuera para minimizar**: Ahora respeta el estado de "fijado"
- **Nombre del paquete**: Renombrado de `@dmasis/logger` a `@darelmasis/devlogger`

### 🐛 Corregido
- Prevención de loops infinitos en captura de errores
- Duplicación de código en `App.jsx`

## [0.1.1] - 2025-11-22

### ✨ Agregado
- Efecto translúcido con backdrop blur
- Click fuera para minimizar el panel

### 🎨 Mejorado
- Estados hover en items de log
- Estilos visuales del panel

## [0.1.0] - 2025-11-22

### ✨ Inicial
- Lanzamiento inicial del logger
- Panel visual collapsable
- Tema claro/oscuro
- Objetos JSON interactivos
- Copiar logs al clipboard
- Auto-detección de entorno
- Soporte para objetos circulares
- Colores por nivel de log

---

[0.3.0]: https://github.com/darrelmasis/logger/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/darrelmasis/logger/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/darrelmasis/logger/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/darrelmasis/logger/releases/tag/v0.1.0
