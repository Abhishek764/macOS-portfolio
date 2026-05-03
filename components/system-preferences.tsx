"use client"

import { useState, useEffect } from "react"
import { Monitor, Palette, Sun, Moon, Image, Info, RefreshCw, Check } from "lucide-react"

interface SystemPreferencesProps {
  wallpaper: string | null
  wallpaperTitle: string | null
  onOpenGallery: () => void
  onResetWallpaper: () => void
}

type Panel = "general" | "appearance" | "desktop" | "about"

export default function SystemPreferences({
  wallpaper,
  wallpaperTitle,
  onOpenGallery,
  onResetWallpaper,
}: SystemPreferencesProps) {
  const [activePanel, setActivePanel] = useState<Panel>("general")
  const [isDark, setIsDark] = useState(false)
  const [accentColor, setAccentColor] = useState("#007AFF")

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleTheme = (mode: "light" | "dark" | "auto") => {
    if (mode === "auto") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", systemPrefersDark)
      setIsDark(systemPrefersDark)
      localStorage.removeItem("theme")
    } else {
      const dark = mode === "dark"
      document.documentElement.classList.toggle("dark", dark)
      setIsDark(dark)
      localStorage.setItem("theme", mode)
    }
  }

  const getCurrentThemeMode = (): string => {
    const saved = localStorage.getItem("theme")
    if (!saved) return "auto"
    return saved
  }

  const [themeMode, setThemeMode] = useState("auto")
  useEffect(() => {
    setThemeMode(getCurrentThemeMode())
  }, [])

  const sidebarItems: { id: Panel; icon: React.ReactNode; label: string }[] = [
    { id: "general", icon: <Monitor size={16} />, label: "General" },
    { id: "appearance", icon: <Palette size={16} />, label: "Appearance" },
    { id: "desktop", icon: <Image size={16} />, label: "Desktop & Screensaver" },
    { id: "about", icon: <Info size={16} />, label: "About This Mac" },
  ]

  const accentColors = [
    { name: "Blue", value: "#007AFF" },
    { name: "Purple", value: "#AF52DE" },
    { name: "Pink", value: "#FF2D55" },
    { name: "Red", value: "#FF3B30" },
    { name: "Orange", value: "#FF9500" },
    { name: "Yellow", value: "#FFCC00" },
    { name: "Green", value: "#34C759" },
    { name: "Graphite", value: "#8E8E93" },
  ]

  return (
    <div className="h-full flex bg-[#f5f5f7] dark:bg-[#1e1e1e] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[200px] bg-[#f0f0f2]/80 dark:bg-[#2a2a2c]/80 backdrop-blur-xl border-r border-black/10 dark:border-white/10 flex flex-col py-2 shrink-0">
        <div className="px-4 py-2 mb-1">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Settings
          </p>
        </div>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(item.id)}
            className={`mx-2 px-3 py-[6px] rounded-md text-[13px] flex items-center gap-2.5 transition-colors ${
              activePanel === item.id
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/8"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* ── General ── */}
        {activePanel === "general" && (
          <div className="animate-fade-in">
            <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white mb-6">General</h2>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-5 mb-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-md">
                  <img src="/photos/abhishek.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-gray-900 dark:text-white">Abhishek Kumar</p>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">Full-Stack Developer</p>
                </div>
              </div>
              <div className="settings-row">
                <span className="text-[13px] text-gray-700 dark:text-gray-300">Email</span>
                <span className="text-[13px] text-gray-500 dark:text-gray-400">abhishek.sphs01@gmail.com</span>
              </div>
              <div className="settings-row">
                <span className="text-[13px] text-gray-700 dark:text-gray-300">Location</span>
                <span className="text-[13px] text-gray-500 dark:text-gray-400">India</span>
              </div>
              <div className="settings-row">
                <span className="text-[13px] text-gray-700 dark:text-gray-300">University</span>
                <span className="text-[13px] text-gray-500 dark:text-gray-400">Lovely Professional University</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-5">
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "GitHub", url: "https://github.com/Abhishek764" },
                  { label: "LinkedIn", url: "https://www.linkedin.com/in/abhishek-kumar-831056237/" },
                  { label: "LeetCode", url: "https://leetcode.com/u/user2044wT/" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-[13px] text-gray-700 dark:text-gray-300">{link.label}</span>
                    <span className="text-[12px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Open ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Appearance ── */}
        {activePanel === "appearance" && (
          <div className="animate-fade-in">
            <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-5 mb-5">
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
              <div className="flex gap-6 mb-4">
                {(["light", "dark", "auto"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setThemeMode(mode)
                      toggleTheme(mode)
                    }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className={`w-[72px] h-[52px] rounded-lg border-2 transition-all flex items-center justify-center ${
                        themeMode === mode
                          ? "border-blue-500 shadow-[0_0_0_2px_rgba(0,122,255,0.3)]"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {mode === "light" && (
                        <div className="w-full h-full rounded-[6px] bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
                          <Sun size={18} className="text-orange-400" />
                        </div>
                      )}
                      {mode === "dark" && (
                        <div className="w-full h-full rounded-[6px] bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
                          <Moon size={18} className="text-blue-300" />
                        </div>
                      )}
                      {mode === "auto" && (
                        <div className="w-full h-full rounded-[6px] overflow-hidden flex">
                          <div className="w-1/2 bg-gradient-to-b from-white to-gray-100" />
                          <div className="w-1/2 bg-gradient-to-b from-gray-800 to-gray-900" />
                        </div>
                      )}
                    </div>
                    <span className={`text-[11px] capitalize ${
                      themeMode === mode ? "text-blue-500 font-medium" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-5">
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-4">Accent Color</h3>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setAccentColor(color.value)
                      document.documentElement.style.setProperty("--accent-color",
                        `${parseInt(color.value.slice(1, 3), 16)}, ${parseInt(color.value.slice(3, 5), 16)}, ${parseInt(color.value.slice(5, 7), 16)}`
                      )
                    }}
                    className="relative group"
                    title={color.name}
                  >
                    <div
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{ backgroundColor: color.value }}
                    />
                    {accentColor === color.value && (
                      <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Desktop & Screensaver ── */}
        {activePanel === "desktop" && (
          <div className="animate-fade-in">
            <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white mb-6">Desktop & Screensaver</h2>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-5 mb-5">
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-4">Current Desktop Picture</h3>
              <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border border-black/10 dark:border-white/10 mb-3 shadow-sm">
                <img
                  src={wallpaper || "/wallpapers/default-wallpaper.jpg"}
                  alt="Current Wallpaper"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4">
                {wallpaperTitle || "Default Wallpaper"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onOpenGallery}
                  className="px-4 py-[7px] bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[13px] font-medium transition-colors btn-press flex items-center gap-2"
                >
                  <Image size={14} />
                  Choose from Photos
                </button>
                <button
                  onClick={onResetWallpaper}
                  className="px-4 py-[7px] bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 rounded-lg text-[13px] font-medium transition-colors btn-press flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── About This Mac ── */}
        {activePanel === "about" && (
          <div className="animate-fade-in">
            <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white mb-6">About This Mac</h2>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-6 text-center mb-5">
              <svg className="w-16 h-16 mx-auto mb-3 fill-current text-gray-800 dark:text-gray-200" viewBox="0 0 16 16">
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
              </svg>
              <h3 className="text-[20px] font-semibold text-gray-900 dark:text-white mb-1">macOS Portfolio</h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">Version 2.0.0</p>
            </div>

            <div className="bg-white dark:bg-[#2a2a2c] rounded-xl border border-black/5 dark:border-white/10 p-5">
              {[
                { label: "Developer", value: "Abhishek Kumar" },
                { label: "OS", value: "macOS Portfolio v2.0" },
                { label: "Kernel", value: "Next.js 15.2.4" },
                { label: "Shell", value: "React 19.0" },
                { label: "DE", value: "Tailwind CSS 3.x" },
                { label: "WM", value: "React Hooks + Context" },
                { label: "CPU", value: "JavaScript V8 @ 60fps" },
                { label: "Resolution", value: "Responsive × Adaptive" },
              ].map((item) => (
                <div key={item.label} className="settings-row">
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
