"use client"

import dynamic from "next/dynamic"
import { ErrorBoundary } from "@/components/error-boundary"

// Dynamically import the Desktop component with loading state
const Desktop = dynamic(() => import("@/components/desktop"), {
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Loading macOS Portfolio...</p>
      </div>
    </div>
  ),
  ssr: false, // Disable server-side rendering for this component
})

export default function Home() {
  return (
    <ErrorBoundary
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white p-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-6">
              We encountered an error while loading the portfolio. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <Desktop />
    </ErrorBoundary>
  )
}
