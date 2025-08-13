"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bug, Terminal, Activity, AlertTriangle, Info, X, Download, Trash2, Play, Pause } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  message: string
  source: string
  data?: any
}

interface NetworkRequest {
  id: string
  url: string
  method: string
  status: number
  duration: number
  timestamp: Date
}

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
}

export const DebugConsole = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([])
  const [command, setCommand] = useState("")
  const [isRecording, setIsRecording] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { name: "Memory Usage", value: 45, unit: "MB", status: "good" },
    { name: "CPU Usage", value: 23, unit: "%", status: "good" },
    { name: "Network Latency", value: 120, unit: "ms", status: "warning" },
    { name: "FPS", value: 58, unit: "fps", status: "good" },
    { name: "Bundle Size", value: 2.3, unit: "MB", status: "good" },
  ])

  // Toggle console with F12 or Ctrl+Shift+I
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault()
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible])

  // Capture console logs
  useEffect(() => {
    if (!isRecording) return

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
    }

    const createLogEntry = (level: LogEntry["level"], args: any[]) => {
      const entry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level,
        message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "),
        source: "console",
        data: args.length === 1 && typeof args[0] === "object" ? args[0] : args,
      }
      setLogs((prev) => [...prev.slice(-99), entry])
    }

    console.log = (...args) => {
      originalConsole.log(...args)
      createLogEntry("info", args)
    }

    console.warn = (...args) => {
      originalConsole.warn(...args)
      createLogEntry("warn", args)
    }

    console.error = (...args) => {
      originalConsole.error(...args)
      createLogEntry("error", args)
    }

    console.info = (...args) => {
      originalConsole.info(...args)
      createLogEntry("info", args)
    }

    return () => {
      console.log = originalConsole.log
      console.warn = originalConsole.warn
      console.error = originalConsole.error
      console.info = originalConsole.info
    }
  }, [isRecording])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  // Simulate network requests
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const request: NetworkRequest = {
          id: Date.now().toString(),
          url: `https://api.example.com/data/${Math.floor(Math.random() * 100)}`,
          method: ["GET", "POST", "PUT"][Math.floor(Math.random() * 3)],
          status: Math.random() > 0.1 ? 200 : 404,
          duration: Math.random() * 1000 + 50,
          timestamp: new Date(),
        }
        setNetworkRequests((prev) => [...prev.slice(-49), request])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 10,
          status: metric.value > 80 ? "critical" : metric.value > 50 ? "warning" : "good",
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const executeCommand = () => {
    if (!command.trim()) return

    try {
      // Basic command execution
      const result = eval(command)
      const entry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: "info",
        message: `> ${command}\n${result}`,
        source: "command",
        data: result,
      }
      setLogs((prev) => [...prev, entry])
    } catch (error) {
      const entry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: "error",
        message: `> ${command}\nError: ${error}`,
        source: "command",
        data: error,
      }
      setLogs((prev) => [...prev, entry])
    }

    setCommand("")
  }

  const clearLogs = () => setLogs([])
  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `debug-logs-${new Date().toISOString()}.json`
    a.click()
  }

  const getLogIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warn":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "debug":
        return <Bug className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: PerformanceMetric["status"]) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-4 bottom-4 top-20 z-50 pointer-events-auto">
      <Card className="h-full bg-gray-900 border-gray-700 text-white overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            <h3 className="font-semibold">ARIA Debug Console</h3>
            <Badge variant={isRecording ? "default" : "secondary"}>{isRecording ? "Recording" : "Paused"}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className="text-white hover:bg-gray-800"
            >
              {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={exportLogs} className="text-white hover:bg-gray-800">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="console" className="flex-1 flex flex-col">
          <TabsList className="bg-gray-800 border-b border-gray-700">
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="flex-1 flex flex-col p-0">
            <div className="flex items-center gap-2 p-2 border-b border-gray-700">
              <Button variant="ghost" size="sm" onClick={clearLogs} className="text-white hover:bg-gray-800">
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
              <Badge variant="outline">{logs.length} entries</Badge>
            </div>

            <ScrollArea className="flex-1 p-2" ref={scrollRef}>
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-sm font-mono">
                    <span className="text-gray-500 text-xs">{log.timestamp.toLocaleTimeString()}</span>
                    {getLogIcon(log.level)}
                    <div className="flex-1">
                      <pre className="whitespace-pre-wrap break-words">{log.message}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-2 border-t border-gray-700">
              <div className="flex gap-2">
                <span className="text-blue-400">&gt;</span>
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && executeCommand()}
                  placeholder="Enter JavaScript command..."
                  className="bg-transparent border-0 text-white placeholder-gray-500 focus:ring-0"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="flex-1 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Network Requests</h4>
                <Badge variant="outline">{networkRequests.length} requests</Badge>
              </div>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {networkRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant={request.status === 200 ? "default" : "destructive"}>{request.method}</Badge>
                        <span className="text-sm font-mono">{request.url}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={request.status === 200 ? "text-green-500" : "text-red-500"}>
                          {request.status}
                        </span>
                        <span className="text-gray-400">{request.duration.toFixed(0)}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="flex-1 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                {performanceMetrics.map((metric) => (
                  <Card key={metric.name} className="bg-gray-800 border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{metric.name}</span>
                      <Activity className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                    </div>
                    <div className="mt-2">
                      <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="flex-1 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Storage Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>LocalStorage</span>
                  <span className="text-gray-400">{Object.keys(localStorage).length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>SessionStorage</span>
                  <span className="text-gray-400">{Object.keys(sessionStorage).length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>IndexedDB</span>
                  <span className="text-gray-400">Available</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache API</span>
                  <span className="text-gray-400">Available</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
