"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Maximize2, Minimize2, X } from "lucide-react"
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
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null

/**
 * Window component that emulates macOS window behavior and appearance
 * with enhanced resizing capabilities from all edges and corners
 */
export default function Window({
  id,
  title,
  icon,
  children,
  isActive,
  position,
  size,
  onClose,
  onFocus,
  onDrag,
  onResize,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  })
  const [prevSize, setPrevSize] = useState({ width: 0, height: 0 })
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 })

  // Animation states
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(true)

  // Track if this is the initial mount
  const initialMountRef = useRef(true)

  const windowRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLElement | null>(null)

  // Store parent element dimensions for maximizing
  useEffect(() => {
    if (windowRef.current) {
      parentRef.current = windowRef.current.parentElement
    }
  }, [])

  // Load saved window size from localStorage on mount
  useEffect(() => {
    try {
      const savedSize = localStorage.getItem(`window-size-${id}`)
      if (savedSize && !isMaximized && initialMountRef.current) {
        const parsedSize = JSON.parse(savedSize)
        // Only apply saved size if it's different from current size
        if (parsedSize.width !== size.width || parsedSize.height !== size.height) {
          onResize(parsedSize)
        }
      }
    } catch (e) {
      console.error(`Failed to load saved window size for ${id}:`, e)
    }

    // Mark initial mount as complete
    initialMountRef.current = false
  }, [id, size.width, size.height, isMaximized, onResize])

  // Handle window opening animation
  useEffect(() => {
    setIsOpening(true)
    const timer = setTimeout(() => {
      setIsOpening(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Save window size to localStorage when it changes
  useEffect(() => {
    // Only save to localStorage when not maximized, not during initial render, and not during opening animation
    if (!isMaximized && !isOpening && !initialMountRef.current) {
      try {
        localStorage.setItem(`window-size-${id}`, JSON.stringify({ width: size.width, height: size.height }))
      } catch (e) {
        console.error(`Failed to save window size for ${id}:`, e)
      }
    }
  }, [id, size.width, size.height, isMaximized, isOpening])

  // Memoize mouse move handler to prevent unnecessary re-creations
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = Math.max(0, e.clientX - dragOffset.x)
        const newY = Math.max(0, e.clientY - dragOffset.y)

        // Ensure window stays within parent bounds
        const parentElement = parentRef.current
        if (parentElement) {
          const parentRect = parentElement.getBoundingClientRect()
          const maxX = parentRect.width - size.width
          const maxY = parentRect.height - size.height

          const boundedX = Math.min(Math.max(0, newX), maxX)
          const boundedY = Math.min(Math.max(0, newY), maxY)

          onDrag({ x: boundedX, y: boundedY })
        } else {
          onDrag({ x: newX, y: newY })
        }
      } else if (isResizing && !isMaximized && resizeDirection) {
        let newWidth = size.width
        let newHeight = size.height
        let newX = position.x
        let newY = position.y

        // Handle horizontal resizing
        if (resizeDirection.includes("right")) {
          newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
        } else if (resizeDirection.includes("left")) {
          const deltaX = e.clientX - resizeStart.x
          newWidth = Math.max(300, resizeStart.width - deltaX)
          if (newWidth !== size.width) {
            newX = resizeStart.left + deltaX
          }
        }

        // Handle vertical resizing
        if (resizeDirection.includes("bottom")) {
          newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y))
        } else if (resizeDirection.includes("top")) {
          const deltaY = e.clientY - resizeStart.y
          newHeight = Math.max(200, resizeStart.height - deltaY)
          if (newHeight !== size.height) {
            newY = resizeStart.top + deltaY
          }
        }

        // Ensure window stays within parent bounds
        const parentElement = parentRef.current
        if (parentElement) {
          const parentRect = parentElement.getBoundingClientRect()

          // Limit width and height to parent dimensions
          newWidth = Math.min(newWidth, parentRect.width)
          newHeight = Math.min(newHeight, parentRect.height)

          // Ensure window doesn't go outside parent bounds
          if (newX + newWidth > parentRect.width) {
            newX = parentRect.width - newWidth
          }

          if (newY + newHeight > parentRect.height) {
            newY = parentRect.height - newHeight
          }
        }

        // Update position if needed
        if (newX !== position.x || newY !== position.y) {
          onDrag({ x: Math.max(0, newX), y: Math.max(0, newY) })
        }

        // Update size if changed
        if (newWidth !== size.width || newHeight !== size.height) {
          onResize({ width: newWidth, height: newHeight })
        }
      }
    },
    [
      isDragging,
      isResizing,
      isMaximized,
      resizeDirection,
      dragOffset,
      resizeStart,
      position.x,
      position.y,
      size.width,
      size.height,
      onDrag,
      onResize,
    ],
  )

  // Memoize mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseMove])

  // Handle window dragging and resizing
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Add cursor styles to document during dragging/resizing
      if (isResizing && resizeDirection) {
        document.body.style.cursor = getCursorStyle(resizeDirection)
      } else if (isDragging) {
        document.body.style.cursor = "move"
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)

      // Reset cursor
      document.body.style.cursor = ""
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp, resizeDirection])

  /**
   * Handles mouse down event on the title bar to start dragging
   */
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isMaximized) return // Only left mouse button and not maximized

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    onFocus()

    // Prevent text selection during drag
    e.preventDefault()
  }

  /**
   * Handles mouse down event on a resize handle to start resizing
   */
  const handleResizeMouseDown = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y,
    })
    onFocus()
  }

  /**
   * Toggles window maximization state
   */
  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous size and position
      onResize({ width: prevSize.width, height: prevSize.height })
      onDrag({ x: prevPosition.x, y: prevPosition.y })
    } else {
      // Save current size and position
      setPrevSize({ width: size.width, height: size.height })
      setPrevPosition({ x: position.x, y: position.y })

      // Maximize
      const parentElement = parentRef.current
      if (parentElement) {
        const parentRect = parentElement.getBoundingClientRect()
        onResize({ width: parentRect.width, height: parentRect.height - 40 }) // Subtract dock height
        onDrag({ x: 0, y: 0 })
      }
    }
    setIsMaximized(!isMaximized)
  }

  /**
   * Handles window close with animation
   */
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 150) // Match the animation duration
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose()
    }
  }

  // Cursor styles for different resize directions
  const getCursorStyle = (direction: ResizeDirection): string => {
    switch (direction) {
      case "top":
        return "cursor-ns-resize"
      case "right":
        return "cursor-ew-resize"
      case "bottom":
        return "cursor-ns-resize"
      case "left":
        return "cursor-ew-resize"
      case "top-left":
        return "cursor-nwse-resize"
      case "top-right":
        return "cursor-nesw-resize"
      case "bottom-left":
        return "cursor-nesw-resize"
      case "bottom-right":
        return "cursor-nwse-resize"
      default:
        return "cursor-default"
    }
  }

  // Focus window when it becomes active
  useEffect(() => {
    if (isActive && windowRef.current) {
      windowRef.current.focus()
    }
  }, [isActive])

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-xl overflow-hidden flex flex-col shadow-2xl transition-all ${
        isActive ? "shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 z-10" : "shadow z-0 opacity-95"
      } ${isClosing ? "scale-95 opacity-0" : ""} ${isOpening ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isActive ? "scale(1)" : "scale(0.99)",
        transition: "transform 0.15s ease, opacity 0.15s ease, scale 0.15s ease",
      }}
      onClick={onFocus}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`window-title-${id}`}
    >
      {/* Window title bar - macOS style */}
      <div
        className={`flex items-center px-3 h-10 ${
          isActive
            ? "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            : "bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
        }`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={toggleMaximize}
        role="toolbar"
        aria-label="Window controls"
      >
        {/* Window controls (traffic lights) */}
        <div className="flex items-center gap-1.5 mr-2">
          <button
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            aria-label="Close window"
          >
            <X size={8} className="text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // Minimize functionality would go here
            }}
            aria-label="Minimize window"
          >
            <Minimize2 size={8} className="text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              toggleMaximize()
            }}
            aria-label="Maximize window"
          >
            <Maximize2 size={8} className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Window title - centered */}
        <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          {icon}
          <span id={`window-title-${id}`} className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
            {title}
          </span>
        </div>
      </div>

      {/* Window content */}
      <div className="flex-1 bg-white dark:bg-gray-900 overflow-hidden flex flex-col relative">
        <ErrorBoundary
          fallback={
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 m-4">
              <h2 className="text-lg font-medium mb-2">Something went wrong</h2>
              <p className="text-sm opacity-80">
                An error occurred while loading this content. Please try closing and reopening the window.
              </p>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      </div>

      {/* Resize handles - only show when not maximized */}
      {!isMaximized && (
        <>
          {/* Corner resize handles */}
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 ${getCursorStyle("bottom-right")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
            aria-label="Resize window from bottom-right corner"
          />
          <div
            className={`absolute bottom-0 left-0 w-4 h-4 ${getCursorStyle("bottom-left")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
            aria-label="Resize window from bottom-left corner"
          />
          <div
            className={`absolute top-0 right-0 w-4 h-4 ${getCursorStyle("top-right")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
            aria-label="Resize window from top-right corner"
          />
          <div
            className={`absolute top-0 left-0 w-4 h-4 ${getCursorStyle("top-left")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
            aria-label="Resize window from top-left corner"
          />

          {/* Edge resize handles */}
          <div
            className={`absolute top-4 left-0 w-2 h-[calc(100%-8px)] ${getCursorStyle("left")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "left")}
            aria-label="Resize window width from left"
          />
          <div
            className={`absolute top-4 right-0 w-2 h-[calc(100%-8px)] ${getCursorStyle("right")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "right")}
            aria-label="Resize window width from right"
          />
          <div
            className={`absolute top-0 left-4 w-[calc(100%-8px)] h-2 ${getCursorStyle("top")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "top")}
            aria-label="Resize window height from top"
          />
          <div
            className={`absolute bottom-0 left-4 w-[calc(100%-8px)] h-2 ${getCursorStyle("bottom")} z-20 hover:bg-blue-500/10`}
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
            aria-label="Resize window height from bottom"
          />
        </>
      )}

      {/* Visual feedback during resizing */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-blue-500/50 rounded-xl pointer-events-none z-30"></div>
      )}
    </div>
  )
}
