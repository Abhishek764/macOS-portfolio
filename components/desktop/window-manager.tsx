"use client"

import type React from "react"
import Window from "@/components/window"

interface WindowData {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
  isActive: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface WindowManagerProps {
  windows: WindowData[]
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onDrag: (id: string, position: { x: number; y: number }) => void
  onResize: (id: string, size: { width: number; height: number }) => void
}

export default function WindowManager({ windows, onClose, onFocus, onDrag, onResize }: WindowManagerProps) {
  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.icon}
          isActive={window.isActive}
          position={window.position}
          size={window.size}
          onClose={() => onClose(window.id)}
          onFocus={() => onFocus(window.id)}
          onDrag={(position) => onDrag(window.id, position)}
          onResize={(size) => onResize(window.id, size)}
        >
          {window.content}
        </Window>
      ))}
    </>
  )
}
