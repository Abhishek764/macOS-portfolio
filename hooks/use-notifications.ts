"use client"

import { useCallback } from "react"

export function useNotifications() {
  /**
   * Displays a macOS-style notification
   */
  const showNotification = useCallback((message: string) => {
    try {
      // Create macOS style notification
      const notification = document.createElement("div")
      notification.className =
        "fixed top-10 right-4 bg-gray-800/80 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-lg z-50 border border-white/10 flex items-center"

      // Add icon
      const iconDiv = document.createElement("div")
      iconDiv.className = "mr-3 bg-blue-500 rounded-full p-2 flex items-center justify-center"
      iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`

      // Add message
      const messageDiv = document.createElement("div")
      messageDiv.textContent = message

      notification.appendChild(iconDiv)
      notification.appendChild(messageDiv)
      document.body.appendChild(notification)

      // Add animation
      notification.style.opacity = "0"
      notification.style.transform = "translateY(-20px)"
      notification.style.transition = "opacity 0.3s ease, transform 0.3s ease"

      setTimeout(() => {
        notification.style.opacity = "1"
        notification.style.transform = "translateY(0)"
      }, 10)

      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = "0"
        notification.style.transform = "translateY(-20px)"

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }, [])

  return { showNotification }
}
