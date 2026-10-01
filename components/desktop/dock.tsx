"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo } from "react"
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
  onDockWindowClick: (windowId: string, openFn: () => void) => void
}

interface DockItem {
  id: string
  label: string
  windowId?: string
  onClick: () => void
  icon: React.ReactNode
}

// ─── macOS Dock Magnification Constants ───
const BASE_SIZE = 52         // Default icon size (px)
const MAX_SIZE = 92          // Fully magnified icon size (px)
const MAGNIFICATION_RANGE = 180  // Distance (px) for magnification falloff

/**
 * Cosine-based magnification — the exact curve real macOS uses.
 * Produces a smooth bell-shaped size increase centred at distance=0.
 */
function getMagnifiedSize(distance: number): number {
  if (distance >= MAGNIFICATION_RANGE) return BASE_SIZE
  const ratio = distance / MAGNIFICATION_RANGE
  const factor = (1 + Math.cos(Math.PI * ratio)) / 2
  return BASE_SIZE + (MAX_SIZE - BASE_SIZE) * factor
}

export default function Dock({
  windows, openAboutWindow, openProjectsWindow, openResumeWindow, openContactWindow,
  openGalleryWindow, openCertificationsWindow, openTerminalWindow, openWallpaperSettingsWindow,
  openLinkedInProfile, openGitHubProfile, openLeetCodeProfile, onDockWindowClick,
}: DockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([])

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

  const IconImg = useMemo(() => {
    const Img = ({ src, alt }: { src: string; alt: string }) => (
      <img src={src} alt={alt} className="w-full h-full object-cover" style={{ borderRadius: "22.5%" }} draggable={false} />
    )
    Img.displayName = "IconImg"
    return Img
  }, [])

  const items: (DockItem | "separator")[] = [
    { id: "about", label: "About Me", windowId: "about", onClick: openAboutWindow, icon: <IconImg src="/icons/persona.png" alt="About" /> },
    { id: "projects", label: "Projects", windowId: "projects", onClick: openProjectsWindow, icon: <IconImg src="/icons/code.png" alt="Projects" /> },
    { id: "resume", label: "Resume", windowId: "resume", onClick: openResumeWindow, icon: <IconImg src="/icons/documents.png" alt="Resume" /> },
    { id: "certs", label: "Certifications", windowId: "certifications", onClick: openCertificationsWindow, icon: <IconImg src="/icons/certificate.png" alt="Certifications" /> },
    { id: "contact", label: "Contact", windowId: "contact", onClick: openContactWindow, icon: <IconImg src="/icons/mail.png" alt="Contact" /> },
    { id: "photos", label: "Photos", windowId: "gallery", onClick: openGalleryWindow, icon: <IconImg src="/icons/photos.png" alt="Photos" /> },
    "separator",
    { id: "linkedin", label: "LinkedIn", onClick: openLinkedInProfile, icon: (
      <div className="w-full h-full bg-gradient-to-br from-[#0077b5] to-[#005582] flex items-center justify-center" style={{ borderRadius: "22.5%" }}>
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
    /* 
     * Wrapper — positions the dock at the bottom-center.
     * The outer container is pointer-events-none so only the glass area captures hover.
     */
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      {/*
       * Glass shelf — `items-end` pins every icon to the bottom edge,
       * so magnified icons grow upward (exactly like real macOS).
       * Extra bottom padding leaves room for the running-app indicator dots.
       */}
      <div
        ref={dockRef}
        className="relative flex items-end gap-[4px] pt-[6px] pb-[11px] px-[9px] bg-white/15 dark:bg-white/10 backdrop-blur-2xl rounded-[20px] border border-white/25 dark:border-white/18 dock-glass pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, i) => {
          if (item === "separator") {
            return <div key={`sep-${i}`} className="mx-[4px] h-[52px] w-px bg-white/25 self-center shrink-0" />
          }

          const idx = iconIndex++

          // Calculate magnified size + hover state for this icon
          const iconEl = iconRefs.current[idx]
          const center = iconEl ? iconEl.getBoundingClientRect().left + iconEl.getBoundingClientRect().width / 2 : null
          let size = BASE_SIZE
          if (mouseX !== null && center !== null) {
            size = getMagnifiedSize(Math.abs(mouseX - center))
          }

          const isRunning = item.windowId && windows.some((w) => w.id === item.windowId)
          // Tooltip only on the icon actually under the cursor, like macOS
          const showTooltip = mouseX !== null && center !== null && Math.abs(mouseX - center) < BASE_SIZE / 2

          return (
            <button
              key={item.id}
              ref={(el) => { iconRefs.current[idx] = el }}
              onClick={(e) => {
                animateBounce(e)
                if (item.windowId) {
                  onDockWindowClick(item.windowId, item.onClick)
                } else {
                  item.onClick()
                }
              }}
              className="dock-icon relative flex flex-col items-center"
              title={item.label}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                /*
                 * CSS transition gives us the smooth spring-like feel.
                 * A fast ease-out on width/height is simpler and more
                 * performant than JS spring loops, and visually identical
                 * to macOS at these durations.
                 */
                transition: 'width 0.2s cubic-bezier(0.22, 1, 0.36, 1), height 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              aria-label={item.label}
            >
              {/* Tooltip */}
              <span
                className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1a1a1a]/85 text-white text-[12px] font-medium rounded-md pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-lg z-50"
                style={{
                  bottom: `${size + 8}px`,
                  opacity: showTooltip ? 1 : 0,
                  transform: `translateX(-50%) translateY(${showTooltip ? 0 : 6}px)`,
                  transition: 'opacity 0.12s ease, transform 0.12s ease',
                }}
              >
                {item.label}
              </span>

              {/* Icon */}
              <div
                className="overflow-hidden shadow-sm"
                style={{ width: '100%', height: '100%', borderRadius: "22.5%" }}
              >
                {item.icon}
              </div>

              {/* Running indicator — sits inside the dock, below the icon */}
              {isRunning && (
                <div className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-white/90 shadow-[0_0_2px_rgba(0,0,0,0.4)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
