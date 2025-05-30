import { useState, useCallback } from 'react'

export const useProjectFolder = () => {
  const [projectFolder, setProjectFolderState] = useState(null)
  const [files, setFiles] = useState(new Map())
  const [currentFile, setCurrentFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadFile = useCallback(async (fileName) => {
    if (!projectFolder || !window.electronAPI) return

    try {
      const filePath = `${projectFolder}/${fileName}`
      const content = await window.electronAPI.readFile(filePath)
      
      setFiles(prev => {
        const newMap = new Map(prev)
        const existingFile = newMap.get(fileName)
        if (existingFile) {
          newMap.set(fileName, {
            ...existingFile,
            content,
            modified: false
          })
        }
        return newMap
      })
    } catch (error) {
      // File read error - could show notification
    }
  }, [projectFolder])

  const loadProjectFolder = useCallback(async (folderPath) => {
    // Validate folderPath more strictly
    if (!folderPath || typeof folderPath !== 'string' || folderPath.trim().length === 0 || folderPath.includes('[object Object]') || !window.electronAPI) {
      return
    }

    const cleanPath = folderPath.trim()
    setIsLoading(true)
    
    try {
      const fileNames = await window.electronAPI.readDir(cleanPath)
      const fileMap = new Map()

      // Load all files
      for (const fileName of fileNames) {
        if (fileName && typeof fileName === 'string') {
          const filePath = `${cleanPath}/${fileName}`
          try {
            const content = await window.electronAPI.readFile(filePath)
            fileMap.set(fileName, {
              name: fileName,
              content: content || '',
              modified: false,
              path: filePath
            })
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }

      setFiles(fileMap)

      // If there are files, open the first one
      if (fileMap.size > 0) {
        const firstFile = Array.from(fileMap.keys())[0]
        setCurrentFile(firstFile)
      } else {
        setCurrentFile(null)
      }

    } catch (error) {
      setFiles(new Map())
      setCurrentFile(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setProjectFolder = useCallback((folderPath) => {
    // Validate folderPath more strictly
    if (folderPath && typeof folderPath === 'string' && folderPath.trim().length > 0 && !folderPath.includes('[object Object]')) {
      const cleanPath = folderPath.trim()
      setProjectFolderState(cleanPath)
      localStorage.setItem('scribe-project-folder', cleanPath)
      loadProjectFolder(cleanPath)
    } else {
      // Clear everything if invalid path
      setProjectFolderState(null)
      setFiles(new Map())
      setCurrentFile(null)
      localStorage.removeItem('scribe-project-folder')
    }
  }, [loadProjectFolder])

  const openFile = useCallback(async (fileName) => {
    if (!window.electronAPI) return
    
    if (!files.has(fileName)) {
      await loadFile(fileName)
    }
    setCurrentFile(fileName)
  }, [files, loadFile])

  const createFile = useCallback(async (fileName) => {
    if (!projectFolder || !window.electronAPI) return

    const fullFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`
    const filePath = `${projectFolder}/${fullFileName}`

    try {
      await window.electronAPI.createFile(filePath, '')
      
      const newFile = {
        name: fullFileName,
        content: '',
        modified: false,
        path: filePath
      }
      
      setFiles(prev => new Map(prev).set(fullFileName, newFile))
      setCurrentFile(fullFileName)
    } catch (error) {
      throw new Error(`Failed to create file: ${error.message}`)
    }
  }, [projectFolder])

  const saveFile = useCallback(async (fileName, content) => {
    if (!projectFolder || !window.electronAPI) return

    try {
      const filePath = `${projectFolder}/${fileName}`
      await window.electronAPI.writeFile(filePath, content)
      
      setFiles(prev => {
        const newMap = new Map(prev)
        const file = newMap.get(fileName)
        if (file) {
          newMap.set(fileName, {
            ...file,
            content,
            modified: false
          })
        }
        return newMap
      })
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`)
    }
  }, [projectFolder])

  const deleteFile = useCallback(async (fileName) => {
    if (!projectFolder || !window.electronAPI) return

    try {
      const filePath = `${projectFolder}/${fileName}`
      await window.electronAPI.deleteFile(filePath)
      
      setFiles(prev => {
        const newMap = new Map(prev)
        newMap.delete(fileName)
        return newMap
      })
      
      if (currentFile === fileName) {
        const remainingFiles = Array.from(files.keys()).filter(name => name !== fileName)
        setCurrentFile(remainingFiles.length > 0 ? remainingFiles[0] : null)
      }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }, [projectFolder, currentFile, files])

  const renameFile = useCallback(async (oldName, newName) => {
    if (!projectFolder || !window.electronAPI) return

    const fullNewName = newName.endsWith('.md') ? newName : `${newName}.md`
    
    if (files.has(fullNewName)) {
      throw new Error('File with that name already exists')
    }

    try {
      const oldPath = `${projectFolder}/${oldName}`
      const newPath = `${projectFolder}/${fullNewName}`
      
      await window.electronAPI.renameFile(oldPath, newPath)
      
      setFiles(prev => {
        const newMap = new Map()
        for (const [key, value] of prev) {
          if (key === oldName) {
            newMap.set(fullNewName, {
              ...value,
              name: fullNewName,
              path: newPath
            })
          } else {
            newMap.set(key, value)
          }
        }
        return newMap
      })
      
      if (currentFile === oldName) {
        setCurrentFile(fullNewName)
      }
    } catch (error) {
      throw new Error(`Failed to rename file: ${error.message}`)
    }
  }, [projectFolder, files, currentFile])

  const updateFileContent = useCallback((fileName, content) => {
    setFiles(prev => {
      const newMap = new Map(prev)
      const file = newMap.get(fileName)
      if (file) {
        const isModified = content !== file.content
        newMap.set(fileName, {
          ...file,
          content,
          modified: isModified
        })
      }
      return newMap
    })
  }, [])

  return {
    projectFolder,
    files,
    currentFile,
    isLoading,
    setProjectFolder,
    openFile,
    createFile,
    saveFile,
    deleteFile,
    renameFile,
    updateFileContent
  }
} 