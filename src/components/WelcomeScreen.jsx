import React from 'react'

function WelcomeScreen({ onSelectFolder }) {
  const handleSelectFolder = async () => {
    console.log('=== DEBUG INFO ===')
    console.log('window.electronAPI exists:', !!window.electronAPI)
    console.log('User agent:', navigator.userAgent)
    console.log('Location:', window.location.href)
    console.log('Available APIs:', window.electronAPI ? Object.keys(window.electronAPI) : 'None')
    
    if (!window.electronAPI) {
      alert('This feature requires the Electron app')
      return
    }

    try {
      const folderPath = await window.electronAPI.openDirectory()
      
      // More robust validation
      if (folderPath && typeof folderPath === 'string' && folderPath.trim().length > 0) {
        const cleanPath = folderPath.trim()
        console.log('Selected folder path:', cleanPath)
        onSelectFolder(cleanPath)
      } else {
        console.log('No folder selected or invalid path:', folderPath)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
      alert('Failed to select folder: ' + error.message)
    }
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1>📝 SCRIBE-AI</h1>
          <p className="welcome-subtitle">A minimal poetry IDE built with React, Electron, and Monaco Editor</p>
        </div>
        
        <div className="welcome-main">
          <div className="welcome-icon">🗂️</div>
          <h2>Connect a Poetry Folder to Get Started</h2>
          <p className="welcome-description">
            Choose a folder on your computer where your poetry files live.<br/>
            SCRIBE will load all your .md files and save directly to this folder.
          </p>
          
          <button onClick={handleSelectFolder} className="btn-connect">
            📁 Choose Poetry Folder
          </button>
          
          <div className="welcome-note">
            <p><strong>Note:</strong> This desktop app has direct file system access. Your files are saved locally and privately on your computer.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen 