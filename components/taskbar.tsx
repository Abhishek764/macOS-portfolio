"use client"

import type React from "react"

import { useState } from "react"
import { Menu, Terminal, User, Code, FileText, Mail, Image, Settings } from "lucide-react"

interface TaskbarProps {
  windows: Array<{
    id: string
    title: string
    icon: React.ReactNode
    isActive: boolean
  }>
  onWindowClick: (id: string) => void
  onTerminalOpen: () => void
  onAboutOpen: () => void
  onProjectsOpen: () => void
  onResumeOpen: () => void
  onContactOpen: () => void
  onGalleryOpen: () => void
  onWallpaperSettingsOpen: () => void
}

export default function Taskbar({
  windows,
  onWindowClick,
  onTerminalOpen,
  onAboutOpen,
  onProjectsOpen,
  onResumeOpen,
  onContactOpen,
  onGalleryOpen,
  onWallpaperSettingsOpen,
}: TaskbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="h-10 bg-gray-900 border-t border-gray-800 flex items-center px-2 z-50">
      {/* Start menu button */}
      <div className="relative">
        <button
          className={`p-1.5 rounded-md ${isMenuOpen ? "bg-gray-700" : "hover:bg-gray-800"}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-5 h-5 text-green-400" />
        </button>

        {/* Start menu */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-56 bg-gray-900 border border-gray-700 rounded-md shadow-lg overflow-hidden">
            <div className="p-3 border-b border-gray-800 bg-gray-800">
              <div className="text-sm font-bold text-green-400">Developer Portfolio</div>
              <div className="text-xs text-gray-400">v1.0.0</div>
            </div>

            <div className="p-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onTerminalOpen()
                  setIsMenuOpen(false)
                }}
              >
                <Terminal size={16} className="text-green-400" />
                <span>Terminal</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onAboutOpen()
                  setIsMenuOpen(false)
                }}
              >
                <User size={16} className="text-blue-400" />
                <span>About Me</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onProjectsOpen()
                  setIsMenuOpen(false)
                }}
              >
                <Code size={16} className="text-green-400" />
                <span>Projects</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onResumeOpen()
                  setIsMenuOpen(false)
                }}
              >
                <FileText size={16} className="text-yellow-400" />
                <span>Resume</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onContactOpen()
                  setIsMenuOpen(false)
                }}
              >
                <Mail size={16} className="text-purple-400" />
                <span>Contact</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onGalleryOpen()
                  setIsMenuOpen(false)
                }}
              >
                <Image size={16} className="text-cyan-400" />
                <span>Photo Gallery</span>
              </button>

              <div className="border-t border-gray-700 my-1"></div>

              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-md"
                onClick={() => {
                  onWallpaperSettingsOpen()
                  setIsMenuOpen(false)
                }}
              >
                <Settings size={16} className="text-gray-400" />
                <span>Wallpaper Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Open windows */}
      <div className="flex items-center gap-1 ml-1">
        {windows.map((window) => (
          <button
            key={window.id}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm ${
              window.isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => onWindowClick(window.id)}
          >
            {window.icon}
            <span>{window.title}</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <div className="ml-auto text-xs text-gray-400">
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  )
}
