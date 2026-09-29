"use client"

import { useState, useCallback, useEffect } from "react"

interface WidgetData {
  id: string
  visible: boolean
  position: { x: number; y: number }
}

export function useWidgets() {
  const [areWidgetsVisible, setAreWidgetsVisible] = useState(true)
  const [widgets, setWidgets] = useState<WidgetData[]>([
    { id: "clock", visible: true, position: { x: 20, y: 30 } },
  ])

  // Load widget settings from localStorage on mount
  useEffect(() => {
    try {
      // Load widget visibility preference
      const savedWidgetsVisible = localStorage.getItem("widgets-visible")
      if (savedWidgetsVisible !== null) {
        setAreWidgetsVisible(savedWidgetsVisible === "true")
      }

      // Load widget positions from local storage (v3: clock-only)
      const savedWidgets = localStorage.getItem("widgets-v3")
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets))
      } else {
        // Initialize the clock in the top-left corner
        const clockWidget = [{ id: "clock", visible: true, position: { x: 20, y: 30 } }]
        setWidgets(clockWidget)
        localStorage.setItem("widgets-v3", JSON.stringify(clockWidget))
      }
    } catch (error) {
      console.error("Error loading widget preferences:", error)
    }
  }, [])

  // Save widget positions when they change
  useEffect(() => {
    try {
      localStorage.setItem("widgets-v3", JSON.stringify(widgets))
    } catch (error) {
      console.error("Error saving widget positions:", error)
    }
  }, [widgets])

  // Save widget visibility preference
  useEffect(() => {
    try {
      localStorage.setItem("widgets-visible", areWidgetsVisible.toString())
    } catch (error) {
      console.error("Error saving widget visibility:", error)
    }
  }, [areWidgetsVisible])

  /**
   * Updates a widget's position
   */
  const updateWidgetPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWidgets((prev) => prev.map((widget) => (widget.id === id ? { ...widget, position } : widget)))
  }, [])

  /**
   * Toggles a widget's visibility
   */
  const toggleWidgetVisibility = useCallback((id: string) => {
    setWidgets((prev) => prev.map((widget) => (widget.id === id ? { ...widget, visible: !widget.visible } : widget)))
  }, [])

  /**
   * Toggles visibility of all widgets
   */
  const toggleAllWidgets = useCallback(() => {
    setAreWidgetsVisible((prev) => !prev)
  }, [])

  return {
    widgets,
    areWidgetsVisible,
    updateWidgetPosition,
    toggleWidgetVisibility,
    toggleAllWidgets,
  }
}
