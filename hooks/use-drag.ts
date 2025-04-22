"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"

interface UseDragOptions {
  initialPosition: { x: number; y: number }
  bounds?: { minX: number; maxX: number; minY: number; maxY: number }
  onDragStart?: (position: { x: number; y: number }) => void
  onDragMove?: (position: { x: number; y: number }) => void
  onDragEnd?: (position: { x: number; y: number }) => void
}

interface UseDragResult {
  position: { x: number; y: number }
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  setPosition: (position: { x: number; y: number }) => void
}

/**
 * Custom hook for implementing drag functionality
 */
export function useDrag({
  initialPosition,
  bounds,
  onDragStart,
  onDragMove,
  onDragEnd,
}: UseDragOptions): UseDragResult {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Apply bounds to a position
  const applyBounds = useCallback(
    (pos: { x: number; y: number }) => {
      if (!bounds) return pos

      return {
        x: Math.min(Math.max(bounds.minX, pos.x), bounds.maxX),
        y: Math.min(Math.max(bounds.minY, pos.y), bounds.maxY),
      }
    },
    [bounds],
  )

  // Handle mouse down to start dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return

      e.preventDefault()
      e.stopPropagation()

      // Calculate offset from current position
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }

      setIsDragging(true)

      if (onDragStart) {
        onDragStart(position)
      }

      // Add event listeners for mouse move and up
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newPosition = applyBounds({
          x: moveEvent.clientX - dragOffset.current.x,
          y: moveEvent.clientY - dragOffset.current.y,
        })

        setPosition(newPosition)

        if (onDragMove) {
          onDragMove(newPosition)
        }
      }

      const handleMouseUp = () => {
        setIsDragging(false)

        if (onDragEnd) {
          onDragEnd(position)
        }

        // Remove event listeners
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [position, applyBounds, onDragStart, onDragMove, onDragEnd],
  )

  return {
    position,
    isDragging,
    handleMouseDown,
    setPosition: (newPosition) => setPosition(applyBounds(newPosition)),
  }
}
