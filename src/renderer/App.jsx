import React, { useState, useEffect, useCallback } from 'react'
import WelcomeScreen from '../components/WelcomeScreen'
import Sidebar from '../components/Sidebar'
import EditorArea from '../components/EditorArea'
import LoadingScreen from '../components/LoadingScreen'
import TitleBar from '../components/TitleBar'
import { useProjectFolder } from './hooks/useProjectFolder'
import { useNotifications } from './hooks/useNotifications'

function App() {
  const [currentView, setCurrentView] = useState('loading') // 'loading', 'welcome', 'main'
  const { 
    projectFolder, 
    files, 
    currentFile, 
    openFile, 
    createFile, 
    saveFile, 
    deleteFile, 
    renameFile,
    setProjectFolder,
    updateFileContent,
    isLoading 
  } = useProjectFolder()
  
  const { showNotification } = useNotifications()

  useEffect(() => {
    // Set initial view to loading while we check for saved folders
    setCurrentView('loading')
  }, [])

  useEffect(() => {
    // Restore saved folder on startup (without clearing localStorage)
    try {
      const savedFolder = localStorage.getItem('scribe-project-folder')
      
      // If savedFolder is not a valid string, clear it
      if (savedFolder && (typeof savedFolder !== 'string' || savedFolder === 'null' || savedFolder === 'undefined')) {
        localStorage.removeItem('scribe-project-folder')
        setCurrentView('welcome')
        return
      }
      
      if (savedFolder && typeof savedFolder === 'string' && savedFolder.length > 0) {
        // Try to restore the saved folder
        if (window.electronAPI) {
          // In Electron, we can actually restore the folder
          setProjectFolder(savedFolder)
        } else {
          // In browser, we can't access file system, but show the saved state exists
          setCurrentView('welcome')
          showNotification('File system access requires Electron app', 'info')
        }
      } else {
        // No saved folder, show welcome
        setCurrentView('welcome')
      }
    } catch (error) {
      // If there's any error with localStorage, clear it and show welcome (but don't clear ALL localStorage)
      localStorage.removeItem('scribe-project-folder')
      setCurrentView('welcome')
    }
  }, [setProjectFolder, showNotification])

  useEffect(() => {
    if (projectFolder && !isLoading) {
      setCurrentView('editor')
    } else if (!projectFolder) {
      setCurrentView('welcome')
    }
  }, [projectFolder, isLoading])

  const handleFolderSelect = useCallback(async (folderPath) => {
    if (!folderPath || typeof folderPath !== 'string') {
      showNotification('Invalid folder path', 'error')
      return
    }
    
    try {
      setProjectFolder(folderPath)
    } catch (error) {
      showNotification('Failed to load folder: ' + error.message, 'error')
    }
  }, [setProjectFolder, showNotification])

  const handleChangeFolder = useCallback(() => {
    localStorage.removeItem('scribe-project-folder')
    setProjectFolder(null)
    setCurrentView('welcome')
  }, [setProjectFolder])

  const handleContentChange = (fileName, content) => {
    updateFileContent(fileName, content)
  }

  const handleSaveFile = async (fileName, content) => {
    try {
      await saveFile(fileName, content)
      showNotification(`💾 Saved "${fileName}"`, 'success')
    } catch (error) {
      showNotification('Failed to save file', 'error')
    }
  }

  if (currentView === 'loading') {
    return <LoadingScreen />
  }

  if (currentView === 'welcome') {
    return <WelcomeScreen onSelectFolder={handleFolderSelect} />
  }

  return (
    <div className="app-container">
      <TitleBar projectFolder={projectFolder} />
      <div className="main-content">
        <Sidebar 
          projectFolder={projectFolder}
          files={files}
          currentFile={currentFile}
          onFileSelect={openFile}
          onCreateFile={createFile}
          onDeleteFile={deleteFile}
          onRenameFile={renameFile}
          onChangeFolder={handleChangeFolder}
          onSaveFile={handleSaveFile}
        />
        <EditorArea 
          files={files}
          currentFile={currentFile}
          onFileSelect={openFile}
          onSaveFile={handleSaveFile}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  )
}

export default App 