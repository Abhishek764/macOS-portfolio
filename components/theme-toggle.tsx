"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  // Initialize with system preference, but will be overridden by localStorage if available
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme) {
      // Use saved preference
      setIsDark(savedTheme === "dark")
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      // Fall back to system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(systemPrefersDark)
      document.documentElement.classList.toggle("dark", systemPrefersDark)
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system changes if no user preference is saved
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches)
        document.documentElement.classList.toggle("dark", e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle("dark", newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")

    // Add a subtle animation to the body when theme changes
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
  }

  return (
    <button
      onClick={toggleTheme}
      className={`h-5 w-5 flex items-center justify-center rounded-full transition-colors duration-200 ${
        isDark ? "bg-gray-700 hover:bg-gray-600 text-yellow-300" : "bg-blue-100 hover:bg-blue-200 text-blue-800"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  )
}
