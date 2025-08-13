"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, Wifi, X, Zap, Monitor, Cpu, HardDrive, Activity, Smartphone, Laptop } from "lucide-react"

interface PowerDataSaverProps {
  onClose: () => void
  onBatterySaverToggle: (enabled: boolean) => void
  onDataSaverToggle: (enabled: boolean) => void
  isMobile?: boolean
}

interface SystemStats {
  batteryLevel: number
  batteryCharging: boolean
  cpuUsage: number
  memoryUsage: number
  networkUsage: number
  dataSaved: number
  powerSaved: number
  estimatedTimeRemaining: number
}

interface OptimizationSettings {
  batterySaver: boolean
  dataSaver: boolean
  reducedAnimations: boolean
  backgroundSync: boolean
  autoSuspendTabs: boolean
  imageCompression: boolean
  videoQuality: "low" | "medium" | "high"
  refreshRate: number
  brightness: number
  cpuThrottling: boolean
}

export function PowerDataSaver({
  onClose,
  onBatterySaverToggle,
  onDataSaverToggle,
  isMobile = false,
}: PowerDataSaverProps) {
  const [stats, setStats] = useState<SystemStats>({
    batteryLevel: 67,
    batteryCharging: false,
    cpuUsage: 23,
    memoryUsage: 45,
    networkUsage: 12,
    dataSaved: 156.7, // MB
    powerSaved: 23.4, // %
    estimatedTimeRemaining: 4.2, // hours
  })

  const [settings, setSettings] = useState<OptimizationSettings>({
    batterySaver: false,
    dataSaver: false,
    reducedAnimations: false,
    backgroundSync: true,
    autoSuspendTabs: false,
    imageCompression: false,
    videoQuality: "high",
    refreshRate: 60,
    brightness: 80,
    cpuThrottling: false,
  })

  const [activeProfile, setActiveProfile] = useState<"performance" | "balanced" | "power-saver">("balanced")

  useEffect(() => {
    // Simulate real-time system stats updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - (settings.batterySaver ? 0.1 : 0.2)),
        cpuUsage: Math.max(5, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(10, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkUsage: Math.max(0, Math.min(100, prev.networkUsage + (Math.random() - 0.5) * 15)),
        dataSaved: settings.dataSaver ? prev.dataSaved + Math.random() * 2 : prev.dataSaved,
        powerSaved: settings.batterySaver ? prev.powerSaved + Math.random() * 0.5 : prev.powerSaved,
        estimatedTimeRemaining: settings.batterySaver
          ? prev.estimatedTimeRemaining + 0.1
          : Math.max(0, prev.estimatedTimeRemaining - 0.05),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [settings.batterySaver, settings.dataSaver])

  const handleBatterySaverToggle = () => {
    const newState = !settings.batterySaver
    setSettings((prev) => ({ ...prev, batterySaver: newState }))
    onBatterySaverToggle(newState)

    if (newState) {
      // Auto-enable power saving features
      setSettings((prev) => ({
        ...prev,
        reducedAnimations: true,
        autoSuspendTabs: true,
        cpuThrottling: true,
        refreshRate: 30,
        brightness: Math.min(prev.brightness, 50),
      }))
      setActiveProfile("power-saver")
    }
  }

  const handleDataSaverToggle = () => {
    const newState = !settings.dataSaver
    setSettings((prev) => ({ ...prev, dataSaver: newState }))
    onDataSaverToggle(newState)

    if (newState) {
      // Auto-enable data saving features
      setSettings((prev) => ({
        ...prev,
        imageCompression: true,
        videoQuality: "low",
        backgroundSync: false,
      }))
    }
  }

  const applyProfile = (profile: "performance" | "balanced" | "power-saver") => {
    setActiveProfile(profile)

    switch (profile) {
      case "performance":
        setSettings((prev) => ({
          ...prev,
          batterySaver: false,
          dataSaver: false,
          reducedAnimations: false,
          backgroundSync: true,
          autoSuspendTabs: false,
          imageCompression: false,
          videoQuality: "high",
          refreshRate: 60,
          brightness: 100,
          cpuThrottling: false,
        }))
        break
      case "balanced":
        setSettings((prev) => ({
          ...prev,
          batterySaver: false,
          dataSaver: false,
          reducedAnimations: false,
          backgroundSync: true,
          autoSuspendTabs: false,
          imageCompression: false,
          videoQuality: "medium",
          refreshRate: 60,
          brightness: 80,
          cpuThrottling: false,
        }))
        break
      case "power-saver":
        setSettings((prev) => ({
          ...prev,
          batterySaver: true,
          dataSaver: true,
          reducedAnimations: true,
          backgroundSync: false,
          autoSuspendTabs: true,
          imageCompression: true,
          videoQuality: "low",
          refreshRate: 30,
          brightness: 50,
          cpuThrottling: true,
        }))
        break
    }
  }

  const getBatteryColor = () => {
    if (stats.batteryLevel > 50) return "text-green-400"
    if (stats.batteryLevel > 20) return "text-yellow-400"
    return "text-red-400"
  }

  const getBatteryIcon = () => {
    if (stats.batteryCharging) return <Zap className="h-4 w-4 text-yellow-400" />
    return <Battery className="h-4 w-4" />
  }

  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const formatData = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
    return `${mb.toFixed(1)} MB`
  }

  return (
    <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {isMobile ? <Smartphone className="h-5 w-5" /> : <Laptop className="h-5 w-5" />}
            <span>Ahorro de {isMobile ? "Batería y Datos" : "Energía"}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getBatteryIcon()}
            <span className={`font-medium ${getBatteryColor()}`}>{stats.batteryLevel.toFixed(0)}%</span>
          </div>
          <Badge variant={settings.batterySaver ? "default" : "secondary"}>
            {settings.batterySaver ? "Ahorro Activo" : "Normal"}
          </Badge>
          {settings.dataSaver && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Data Saver
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="overview" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              Configuración
            </TabsTrigger>
            <TabsTrigger value="profiles" className="text-xs">
              Perfiles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Battery Status */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Estado de la Batería</h4>
                <span className="text-xs text-gray-400">
                  {stats.batteryCharging ? "Cargando" : formatTime(stats.estimatedTimeRemaining)}
                </span>
              </div>
              <Progress value={stats.batteryLevel} className="mb-2" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Nivel: {stats.batteryLevel.toFixed(0)}%</span>
                <span>Ahorro: {stats.powerSaved.toFixed(1)}%</span>
              </div>
            </div>

            {/* System Resources */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">CPU</span>
                </div>
                <Progress value={stats.cpuUsage} className="mb-1" />
                <span className="text-xs text-gray-400">{stats.cpuUsage.toFixed(0)}%</span>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="h-4 w-4 text-green-400" />
                  <span className="text-sm">RAM</span>
                </div>
                <Progress value={stats.memoryUsage} className="mb-1" />
                <span className="text-xs text-gray-400">{stats.memoryUsage.toFixed(0)}%</span>
              </div>
            </div>

            {/* Network Usage */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium">Uso de Red</span>
                </div>
                <span className="text-xs text-gray-400">Ahorrado: {formatData(stats.dataSaved)}</span>
              </div>
              <Progress value={stats.networkUsage} className="mb-2" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Actividad: {stats.networkUsage.toFixed(0)}%</span>
                <span>Data Saver: {settings.dataSaver ? "ON" : "OFF"}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleBatterySaverToggle}
                className={`${
                  settings.batterySaver ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Battery className="h-4 w-4 mr-2" />
                {settings.batterySaver ? "Desactivar" : "Activar"} Ahorro
              </Button>

              <Button
                onClick={handleDataSaverToggle}
                className={`${settings.dataSaver ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                <Wifi className="h-4 w-4 mr-2" />
                {settings.dataSaver ? "Desactivar" : "Activar"} Data Saver
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Power Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center">
                <Battery className="h-4 w-4 mr-2" />
                Configuración de Energía
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Animaciones reducidas</span>
                  <Switch
                    checked={settings.reducedAnimations}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, reducedAnimations: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Suspender pestañas inactivas</span>
                  <Switch
                    checked={settings.autoSuspendTabs}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoSuspendTabs: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Limitación de CPU</span>
                  <Switch
                    checked={settings.cpuThrottling}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, cpuThrottling: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Frecuencia de actualización: {settings.refreshRate}Hz</label>
                <Slider
                  value={[settings.refreshRate]}
                  onValueChange={([value]) => setSettings((prev) => ({ ...prev, refreshRate: value }))}
                  max={120}
                  min={30}
                  step={30}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Brillo de pantalla: {settings.brightness}%</label>
                <Slider
                  value={[settings.brightness]}
                  onValueChange={([value]) => setSettings((prev) => ({ ...prev, brightness: value }))}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Data Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center">
                <Wifi className="h-4 w-4 mr-2" />
                Configuración de Datos
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compresión de imágenes</span>
                  <Switch
                    checked={settings.imageCompression}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, imageCompression: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Sincronización en segundo plano</span>
                  <Switch
                    checked={settings.backgroundSync}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, backgroundSync: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Calidad de video</label>
                <div className="flex space-x-2">
                  {(["low", "medium", "high"] as const).map((quality) => (
                    <Button
                      key={quality}
                      variant={settings.videoQuality === quality ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings((prev) => ({ ...prev, videoQuality: quality }))}
                    >
                      {quality === "low" ? "Baja" : quality === "medium" ? "Media" : "Alta"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Perfiles de Optimización</h4>

              <div className="space-y-2">
                <Button
                  variant={activeProfile === "performance" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => applyProfile("performance")}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Rendimiento</div>
                    <div className="text-xs text-gray-400">Máximo rendimiento, mayor consumo</div>
                  </div>
                </Button>

                <Button
                  variant={activeProfile === "balanced" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => applyProfile("balanced")}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Equilibrado</div>
                    <div className="text-xs text-gray-400">Balance entre rendimiento y ahorro</div>
                  </div>
                </Button>

                <Button
                  variant={activeProfile === "power-saver" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => applyProfile("power-saver")}
                >
                  <Battery className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Ahorro de Energía</div>
                    <div className="text-xs text-gray-400">Máximo ahorro, rendimiento reducido</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="text-sm font-medium mb-3">Estadísticas del Perfil Actual</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Ahorro estimado:</span>
                  <div className="font-medium text-green-400">
                    {activeProfile === "power-saver" ? "40-60%" : activeProfile === "balanced" ? "15-25%" : "0-5%"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Rendimiento:</span>
                  <div className="font-medium text-blue-400">
                    {activeProfile === "performance" ? "Alto" : activeProfile === "balanced" ? "Medio" : "Reducido"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Duración batería:</span>
                  <div className="font-medium text-yellow-400">
                    {activeProfile === "power-saver" ? "+2-4h" : activeProfile === "balanced" ? "+1-2h" : "Normal"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Uso de datos:</span>
                  <div className="font-medium text-purple-400">
                    {activeProfile === "power-saver" ? "-50%" : activeProfile === "balanced" ? "-20%" : "Normal"}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
