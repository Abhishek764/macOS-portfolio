"use client"

import type React from "react"
import SystemStatusWidget from "@/components/widgets/system-status"
import NotesWidget from "@/components/widgets/notes"

interface WidgetData {
  id: string
  visible: boolean
  position: { x: number; y: number }
}

interface WidgetsContainerProps {
  widgets: WidgetData[]
  areWidgetsVisible: boolean
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void
  toggleWidgetVisibility: (id: string) => void
  desktopRef: React.RefObject<HTMLDivElement>
}

export default function WidgetsContainer({
  widgets,
  areWidgetsVisible,
  updateWidgetPosition,
  toggleWidgetVisibility,
  desktopRef,
}: WidgetsContainerProps) {
  if (!areWidgetsVisible) return null

  return (
    <>
      {widgets.map(
        (widget) =>
          widget.visible && (
            <div
              key={widget.id}
              className="absolute z-10 animate-fade-in"
              style={{
                left: `${widget.position.x}px`,
                top: `${widget.position.y}px`,
                touchAction: "none",
              }}
              onMouseDown={(e) => {
                if (
                  e.target === e.currentTarget ||
                  (e.target as HTMLElement).classList.contains("widget-drag-handle")
                ) {
                  const startX = e.clientX
                  const startY = e.clientY
                  const startLeft = widget.position.x
                  const startTop = widget.position.y

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX
                    const deltaY = moveEvent.clientY - startY

                    // Calculate new position
                    let newX = startLeft + deltaX
                    let newY = startTop + deltaY

                    // Get desktop bounds
                    const desktopRect = desktopRef.current?.getBoundingClientRect()
                    if (desktopRect) {
                      // Keep widget within desktop bounds
                      newX = Math.max(0, Math.min(newX, desktopRect.width - 300))
                      newY = Math.max(0, Math.min(newY, desktopRect.height - 200))
                    }

                    updateWidgetPosition(widget.id, { x: newX, y: newY })
                  }

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove)
                    document.removeEventListener("mouseup", handleMouseUp)
                  }

                  document.addEventListener("mousemove", handleMouseMove)
                  document.addEventListener("mouseup", handleMouseUp)
                }
              }}
            >
              {widget.id === "system-status" && (
                <SystemStatusWidget onClose={() => toggleWidgetVisibility(widget.id)} />
              )}
              {widget.id === "notes" && <NotesWidget onClose={() => toggleWidgetVisibility(widget.id)} />}
            </div>
          ),
      )}
    </>
  )
}
