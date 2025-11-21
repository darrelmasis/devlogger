import React, { createContext, useContext, useState } from 'react'
import { isProd, detectEnv } from '../utils/env'

const LoggerContext = createContext()
export const useLogger = () => useContext(LoggerContext)

export const LoggerProvider = ({ children }) => {
  const [logs, setLogs] = useState([])

  const addLog = (level, message) => {
    if (!isProd || level === 'force') {
      const consoleMethod = level === 'force' || level === 'log' ? 'log' : level
      console[consoleMethod](message)
      setLogs(prev => [...prev, { level, message }])
    }
  }

  const log = (...args) => addLog('log', args.join(' '))
  
  log.info = msg => addLog('log', `[INFO] ${msg}`)
  log.warn = msg => addLog('warn', `[WARN] ${msg}`)
  log.error = msg => addLog('error', `[ERROR] ${msg}`)
  log.force = msg => addLog('force', `[FORCE] ${msg}`)
  log.env = detectEnv()

  return (
    <LoggerContext.Provider value={{ logs, log }}>
      {children}
    </LoggerContext.Provider>
  )
}
