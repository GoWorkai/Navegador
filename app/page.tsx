"use client"

import { useState, useEffect } from "react"
import NavigadorIntegralIA from "@/components/navegador-integral-ia"
import WindowsDesktop from "@/components/windows-desktop"
import WorkspaceManager from "@/components/workspace-manager"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<"navegador" | "escritorio">("navegador")
  const [openApps, setOpenApps] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAppLaunch = (appId: string) => {
    console.log(`Launching app: ${appId}`)

    if (!openApps.includes(appId)) {
      setOpenApps((prev) => [...prev, appId])
    }

    switch (appId) {
      case "navegador":
      case "browser":
        setCurrentView("navegador")
        break
      case "callwave":
        console.log("Opening CallWave AI Agent...")
        break
      case "finance":
        console.log("Opening Personal Finance Manager...")
        break
      case "ai-assistant":
        console.log("Opening AI Assistant...")
        break
      case "crm-personal":
        console.log("Opening Personal CRM...")
        break
      default:
        console.log(`Opening app: ${appId}`)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "d":
            e.preventDefault()
            setCurrentView("escritorio")
            break
          case "h":
            e.preventDefault()
            setCurrentView("navegador")
            break
          case "n":
            e.preventDefault()
            setCurrentView("navegador")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl font-space-grotesk">Iniciando Navegador Integral de IA...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {currentView === "navegador" ? (
        <NavigadorIntegralIA onSwitchToDesktop={() => setCurrentView("escritorio")} onAppLaunch={handleAppLaunch} />
      ) : (
        <div className="relative h-full w-full bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900">
          <WindowsDesktop onAppLaunch={handleAppLaunch} />
          <WorkspaceManager />

          <div className="absolute bottom-4 left-4 text-white/50 text-xs font-inter">
            Presiona Ctrl+H para Navegador • Ctrl+N para Nueva Pestaña
          </div>
        </div>
      )}
    </div>
  )
}
