"use client"

import { useState, useEffect } from "react"
import { X, Cpu, MemoryStickIcon as Memory, Disc, Activity, MoreHorizontal } from "lucide-react"

export default function SystemStatusWidget({ onClose }: { onClose: () => void }) {
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(65)
  const [diskUsage, setDiskUsage] = useState(74)
  const [networkUsage, setNetworkUsage] = useState(28)

  useEffect(() => {
    const updateMetrics = () => {
      setCpuUsage((prev) => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 20)))
      setMemoryUsage((prev) => Math.max(30, Math.min(90, prev + (Math.random() - 0.5) * 10)))
      setDiskUsage((prev) => Math.max(60, Math.min(92, prev + (Math.random() - 0.5) * 5)))
      setNetworkUsage((prev) => Math.max(5, Math.min(85, prev + (Math.random() - 0.5) * 25)))
    }
    const interval = setInterval(updateMetrics, 2500)
    return () => clearInterval(interval)
  }, [])

  const MetricBar = ({ icon, label, value, color }: {
    icon: React.ReactNode; label: string; value: number; color: string
  }) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400 tabular-nums">{Math.round(value)}%</span>
      </div>
      <div className="w-full h-[5px] bg-gray-200/60 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full progress-smooth ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="w-72 bg-white/80 dark:bg-[#2a2a2c]/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/50 dark:border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/8 flex items-center justify-between widget-drag-handle cursor-move">
        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">System Status</h3>
        <div className="flex items-center gap-0.5">
          <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors" onClick={onClose}>
            <X size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3.5">
        <MetricBar icon={<Cpu size={13} className="text-blue-500" />} label="CPU" value={cpuUsage} color="bg-blue-500" />
        <MetricBar icon={<Memory size={13} className="text-green-500" />} label="Memory" value={memoryUsage} color="bg-green-500" />
        <MetricBar icon={<Disc size={13} className="text-purple-500" />} label="Disk" value={diskUsage} color={diskUsage > 90 ? "bg-red-500" : "bg-purple-500"} />
        <MetricBar icon={<Activity size={13} className="text-orange-500" />} label="Network" value={networkUsage} color="bg-orange-500" />
      </div>
    </div>
  )
}
