import React from 'react'

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <div className="loading-text">
        Loading your poetry folder...<br/>
        <small>This will only take a moment</small>
      </div>
    </div>
  )
}

export default LoadingScreen 