"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Download } from "lucide-react"

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Verificar estado de conexión
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Verificar si está instalado como PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Verificar actualizaciones del service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        setUpdateAvailable(true)
      })
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleUpdate = () => {
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      {/* Estado de conexión */}
      <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 mr-1" />
            Offline
          </>
        )}
      </Badge>

      {/* Estado de instalación */}
      {isInstalled && (
        <Badge variant="secondary" className="text-xs">
          <Download className="w-3 h-3 mr-1" />
          Instalado
        </Badge>
      )}

      {/* Actualización disponible */}
      {updateAvailable && (
        <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={handleUpdate}>
          Actualizar
        </Badge>
      )}
    </div>
  )
}
