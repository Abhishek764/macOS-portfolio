"use client"

import React from "react"

import { useRef } from "react"
import { useDrag } from "@/hooks/use-drag"

interface DraggableWidgetProps {
  id: string
  initialPosition: { x: number; y: number }
  onPositionChange: (id: string, position: { x: number; y: number }) => void
  children: React.ReactNode
  className?: string
  handleClassName?: string
}

export default function DraggableWidget({
  id,
  initialPosition,
  onPositionChange,
  children,
  className = "",
  handleClassName = "widget-drag-handle",
}: DraggableWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Use the custom drag hook
  const { position, isDragging, handleMouseDown } = useDrag({
    initialPosition,
    onDragMove: (newPosition) => {
      onPositionChange(id, newPosition)
    },
  })

  return (
    <div
      ref={containerRef}
      className={`absolute ${isDragging ? "z-50" : "z-10"} ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none",
        transition: isDragging ? "none" : "box-shadow 0.2s ease",
        boxShadow: isDragging ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "",
      }}
    >
      {/* Clone children and add drag handle functionality */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child

        return React.cloneElement(child, {
          ...child.props,
          onMouseDown: (e: React.MouseEvent) => {
            // Only handle drag if clicking on the handle element
            if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains(handleClassName)) {
              handleMouseDown(e)
            }

            // Call the original onMouseDown if it exists
            if (child.props.onMouseDown) {
              child.props.onMouseDown(e)
            }
          },
        })
      })}
    </div>
  )
}
