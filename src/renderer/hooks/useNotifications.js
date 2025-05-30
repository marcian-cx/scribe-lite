import { useCallback } from 'react'

export function useNotifications() {
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const notification = document.createElement('div')
    
    const colors = {
      success: '#28a745',
      error: '#dc3545', 
      info: '#0e639c'
    }
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      z-index: 10000;
      transition: all 0.3s ease;
      background: ${colors[type] || colors.info};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      max-width: 350px;
      font-family: 'JetBrains Mono', monospace;
    `
    
    notification.textContent = message
    document.body.appendChild(notification)
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)'
      notification.style.opacity = '1'
    })
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.opacity = '0'
      notification.style.transform = 'translateX(100%)'
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, duration)
  }, [])

  return { showNotification }
} 