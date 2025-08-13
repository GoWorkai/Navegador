"use client"

import { useState } from "react"
import { Globe, Plus, X, ArrowLeft, ArrowRight, RotateCcw, Home, Star, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProfile } from "@/components/profile-provider"

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
  isLoading: boolean
}

export function BrowserWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Speed Dial",
      url: "aria://speed-dial",
      isActive: true,
      isLoading: false,
    },
  ])
  const [addressBar, setAddressBar] = useState("aria://speed-dial")

  const speedDialSites = [
    { name: "YouTube", url: "https://youtube.com", color: "bg-red-500", icon: "📺" },
    { name: "Gmail", url: "https://gmail.com", color: "bg-blue-500", icon: "📧" },
    { name: "WhatsApp", url: "https://web.whatsapp.com", color: "bg-green-500", icon: "💬" },
    { name: "Spotify", url: "https://spotify.com", color: "bg-green-600", icon: "🎵" },
    { name: "Netflix", url: "https://netflix.com", color: "bg-red-600", icon: "🎬" },
    { name: "GitHub", url: "https://github.com", color: "bg-gray-800", icon: "👨‍💻" },
    { name: "Twitter", url: "https://twitter.com", color: "bg-blue-400", icon: "🐦" },
    { name: "Instagram", url: "https://instagram.com", color: "bg-pink-500", icon: "📸" },
  ]

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "Nueva pestaña",
      url: "aria://speed-dial",
      isActive: true,
      isLoading: false,
    }
    setTabs((prev) => prev.map((tab) => ({ ...tab, isActive: false })).concat(newTab))
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return
    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== tabId)
      if (prev.find((tab) => tab.id === tabId)?.isActive && filtered.length > 0) {
        filtered[0].isActive = true
      }
      return filtered
    })
  }

  const switchTab = (tabId: string) => {
    setTabs((prev) => prev.map((tab) => ({ ...tab, isActive: tab.id === tabId })))
  }

  const navigate = (url: string) => {
    if (!hasPermission("nav.browse")) {
      alert("No tienes permisos para navegar")
      return
    }
    setAddressBar(url)
    setTabs((prev) => prev.map((tab) => (tab.isActive ? { ...tab, url, isLoading: true, title: "Cargando..." } : tab)))
    // Simular carga
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((tab) => (tab.isActive ? { ...tab, isLoading: false, title: new URL(url).hostname } : tab)),
      )
    }, 1000)
  }

  const activeTab = tabs.find((tab) => tab.isActive)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Barra de pestañas */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-xs px-3 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer ${
                tab.isActive ? "bg-white dark:bg-gray-900" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate text-sm">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 p-0 h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addTab} className="p-2">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Barra de navegación */}
      <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1 mr-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && navigate(addressBar)}
              className="pr-8"
              placeholder="Buscar o escribir URL"
            />
            <Shield className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
          </div>
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-auto">
        {activeTab?.url === "aria://speed-dial" ? (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6 text-center">Speed Dial</h1>
              <div className="grid grid-cols-4 gap-6">
                {speedDialSites.map((site) => (
                  <button
                    key={site.name}
                    onClick={() => navigate(site.url)}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className={`w-16 h-16 ${site.color} rounded-lg flex items-center justify-center text-2xl mb-2`}
                    >
                      {site.icon}
                    </div>
                    <span className="text-sm font-medium">{site.name}</span>
                  </button>
                ))}
              </div>

              {currentProfile?.role === "admin" && (
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">IA Navegación Inteligente</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sugerencias personalizadas basadas en tu historial y preferencias.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Navegando a {activeTab?.url}</p>
              {activeTab?.isLoading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
