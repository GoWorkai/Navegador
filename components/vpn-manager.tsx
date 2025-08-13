"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ShieldCheck, ShieldX, Globe, Zap, Activity, X } from "lucide-react"

interface VPNLocation {
  id: string
  country: string
  city: string
  flag: string
  ping: number
  load: number
  premium?: boolean
}

interface VPNStatus {
  connected: boolean
  location: VPNLocation | null
  ip: string
  bytesUp: number
  bytesDown: number
  connectionTime: number
}

interface VPNManagerProps {
  onClose: () => void
  onVPNToggle: (enabled: boolean, location?: VPNLocation) => void
  currentTab?: number
}

const VPN_LOCATIONS: VPNLocation[] = [
  { id: "us-ny", country: "Estados Unidos", city: "Nueva York", flag: "🇺🇸", ping: 45, load: 23 },
  { id: "us-ca", country: "Estados Unidos", city: "Los Ángeles", flag: "🇺🇸", ping: 52, load: 31 },
  { id: "uk-lon", country: "Reino Unido", city: "Londres", flag: "🇬🇧", ping: 78, load: 18 },
  { id: "de-ber", country: "Alemania", city: "Berlín", flag: "🇩🇪", ping: 65, load: 27 },
  { id: "jp-tok", country: "Japón", city: "Tokio", flag: "🇯🇵", ping: 125, load: 15 },
  { id: "au-syd", country: "Australia", city: "Sídney", flag: "🇦🇺", ping: 180, load: 42 },
  { id: "ca-tor", country: "Canadá", city: "Toronto", flag: "🇨🇦", ping: 38, load: 29 },
  { id: "fr-par", country: "Francia", city: "París", flag: "🇫🇷", ping: 72, load: 35 },
  { id: "nl-ams", country: "Países Bajos", city: "Ámsterdam", flag: "🇳🇱", ping: 68, load: 22, premium: true },
  { id: "sg-sin", country: "Singapur", city: "Singapur", flag: "🇸🇬", ping: 145, load: 19, premium: true },
]

export function VPNManager({ onClose, onVPNToggle, currentTab }: VPNManagerProps) {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>({
    connected: false,
    location: null,
    ip: "192.168.1.100",
    bytesUp: 0,
    bytesDown: 0,
    connectionTime: 0,
  })

  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [perTabMode, setPerTabMode] = useState(false)
  const [tabVPNs, setTabVPNs] = useState<Record<number, VPNLocation>>({})
  const [autoConnect, setAutoConnect] = useState(false)
  const [killSwitch, setKillSwitch] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (vpnStatus.connected) {
      interval = setInterval(() => {
        setVpnStatus((prev) => ({
          ...prev,
          connectionTime: prev.connectionTime + 1,
          bytesUp: prev.bytesUp + Math.random() * 1000,
          bytesDown: prev.bytesDown + Math.random() * 5000,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [vpnStatus.connected])

  const handleConnect = async () => {
    if (!selectedLocation && !vpnStatus.connected) return

    setIsConnecting(true)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (vpnStatus.connected) {
      // Disconnect
      setVpnStatus((prev) => ({
        ...prev,
        connected: false,
        location: null,
        connectionTime: 0,
      }))
      onVPNToggle(false)
    } else {
      // Connect
      const location = VPN_LOCATIONS.find((loc) => loc.id === selectedLocation)
      if (location) {
        setVpnStatus((prev) => ({
          ...prev,
          connected: true,
          location,
          ip: generateVPNIP(location),
          connectionTime: 0,
        }))
        onVPNToggle(true, location)
      }
    }

    setIsConnecting(false)
  }

  const handleTabVPN = (tabId: number, locationId: string) => {
    const location = VPN_LOCATIONS.find((loc) => loc.id === locationId)
    if (location) {
      setTabVPNs((prev) => ({
        ...prev,
        [tabId]: location,
      }))
    }
  }

  const generateVPNIP = (location: VPNLocation): string => {
    const ranges: Record<string, string> = {
      "us-ny": "74.125.224.",
      "us-ca": "173.194.46.",
      "uk-lon": "216.58.213.",
      "de-ber": "172.217.16.",
      "jp-tok": "142.250.196.",
      "au-syd": "172.217.25.",
      "ca-tor": "142.251.46.",
      "fr-par": "216.58.201.",
      "nl-ams": "172.217.21.",
      "sg-sin": "142.250.185.",
    }

    const baseIP = ranges[location.id] || "192.168.1."
    return baseIP + Math.floor(Math.random() * 255)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = () => {
    if (vpnStatus.connected) return "text-green-400"
    if (isConnecting) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusIcon = () => {
    if (vpnStatus.connected) return <ShieldCheck className="h-5 w-5 text-green-400" />
    if (isConnecting) return <Shield className="h-5 w-5 text-yellow-400 animate-pulse" />
    return <ShieldX className="h-5 w-5 text-red-400" />
  }

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-700 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>VPN Manager</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={vpnStatus.connected ? "default" : "secondary"} className={getStatusColor()}>
            {vpnStatus.connected ? "Conectado" : isConnecting ? "Conectando..." : "Desconectado"}
          </Badge>
          {vpnStatus.location && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {vpnStatus.location.flag} {vpnStatus.location.city}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        {vpnStatus.connected && (
          <div className="bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">IP Virtual:</span>
              <span className="font-mono">{vpnStatus.ip}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Tiempo:</span>
              <span className="font-mono">{formatTime(vpnStatus.connectionTime)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-1">
                <Activity className="h-3 w-3 text-green-400" />
                <span className="text-gray-400">↑</span>
                <span>{formatBytes(vpnStatus.bytesUp)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="h-3 w-3 text-blue-400" />
                <span className="text-gray-400">↓</span>
                <span>{formatBytes(vpnStatus.bytesDown)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Location Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Ubicación del Servidor</label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="bg-gray-800 border-gray-600">
              <SelectValue placeholder="Seleccionar ubicación..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {VPN_LOCATIONS.map((location) => (
                <SelectItem key={location.id} value={location.id} className="text-white">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span>{location.flag}</span>
                      <span>
                        {location.city}, {location.country}
                      </span>
                      {location.premium && (
                        <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{location.ping}ms</span>
                      <div className="flex items-center space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-green-400"
                          style={{
                            backgroundColor:
                              location.load < 30 ? "#10b981" : location.load < 60 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                        <span>{location.load}%</span>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connection Button */}
        <Button
          onClick={handleConnect}
          disabled={isConnecting || (!selectedLocation && !vpnStatus.connected)}
          className={`w-full ${
            vpnStatus.connected ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isConnecting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Conectando...</span>
            </div>
          ) : vpnStatus.connected ? (
            "Desconectar VPN"
          ) : (
            "Conectar VPN"
          )}
        </Button>

        {/* Advanced Settings */}
        <div className="space-y-3 pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm">VPN por pestaña</span>
            </div>
            <Switch checked={perTabMode} onCheckedChange={setPerTabMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Conexión automática</span>
            </div>
            <Switch checked={autoConnect} onCheckedChange={setAutoConnect} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldX className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Kill Switch</span>
            </div>
            <Switch checked={killSwitch} onCheckedChange={setKillSwitch} />
          </div>
        </div>

        {/* Per-tab VPN (when enabled) */}
        {perTabMode && currentTab && (
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">VPN para pestaña actual</h4>
            <Select value={tabVPNs[currentTab]?.id || ""} onValueChange={(value) => handleTabVPN(currentTab, value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Sin VPN para esta pestaña" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="" className="text-white">
                  Sin VPN
                </SelectItem>
                {VPN_LOCATIONS.map((location) => (
                  <SelectItem key={location.id} value={location.id} className="text-white">
                    {location.flag} {location.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
