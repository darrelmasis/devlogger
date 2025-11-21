import React from 'react'
import { useLogger } from '../context/LoggerContext'

export const LoggerDisplay = () => {
  const { logs } = useLogger()

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      width: 350,
      maxHeight: '40vh',
      overflowY: 'auto',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: 12,
      padding: 10,
      borderRadius: 5,
      zIndex: 99999
    }}>
      {logs.map((log, idx) => (
        <div key={idx} style={{
          color: log.level === 'log' ? 'lightgreen' :
                 log.level === 'warn' ? 'orange' :
                 log.level === 'error' ? 'red' : 'white',
          marginBottom: 4
        }}>
          {log.message}
        </div>
      ))}
    </div>
  )
}
