"use client"

import { useState, useCallback } from "react"
import type React from "react"

interface WindowData {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
  isActive: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export function useWindows() {
  const [windows, setWindows] = useState<WindowData[]>([])

  /**
   * Opens a new window or brings an existing one to the front
   */
  const openWindow = useCallback(
    (
      id: string,
      title: string,
      icon: React.ReactNode,
      content: React.ReactNode,
      position = { x: 50, y: 50 },
      size = { width: 800, height: 500 },
    ) => {
      setWindows((prev) => {
        const existingWindowIndex = prev.findIndex((w) => w.id === id)

        if (existingWindowIndex >= 0) {
          // If window exists, just make it active
          const newWindows = [...prev]
          const [activeWindow] = newWindows.splice(existingWindowIndex, 1)
          activeWindow.isActive = true

          // Make all other windows inactive
          const updatedWindows = newWindows.map((w) => ({ ...w, isActive: false }))

          // Add the active window at the end (top of z-index)
          return [...updatedWindows, activeWindow]
        } else {
          // Otherwise create a new window
          return [
            ...prev.map((w) => ({ ...w, isActive: false })),
            { id, title, icon, content, isActive: true, position, size },
          ]
        }
      })
    },
    [],
  )

  /**
   * Closes a window by its ID
   */
  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== id))
  }, [])

  /**
   * Sets a window as active (brings to front)
   */
  const setActiveWindow = useCallback((id: string) => {
    setWindows((prev) => {
      // Find the window to make active
      const windowIndex = prev.findIndex((w) => w.id === id)
      if (windowIndex === -1) return prev

      // Create a new array with the active window moved to the end (top of z-index)
      const newWindows = [...prev]
      const [activeWindow] = newWindows.splice(windowIndex, 1)
      activeWindow.isActive = true

      // Make all other windows inactive
      const updatedWindows = newWindows.map((w) => ({ ...w, isActive: false }))

      // Add the active window at the end
      return [...updatedWindows, activeWindow]
    })
  }, [])

  /**
   * Updates a window's position
   */
  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, position } : window)))
  }, [])

  /**
   * Updates a window's size
   */
  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id)
      // Only update if the size actually changed
      if (!window || (window.size.width === size.width && window.size.height === size.height)) {
        return prev
      }
      return prev.map((window) => (window.id === id ? { ...window, size } : window))
    })
  }, [])

  return {
    windows,
    openWindow,
    closeWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
  }
}
