"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { X, Minus, Maximize2 } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"

interface WindowProps {
  id: string
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isActive: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  onClose: () => void
  onFocus: () => void
  onDrag: (position: { x: number; y: number }) => void
  onResize: (size: { width: number; height: number }) => void
}

type ResizeDirection =
  | "top" | "right" | "bottom" | "left"
  | "top-left" | "top-right" | "bottom-left" | "bottom-right"
  | null

export default function Window({
  id, title, icon, children, isActive, position, size, onClose, onFocus, onDrag, onResize,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })
  const [prevSize, setPrevSize] = useState({ width: 0, height: 0 })
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 })
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(true)
  const [trafficLightsHovered, setTrafficLightsHovered] = useState(false)

  const windowRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLElement | null>(null)
  const initialMountRef = useRef(true)

  useEffect(() => {
    if (windowRef.current) parentRef.current = windowRef.current.parentElement
  }, [])

  // Load saved size
  useEffect(() => {
    try {
      const savedSize = localStorage.getItem(`window-size-${id}`)
      if (savedSize && !isMaximized && initialMountRef.current) {
        const parsed = JSON.parse(savedSize)
        if (parsed.width !== size.width || parsed.height !== size.height) onResize(parsed)
      }
    } catch (e) { /* ignore */ }
    initialMountRef.current = false
  }, [id])

  // Opening animation
  useEffect(() => {
    setIsOpening(true)
    const timer = setTimeout(() => setIsOpening(false), 350)
    return () => clearTimeout(timer)
  }, [])

  // Save size
  useEffect(() => {
    if (!isMaximized && !isOpening && !initialMountRef.current) {
      try {
        localStorage.setItem(`window-size-${id}`, JSON.stringify({ width: size.width, height: size.height }))
      } catch (e) { /* ignore */ }
    }
  }, [id, size.width, size.height, isMaximized, isOpening])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      const newX = Math.max(0, e.clientX - dragOffset.x)
      const newY = Math.max(0, e.clientY - dragOffset.y)
      const parent = parentRef.current
      if (parent) {
        const rect = parent.getBoundingClientRect()
        onDrag({ x: Math.min(newX, rect.width - 100), y: Math.min(newY, rect.height - 40) })
      } else {
        onDrag({ x: newX, y: newY })
      }
    } else if (isResizing && !isMaximized && resizeDirection) {
      let w = size.width, h = size.height, nx = position.x, ny = position.y
      if (resizeDirection.includes("right")) w = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
      else if (resizeDirection.includes("left")) {
        const dx = e.clientX - resizeStart.x
        w = Math.max(300, resizeStart.width - dx)
        if (w !== size.width) nx = resizeStart.left + dx
      }
      if (resizeDirection.includes("bottom")) h = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y))
      else if (resizeDirection.includes("top")) {
        const dy = e.clientY - resizeStart.y
        h = Math.max(200, resizeStart.height - dy)
        if (h !== size.height) ny = resizeStart.top + dy
      }
      const parent = parentRef.current
      if (parent) {
        const rect = parent.getBoundingClientRect()
        w = Math.min(w, rect.width); h = Math.min(h, rect.height)
      }
      if (nx !== position.x || ny !== position.y) onDrag({ x: Math.max(0, nx), y: Math.max(0, ny) })
      if (w !== size.width || h !== size.height) onResize({ width: w, height: h })
    }
  }, [isDragging, isResizing, isMaximized, resizeDirection, dragOffset, resizeStart, position, size, onDrag, onResize])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false); setIsResizing(false); setResizeDirection(null)
    document.body.style.cursor = ""
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = isDragging ? "grabbing" : getCursorStyle(resizeDirection)
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp, resizeDirection])

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isMaximized) return
    setIsDragging(true)
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
    onFocus(); e.preventDefault()
  }

  const handleResizeMouseDown = (e: React.MouseEvent, dir: ResizeDirection) => {
    e.preventDefault(); e.stopPropagation()
    setIsResizing(true); setResizeDirection(dir)
    setResizeStart({ x: e.clientX, y: e.clientY, width: size.width, height: size.height, left: position.x, top: position.y })
    onFocus()
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      onResize(prevSize); onDrag(prevPosition)
    } else {
      setPrevSize({ ...size }); setPrevPosition({ ...position })
      const parent = parentRef.current
      if (parent) {
        const rect = parent.getBoundingClientRect()
        onResize({ width: rect.width, height: rect.height - 80 }); onDrag({ x: 0, y: 0 })
      }
    }
    setIsMaximized(!isMaximized)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => onClose(), 200)
  }

  const getCursorStyle = (d: ResizeDirection): string => {
    switch (d) {
      case "top": case "bottom": return "ns-resize"
      case "right": case "left": return "ew-resize"
      case "top-left": case "bottom-right": return "nwse-resize"
      case "top-right": case "bottom-left": return "nesw-resize"
      default: return "default"
    }
  }

  const getCursorClass = (d: ResizeDirection): string => {
    switch (d) {
      case "top": case "bottom": return "cursor-ns-resize"
      case "right": case "left": return "cursor-ew-resize"
      case "top-left": case "bottom-right": return "cursor-nwse-resize"
      case "top-right": case "bottom-left": return "cursor-nesw-resize"
      default: return "cursor-default"
    }
  }

  useEffect(() => { if (isActive && windowRef.current) windowRef.current.focus() }, [isActive])

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-xl overflow-hidden flex flex-col ${
        isActive ? "macos-window-shadow z-10" : "macos-window-shadow-inactive z-0"
      } ${isClosing ? "window-closing" : ""} ${isOpening ? "window-opening" : ""}`}
      style={{
        left: `${position.x}px`, top: `${position.y}px`,
        width: `${size.width}px`, height: `${size.height}px`,
      }}
      onClick={onFocus}
      tabIndex={0}
      role="dialog"
      aria-labelledby={`window-title-${id}`}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center px-3 h-[38px] shrink-0 select-none relative ${
          isActive
            ? "bg-[#e8e6e8]/95 dark:bg-[#3a3a3c]/95 border-b border-black/10 dark:border-white/8"
            : "bg-[#f6f6f6]/90 dark:bg-[#2a2a2c]/90 border-b border-black/5 dark:border-white/5"
        } backdrop-blur-xl`}
        style={{ cursor: isDragging ? "grabbing" : "default" }}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        {/* Traffic Lights */}
        <div
          className="flex items-center gap-[7px] mr-3 z-10"
          onMouseEnter={() => setTrafficLightsHovered(true)}
          onMouseLeave={() => setTrafficLightsHovered(false)}
        >
          <button
            className={`w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100 ${
              isActive ? "bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]" : "bg-[#ddd] dark:bg-[#555]"
            } hover:brightness-90`}
            onClick={(e) => { e.stopPropagation(); handleClose() }}
          >
            {trafficLightsHovered && <X size={7} strokeWidth={3} className="text-[#4a0002]" />}
          </button>
          <button
            className={`w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100 ${
              isActive ? "bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]" : "bg-[#ddd] dark:bg-[#555]"
            } hover:brightness-90`}
            onClick={(e) => e.stopPropagation()}
          >
            {trafficLightsHovered && <Minus size={7} strokeWidth={3} className="text-[#995700]" />}
          </button>
          <button
            className={`w-[12px] h-[12px] rounded-full flex items-center justify-center transition-all duration-100 ${
              isActive ? "bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]" : "bg-[#ddd] dark:bg-[#555]"
            } hover:brightness-90`}
            onClick={(e) => { e.stopPropagation(); toggleMaximize() }}
          >
            {trafficLightsHovered && <Maximize2 size={6} strokeWidth={3} className="text-[#006500]" />}
          </button>
        </div>

        {/* Window Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5">
            {icon}
            <span
              id={`window-title-${id}`}
              className={`text-[13px] font-medium truncate ${
                isActive ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] overflow-hidden flex flex-col relative">
        <ErrorBoundary
          fallback={
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-300 m-4">
              <h2 className="text-base font-medium mb-1">Something went wrong</h2>
              <p className="text-sm opacity-80">Please close and reopen this window.</p>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div className={`absolute bottom-0 right-0 w-5 h-5 ${getCursorClass("bottom-right")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")} />
          <div className={`absolute bottom-0 left-0 w-5 h-5 ${getCursorClass("bottom-left")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")} />
          <div className={`absolute top-0 right-0 w-5 h-5 ${getCursorClass("top-right")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "top-right")} />
          <div className={`absolute top-0 left-0 w-5 h-5 ${getCursorClass("top-left")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "top-left")} />
          <div className={`absolute top-5 left-0 w-1 h-[calc(100%-10px)] ${getCursorClass("left")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "left")} />
          <div className={`absolute top-5 right-0 w-1 h-[calc(100%-10px)] ${getCursorClass("right")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "right")} />
          <div className={`absolute top-0 left-5 w-[calc(100%-10px)] h-1 ${getCursorClass("top")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "top")} />
          <div className={`absolute bottom-0 left-5 w-[calc(100%-10px)] h-1 ${getCursorClass("bottom")} z-20`} onMouseDown={(e) => handleResizeMouseDown(e, "bottom")} />
        </>
      )}
    </div>
  )
}
