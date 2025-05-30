import React from 'react'

function TitleBar({ projectFolder }) {
  const folderName = projectFolder ? projectFolder.split('/').pop() || projectFolder : 'SCRIBE-AI'
  
  return (
    <div className="title-bar">
      <div className="title-bar-drag-region">
        <div className="title-bar-title">
          {folderName} — SCRIBE-AI
        </div>
      </div>
    </div>
  )
}

export default TitleBar 