"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/error-boundary"

const Desktop = dynamic(() => import("@/components/desktop"), {
  loading: () => null,
  ssr: false,
})

export default function Home() {
  const [bootPhase, setBootPhase] = useState<"boot" | "fade" | "desktop">("boot")

  useEffect(() => {
    // Boot screen shows for 2s, then fades for 0.6s
    const bootTimer = setTimeout(() => setBootPhase("fade"), 2000)
    const fadeTimer = setTimeout(() => setBootPhase("desktop"), 2600)
    return () => {
      clearTimeout(bootTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  return (
    <ErrorBoundary
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-medium mb-3">Something went wrong</h1>
            <p className="text-sm text-gray-400 mb-6">
              An error occurred while loading the portfolio.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              Restart
            </button>
          </div>
        </div>
      }
    >
      {/* macOS Boot Screen */}
      {bootPhase !== "desktop" && (
        <div
          className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity ${
            bootPhase === "fade" ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: "600ms" }}
        >
          {/* Apple Logo */}
          <svg className="w-20 h-20 text-white/90 fill-current boot-logo" viewBox="0 0 16 16">
            <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
          </svg>

          {/* Progress Bar */}
          <div className="mt-10 w-[200px] h-[4px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/90 rounded-full boot-progress" />
          </div>
        </div>
      )}

      {/* Desktop - always mounted for preloading */}
      <div className={bootPhase === "desktop" ? "animate-fade-in" : "opacity-0 pointer-events-none"}>
        <Desktop />
      </div>
    </ErrorBoundary>
  )
}
