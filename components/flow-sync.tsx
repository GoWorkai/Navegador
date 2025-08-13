"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Smartphone,
  Monitor,
  Tablet,
  Send,
  QrCode,
  Link,
  FileText,
  ImageIcon,
  Download,
  Upload,
  Shield,
  X,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react"

interface Device {
  id: string
  name: string
  type: "mobile" | "desktop" | "tablet"
  status: "online" | "offline" | "syncing"
  lastSeen: Date
  platform: string
}

interface FlowItem {
  id: string
  type: "text" | "url" | "file" | "image"
  content: string
  fileName?: string
  fileSize?: number
  timestamp: Date
  fromDevice: string
  toDevice?: string
  encrypted: boolean
  synced: boolean
}

interface FlowSyncProps {
  onClose?: () => void
}

export function FlowSync({ onClose }: FlowSyncProps) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "device-1",
      name: "iPhone de Juan",
      type: "mobile",
      status: "online",
      lastSeen: new Date(),
      platform: "iOS 17.2",
    },
    {
      id: "device-2",
      name: "PC Escritorio",
      type: "desktop",
      status: "online",
      lastSeen: new Date(),
      platform: "Windows 11",
    },
    {
      id: "device-3",
      name: "iPad Pro",
      type: "tablet",
      status: "offline",
      lastSeen: new Date(Date.now() - 3600000),
      platform: "iPadOS 17.1",
    },
  ])

  const [flowItems, setFlowItems] = useState<FlowItem[]>([
    {
      id: "flow-1",
      type: "url",
      content: "https://github.com/vercel/next.js",
      timestamp: new Date(Date.now() - 300000),
      fromDevice: "iPhone de Juan",
      encrypted: true,
      synced: true,
    },
    {
      id: "flow-2",
      type: "text",
      content: "Recordar comprar leche y pan para mañana",
      timestamp: new Date(Date.now() - 600000),
      fromDevice: "PC Escritorio",
      encrypted: true,
      synced: true,
    },
  ])

  const [sendContent, setSendContent] = useState("")
  const [sendType, setSendType] = useState<"text" | "url" | "file">("text")
  const [selectedDevice, setSelectedDevice] = useState<string>("")
  const [qrCode, setQrCode] = useState("")
  const [showQR, setShowQR] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate QR code for device pairing
  const generateQRCode = () => {
    const pairingData = {
      deviceId: "current-device",
      timestamp: Date.now(),
      encryptionKey: generateEncryptionKey(),
      serverEndpoint: window.location.origin + "/api/flow/pair",
    }

    const qrData = btoa(JSON.stringify(pairingData))
    setQrCode(qrData)
    setShowQR(true)
  }

  const generateEncryptionKey = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  const detectContentType = (content: string): "text" | "url" => {
    try {
      new URL(content)
      return "url"
    } catch {
      return "text"
    }
  }

  const sendToDevice = async () => {
    if (!sendContent.trim() || !selectedDevice) return

    const contentType = sendType === "text" ? detectContentType(sendContent) : sendType

    const newItem: FlowItem = {
      id: `flow-${Date.now()}`,
      type: contentType,
      content: sendContent,
      timestamp: new Date(),
      fromDevice: "Dispositivo Actual",
      toDevice: selectedDevice,
      encrypted: encryptionEnabled,
      synced: false,
    }

    setFlowItems((prev) => [newItem, ...prev])

    // Simulate encryption and sync
    setTimeout(() => {
      setFlowItems((prev) => prev.map((item) => (item.id === newItem.id ? { ...item, synced: true } : item)))
    }, 1500)

    setSendContent("")
  }

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const newItem: FlowItem = {
      id: `flow-${Date.now()}`,
      type: file.type.startsWith("image/") ? "image" : "file",
      content: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      timestamp: new Date(),
      fromDevice: "Dispositivo Actual",
      toDevice: selectedDevice,
      encrypted: encryptionEnabled,
      synced: false,
    }

    setFlowItems((prev) => [newItem, ...prev])

    setTimeout(() => {
      setFlowItems((prev) => prev.map((item) => (item.id === newItem.id ? { ...item, synced: true } : item)))
    }, 2000)
  }

  const getDeviceIcon = (type: Device["type"]) => {
    switch (type) {
      case "mobile":
        return Smartphone
      case "desktop":
        return Monitor
      case "tablet":
        return Tablet
      default:
        return Monitor
    }
  }

  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "offline":
        return "bg-gray-400"
      case "syncing":
        return "bg-yellow-400 animate-pulse"
      default:
        return "bg-gray-400"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Flow - Sincronización</h2>
            <p className="text-blue-100 text-sm">Sincronización cifrada entre dispositivos</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm">
            <Shield className="h-4 w-4" />
            <span>Cifrado E2E</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Devices Panel */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Dispositivos Conectados</h3>
              <Button size="sm" onClick={generateQRCode} className="bg-blue-600 hover:bg-blue-700">
                <QrCode className="h-4 w-4 mr-1" />
                Conectar
              </Button>
            </div>

            <div className="space-y-3">
              {devices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type)
                return (
                  <div
                    key={device.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedDevice === device.name
                        ? "bg-blue-600/20 border-blue-500"
                        : "bg-gray-700/50 border-gray-600 hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedDevice(device.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DeviceIcon className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-white font-medium text-sm">{device.name}</div>
                          <div className="text-gray-400 text-xs">{device.platform}</div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {device.status === "online"
                        ? "En línea"
                        : device.status === "syncing"
                          ? "Sincronizando..."
                          : `Visto ${device.lastSeen.toLocaleTimeString()}`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Send Content */}
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-3">Enviar Contenido</h4>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={sendType === "text" ? "default" : "outline"}
                  onClick={() => setSendType("text")}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Texto
                </Button>
                <Button
                  size="sm"
                  variant={sendType === "url" ? "default" : "outline"}
                  onClick={() => setSendType("url")}
                  className="flex-1"
                >
                  <Link className="h-4 w-4 mr-1" />
                  URL
                </Button>
                <Button
                  size="sm"
                  variant={sendType === "file" ? "default" : "outline"}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Archivo
                </Button>
              </div>

              <Textarea
                value={sendContent}
                onChange={(e) => setSendContent(e.target.value)}
                placeholder={sendType === "url" ? "https://ejemplo.com" : "Escribe tu mensaje..."}
                className="bg-gray-700 border-gray-600 text-white resize-none"
                rows={3}
              />

              <div className="flex items-center space-x-2">
                <Button
                  onClick={sendToDevice}
                  disabled={!sendContent.trim() || !selectedDevice}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar a {selectedDevice || "dispositivo"}
                </Button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Cifrado extremo a extremo activado</span>
              </div>
            </div>
          </div>

          <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept="*/*" />
        </div>

        {/* Flow History */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">Historial de Sincronización</h3>
            <p className="text-gray-400 text-sm">Elementos compartidos entre dispositivos</p>
          </div>

          <div className="space-y-3">
            {flowItems.map((item) => (
              <Card key={item.id} className="bg-gray-800/50 border-gray-700 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      {item.type === "url" && <Link className="h-5 w-5 text-blue-400" />}
                      {item.type === "text" && <FileText className="h-5 w-5 text-green-400" />}
                      {item.type === "file" && <Download className="h-5 w-5 text-purple-400" />}
                      {item.type === "image" && <ImageIcon className="h-5 w-5 text-pink-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium">
                          {item.type === "url"
                            ? "Enlace"
                            : item.type === "text"
                              ? "Texto"
                              : item.type === "file"
                                ? "Archivo"
                                : "Imagen"}
                        </span>
                        {item.encrypted && <Shield className="h-3 w-3 text-green-400" />}
                        {item.synced ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <RefreshCw className="h-3 w-3 text-yellow-400 animate-spin" />
                        )}
                      </div>

                      <div className="text-gray-300 text-sm mb-2 break-all">
                        {item.fileName ? (
                          <div>
                            <span className="font-medium">{item.fileName}</span>
                            {item.fileSize && (
                              <span className="text-gray-500 ml-2">({formatFileSize(item.fileSize)})</span>
                            )}
                          </div>
                        ) : item.content.length > 100 ? (
                          item.content.substring(0, 100) + "..."
                        ) : (
                          item.content
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>De: {item.fromDevice}</span>
                        {item.toDevice && <span>Para: {item.toDevice}</span>}
                        <span>{item.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.content, item.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Conectar Dispositivo</h3>
              <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Escanea este código QR desde tu otro dispositivo para conectarlo de forma segura
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => setShowQR(false)} className="flex-1">
                  Cerrar
                </Button>
                <Button variant="outline" onClick={generateQRCode} className="flex-1 bg-transparent">
                  Regenerar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}
