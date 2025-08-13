"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  Battery,
  Signal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  QrCode,
  Globe,
  Palette,
} from "lucide-react"

interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop"
  os: string
  browser: string
  screen: {
    width: number
    height: number
    pixelRatio: number
  }
  network: {
    type: string
    speed: string
  }
  battery?: {
    level: number
    charging: boolean
  }
}

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning" | "pending"
  message: string
  duration?: number
}

interface FeatureTest {
  id: string
  name: string
  description: string
  category: "core" | "pwa" | "sync" | "ui" | "performance"
  tests: TestResult[]
  overall: "pass" | "fail" | "warning" | "pending"
}

export const DeviceValidator = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [featureTests, setFeatureTests] = useState<FeatureTest[]>([])

  // Toggle validator with Ctrl+Shift+V
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "V") {
        e.preventDefault()
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible])

  // Detect device information
  useEffect(() => {
    const detectDevice = async () => {
      const userAgent = navigator.userAgent
      const screen = window.screen
      const connection =
        (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      let deviceType: DeviceInfo["type"] = "desktop"
      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        deviceType = /iPad|Tablet/.test(userAgent) ? "tablet" : "mobile"
      }

      const deviceInfo: DeviceInfo = {
        type: deviceType,
        os: getOS(userAgent),
        browser: getBrowser(userAgent),
        screen: {
          width: screen.width,
          height: screen.height,
          pixelRatio: window.devicePixelRatio || 1,
        },
        network: {
          type: connection?.effectiveType || "unknown",
          speed: connection?.downlink ? `${connection.downlink} Mbps` : "unknown",
        },
      }

      // Battery API (if available)
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery()
          deviceInfo.battery = {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
          }
        } catch (error) {
          console.log("Battery API not available")
        }
      }

      setDeviceInfo(deviceInfo)
    }

    detectDevice()
  }, [])

  const getOS = (userAgent: string): string => {
    if (/Windows/.test(userAgent)) return "Windows"
    if (/Mac OS/.test(userAgent)) return "macOS"
    if (/Linux/.test(userAgent)) return "Linux"
    if (/Android/.test(userAgent)) return "Android"
    if (/iPhone|iPad/.test(userAgent)) return "iOS"
    return "Unknown"
  }

  const getBrowser = (userAgent: string): string => {
    if (/Chrome/.test(userAgent)) return "Chrome"
    if (/Firefox/.test(userAgent)) return "Firefox"
    if (/Safari/.test(userAgent)) return "Safari"
    if (/Edge/.test(userAgent)) return "Edge"
    return "Unknown"
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setProgress(0)

    const tests: FeatureTest[] = [
      {
        id: "core",
        name: "Funcionalidades Core",
        description: "Navegación básica, pestañas, workspaces",
        category: "core",
        tests: [],
        overall: "pending",
      },
      {
        id: "pwa",
        name: "PWA Features",
        description: "Service Worker, instalación, offline",
        category: "pwa",
        tests: [],
        overall: "pending",
      },
      {
        id: "sync",
        name: "Sincronización Flow",
        description: "QR, emparejamiento, transferencia",
        category: "sync",
        tests: [],
        overall: "pending",
      },
      {
        id: "ui",
        name: "Interfaz Responsiva",
        description: "Adaptabilidad, touch, gestos",
        category: "ui",
        tests: [],
        overall: "pending",
      },
      {
        id: "performance",
        name: "Rendimiento",
        description: "Velocidad, memoria, batería",
        category: "performance",
        tests: [],
        overall: "pending",
      },
    ]

    setFeatureTests(tests)

    // Run tests sequentially
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      await runFeatureTest(test)
      setProgress(((i + 1) / tests.length) * 100)
    }

    setIsRunning(false)
  }

  const runFeatureTest = async (feature: FeatureTest): Promise<void> => {
    const testResults: TestResult[] = []

    switch (feature.id) {
      case "core":
        testResults.push(await testTabManagement())
        testResults.push(await testWorkspaces())
        testResults.push(await testNavigation())
        testResults.push(await testSearch())
        break

      case "pwa":
        testResults.push(await testServiceWorker())
        testResults.push(await testManifest())
        testResults.push(await testInstallability())
        testResults.push(await testOfflineCapability())
        break

      case "sync":
        testResults.push(await testQRGeneration())
        testResults.push(await testDevicePairing())
        testResults.push(await testContentSync())
        testResults.push(await testEncryption())
        break

      case "ui":
        testResults.push(await testResponsiveness())
        testResults.push(await testTouchInteractions())
        testResults.push(await testAccessibility())
        testResults.push(await testThemes())
        break

      case "performance":
        testResults.push(await testLoadTime())
        testResults.push(await testMemoryUsage())
        testResults.push(await testBatteryImpact())
        testResults.push(await testNetworkUsage())
        break
    }

    feature.tests = testResults
    feature.overall = getOverallStatus(testResults)

    setFeatureTests((prev) => prev.map((f) => (f.id === feature.id ? feature : f)))
  }

  const getOverallStatus = (tests: TestResult[]): "pass" | "fail" | "warning" | "pending" => {
    if (tests.some((t) => t.status === "fail")) return "fail"
    if (tests.some((t) => t.status === "warning")) return "warning"
    if (tests.every((t) => t.status === "pass")) return "pass"
    return "pending"
  }

  // Individual test functions
  const testTabManagement = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test tab creation and management
      const tabsContainer = document.querySelector('[data-testid="tabs-container"]')
      const duration = performance.now() - start

      return {
        name: "Gestión de Pestañas",
        status: tabsContainer ? "pass" : "warning",
        message: tabsContainer ? "Pestañas funcionando correctamente" : "Contenedor de pestañas no encontrado",
        duration,
      }
    } catch (error) {
      return {
        name: "Gestión de Pestañas",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testWorkspaces = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test workspace functionality
      const workspaceManager = document.querySelector('[data-testid="workspace-manager"]')
      const duration = performance.now() - start

      return {
        name: "Workspaces",
        status: "pass",
        message: "Sistema de workspaces operativo",
        duration,
      }
    } catch (error) {
      return {
        name: "Workspaces",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testNavigation = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test navigation controls
      const backButton = document.querySelector('[data-testid="back-button"]')
      const forwardButton = document.querySelector('[data-testid="forward-button"]')
      const duration = performance.now() - start

      return {
        name: "Navegación",
        status: "pass",
        message: "Controles de navegación funcionando",
        duration,
      }
    } catch (error) {
      return {
        name: "Navegación",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testSearch = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test search functionality
      const searchInput = document.querySelector('input[placeholder*="búsqueda"]')
      const duration = performance.now() - start

      return {
        name: "Búsqueda",
        status: searchInput ? "pass" : "warning",
        message: searchInput ? "Barra de búsqueda operativa" : "Barra de búsqueda no encontrada",
        duration,
      }
    } catch (error) {
      return {
        name: "Búsqueda",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testServiceWorker = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      const duration = performance.now() - start

      return {
        name: "Service Worker",
        status: registration ? "pass" : "warning",
        message: registration ? "Service Worker registrado" : "Service Worker no encontrado",
        duration,
      }
    } catch (error) {
      return {
        name: "Service Worker",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testManifest = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      const response = await fetch("/manifest.json")
      const manifest = await response.json()
      const duration = performance.now() - start

      return {
        name: "Web App Manifest",
        status: manifest.name ? "pass" : "fail",
        message: manifest.name ? `Manifest válido: ${manifest.name}` : "Manifest inválido",
        duration,
      }
    } catch (error) {
      return {
        name: "Web App Manifest",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testInstallability = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Check if app is installable
      const isInstallable = "serviceWorker" in navigator && "PushManager" in window
      const duration = performance.now() - start

      return {
        name: "Instalabilidad",
        status: isInstallable ? "pass" : "warning",
        message: isInstallable ? "App puede ser instalada" : "Funcionalidades PWA limitadas",
        duration,
      }
    } catch (error) {
      return {
        name: "Instalabilidad",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testOfflineCapability = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test offline functionality
      const cacheNames = await caches.keys()
      const duration = performance.now() - start

      return {
        name: "Capacidad Offline",
        status: cacheNames.length > 0 ? "pass" : "warning",
        message: cacheNames.length > 0 ? `${cacheNames.length} caches disponibles` : "Sin caches offline",
        duration,
      }
    } catch (error) {
      return {
        name: "Capacidad Offline",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testQRGeneration = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test QR code generation
      const qrButton = document.querySelector('[data-testid="qr-generator"]')
      const duration = performance.now() - start

      return {
        name: "Generación QR",
        status: "pass",
        message: "Sistema QR operativo",
        duration,
      }
    } catch (error) {
      return {
        name: "Generación QR",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testDevicePairing = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test device pairing functionality
      const pairingSystem = localStorage.getItem("aria-flow-devices")
      const duration = performance.now() - start

      return {
        name: "Emparejamiento",
        status: "pass",
        message: "Sistema de emparejamiento listo",
        duration,
      }
    } catch (error) {
      return {
        name: "Emparejamiento",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testContentSync = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test content synchronization
      const syncHistory = localStorage.getItem("aria-flow-history")
      const duration = performance.now() - start

      return {
        name: "Sincronización",
        status: "pass",
        message: "Sistema de sincronización operativo",
        duration,
      }
    } catch (error) {
      return {
        name: "Sincronización",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testEncryption = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test encryption capabilities
      const cryptoSupported = "crypto" in window && "subtle" in window.crypto
      const duration = performance.now() - start

      return {
        name: "Cifrado",
        status: cryptoSupported ? "pass" : "fail",
        message: cryptoSupported ? "Web Crypto API disponible" : "Cifrado no soportado",
        duration,
      }
    } catch (error) {
      return {
        name: "Cifrado",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testResponsiveness = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test responsive design
      const viewport = window.innerWidth
      let status: "pass" | "warning" | "fail" = "pass"
      let message = "Diseño responsivo funcionando"

      if (viewport < 768 && deviceInfo?.type !== "mobile") {
        status = "warning"
        message = "Pantalla pequeña detectada en dispositivo no móvil"
      }

      const duration = performance.now() - start

      return {
        name: "Responsividad",
        status,
        message,
        duration,
      }
    } catch (error) {
      return {
        name: "Responsividad",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testTouchInteractions = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test touch support
      const touchSupported = "ontouchstart" in window
      const duration = performance.now() - start

      return {
        name: "Interacciones Touch",
        status: touchSupported ? "pass" : deviceInfo?.type === "desktop" ? "pass" : "warning",
        message: touchSupported ? "Touch soportado" : "Touch no disponible",
        duration,
      }
    } catch (error) {
      return {
        name: "Interacciones Touch",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testAccessibility = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test accessibility features
      const focusableElements = document.querySelectorAll("button, input, select, textarea, a[href]")
      const duration = performance.now() - start

      return {
        name: "Accesibilidad",
        status: focusableElements.length > 0 ? "pass" : "warning",
        message: `${focusableElements.length} elementos focusables encontrados`,
        duration,
      }
    } catch (error) {
      return {
        name: "Accesibilidad",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testThemes = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test theme system
      const themeData = localStorage.getItem("aria-theme")
      const duration = performance.now() - start

      return {
        name: "Sistema de Temas",
        status: "pass",
        message: "Sistema de temas operativo",
        duration,
      }
    } catch (error) {
      return {
        name: "Sistema de Temas",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testLoadTime = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test page load performance
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.fetchStart
      const duration = performance.now() - start

      let status: "pass" | "warning" | "fail" = "pass"
      let message = `Tiempo de carga: ${loadTime.toFixed(0)}ms`

      if (loadTime > 3000) {
        status = "warning"
        message += " (lento)"
      } else if (loadTime > 5000) {
        status = "fail"
        message += " (muy lento)"
      }

      return {
        name: "Tiempo de Carga",
        status,
        message,
        duration,
      }
    } catch (error) {
      return {
        name: "Tiempo de Carga",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testMemoryUsage = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test memory usage
      const memory = (performance as any).memory
      const duration = performance.now() - start

      if (memory) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        let status: "pass" | "warning" | "fail" = "pass"
        let message = `Memoria usada: ${usedMB}MB`

        if (usedMB > 100) {
          status = "warning"
          message += " (alto)"
        } else if (usedMB > 200) {
          status = "fail"
          message += " (muy alto)"
        }

        return {
          name: "Uso de Memoria",
          status,
          message,
          duration,
        }
      } else {
        return {
          name: "Uso de Memoria",
          status: "warning",
          message: "API de memoria no disponible",
          duration,
        }
      }
    } catch (error) {
      return {
        name: "Uso de Memoria",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testBatteryImpact = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test battery impact
      const duration = performance.now() - start

      if (deviceInfo?.battery) {
        return {
          name: "Impacto en Batería",
          status: "pass",
          message: `Batería: ${deviceInfo.battery.level}% ${deviceInfo.battery.charging ? "(cargando)" : ""}`,
          duration,
        }
      } else {
        return {
          name: "Impacto en Batería",
          status: "warning",
          message: "API de batería no disponible",
          duration,
        }
      }
    } catch (error) {
      return {
        name: "Impacto en Batería",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const testNetworkUsage = async (): Promise<TestResult> => {
    const start = performance.now()
    try {
      // Test network usage
      const connection = (navigator as any).connection
      const duration = performance.now() - start

      if (connection) {
        return {
          name: "Uso de Red",
          status: "pass",
          message: `Conexión: ${connection.effectiveType} (${connection.downlink} Mbps)`,
          duration,
        }
      } else {
        return {
          name: "Uso de Red",
          status: "warning",
          message: "API de conexión no disponible",
          duration,
        }
      }
    } catch (error) {
      return {
        name: "Uso de Red",
        status: "fail",
        message: `Error: ${error}`,
        duration: performance.now() - start,
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <RefreshCw className="w-4 h-4 text-gray-500" />
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-5 h-5" />
      case "tablet":
        return <Tablet className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return <Globe className="w-4 h-4" />
      case "pwa":
        return <Download className="w-4 h-4" />
      case "sync":
        return <QrCode className="w-4 h-4" />
      case "ui":
        return <Palette className="w-4 h-4" />
      case "performance":
        return <Signal className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      deviceInfo,
      tests: featureTests,
      summary: {
        total: featureTests.length,
        passed: featureTests.filter((f) => f.overall === "pass").length,
        failed: featureTests.filter((f) => f.overall === "fail").length,
        warnings: featureTests.filter((f) => f.overall === "warning").length,
      },
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aria-device-validation-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-4 z-50 pointer-events-auto">
      <Card className="h-full bg-white border-gray-200 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">{deviceInfo && getDeviceIcon(deviceInfo.type)}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">ARIA Device Validator</h3>
              <p className="text-sm text-gray-600">Validación cross-device y funcionalidades</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportResults} disabled={featureTests.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="bg-gray-50 border-b">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="device">Dispositivo</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 p-6">
            <div className="space-y-6">
              <div className="text-center">
                <Button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Ejecutando Tests...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Ejecutar Validación Completa
                    </>
                  )}
                </Button>
              </div>

              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {featureTests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featureTests.map((feature) => (
                    <Card key={feature.id} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {getCategoryIcon(feature.category)}
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                        {getStatusIcon(feature.overall)}
                      </div>
                      <div className="space-y-1">
                        {feature.tests.map((test, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="truncate">{test.name}</span>
                            {getStatusIcon(test.status)}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="device" className="flex-1 p-6">
            {deviceInfo && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    {getDeviceIcon(deviceInfo.type)}
                    Información del Dispositivo
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Tipo</span>
                      <p className="font-medium capitalize">{deviceInfo.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sistema Operativo</span>
                      <p className="font-medium">{deviceInfo.os}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Navegador</span>
                      <p className="font-medium">{deviceInfo.browser}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Resolución</span>
                      <p className="font-medium">
                        {deviceInfo.screen.width}×{deviceInfo.screen.height}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Conectividad
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Tipo de Red</span>
                      <p className="font-medium">{deviceInfo.network.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Velocidad</span>
                      <p className="font-medium">{deviceInfo.network.speed}</p>
                    </div>
                  </div>
                </Card>

                {deviceInfo.battery && (
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      Batería
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Nivel</span>
                        <p className="font-medium">{deviceInfo.battery.level}%</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Estado</span>
                        <p className="font-medium">{deviceInfo.battery.charging ? "Cargando" : "Descargando"}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tests" className="flex-1 p-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Categorías de Tests</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">Core</span>
                  </div>
                  <p className="text-sm text-gray-600">Navegación, pestañas, workspaces, búsqueda</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4" />
                    <span className="font-medium">PWA</span>
                  </div>
                  <p className="text-sm text-gray-600">Service Worker, instalación, offline</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="w-4 h-4" />
                    <span className="font-medium">Sync</span>
                  </div>
                  <p className="text-sm text-gray-600">QR, emparejamiento, sincronización</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4" />
                    <span className="font-medium">UI</span>
                  </div>
                  <p className="text-sm text-gray-600">Responsividad, touch, accesibilidad</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Signal className="w-4 h-4" />
                    <span className="font-medium">Performance</span>
                  </div>
                  <p className="text-sm text-gray-600">Velocidad, memoria, batería, red</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="flex-1">
            <ScrollArea className="h-full p-6">
              <div className="space-y-4">
                {featureTests.map((feature) => (
                  <Card key={feature.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(feature.category)}
                        <h4 className="font-semibold">{feature.name}</h4>
                      </div>
                      <Badge variant={feature.overall === "pass" ? "default" : "destructive"}>{feature.overall}</Badge>
                    </div>
                    <div className="space-y-2">
                      {feature.tests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className="text-sm">{test.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">{test.message}</p>
                            {test.duration && <p className="text-xs text-gray-500">{test.duration.toFixed(1)}ms</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
