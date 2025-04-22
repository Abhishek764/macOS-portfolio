"use client"

import type React from "react"
import { useCallback } from "react"
import { Linkedin } from "lucide-react"

interface DockProps {
  windows: Array<{ id: string }>
  openAboutWindow: () => void
  openProjectsWindow: () => void
  openResumeWindow: () => void
  openContactWindow: () => void
  openGalleryWindow: () => void
  openCertificationsWindow: () => void
  openTerminalWindow: () => void
  openWallpaperSettingsWindow: () => void
  openLinkedInProfile: () => void
  openGitHubProfile: () => void
  openLeetCodeProfile: () => void
}

export default function Dock({
  windows,
  openAboutWindow,
  openProjectsWindow,
  openResumeWindow,
  openContactWindow,
  openGalleryWindow,
  openCertificationsWindow,
  openTerminalWindow,
  openWallpaperSettingsWindow,
  openLinkedInProfile,
  openGitHubProfile,
  openLeetCodeProfile,
}: DockProps) {
  /**
   * Animates a dock icon with a bounce effect
   * @param event - Mouse event from clicking the icon
   */
  const animateDockIcon = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    button.classList.add("dock-bounce")

    // Remove the animation class after it completes
    setTimeout(() => {
      if (button) {
        button.classList.remove("dock-bounce")
      }
    }, 500)
  }, [])

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2 p-2 px-4 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl z-10 border border-white/10">
      <button
        onClick={(e) => {
          animateDockIcon(e)
          openAboutWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="About Me"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-blue-500/50">
          <img src="/icons/persona.png" alt="About" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">About</span>
        {windows.some((w) => w.id === "about") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openProjectsWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Projects"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-blue-500/50">
          <img src="/icons/code.png" alt="Projects" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">Projects</span>
        {windows.some((w) => w.id === "projects") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openResumeWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Resume"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-green-500/50">
          <img src="/icons/documents.png" alt="Resume" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">Resume</span>
        {windows.some((w) => w.id === "resume") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openCertificationsWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Certifications"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-purple-500/50">
          <img src="/icons/certificate.png" alt="Certifications" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          Certifications
        </span>
        {windows.some((w) => w.id === "certifications") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openContactWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Contact"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-blue-500/50">
          <img src="/icons/mail.png" alt="Contact" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">Contact</span>
        {windows.some((w) => w.id === "contact") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openGalleryWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Photos"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-cyan-500/50">
          <img src="/icons/photos.png" alt="Photos" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">Photos</span>
        {windows.some((w) => w.id === "gallery") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <div className="mx-2 h-8 w-px bg-white/20"></div>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openLinkedInProfile()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="LinkedIn Profile"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50">
          <Linkedin className="w-7 h-7 text-white" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">LinkedIn</span>
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openGitHubProfile()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="GitHub Profile"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-gray-500/50">
          <img src="/icons/github.png" alt="GitHub" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">GitHub</span>
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openLeetCodeProfile()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="LeetCode Profile"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-yellow-500/50">
          <img src="/icons/leetcode.png" alt="LeetCode" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">LeetCode</span>
      </button>

      <div className="mx-2 h-8 w-px bg-white/20"></div>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openTerminalWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Terminal"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-gray-500/50">
          <img src="/icons/terminal.png" alt="Terminal" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">Terminal</span>
        {windows.some((w) => w.id === "terminal") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>

      <button
        onClick={(e) => {
          animateDockIcon(e)
          openWallpaperSettingsWindow()
        }}
        className="group flex flex-col items-center justify-center transition-all duration-200 hover:scale-125 dock-icon-reflection relative"
        aria-label="Settings"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-gray-500/50">
          <img src="/icons/settings.png" alt="Settings" className="w-full h-full object-cover" />
        </div>
        <span className="text-xs mt-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">Settings</span>
        {windows.some((w) => w.id === "wallpaper-settings") && (
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-1"></div>
        )}
      </button>
    </div>
  )
}
