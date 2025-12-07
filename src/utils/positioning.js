// Utilidades para posicionamiento del logger

export const getClosestCorner = (x, y) => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  const isLeft = x < windowWidth / 2
  const isTop = y < windowHeight / 2
  
  if (isTop && isLeft) return 'top-left'
  if (isTop && !isLeft) return 'top-right'
  if (!isTop && isLeft) return 'bottom-left'
  return 'bottom-right'
}

export const getBubblePosition = (corner) => {
  const isMobile = window.innerWidth <= 480
  const margin = isMobile ? 8 : 20
  const bubbleSize = isMobile ? 56 : 50
  
  switch (corner) {
    case 'top-left':
      return { top: margin, left: margin }
    case 'top-right':
      return { top: margin, left: window.innerWidth - bubbleSize - margin }
    case 'bottom-left':
      return { top: window.innerHeight - bubbleSize - margin, left: margin }
    case 'bottom-right':
    default:
      return { top: window.innerHeight - bubbleSize - margin, left: window.innerWidth - bubbleSize - margin }
  }
}

export const getPanelPosition = (corner) => {
  const isMobile = window.innerWidth <= 480
  const margin = isMobile ? 8 : 20
  const panelWidth = isMobile ? window.innerWidth - 16 : 400
  
  switch (corner) {
    case 'top-left':
      return { top: margin, left: margin }
    case 'top-right':
      return { top: margin, left: window.innerWidth - panelWidth - margin }
    case 'bottom-left':
      return { bottom: margin, left: margin }
    case 'bottom-right':
    default:
      return { bottom: margin, left: window.innerWidth - panelWidth - margin }
  }
}

export const convertDragPosition = (dragPosition, targetCorner) => {
  if (!dragPosition) return null
  
  const isBottomCorner = targetCorner === 'bottom-left' || targetCorner === 'bottom-right'
  
  if (isBottomCorner && dragPosition.top !== undefined) {
    // Convertir top a bottom para esquinas bottom
    const bottom = window.innerHeight - dragPosition.top
    return { bottom, left: dragPosition.left }
  } else if (!isBottomCorner && dragPosition.bottom !== undefined) {
    // Convertir bottom a top para esquinas top
    const top = window.innerHeight - dragPosition.bottom
    return { top, left: dragPosition.left }
  }
  
  return dragPosition
}
