export const detectEnv = () => {
  if (import.meta.env.VITE_APP_ENV) return import.meta.env.VITE_APP_ENV
  if (import.meta.env.MODE) return import.meta.env.MODE
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') return 'development'
    return 'production'
  }
  return 'development'
}

export const isProd = detectEnv() === 'production'
