"use client"

import type { ReactNode } from "react"
import { DesktopProvider } from "@/contexts/desktop-context"

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return <DesktopProvider>{children}</DesktopProvider>
}
