"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, Smartphone, Monitor } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Mostrar prompt después de un delay
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 5000)
    }

    // Escuchar cuando se instala la app
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // No mostrar de nuevo en esta sesión
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
  }

  // No mostrar si ya está instalado o fue rechazado recientemente
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  const dismissedTime = localStorage.getItem("pwa-install-dismissed")
  if (dismissedTime && Date.now() - Number.parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border p-4 animate-in slide-in-from-bottom-2">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Instalar ARIA Navigator</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Accede más rápido desde tu escritorio o móvil
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" onClick={handleInstallClick} className="text-xs h-8">
                <Download className="w-3 h-3 mr-1" />
                Instalar
              </Button>

              <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-xs h-8">
                Ahora no
              </Button>
            </div>
          </div>

          <Button size="sm" variant="ghost" onClick={handleDismiss} className="flex-shrink-0 h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Monitor className="w-3 h-3" />
            <span>Escritorio</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Smartphone className="w-3 h-3" />
            <span>Móvil</span>
          </div>
        </div>
      </div>
    </div>
  )
}
