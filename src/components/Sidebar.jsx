import React, { useState } from 'react'
import { Plus, Folder, Save } from 'lucide-react'
import FileItem from './FileItem'

function Sidebar({ 
  projectFolder, 
  files, 
  currentFile, 
  onFileSelect, 
  onCreateFile, 
  onDeleteFile, 
  onRenameFile, 
  onChangeFolder, 
  onSaveFile 
}) {
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return

    try {
      await onCreateFile(newFileName.trim())
      setNewFileName('')
      setIsCreatingFile(false)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSaveCurrentFile = async () => {
    if (!currentFile || !files.has(currentFile)) return

    const file = files.get(currentFile)
    try {
      await onSaveFile(currentFile, file.content)
    } catch (error) {
      alert('Failed to save file: ' + error.message)
    }
  }

  const folderName = projectFolder ? projectFolder.split('/').pop() || projectFolder : 'No Folder'
  const fileArray = Array.from(files.values()).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>{folderName.toUpperCase()}</h3>
        <div className="sidebar-actions">
          <button 
            onClick={() => setIsCreatingFile(true)} 
            className="btn btn-sm"
            title="New File"
          >
            <Plus size={12} />
          </button>
          <button 
            onClick={onChangeFolder} 
            className="btn btn-sm btn-secondary"
            title="Change Folder"
          >
            <Folder size={12} />
          </button>
        </div>
      </div>
      
      <div className="file-tree">
        {isCreatingFile && (
          <div className="file-item" style={{ background: '#2a2d2e' }}>
            <span className="file-icon">📝</span>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile()
                if (e.key === 'Escape') {
                  setIsCreatingFile(false)
                  setNewFileName('')
                }
              }}
              onBlur={handleCreateFile}
              autoFocus
              style={{
                background: 'transparent',
                border: '1px solid #0e639c',
                color: '#ffffff',
                padding: '2px 4px',
                fontSize: '13px',
                flex: 1
              }}
              placeholder="poem-title"
            />
          </div>
        )}
        
        {fileArray.length === 0 ? (
          <div className="empty-folder">
            No .md files found<br/>
            <small>Create a new file to get started</small>
          </div>
        ) : (
          fileArray.map(file => {
            return (
              <FileItem
                key={file.name}
                file={file}
                isActive={currentFile === file.name}
                onSelect={() => onFileSelect(file.name)}
                onDelete={() => onDeleteFile(file.name)}
                onRename={(newName) => onRenameFile(file.name, newName)}
              />
            )
          })
        )}
      </div>
      
      <div className="sidebar-footer">
        <button 
          onClick={handleSaveCurrentFile} 
          className="btn"
          disabled={!currentFile}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={14} />
          Save Current
        </button>
      </div>
    </div>
  )
}

export default Sidebar 