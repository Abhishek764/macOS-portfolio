"use client"

import { useState, useEffect, useRef } from "react"
import { Wifi, Battery, Search, Sun, Moon } from "lucide-react"

interface MenuBarProps {
  onToggleWidgets: () => void
  areWidgetsVisible: boolean
}

type ActiveMenu = "apple" | "file" | "edit" | "view" | "widgets" | "help" | "control-center" | null

export default function MenuBar({ onToggleWidgets, areWidgetsVisible }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null)
  const [isDark, setIsDark] = useState(false)
  const menuBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const formattedDate = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  const formattedTime = currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle("dark", newDark)
    localStorage.setItem("theme", newDark ? "dark" : "light")
  }

  const MenuButton = ({ id, label }: { id: ActiveMenu; label: string | React.ReactNode }) => (
    <button
      className={`px-2 py-0.5 rounded-[4px] text-[13px] transition-colors ${
        activeMenu === id
          ? "bg-blue-500/90 text-white"
          : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-900 dark:text-gray-200"
      }`}
      onMouseDown={(e) => {
        e.stopPropagation()
        setActiveMenu(activeMenu === id ? null : id)
      }}
      onMouseEnter={() => {
        if (activeMenu !== null) setActiveMenu(id)
      }}
    >
      {label}
    </button>
  )

  const Dropdown = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute top-[25px] left-0 dropdown-enter z-50">
      <div className="bg-white/85 dark:bg-[#2a2a2c]/90 backdrop-blur-2xl border border-black/15 dark:border-white/15 rounded-lg shadow-xl w-[220px] py-[4px] px-[4px]">
        {children}
      </div>
    </div>
  )

  const MenuItem = ({ label, shortcut, disabled, onClick }: { label: string; shortcut?: string; disabled?: boolean; onClick?: () => void }) => (
    <button
      className={`w-full text-left px-3 py-[5px] text-[13px] rounded-[4px] flex items-center justify-between transition-colors ${
        disabled ? "text-gray-400 dark:text-gray-600 cursor-default" : "hover:bg-blue-500 hover:text-white group"
      }`}
      onClick={() => { if (!disabled && onClick) { onClick(); setActiveMenu(null) } }}
      disabled={disabled}
    >
      <span>{label}</span>
      {shortcut && <span className={`text-[11px] ml-6 ${disabled ? "text-gray-300 dark:text-gray-700" : "text-gray-400 group-hover:text-white/70"}`}>{shortcut}</span>}
    </button>
  )

  const Separator = () => <div className="my-[3px] mx-3 border-t border-black/8 dark:border-white/10" />

  return (
    <div
      ref={menuBarRef}
      className="h-[26px] bg-white/70 dark:bg-black/50 backdrop-blur-2xl border-b border-black/10 dark:border-white/8 flex items-center justify-between px-4 z-50 shrink-0 select-none"
    >
      {/* Left */}
      <div className="flex items-center gap-1">
        {/* Apple Menu */}
        <div className="relative">
          <MenuButton
            id="apple"
            label={
              <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 16 16">
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
              </svg>
            }
          />
          {activeMenu === "apple" && (
            <Dropdown>
              <MenuItem label="About This Mac" shortcut="" onClick={() => {}} />
              <Separator />
              <MenuItem label="System Preferences…" shortcut="⌘," onClick={() => {}} />
              <Separator />
              <MenuItem label="Force Quit…" shortcut="⌘⌥⎋" onClick={() => {}} />
              <Separator />
              <MenuItem label="Restart…" onClick={() => window.location.reload()} />
            </Dropdown>
          )}
        </div>

        <span className="text-[13px] font-semibold text-gray-900 dark:text-white ml-3 mr-2">Portfolio</span>

        <div className="hidden md:flex items-center gap-0.5">
          <div className="relative">
            <MenuButton id="file" label="File" />
            {activeMenu === "file" && (
              <Dropdown>
                <MenuItem label="New Window" shortcut="⌘N" onClick={() => {}} />
                <MenuItem label="Open…" shortcut="⌘O" disabled />
                <Separator />
                <MenuItem label="Close Window" shortcut="⌘W" onClick={() => {}} />
              </Dropdown>
            )}
          </div>

          <div className="relative">
            <MenuButton id="edit" label="Edit" />
            {activeMenu === "edit" && (
              <Dropdown>
                <MenuItem label="Undo" shortcut="⌘Z" disabled />
                <MenuItem label="Redo" shortcut="⌘⇧Z" disabled />
                <Separator />
                <MenuItem label="Cut" shortcut="⌘X" disabled />
                <MenuItem label="Copy" shortcut="⌘C" disabled />
                <MenuItem label="Paste" shortcut="⌘V" disabled />
                <MenuItem label="Select All" shortcut="⌘A" disabled />
              </Dropdown>
            )}
          </div>

          <div className="relative">
            <MenuButton id="view" label="View" />
            {activeMenu === "view" && (
              <Dropdown>
                <MenuItem label={areWidgetsVisible ? "Hide Widgets" : "Show Widgets"} onClick={onToggleWidgets} />
                <Separator />
                <MenuItem label="Enter Full Screen" shortcut="⌃⌘F" disabled />
              </Dropdown>
            )}
          </div>

          <div className="relative">
            <MenuButton id="help" label="Help" />
            {activeMenu === "help" && (
              <Dropdown>
                <MenuItem label="Portfolio Help" disabled />
                <Separator />
                <MenuItem label="View on GitHub" onClick={() => window.open("https://github.com/Abhishek764", "_blank")} />
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2">
          <Battery size={16} className="text-gray-700 dark:text-gray-300" />
          <Wifi size={14} className="text-gray-700 dark:text-gray-300" />
          <Search size={14} className="text-gray-700 dark:text-gray-300" />
        </div>

        {/* Control Center */}
        <div className="relative">
          <button
            className={`p-0.5 rounded transition-colors ${
              activeMenu === "control-center" ? "bg-blue-500/90" : "hover:bg-black/5 dark:hover:bg-white/10"
            }`}
            onClick={() => setActiveMenu(activeMenu === "control-center" ? null : "control-center")}
          >
            <div className="flex items-center gap-0.5">
              <div className="w-[6px] h-[6px] bg-gray-600 dark:bg-gray-300 rounded-full" />
              <div className="w-[6px] h-[6px] bg-gray-600 dark:bg-gray-300 rounded-full" />
            </div>
          </button>
          {activeMenu === "control-center" && (
            <div className="absolute top-[25px] right-0 dropdown-enter z-50">
              <div className="bg-white/85 dark:bg-[#2a2a2c]/90 backdrop-blur-2xl border border-black/15 dark:border-white/15 rounded-xl shadow-xl w-[280px] p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button className="flex items-center gap-2 p-2.5 bg-blue-500 rounded-lg text-white text-[12px] font-medium">
                    <Wifi size={14} /> Wi-Fi
                  </button>
                  <button className="flex items-center gap-2 p-2.5 bg-gray-100 dark:bg-white/10 rounded-lg text-gray-700 dark:text-gray-300 text-[12px] font-medium">
                    <Battery size={14} /> 100%
                  </button>
                </div>

                <div className="border-t border-black/8 dark:border-white/10 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <button
                      onClick={toggleTheme}
                      className={`macos-toggle ${isDark ? "active" : ""}`}
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">Display</span>
                    <div className="flex items-center gap-1">
                      <Sun size={12} className="text-gray-400" />
                      <div className="w-20 h-[4px] bg-gray-200 dark:bg-white/15 rounded-full overflow-hidden">
                        <div className="h-full bg-white dark:bg-white/60 rounded-full" style={{ width: "70%" }} />
                      </div>
                      <Sun size={14} className="text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="text-[13px] text-gray-800 dark:text-gray-200 tabular-nums">
          {formattedDate} {formattedTime}
        </span>
      </div>
    </div>
  )
}
