import React, { createContext, useContext, useState } from 'react'
import { isProd, detectEnv } from '../utils/env'

const LoggerContext = createContext()
export const useLogger = () => useContext(LoggerContext)

export const LoggerProvider = ({ children }) => {
  const [logs, setLogs] = useState([])

  const addLog = (level, message) => {
    if (!isProd || level === 'force') {
      console[level === 'log' ? 'log' : level](message)
      setLogs(prev => [...prev, { level, message }])
    }
  }

  const logger = {
    info: msg => addLog('log', `[INFO] ${msg}`),
    warn: msg => addLog('warn', `[WARN] ${msg}`),
    error: msg => addLog('error', `[ERROR] ${msg}`),
    force: msg => addLog('force', `[FORCE] ${msg}`),
    env: detectEnv()
  }

  return (
    <LoggerContext.Provider value={{ logs, logger }}>
      {children}
    </LoggerContext.Provider>
  )
}
