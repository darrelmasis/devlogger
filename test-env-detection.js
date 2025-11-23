// Test script to verify environment detection works at runtime
import { detectEnv, getIsProd } from './src/utils/env.js'

console.log('=== Environment Detection Test ===')
console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A (Node.js)')
console.log('Detected environment:', detectEnv())
console.log('Is production?:', getIsProd())
console.log('')

// Simulate different hostnames
const testCases = [
  { hostname: 'localhost', expected: 'development' },
  { hostname: '127.0.0.1', expected: 'development' },
  { hostname: '192.168.1.100', expected: 'development' },
  { hostname: 'dev.myapp.com', expected: 'development' },
  { hostname: 'myapp-dev.vercel.app', expected: 'development' },
  { hostname: 'preview-abc123.vercel.app', expected: 'development' },
  { hostname: 'staging.myapp.com', expected: 'development' },
  { hostname: 'myapp.com', expected: 'production' },
  { hostname: 'www.myapp.com', expected: 'production' },
  { hostname: 'myapp.vercel.app', expected: 'production' },
]

console.log('=== Hostname Pattern Tests ===')
testCases.forEach(({ hostname, expected }) => {
  // Simulate the logic from detectEnv
  let result = 'production' // default
  
  if (hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local')) {
    result = 'development'
  } else if (hostname.includes('localhost') || 
      hostname.includes('dev.') || 
      hostname.includes('-dev.') ||
      hostname.includes('.dev-') ||
      hostname.includes('preview') ||
      hostname.includes('staging') ||
      hostname.includes('-test.') ||
      hostname.includes('.test')) {
    result = 'development'
  }
  
  const status = result === expected ? '✓' : '✗'
  console.log(`${status} ${hostname.padEnd(30)} -> ${result} (expected: ${expected})`)
})
