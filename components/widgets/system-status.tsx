"use client"

import { useState, useEffect } from "react"
import { X, Cpu, MemoryStickIcon as Memory, Disc, Activity, MoreHorizontal } from "lucide-react"

export default function SystemStatusWidget({ onClose }: { onClose: () => void }) {
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [diskUsage, setDiskUsage] = useState(0)
  const [networkUsage, setNetworkUsage] = useState(0)

  // Simulate changing system metrics
  useEffect(() => {
    const updateMetrics = () => {
      setCpuUsage(Math.floor(Math.random() * 100))
      setMemoryUsage(Math.floor(Math.random() * 100))
      setDiskUsage(70 + Math.floor(Math.random() * 20)) // Keep disk usage high
      setNetworkUsage(Math.floor(Math.random() * 100))
    }

    // Initial update
    updateMetrics()

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between widget-drag-handle cursor-move">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">System Status</h3>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MoreHorizontal size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
            <X size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Cpu size={14} className="text-blue-500 mr-1.5" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">CPU</span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cpuUsage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cpuUsage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Memory size={14} className="text-green-500 mr-1.5" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Memory</span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{memoryUsage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${memoryUsage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Disc size={14} className="text-purple-500 mr-1.5" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Disk</span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{diskUsage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${diskUsage > 90 ? "bg-red-500" : "bg-purple-500"}`}
              style={{ width: `${diskUsage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <Activity size={14} className="text-yellow-500 mr-1.5" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Network</span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{networkUsage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${networkUsage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <button className="text-blue-500 hover:text-blue-600">Refresh</button>
        </div>
      </div>
    </div>
  )
}
