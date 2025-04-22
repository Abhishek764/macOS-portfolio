"use client"

import type React from "react"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"

// Define types
interface WindowData {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
  isActive: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface WidgetData {
  id: string
  visible: boolean
  position: { x: number; y: number }
}

interface DesktopState {
  windows: WindowData[]
  widgets: WidgetData[]
  areWidgetsVisible: boolean
  wallpaper: string | null
  wallpaperTitle: string | null
}

// Define action types
type DesktopAction =
  | { type: "OPEN_WINDOW"; payload: Omit<WindowData, "isActive"> }
  | { type: "CLOSE_WINDOW"; payload: { id: string } }
  | { type: "SET_ACTIVE_WINDOW"; payload: { id: string } }
  | { type: "UPDATE_WINDOW_POSITION"; payload: { id: string; position: { x: number; y: number } } }
  | { type: "UPDATE_WINDOW_SIZE"; payload: { id: string; size: { width: number; height: number } } }
  | { type: "TOGGLE_WIDGET_VISIBILITY"; payload: { id: string } }
  | { type: "TOGGLE_ALL_WIDGETS" }
  | { type: "UPDATE_WIDGET_POSITION"; payload: { id: string; position: { x: number; y: number } } }
  | { type: "SET_WALLPAPER"; payload: { wallpaper: string; title?: string } }
  | { type: "RESET_WALLPAPER" }

// Create contexts
const DesktopStateContext = createContext<DesktopState | undefined>(undefined)
const DesktopDispatchContext = createContext<React.Dispatch<DesktopAction> | undefined>(undefined)

// Initial state
const initialState: DesktopState = {
  windows: [],
  widgets: typeof window !== "undefined" ? [
    { id: "system-status", visible: true, position: { x: window.innerWidth - 300, y: 50 } },
    { id: "notes", visible: true, position: { x: window.innerWidth - 300, y: 300 } },
  ] : [], // Provide a fallback for SSR
  areWidgetsVisible: true,
  wallpaper: null,
  wallpaperTitle: null,
}

// Reducer function
function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const { id, title, icon, content, position, size } = action.payload
      const existingWindowIndex = state.windows.findIndex((w) => w.id === id)

      if (existingWindowIndex >= 0) {
        // If window exists, just make it active
        const newWindows = [...state.windows]
        const [activeWindow] = newWindows.splice(existingWindowIndex, 1)
        activeWindow.isActive = true

        // Make all other windows inactive
        const updatedWindows = newWindows.map((w) => ({ ...w, isActive: false }))

        // Add the active window at the end (top of z-index)
        return {
          ...state,
          windows: [...updatedWindows, activeWindow],
        }
      } else {
        // Otherwise create a new window
        return {
          ...state,
          windows: [
            ...state.windows.map((w) => ({ ...w, isActive: false })),
            { id, title, icon, content, isActive: true, position, size },
          ],
        }
      }
    }

    case "CLOSE_WINDOW": {
      return {
        ...state,
        windows: state.windows.filter((window) => window.id !== action.payload.id),
      }
    }

    case "SET_ACTIVE_WINDOW": {
      const windowIndex = state.windows.findIndex((w) => w.id === action.payload.id)
      if (windowIndex === -1) return state

      const newWindows = [...state.windows]
      const [activeWindow] = newWindows.splice(windowIndex, 1)
      activeWindow.isActive = true

      // Make all other windows inactive
      const updatedWindows = newWindows.map((w) => ({ ...w, isActive: false }))

      return {
        ...state,
        windows: [...updatedWindows, activeWindow],
      }
    }

    case "UPDATE_WINDOW_POSITION": {
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.id === action.payload.id ? { ...window, position: action.payload.position } : window,
        ),
      }
    }

    case "UPDATE_WINDOW_SIZE": {
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.id === action.payload.id ? { ...window, size: action.payload.size } : window,
        ),
      }
    }

    case "TOGGLE_WIDGET_VISIBILITY": {
      return {
        ...state,
        widgets: state.widgets.map((widget) =>
          widget.id === action.payload.id ? { ...widget, visible: !widget.visible } : widget,
        ),
      }
    }

    case "TOGGLE_ALL_WIDGETS": {
      return {
        ...state,
        areWidgetsVisible: !state.areWidgetsVisible,
      }
    }

    case "UPDATE_WIDGET_POSITION": {
      return {
        ...state,
        widgets: state.widgets.map((widget) =>
          widget.id === action.payload.id ? { ...widget, position: action.payload.position } : widget,
        ),
      }
    }

    case "SET_WALLPAPER": {
      return {
        ...state,
        wallpaper: action.payload.wallpaper,
        wallpaperTitle: action.payload.title || "Custom Wallpaper",
      }
    }

    case "RESET_WALLPAPER": {
      const defaultWallpaper = "/wallpapers/default-wallpaper.jpg"
      const defaultWallpaperTitle = "Mountain Landscape"

      return {
        ...state,
        wallpaper: defaultWallpaper,
        wallpaperTitle: defaultWallpaperTitle,
      }
    }

    default:
      return state
  }
}

// Provider component
interface DesktopProviderProps {
  children: ReactNode
}

export function DesktopProvider({ children }: DesktopProviderProps) {
  const [state, dispatch] = useReducer(desktopReducer, initialState)

  return (
    <DesktopStateContext.Provider value={state}>
      <DesktopDispatchContext.Provider value={dispatch}>{children}</DesktopDispatchContext.Provider>
    </DesktopStateContext.Provider>
  )
}

// Custom hooks to use the context
export function useDesktopState() {
  const context = useContext(DesktopStateContext)
  if (context === undefined) {
    throw new Error("useDesktopState must be used within a DesktopProvider")
  }
  return context
}

export function useDesktopDispatch() {
  const context = useContext(DesktopDispatchContext)
  if (context === undefined) {
    throw new Error("useDesktopDispatch must be used within a DesktopProvider")
  }
  return context
}

// Combined hook for convenience
export function useDesktop() {
  return {
    state: useDesktopState(),
    dispatch: useDesktopDispatch(),
  }
}

// Action creators
export function useWindowActions() {
  const dispatch = useDesktopDispatch()

  return {
    openWindow: useCallback(
      (
        id: string,
        title: string,
        icon: React.ReactNode,
        content: React.ReactNode,
        position = { x: 50, y: 50 },
        size = { width: 800, height: 500 },
      ) => {
        dispatch({
          type: "OPEN_WINDOW",
          payload: { id, title, icon, content, position, size },
        })
      },
      [dispatch],
    ),

    closeWindow: useCallback(
      (id: string) => {
        dispatch({ type: "CLOSE_WINDOW", payload: { id } })
      },
      [dispatch],
    ),

    setActiveWindow: useCallback(
      (id: string) => {
        dispatch({ type: "SET_ACTIVE_WINDOW", payload: { id } })
      },
      [dispatch],
    ),

    updateWindowPosition: useCallback(
      (id: string, position: { x: number; y: number }) => {
        dispatch({ type: "UPDATE_WINDOW_POSITION", payload: { id, position } })
      },
      [dispatch],
    ),

    updateWindowSize: useCallback(
      (id: string, size: { width: number; height: number }) => {
        dispatch({ type: "UPDATE_WINDOW_SIZE", payload: { id, size } })
      },
      [dispatch],
    ),
  }
}

export function useWidgetActions() {
  const dispatch = useDesktopDispatch()

  return {
    toggleWidgetVisibility: useCallback(
      (id: string) => {
        dispatch({ type: "TOGGLE_WIDGET_VISIBILITY", payload: { id } })
      },
      [dispatch],
    ),

    toggleAllWidgets: useCallback(() => {
      dispatch({ type: "TOGGLE_ALL_WIDGETS" })
    }, [dispatch]),

    updateWidgetPosition: useCallback(
      (id: string, position: { x: number; y: number }) => {
        dispatch({ type: "UPDATE_WIDGET_POSITION", payload: { id, position } })
      },
      [dispatch],
    ),
  }
}

export function useWallpaperActions() {
  const dispatch = useDesktopDispatch()

  return {
    setWallpaper: useCallback(
      (wallpaper: string, title?: string) => {
        dispatch({ type: "SET_WALLPAPER", payload: { wallpaper, title } })
      },
      [dispatch],
    ),

    resetWallpaper: useCallback(() => {
      dispatch({ type: "RESET_WALLPAPER" })
    }, [dispatch]),
  }
}
