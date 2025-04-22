"use client"

import { useEffect, useRef } from "react"
import MenuBar from "@/components/menu-bar"
import Terminal from "@/components/terminal"
import PhotoGallery from "@/components/photo-gallery"
import { User, RefreshCw } from "lucide-react"

// Import modular components
import WindowManager from "@/components/desktop/window-manager"
import Dock from "@/components/desktop/dock"
import WidgetsContainer from "@/components/desktop/widgets-container"
import ContextMenu from "@/components/desktop/context-menu"

// Import context hooks
import { useDesktopState, useWindowActions, useWidgetActions, useWallpaperActions } from "@/contexts/desktop-context"

/**
 * Main Desktop component that serves as the container for the entire application
 * Uses context API for state management
 */
export default function DesktopWithContext() {
  // Use context hooks for state and actions
  const { windows, widgets, areWidgetsVisible, wallpaper, wallpaperTitle } = useDesktopState()
  const { openWindow, closeWindow, setActiveWindow, updateWindowPosition, updateWindowSize } = useWindowActions()
  const { toggleWidgetVisibility, toggleAllWidgets, updateWidgetPosition } = useWidgetActions()
  const { handleSetWallpaper, resetWallpaper } = useWallpaperActions()

  // Reference to the desktop element for positioning
  const desktopRef = useRef<HTMLDivElement>(null)

  // Track if component is mounted
  const isMountedRef = useRef(true)

  // Refs for event handlers
  const openGalleryWindowRef = useRef<() => void>()
  const resetWallpaperRef = useRef<() => void>()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Terminal window opener
  const openTerminalWindow = () => {
    openWindow(
      "terminal",
      "Terminal",
      <img src="/icons/terminal.png" alt="Terminal" className="w-4 h-4" />,
      <Terminal />,
      { x: 100, y: 80 },
    )
  }

  // About window opener
  const openAboutWindow = () => {
    openWindow(
      "about",
      "About Me",
      <User size={16} />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900">
        {/* About content */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">About Abhishek Kumar</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          I'm a passionate Computer Science Engineering student with expertise in full-stack development, cloud
          computing, and DevOps technologies.
        </p>
        {/* More about content */}
      </div>,
    )
  }

  // Projects window opener
  const openProjectsWindow = () => {
    openWindow(
      "projects",
      "Projects",
      <img src="/icons/code.png" alt="Projects" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900">
        {/* Projects content */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">My Projects</h2>
        {/* Project items */}
      </div>,
    )
  }

  // Resume window opener
  const openResumeWindow = () => {
    openWindow(
      "resume",
      "Resume",
      <img src="/icons/documents.png" alt="Resume" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900">
        {/* Resume content */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Abhishek Kumar</h2>
          {/* Download button */}
        </div>
        {/* Resume details */}
      </div>,
      { x: 100, y: 50 },
      { width: 800, height: 600 },
    )
  }

  // Contact window opener
  const openContactWindow = () => {
    openWindow(
      "contact",
      "Contact",
      <img src="/icons/mail.png" alt="Contact" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900">
        {/* Contact content */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Me</h2>
        {/* Contact details */}
      </div>,
    )
  }

  // Gallery window opener
  const openGalleryWindow = () => {
    openWindow(
      "gallery",
      "Photos",
      <img src="/icons/photos.png" alt="Photos" className="w-4 h-4" />,
      <PhotoGallery onSetWallpaper={handleSetWallpaper} />,
      { x: 80, y: 60 },
      { width: 900, height: 600 },
    )
  }

  // Wallpaper settings window opener
  const openWallpaperSettingsWindow = () => {
    openWindow(
      "wallpaper-settings",
      "Wallpaper Settings",
      <img src="/icons/settings.png" alt="Settings" className="w-4 h-4" />,
      <div className="p-6 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Wallpaper Settings</h2>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Current Wallpaper</h3>
          {wallpaper ? (
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Title: {wallpaperTitle || "Custom Wallpaper"}</p>
              <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <img
                  src={wallpaper || "/placeholder.svg"}
                  alt="Current Wallpaper"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Using default gradient wallpaper</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={openGalleryWindow}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <img src="/icons/photos.png" alt="Photos" className="w-4 h-4" />
            Choose from Photos
          </button>

          {wallpaper && (
            <button
              onClick={resetWallpaper}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <RefreshCw size={16} />
              Reset to Default
            </button>
          )}
        </div>
      </div>,
      { x: 120, y: 120 },
      { width: 500, height: 400 },
    )
  }

  // External profile openers
  const openLinkedInProfile = () => {
    window.open("https://linkedin.com", "_blank", "noopener,noreferrer")
  }

  const openGitHubProfile = () => {
    window.open("https://github.com", "_blank", "noopener,noreferrer")
  }

  const openLeetCodeProfile = () => {
    window.open("https://leetcode.com", "_blank", "noopener,noreferrer")
  }

  // Set up event listeners for terminal commands
  useEffect(() => {
    const handleOpenGallery = () => {
      if (openGalleryWindowRef.current) {
        openGalleryWindowRef.current()
      }
    }

    const handleResetWallpaper = () => {
      if (resetWallpaperRef.current) {
        resetWallpaperRef.current()
      }
    }

    document.addEventListener("openGallery", handleOpenGallery)
    document.addEventListener("resetWallpaper", handleResetWallpaper)

    return () => {
      document.removeEventListener("openGallery", handleOpenGallery)
      document.removeEventListener("resetWallpaper", handleResetWallpaper)
    }
  }, [])

  // Update the refs when the functions change
  useEffect(() => {
    openGalleryWindowRef.current = openGalleryWindow
  }, [])

  useEffect(() => {
    resetWallpaperRef.current = resetWallpaper
  }, [resetWallpaper])

  // Open terminal by default on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        openTerminalWindow()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col"
      ref={desktopRef}
    >
      {/* Menu bar */}
      <MenuBar onToggleWidgets={toggleAllWidgets} areWidgetsVisible={areWidgetsVisible} />

      {/* Desktop area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: wallpaper ? `url(${wallpaper})` : "linear-gradient(120deg, #f0f0f0, #2d3748)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out",
        }}
      >
        {/* Overlay for better readability with any wallpaper */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 pointer-events-none"></div>

        {/* Widgets */}
        <WidgetsContainer
          widgets={widgets}
          areWidgetsVisible={areWidgetsVisible}
          updateWidgetPosition={updateWidgetPosition}
          toggleWidgetVisibility={toggleWidgetVisibility}
          desktopRef={desktopRef}
        />

        {/* Desktop context menu */}
        <ContextMenu
          openTerminalWindow={openTerminalWindow}
          toggleAllWidgets={toggleAllWidgets}
          openWallpaperSettingsWindow={openWallpaperSettingsWindow}
          resetWallpaper={resetWallpaper}
          areWidgetsVisible={areWidgetsVisible}
          wallpaper={wallpaper}
        />

        {/* Windows */}
        <WindowManager
          windows={windows}
          onClose={closeWindow}
          onFocus={setActiveWindow}
          onDrag={updateWindowPosition}
          onResize={updateWindowSize}
        />
      </div>

      {/* macOS style dock */}
      <Dock
        windows={windows}
        openAboutWindow={openAboutWindow}
        openProjectsWindow={openProjectsWindow}
        openResumeWindow={openResumeWindow}
        openContactWindow={openContactWindow}
        openGalleryWindow={openGalleryWindow}
        openTerminalWindow={openTerminalWindow}
        openWallpaperSettingsWindow={openWallpaperSettingsWindow}
        openLinkedInProfile={openLinkedInProfile}
        openGitHubProfile={openGitHubProfile}
        openLeetCodeProfile={openLeetCodeProfile}
      />
    </div>
  )
}
