import React, { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'

function FileItem({ file, isActive, onSelect, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(file.name.replace('.md', ''))
  const [showActions, setShowActions] = useState(false)

  const handleRename = () => {
    if (!editName.trim()) return
    
    try {
      onRename(editName.trim())
      setIsEditing(false)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      onDelete()
    }
  }

  if (isEditing) {
    return (
      <div className="file-item" style={{ background: '#2a2d2e' }}>
        <span className="file-icon">📝</span>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') setIsEditing(false)
          }}
          onBlur={handleRename}
          autoFocus
          style={{
            background: 'transparent',
            border: '1px solid #0e639c',
            color: '#ffffff',
            padding: '2px 4px',
            fontSize: '13px',
            flex: 1
          }}
        />
      </div>
    )
  }

  return (
    <div 
      className={`file-item ${isActive ? 'active' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <span className="file-icon">📝</span>
      <span className="file-name" onClick={onSelect} style={{ cursor: 'pointer', flex: 1 }}>
        {file.modified ? '● ' : ''}{file.name}
      </span>
      
      {showActions && (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#858585',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: '2px'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3c3c3c'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
            title="Rename"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#858585',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: '2px'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3c3c3c'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

export default FileItem