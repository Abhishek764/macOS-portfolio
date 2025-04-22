"use client"

import { useRef, useEffect } from "react"

interface ContextMenuProps {
  openTerminalWindow: () => void
  toggleAllWidgets: () => void
  openWallpaperSettingsWindow: () => void
  resetWallpaper: () => void
  areWidgetsVisible: boolean
  wallpaper: string | null
}

export default function ContextMenu({
  openTerminalWindow,
  toggleAllWidgets,
  openWallpaperSettingsWindow,
  resetWallpaper,
  areWidgetsVisible,
  wallpaper,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (menuRef.current.style.display === "block") {
          menuRef.current.style.display = "none"
        }
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  return (
    <>
      <div
        className="absolute inset-0 z-0"
        onContextMenu={(e) => {
          e.preventDefault()
          if (menuRef.current) {
            menuRef.current.style.display = "block"
            menuRef.current.style.left = `${e.clientX}px`
            menuRef.current.style.top = `${e.clientY}px`
          }
        }}
      ></div>

      <div ref={menuRef} className="hidden absolute z-50" id="desktop-context-menu">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden w-56 animate-scale-in origin-top-left">
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors duration-150"
            onClick={openTerminalWindow}
          >
            <div className="flex items-center gap-2">
              <img src="/icons/terminal.png" alt="Terminal" className="w-4 h-4" />
              <span>Open Terminal</span>
            </div>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors duration-150"
            onClick={toggleAllWidgets}
          >
            {areWidgetsVisible ? "Hide Widgets" : "Show Widgets"}
          </button>

          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors duration-150"
            onClick={openWallpaperSettingsWindow}
          >
            Change Wallpaper
          </button>

          {wallpaper && (
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors duration-150"
              onClick={resetWallpaper}
            >
              Reset Wallpaper
            </button>
          )}
        </div>
      </div>
    </>
  )
}
