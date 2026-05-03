"use client"

import { useState, useEffect, useRef } from "react"

interface ContextMenuProps {
  openTerminalWindow: () => void
  toggleAllWidgets: () => void
  openWallpaperSettingsWindow: () => void
  resetWallpaper: () => void
  areWidgetsVisible: boolean
  wallpaper: string | null
}

export default function ContextMenu({
  openTerminalWindow, toggleAllWidgets, openWallpaperSettingsWindow,
  resetWallpaper, areWidgetsVisible, wallpaper,
}: ContextMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsVisible(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVisible(false)
    }
    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleAction = (action: () => void) => {
    setIsVisible(false)
    action()
  }

  const MenuItem = ({ label, shortcut, onClick }: { label: string; shortcut?: string; onClick: () => void }) => (
    <button
      className="w-full text-left px-3 py-[5px] hover:bg-blue-500 hover:text-white text-[13px] transition-colors rounded-[4px] flex items-center justify-between group"
      onClick={() => handleAction(onClick)}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="text-[11px] text-gray-400 group-hover:text-white/70 ml-6">{shortcut}</span>
      )}
    </button>
  )

  const Separator = () => <div className="my-[3px] mx-3 border-t border-black/8 dark:border-white/10" />

  return (
    <>
      <div
        className="absolute inset-0 z-0"
        onContextMenu={(e) => {
          e.preventDefault()
          setPosition({ x: e.clientX, y: e.clientY })
          setIsVisible(true)
        }}
      />

      {isVisible && (
        <div
          ref={menuRef}
          className="fixed z-50 context-menu-enter"
          style={{ left: position.x, top: position.y }}
        >
          <div className="bg-white/85 dark:bg-[#2a2a2c]/90 backdrop-blur-2xl border border-black/15 dark:border-white/15 rounded-lg shadow-xl overflow-hidden w-[220px] py-[4px] px-[4px]">
            <MenuItem label="New Finder Window" shortcut="⌘N" onClick={openTerminalWindow} />
            <Separator />
            <MenuItem label="Open Terminal" shortcut="⌘T" onClick={openTerminalWindow} />
            <MenuItem
              label={areWidgetsVisible ? "Hide Widgets" : "Show Widgets"}
              shortcut="⌘W"
              onClick={toggleAllWidgets}
            />
            <Separator />
            <MenuItem label="Change Wallpaper…" onClick={openWallpaperSettingsWindow} />
            {wallpaper && <MenuItem label="Use Default Wallpaper" onClick={resetWallpaper} />}
            <Separator />
            <MenuItem label="Get Info" shortcut="⌘I" onClick={() => {}} />
          </div>
        </div>
      )}
    </>
  )
}
