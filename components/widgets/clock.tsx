"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function ClockWidget({ onClose }: { onClose: () => void }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours() % 12

  const secondAngle = seconds * 6
  const minuteAngle = minutes * 6 + seconds * 0.1
  const hourAngle = hours * 30 + minutes * 0.5

  const digitalTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  const dayLabel = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()

  return (
    <div className="relative w-60 overflow-hidden rounded-[28px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl bg-white/10 dark:bg-white/5 widget-drag-handle cursor-move">
      {/* Glass sheen — diagonal highlight sweeping across the panel */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent" />
      {/* Bottom-edge glow for depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/10 to-transparent" />
      {/* Top inner highlight — the glass edge catching light */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 pt-3.5">
        <h3 className="text-[12px] font-semibold tracking-[0.12em] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          CLOCK
        </h3>
        <button
          className="p-1 rounded-full text-white/50 hover:text-white/90 hover:bg-white/15 transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onClose() }}
          aria-label="Close clock widget"
        >
          <X size={12} />
        </button>
      </div>

      <div className="relative p-4 flex flex-col items-center">
        {/* Glass analog face */}
        <div className="relative w-36 h-36 rounded-full bg-white/10 ring-1 ring-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-8px_16px_rgba(0,0,0,0.12)]">
          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${i * 30}deg) translateY(-64px)` }}
            >
              <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full ${i % 3 === 0 ? "w-[2px] h-[10px] bg-white/90" : "w-[1px] h-[6px] bg-white/45"}`} />
            </div>
          ))}

          {/* Hour hand */}
          <div
            className="absolute left-1/2 top-1/2 w-[4px] h-[42px] bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.45)]"
            style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`, transformOrigin: "50% 100%" }}
          />
          {/* Minute hand */}
          <div
            className="absolute left-1/2 top-1/2 w-[3px] h-[60px] bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.45)]"
            style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`, transformOrigin: "50% 100%" }}
          />
          {/* Second hand */}
          <div
            className="absolute left-1/2 top-1/2 w-[1.5px] h-[64px] bg-orange-400 rounded-full shadow-[0_0_6px_rgba(251,146,60,0.6)]"
            style={{ transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`, transformOrigin: "50% 100%" }}
          />
          {/* Center pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-orange-400 ring-2 ring-white/70" />
        </div>

        <p className="mt-3 text-[10px] font-semibold tracking-[0.18em] text-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {dayLabel}
        </p>
        <p className="text-[22px] font-semibold text-white tabular-nums leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
          {digitalTime}
        </p>
      </div>
    </div>
  )
}
