import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// In development, explicitly set the dev server URL
if (process.env.IS_DEV === 'true') {
  process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173'
}

console.log('Electron starting - IS_DEV:', process.env.IS_DEV)
console.log('Electron starting - VITE_DEV_SERVER_URL:', process.env.VITE_DEV_SERVER_URL)

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  process.exit(0)
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
      win.show()
    }
  })
}

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '..')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, 'public')

console.log('Electron __dirname:', __dirname)
console.log('Electron DIST path:', process.env.DIST)
console.log('Electron VITE_PUBLIC path:', process.env.VITE_PUBLIC)

let win

function createWindow() {
  if (win) {
    win.focus()
    return
  }

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'SCRIBE-AI',
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('Loading from Vite dev server:', process.env.VITE_DEV_SERVER_URL)
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    const indexPath = path.join(process.env.DIST, 'index.html')
    console.log('Loading from file:', indexPath)
    win.loadFile(indexPath)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else if (win) {
      win.show()
      win.focus()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for file system operations
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('fs:readDir', async (event, dirPath) => {
  try {
    // Validate that dirPath is a string and not an object
    if (!dirPath || typeof dirPath !== 'string' || dirPath.includes('[object Object]')) {
      throw new Error(`Invalid directory path: ${dirPath}`)
    }
    
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    // Return all files (not just .md files) so user can see their files
    return entries
      .filter(entry => entry.isFile())
      .map(entry => entry.name)
  } catch (error) {
    console.error('Error occurred in handler for \'fs:readDir\':', error)
    throw error
  }
})

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    throw error
  }
})

ipcMain.handle('fs:writeFile', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8')
    return true
  } catch (error) {
    throw error
  }
})

ipcMain.handle('fs:deleteFile', async (event, filePath) => {
  try {
    await fs.unlink(filePath)
    return true
  } catch (error) {
    throw error
  }
})

ipcMain.handle('fs:createFile', async (event, filePath, content = '') => {
  try {
    await fs.writeFile(filePath, content, 'utf-8')
    return true
  } catch (error) {
    throw error
  }
})

ipcMain.handle('fs:renameFile', async (event, oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath)
    return true
  } catch (error) {
    throw error
  }
})

ipcMain.handle('fs:exists', async (event, filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}) 