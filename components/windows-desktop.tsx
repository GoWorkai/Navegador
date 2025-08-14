"use client"

import React from "react"
import { useMemo, useState } from "react"
import {
  Globe,
  Bot,
  Calculator,
  Music,
  Folder,
  Settings,
  ImageIcon,
  FileText,
  Search,
  Sparkles,
  Wifi,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DesktopIcon {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  category: "app" | "folder" | "file"
  action: () => void
  size: "small" | "medium" | "large"
}

interface WindowsDesktopProps {
  onAppLaunch: (appId: string) => void
}

export function WindowsDesktop({ onAppLaunch }: WindowsDesktopProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const desktopIcons = useMemo<DesktopIcon[]>(
    () => [
      {
        id: "browser",
        name: "Navegador Web",
        icon: Globe,
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        category: "app",
        action: () => onAppLaunch("browser"),
        size: "large",
      },
      {
        id: "ai-assistant",
        name: "Asistente IA",
        icon: Bot,
        color: "bg-gradient-to-br from-purple-500 to-purple-600",
        category: "app",
        action: () => onAppLaunch("ai"),
        size: "large",
      },
      {
        id: "finance",
        name: "Finanzas",
        icon: Calculator,
        color: "bg-gradient-to-br from-green-500 to-green-600",
        category: "app",
        action: () => onAppLaunch("finance"),
        size: "large",
      },
      {
        id: "music",
        name: "Música",
        icon: Music,
        color: "bg-gradient-to-br from-pink-500 to-pink-600",
        category: "app",
        action: () => onAppLaunch("music"),
        size: "large",
      },
      {
        id: "documents",
        name: "Documentos",
        icon: Folder,
        color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
        category: "folder",
        action: () => onAppLaunch("documents"),
        size: "large",
      },
      {
        id: "settings",
        name: "Configuración",
        icon: Settings,
        color: "bg-gradient-to-br from-gray-500 to-gray-600",
        category: "app",
        action: () => onAppLaunch("settings"),
        size: "large",
      },
      {
        id: "gallery",
        name: "Galería",
        icon: ImageIcon,
        color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        category: "app",
        action: () => onAppLaunch("gallery"),
        size: "large",
      },
      {
        id: "notes",
        name: "Notas",
        icon: FileText,
        color: "bg-gradient-to-br from-orange-500 to-orange-600",
        category: "app",
        action: () => onAppLaunch("notes"),
        size: "large",
      },
    ],
    [onAppLaunch],
  )

  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []

    return [
      {
        type: "search",
        query: `Buscar "${searchQuery}" en Google`,
        icon: Search,
        action: () => handleSearch(searchQuery, "google"),
      },
      {
        type: "ai",
        query: `Buscar "${searchQuery}" con IA`,
        icon: Sparkles,
        action: () => handleSearch(searchQuery, "ai"),
      },
      {
        type: "direct",
        query: `Ir a ${searchQuery}`,
        icon: Globe,
        action: () => handleSearch(searchQuery, "direct"),
      },
    ]
  }, [searchQuery])

  const handleSearch = (query: string, type: "google" | "ai" | "direct") => {
    if (!query.trim()) return

    console.log("Iniciando búsqueda:", { query, type })

    // Open browser first
    onAppLaunch("browser")

    // Send search query to browser via custom event with delay
    setTimeout(() => {
      const searchEvent = new CustomEvent("desktopSearch", {
        detail: { query, type },
      })
      console.log("Enviando evento desktopSearch:", searchEvent.detail)
      window.dispatchEvent(searchEvent)
    }, 500)

    // Clear search and hide suggestions
    setSearchQuery("")
    setShowSearchSuggestions(false)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery, "google")
    }
  }

  const iconGrid = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col
      if (index < desktopIcons.length) {
        iconGrid.push({
          ...desktopIcons[index],
          gridPosition: { row, col },
        })
      }
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, white 2px, transparent 2px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="flex items-center bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden min-w-[600px]">
            <Search className="w-6 h-6 text-gray-500 ml-6" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchSuggestions(e.target.value.length > 0)
              }}
              onKeyPress={handleSearchKeyPress}
              onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              placeholder="Buscar en la web, preguntar a la IA o navegar..."
              className="border-0 bg-transparent text-lg px-6 py-5 focus:ring-0 focus:outline-none placeholder:text-gray-500 flex-1"
            />
            <Button
              onClick={() => handleSearch(searchQuery, "ai")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl m-3 px-8 py-3 font-medium"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              IA
            </Button>
          </div>

          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
              {searchSuggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon
                return (
                  <button
                    key={index}
                    onClick={suggestion.action}
                    className="w-full px-6 py-4 text-left hover:bg-white/60 transition-colors flex items-center space-x-4"
                  >
                    <div
                      className={`p-3 rounded-xl ${
                        suggestion.type === "ai"
                          ? "bg-purple-100 text-purple-600"
                          : suggestion.type === "search"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700 font-medium text-lg">{suggestion.query}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-20 left-8 grid grid-cols-3 gap-8">
        {iconGrid.map((icon) => {
          const IconComponent = icon.icon
          return (
            <button
              key={icon.id}
              onClick={icon.action}
              className="group flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              style={{
                width: 100,
                height: 100,
              }}
            >
              <div
                className={`${icon.color} p-4 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-sm mt-2 text-center font-medium drop-shadow-lg group-hover:text-white/90">
                {icon.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-t border-white/20">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <button className="p-3 hover:bg-white/20 rounded-xl transition-colors group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAppLaunch("browser")}
                className="text-white hover:bg-white/20 p-2"
              >
                <Globe className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAppLaunch("ai")}
                className="text-white hover:bg-white/20 p-2"
              >
                <Bot className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAppLaunch("finance")}
                className="text-white hover:bg-white/20 p-2"
              >
                <Calculator className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-white">
            <div className="flex items-center space-x-2 text-sm">
              <Wifi className="w-4 h-4" />
              <span>Conectado</span>
            </div>
            <div className="flex flex-col items-end text-sm">
              <span className="font-medium">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="text-xs text-white/70">
                {currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindowsDesktop
