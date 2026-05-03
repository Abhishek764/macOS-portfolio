"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
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

interface DockItem {
  id: string
  label: string
  windowId?: string
  onClick: () => void
  icon: React.ReactNode
}

export default function Dock({
  windows, openAboutWindow, openProjectsWindow, openResumeWindow, openContactWindow,
  openGalleryWindow, openCertificationsWindow, openTerminalWindow, openWallpaperSettingsWindow,
  openLinkedInProfile, openGitHubProfile, openLeetCodeProfile,
}: DockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([])

  const BASE_SIZE = 48
  const MAX_SIZE = 68
  const EFFECT_DISTANCE = 140

  const getScale = useCallback((index: number): number => {
    if (mouseX === null || !dockRef.current) return 1
    const icon = iconRefs.current[index]
    if (!icon) return 1
    const iconRect = icon.getBoundingClientRect()
    const iconCenter = iconRect.left + iconRect.width / 2
    const distance = Math.abs(mouseX - iconCenter)
    if (distance > EFFECT_DISTANCE) return 1
    // Gaussian falloff
    const scale = 1 + ((MAX_SIZE - BASE_SIZE) / BASE_SIZE) * Math.exp(-((distance * distance) / (2 * (EFFECT_DISTANCE / 2.5) ** 2)))
    return Math.min(scale, MAX_SIZE / BASE_SIZE)
  }, [mouseX])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouseX(null)
  }, [])

  const animateBounce = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    btn.classList.add("dock-bounce")
    setTimeout(() => btn?.classList.remove("dock-bounce"), 600)
  }, [])

  const IconImg = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="w-full h-full object-cover rounded-xl" draggable={false} />
  )

  const items: (DockItem | "separator")[] = [
    { id: "about", label: "About Me", windowId: "about", onClick: openAboutWindow, icon: <IconImg src="/icons/persona.png" alt="About" /> },
    { id: "projects", label: "Projects", windowId: "projects", onClick: openProjectsWindow, icon: <IconImg src="/icons/code.png" alt="Projects" /> },
    { id: "resume", label: "Resume", windowId: "resume", onClick: openResumeWindow, icon: <IconImg src="/icons/documents.png" alt="Resume" /> },
    { id: "certs", label: "Certifications", windowId: "certifications", onClick: openCertificationsWindow, icon: <IconImg src="/icons/certificate.png" alt="Certifications" /> },
    { id: "contact", label: "Contact", windowId: "contact", onClick: openContactWindow, icon: <IconImg src="/icons/mail.png" alt="Contact" /> },
    { id: "photos", label: "Photos", windowId: "gallery", onClick: openGalleryWindow, icon: <IconImg src="/icons/photos.png" alt="Photos" /> },
    "separator",
    { id: "linkedin", label: "LinkedIn", onClick: openLinkedInProfile, icon: (
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0077b5] to-[#005582] flex items-center justify-center">
        <Linkedin className="w-7 h-7 text-white" />
      </div>
    )},
    { id: "github", label: "GitHub", onClick: openGitHubProfile, icon: <IconImg src="/icons/github.png" alt="GitHub" /> },
    { id: "leetcode", label: "LeetCode", onClick: openLeetCodeProfile, icon: <IconImg src="/icons/leetcode.png" alt="LeetCode" /> },
    "separator",
    { id: "terminal", label: "Terminal", windowId: "terminal", onClick: openTerminalWindow, icon: <IconImg src="/icons/terminal.png" alt="Terminal" /> },
    { id: "settings", label: "System Preferences", windowId: "wallpaper-settings", onClick: openWallpaperSettingsWindow, icon: <IconImg src="/icons/settings.png" alt="Settings" /> },
  ]

  let iconIndex = 0

  return (
    <div
      ref={dockRef}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-[3px] py-[5px] px-[10px] bg-white/15 dark:bg-white/10 backdrop-blur-2xl rounded-[18px] z-10 border border-white/25 dark:border-white/12 dock-glass"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {items.map((item, i) => {
        if (item === "separator") {
          return <div key={`sep-${i}`} className="mx-[3px] h-10 w-px bg-white/25 self-center shrink-0" />
        }
        const idx = iconIndex++
        const scale = getScale(idx)
        const isRunning = item.windowId && windows.some((w) => w.id === item.windowId)
        return (
          <button
            key={item.id}
            ref={(el) => { iconRefs.current[idx] = el }}
            onClick={(e) => { animateBounce(e); item.onClick() }}
            className="group relative flex flex-col items-center dock-icon origin-bottom"
            style={{ transform: `scale(${scale})`, zIndex: scale > 1.1 ? 10 : 1 }}
            aria-label={item.label}
          >
            {/* Tooltip */}
            <span className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-[3px] bg-[#1a1a1a]/90 text-white text-[11px] rounded-md pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-lg z-50 transition-all duration-100 ${
              scale > 1.15 ? "opacity-100 -top-9" : "opacity-0 -top-7"
            }`}>
              {item.label}
            </span>
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
              {item.icon}
            </div>
            {/* Running dot */}
            {isRunning && (
              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-white/80" />
            )}
          </button>
        )
      })}
    </div>
  )
}
