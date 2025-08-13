"use client"

import type React from "react"
import { useMemo } from "react"
import { Globe, Bot, Calculator, Music, Folder, Settings, ImageIcon, FileText } from "lucide-react"

interface DesktopIcon {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  category: "app" | "folder" | "file"
  action: () => void
  position: { x: number; y: number }
  size: "small" | "medium" | "large"
}

interface WindowsDesktopProps {
  onAppLaunch: (appId: string) => void
}

export function WindowsDesktop({ onAppLaunch }: WindowsDesktopProps) {
  const desktopIcons = useMemo<DesktopIcon[]>(
    () => [
      {
        id: "browser",
        name: "Navegador Web",
        icon: Globe,
        color: "bg-blue-500",
        category: "app",
        action: () => onAppLaunch("browser"),
        position: { x: 50, y: 50 },
        size: "large",
      },
      {
        id: "ai-assistant",
        name: "Asistente IA",
        icon: Bot,
        color: "bg-purple-500",
        category: "app",
        action: () => onAppLaunch("ai"),
        position: { x: 50, y: 180 },
        size: "large",
      },
      {
        id: "finance",
        name: "Finanzas",
        icon: Calculator,
        color: "bg-green-500",
        category: "app",
        action: () => onAppLaunch("finance"),
        position: { x: 50, y: 310 },
        size: "large",
      },
      {
        id: "music",
        name: "Música",
        icon: Music,
        color: "bg-pink-500",
        category: "app",
        action: () => onAppLaunch("music"),
        position: { x: 180, y: 50 },
        size: "large",
      },
      {
        id: "documents",
        name: "Documentos",
        icon: Folder,
        color: "bg-yellow-500",
        category: "folder",
        action: () => onAppLaunch("documents"),
        position: { x: 180, y: 180 },
        size: "large",
      },
      {
        id: "settings",
        name: "Configuración",
        icon: Settings,
        color: "bg-gray-500",
        category: "app",
        action: () => onAppLaunch("settings"),
        position: { x: 180, y: 310 },
        size: "large",
      },
      {
        id: "gallery",
        name: "Galería",
        icon: ImageIcon,
        color: "bg-indigo-500",
        category: "app",
        action: () => onAppLaunch("gallery"),
        position: { x: 310, y: 50 },
        size: "large",
      },
      {
        id: "notes",
        name: "Notas",
        icon: FileText,
        color: "bg-orange-500",
        category: "app",
        action: () => onAppLaunch("notes"),
        position: { x: 310, y: 180 },
        size: "large",
      },
    ],
    [onAppLaunch],
  )

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Desktop Icons */}
      {desktopIcons.map((icon) => {
        const IconComponent = icon.icon
        return (
          <button
            key={icon.id}
            onClick={icon.action}
            className="absolute group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            style={{
              left: icon.position.x,
              top: icon.position.y,
              width: icon.size === "large" ? 80 : icon.size === "medium" ? 64 : 48,
              height: icon.size === "large" ? 80 : icon.size === "medium" ? 64 : 48,
            }}
          >
            <div className={`${icon.color} p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1 text-center font-medium drop-shadow-lg">{icon.name}</span>
          </button>
        )
      })}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/50 backdrop-blur-sm border-t border-white/20">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/20 rounded transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-white text-sm">
            <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
