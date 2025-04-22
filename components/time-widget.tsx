"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"

export default function TimeWidget() {
  const [time, setTime] = useState(new Date())
  const [showDate, setShowDate] = useState(false)

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time as HH:MM AM/PM
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  // Format date as Day, Month DD
  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div
      className="flex items-center text-sm text-gray-700 dark:text-gray-300 select-none"
      onClick={() => setShowDate(!showDate)}
    >
      <div className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-800/50 px-2 py-1 rounded-md transition-colors">
        {showDate ? (
          <>
            <Calendar size={14} className="opacity-70" />
            <span>{formattedDate}</span>
          </>
        ) : (
          <>
            <Clock size={14} className="opacity-70" />
            <span>{formattedTime}</span>
          </>
        )}
      </div>
    </div>
  )
}
