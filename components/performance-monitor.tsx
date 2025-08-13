"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react"

interface PerformanceMetrics {
  memory: number
  cpu: number
  network: number
  fps: number
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: 0,
    cpu: 0,
    network: 0,
    fps: 60,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate performance metrics
      setMetrics({
        memory: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || Math.random() * 100,
        cpu: Math.random() * 100,
        network: Math.random() * 100,
        fps: 60 - Math.random() * 10,
      })
    }

    const interval = setInterval(updateMetrics, 1000)
    return () => clearInterval(interval)
  }, [])

  // Show monitor on Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-96 z-50">
      <Card className="bg-black/80 backdrop-blur-sm border-gray-700 p-4 text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Performance Monitor</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              <span>RAM: {metrics.memory}MB</span>
            </div>
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>CPU: {metrics.cpu.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>Net: {metrics.network.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>FPS: {metrics.fps.toFixed(0)}</span>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            Ctrl+Shift+P to toggle
          </Badge>
        </div>
      </Card>
    </div>
  )
}
