"use client"

import { useState, useCallback, useEffect } from "react"

export function useWallpaper(showNotification: (message: string) => void) {
  const [wallpaper, setWallpaper] = useState<string | null>(null)
  const [wallpaperTitle, setWallpaperTitle] = useState<string | null>(null)

  // Load wallpaper from localStorage on mount
  useEffect(() => {
    try {
      // Set default wallpaper path
      const defaultWallpaper = "/wallpapers/default-wallpaper.jpg"
      const defaultWallpaperTitle = "Mountain Landscape"

      // Load wallpaper from local storage or use default
      const savedWallpaper = localStorage.getItem("wallpaper") || defaultWallpaper
      const savedWallpaperTitle = localStorage.getItem("wallpaperTitle") || defaultWallpaperTitle

      // Always set wallpaper, either from localStorage or default
      setWallpaper(savedWallpaper)
      setWallpaperTitle(savedWallpaperTitle)

      // Save default wallpaper to localStorage if not already set
      if (!localStorage.getItem("wallpaper")) {
        localStorage.setItem("wallpaper", defaultWallpaper)
        localStorage.setItem("wallpaperTitle", defaultWallpaperTitle)
      }
    } catch (error) {
      console.error("Error loading wallpaper:", error)
    }
  }, [])

  /**
   * Sets the desktop wallpaper and saves it to localStorage
   */
  const handleSetWallpaper = useCallback(
    (imageUrl: string) => {
      try {
        setWallpaper(imageUrl)
        localStorage.setItem("wallpaper", imageUrl)
        showNotification("Wallpaper changed successfully!")
      } catch (error) {
        console.error("Failed to set wallpaper:", error)
        showNotification("Failed to set wallpaper. Please try again.")
      }
    },
    [showNotification],
  )

  /**
   * Resets the wallpaper to default and updates localStorage
   */
  const resetWallpaper = useCallback(() => {
    try {
      // Set default wallpaper instead of null
      const defaultWallpaper = "/wallpapers/default-wallpaper.jpg"
      const defaultWallpaperTitle = "Mountain Landscape"

      setWallpaper(defaultWallpaper)
      setWallpaperTitle(defaultWallpaperTitle)

      // Update localStorage with default wallpaper
      localStorage.setItem("wallpaper", defaultWallpaper)
      localStorage.setItem("wallpaperTitle", defaultWallpaperTitle)

      showNotification("Wallpaper reset to default")
    } catch (error) {
      console.error("Failed to reset wallpaper:", error)
      showNotification("Failed to reset wallpaper. Please try again.")
    }
  }, [showNotification])

  return {
    wallpaper,
    wallpaperTitle,
    handleSetWallpaper,
    resetWallpaper,
  }
}
