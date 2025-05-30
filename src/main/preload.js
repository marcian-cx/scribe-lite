const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog APIs
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),

  // File system APIs
  readDir: (dirPath) => ipcRenderer.invoke('fs:readDir', dirPath),
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),
  deleteFile: (filePath) => ipcRenderer.invoke('fs:deleteFile', filePath),
  createFile: (filePath, content) => ipcRenderer.invoke('fs:createFile', filePath, content),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('fs:renameFile', oldPath, newPath),
  exists: (filePath) => ipcRenderer.invoke('fs:exists', filePath),

  // Message handling
  onMessage: (callback) => ipcRenderer.on('main-process-message', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}) 