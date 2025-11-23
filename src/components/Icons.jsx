import { forwardRef } from 'react'

import * as ClassicsRegular from '../assets/icons/processed/classics/regular'
import * as ClassicsSolid from '../assets/icons/processed/classics/solid'
import * as DuotonesRegularIcons from '../assets/icons/processed/duotones/regular'
import * as DuotonesSolidIcons from '../assets/icons/processed/duotones/solid'
import * as ClassicsLight from '../assets/icons/processed/classics/light'

export const Icons = {
  classics: {
    regular: ClassicsRegular,
    solid: ClassicsSolid,
    light: ClassicsLight,
  },
  duotones: {
    regular: DuotonesRegularIcons,
    solid: DuotonesSolidIcons,
  }
}

// Conversión "arrow-left" → "ArrowLeft"
const toPascal = name =>
  name
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('')

/* Tamaños en píxeles (sin Tailwind) */
const sizeMap = {
  xs: { width: '12px', height: '12px' },
  sm: { width: '16px', height: '16px' },
  md: { width: '20px', height: '20px' },
  lg: { width: '24px', height: '24px' },
  xl: { width: '28px', height: '28px' },
  '2xl': { width: '32px', height: '32px' },
}

const Icon = forwardRef(
  (
    {
      name,
      family = 'classics',
      style = 'regular',
      size = 'md',
      color = 'currentColor',
      className = '',
      dataName,
      title = '',
    },
    ref
  ) => {
    const iconName = toPascal(name)

    // Seleccionar icono según familia + estilo
    const IconComponent =
      family === 'brands' || family === 'flags'
        ? Icons[family]?.[iconName]
        : Icons[family]?.[style]?.[iconName]

    // Verificar que el componente sea válido
    const isValidComponent = IconComponent && 
      typeof IconComponent !== 'string' &&
      (typeof IconComponent === 'function' || 
       (typeof IconComponent === 'object' && IconComponent.$$typeof))

    // fallback → span simple
    const fallback = () => <span>?</span>

    const Svg = isValidComponent ? IconComponent : fallback

    // Estilos inline
    const spanStyle = {
      display: 'inline-flex',
      userSelect: 'none',
      fill: color,
      ...sizeMap[size],
    }

    // Verificar antes de renderizar
    if (typeof Svg !== 'function' && !(typeof Svg === 'object' && Svg.$$typeof)) {
      console.warn(`Icon "${name}" (${iconName}) no es un componente válido`)
      return (
        <span ref={ref} style={spanStyle} data-name={dataName || name} className={className}>
          <span>?</span>
        </span>
      )
    }

    return (
      <span ref={ref} style={spanStyle} data-name={dataName || name} title={title} className={className}>
        <Svg style={{ width: '100%', height: '100%' }} />
      </span>
    )
  }
)

export default Icon