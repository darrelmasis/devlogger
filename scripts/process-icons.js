import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('⏳ Procesando iconos...')

// 1. Ejecutar PowerShell para copiar/actualizar base
const powershellScriptPath = path.join(__dirname, '..', 'src', 'assets', 'icons', 'src', 'get-icons-variants-from-regular.ps1')
const powershellScript = `powershell -ExecutionPolicy Bypass -File "${powershellScriptPath}"`

execSync(powershellScript, { stdio: 'inherit' })

// Carpeta origen
const sourceFolders = {
  brands: 'src/assets/icons/src/brands',
  classics: {
    regular: 'src/assets/icons/src/classic/regular',
    solid: 'src/assets/icons/src/classic/solid',
    light: 'src/assets/icons/src/classic/light'
  },
  duotones: {
    regular: 'src/assets/icons/src/duotones/regular',
    solid: 'src/assets/icons/src/duotones/solid'
  },
  flags: 'src/assets/icons/src/flags',
}

// Carpeta destino
const targetBase = 'src/assets/icons/processed'

const maxSize = 24

// ----------------------
// Procesar un SVG
// ----------------------
function processSVG(filePath, targetFile) {
  let svg = fs.readFileSync(filePath, 'utf8')

  svg = svg.replace(/<!--[\s\S]*?-->/g, '')

  const iconName = path.basename(filePath, '.svg')
  svg = svg.replace('<svg', `<svg data-iconname="${iconName}"`)

  const viewBoxMatch = svg.match(
    /viewBox=['"]([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)['"]/
  )

  if (!viewBoxMatch) {
    console.warn(`⚠️ No viewBox encontrado: ${filePath}`)
    return
  }

  const [, , , widthStr, heightStr] = viewBoxMatch
  const width = parseFloat(widthStr)
  const height = parseFloat(heightStr)

  let newWidth, newHeight
  if (width > height) {
    newWidth = maxSize
    newHeight = (height / width) * maxSize
  } else {
    newHeight = maxSize
    newWidth = (width / height) * maxSize
  }

  svg = svg.replace(/width="[\d.]+"/, `width="${newWidth}"`)
  svg = svg.replace(/height="[\d.]+"/, `height="${newHeight}"`)

  fs.mkdirSync(path.dirname(targetFile), { recursive: true })
  fs.writeFileSync(targetFile, svg, 'utf8')
}

// ----------------------
// Procesar folder
// ----------------------
function processFolder(folder, targetFolder) {
  if (!fs.existsSync(folder)) return

  fs.readdirSync(folder).forEach((file) => {
    const srcPath = path.join(folder, file)
    const stats = fs.statSync(srcPath)

    if (stats.isFile() && file.endsWith('.svg')) {
      const targetFile = path.join(targetFolder, file)
      processSVG(srcPath, targetFile)
    } else if (stats.isDirectory()) {
      processFolder(srcPath, path.join(targetFolder, file))
    }
  })
}

// Procesar todo
Object.entries(sourceFolders).forEach(([type, folder]) => {
  const targetFolder = path.join(targetBase, type)

  if (typeof folder === 'string') {
    processFolder(folder, targetFolder)
  } else {
    Object.entries(folder).forEach(([sub, subPath]) => {
      processFolder(subPath, path.join(targetFolder, sub))
    })
  }
})

// ----------------------
// Generar index.jsx
// ----------------------
function generateIndex(folder) {
  const files = fs.readdirSync(folder).filter((f) => f.endsWith('.svg'))

  if (files.length === 0) return

  const imports = files
    .map((f) => {
      const name = pascalCase(f.replace('.svg', ''))
      return `import ${name} from './${f}?react'`
    })
    .join('\n')

  const exports = `export {\n${files
    .map((f) => '  ' + pascalCase(f.replace('.svg', '')))
    .join(',\n')}\n}`

  const content = `${imports}\n\n${exports}\n`

  fs.writeFileSync(path.join(folder, 'index.jsx'), content, 'utf8')
}

function pascalCase(str) {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function generateIndexesRecursive(folder) {
  fs.readdirSync(folder).forEach((file) => {
    const filePath = path.join(folder, file)
    if (fs.statSync(filePath).isDirectory()) {
      generateIndexesRecursive(filePath)
    }
  })
  generateIndex(folder)
}

generateIndexesRecursive(targetBase)

console.log('✅ Iconos procesados y index.jsx generados.')
