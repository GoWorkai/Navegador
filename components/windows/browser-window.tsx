"use client"

import { useState, useEffect } from "react"
import {
  Globe,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Star,
  Shield,
  Zap,
  Search,
  Download,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Filter,
  Sparkles,
  Brain,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/components/profile-provider"

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
  isLoading: boolean
  isPrivate: boolean
  blockedAds: number
  blockedTrackers: number
}

interface Bookmark {
  id: string
  title: string
  url: string
  favicon?: string
  folder?: string
  tags: string[]
}

interface HistoryItem {
  id: string
  title: string
  url: string
  visitTime: Date
  visitCount: number
}

interface AISearchSuggestion {
  query: string
  type: "search" | "navigate" | "action"
  confidence: number
  description: string
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
      isPrivate: false,
      blockedAds: 0,
      blockedTrackers: 0,
    },
  ])
  const [addressBar, setAddressBar] = useState("aria://speed-dial")
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<AISearchSuggestion[]>([])
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [adBlockEnabled, setAdBlockEnabled] = useState(true)
  const [trackerBlockEnabled, setTrackerBlockEnabled] = useState(true)

  const [bookmarks] = useState<Bookmark[]>([
    { id: "1", title: "GitHub", url: "https://github.com", tags: ["desarrollo", "código"], folder: "Trabajo" },
    { id: "2", title: "YouTube", url: "https://youtube.com", tags: ["entretenimiento", "videos"] },
    { id: "3", title: "Gmail", url: "https://gmail.com", tags: ["email", "comunicación"], folder: "Productividad" },
  ])

  const [history] = useState<HistoryItem[]>([
    { id: "1", title: "GitHub", url: "https://github.com", visitTime: new Date(), visitCount: 15 },
    {
      id: "2",
      title: "Stack Overflow",
      url: "https://stackoverflow.com",
      visitTime: new Date(Date.now() - 3600000),
      visitCount: 8,
    },
    {
      id: "3",
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      visitTime: new Date(Date.now() - 7200000),
      visitCount: 12,
    },
  ])

  const speedDialSites = [
    { name: "YouTube", url: "https://youtube.com", color: "bg-red-500", icon: "📺", category: "Entretenimiento" },
    { name: "Gmail", url: "https://gmail.com", color: "bg-blue-500", icon: "📧", category: "Productividad" },
    { name: "WhatsApp", url: "https://web.whatsapp.com", color: "bg-green-500", icon: "💬", category: "Comunicación" },
    { name: "Spotify", url: "https://spotify.com", color: "bg-green-600", icon: "🎵", category: "Entretenimiento" },
    { name: "Netflix", url: "https://netflix.com", color: "bg-red-600", icon: "🎬", category: "Entretenimiento" },
    { name: "GitHub", url: "https://github.com", color: "bg-gray-800", icon: "👨‍💻", category: "Desarrollo" },
    { name: "Twitter", url: "https://twitter.com", color: "bg-blue-400", icon: "🐦", category: "Social" },
    { name: "Instagram", url: "https://instagram.com", color: "bg-pink-500", icon: "📸", category: "Social" },
  ]

  useEffect(() => {
    if (addressBar && addressBar.length > 2) {
      const suggestions: AISearchSuggestion[] = [
        {
          query: `Buscar "${addressBar}" con IA`,
          type: "search",
          confidence: 0.9,
          description: "Búsqueda inteligente con resultados personalizados",
        },
        {
          query: `Navegar a ${addressBar}`,
          type: "navigate",
          confidence: 0.7,
          description: "Ir directamente al sitio web",
        },
        {
          query: `Analizar "${addressBar}" con IA`,
          type: "action",
          confidence: 0.8,
          description: "Obtener resumen y análisis del contenido",
        },
      ]
      setAiSuggestions(suggestions)
    } else {
      setAiSuggestions([])
    }
  }, [addressBar])

  useEffect(() => {
    const handleDesktopSearch = (event: CustomEvent) => {
      const { query, type } = event.detail

      let searchUrl = ""
      switch (type) {
        case "google":
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
          break
        case "ai":
          searchUrl = `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`
          break
        case "direct":
          searchUrl = query.startsWith("http") ? query : `https://${query}`
          break
        default:
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
      }

      navigate(searchUrl, type === "ai")
    }

    window.addEventListener("desktopSearch", handleDesktopSearch as EventListener)
    return () => window.removeEventListener("desktopSearch", handleDesktopSearch as EventListener)
  }, [])

  const addTab = (isPrivate = false) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: isPrivate ? "Nueva pestaña privada" : "Nueva pestaña",
      url: "aria://speed-dial",
      isActive: true,
      isLoading: false,
      isPrivate,
      blockedAds: 0,
      blockedTrackers: 0,
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
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      setAddressBar(tab.url)
    }
  }

  const navigate = (url: string, useAI = false) => {
    if (!hasPermission("nav.browse")) {
      alert("No tienes permisos para navegar")
      return
    }

    setAddressBar(url)
    setTabs((prev) =>
      prev.map((tab) =>
        tab.isActive
          ? {
              ...tab,
              url,
              isLoading: true,
              title: useAI ? "🤖 Búsqueda IA..." : "Cargando...",
              blockedAds: tab.blockedAds + (adBlockEnabled ? Math.floor(Math.random() * 5) : 0),
              blockedTrackers: tab.blockedTrackers + (trackerBlockEnabled ? Math.floor(Math.random() * 3) : 0),
            }
          : tab,
      ),
    )

    setTimeout(
      () => {
        let displayTitle = "Página desconocida"

        try {
          if (url.startsWith("http://") || url.startsWith("https://")) {
            const urlObj = new URL(url)

            if (urlObj.hostname.includes("google.com") && urlObj.searchParams.get("q")) {
              displayTitle = `Google: ${urlObj.searchParams.get("q")}`
            } else if (urlObj.hostname.includes("perplexity.ai") && urlObj.searchParams.get("q")) {
              displayTitle = `🤖 Perplexity: ${urlObj.searchParams.get("q")}`
            } else {
              displayTitle = urlObj.hostname
            }
          } else if (url.startsWith("aria://")) {
            displayTitle = url.replace("aria://", "").replace("-", " ")
            displayTitle = displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1)
          } else {
            displayTitle = url.length > 30 ? url.substring(0, 30) + "..." : url
          }
        } catch (error) {
          displayTitle = url.length > 30 ? url.substring(0, 30) + "..." : url
        }

        setTabs((prev) =>
          prev.map((tab) =>
            tab.isActive
              ? {
                  ...tab,
                  isLoading: false,
                  title: useAI ? `🤖 ${displayTitle}` : displayTitle,
                }
              : tab,
          ),
        )
      },
      useAI ? 2000 : 1000,
    )
  }

  const activeTab = tabs.find((tab) => tab.isActive)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-xs px-3 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer ${
                tab.isActive ? "bg-white dark:bg-gray-900" : "hover:bg-gray-50 dark:hover:bg-gray-700"
              } ${tab.isPrivate ? "bg-purple-50 dark:bg-purple-900/20" : ""}`}
              onClick={() => switchTab(tab.id)}
            >
              {tab.isPrivate ? (
                <Lock className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" />
              ) : (
                <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="truncate text-sm">{tab.title}</span>
              {(tab.blockedAds > 0 || tab.blockedTrackers > 0) && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.blockedAds + tab.blockedTrackers}
                </Badge>
              )}
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
        <div className="flex items-center space-x-1 px-2">
          <Button variant="ghost" size="sm" onClick={() => addTab(false)} className="p-2">
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addTab(true)} className="p-2" title="Nueva pestaña privada">
            <Lock className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  let searchUrl = addressBar
                  if (!addressBar.startsWith("http") && !addressBar.startsWith("aria://")) {
                    searchUrl = `https://www.google.com/search?q=${encodeURIComponent(addressBar)}`
                  }
                  navigate(searchUrl)
                }
              }}
              className="pr-20"
              placeholder="Buscar con IA o escribir URL"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {adBlockEnabled && <Shield className="w-4 h-4 text-green-500" title="Bloqueador de anuncios activo" />}
              {trackerBlockEnabled && <Eye className="w-4 h-4 text-blue-500" title="Protección de rastreo activa" />}
              {activeTab?.isPrivate && <Lock className="w-4 h-4 text-purple-500" title="Modo privado" />}
            </div>

            {aiSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md shadow-lg z-10">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(addressBar, suggestion.type === "search")}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    {suggestion.type === "search" && <Brain className="w-4 h-4 text-blue-500" />}
                    {suggestion.type === "navigate" && <Globe className="w-4 h-4 text-green-500" />}
                    {suggestion.type === "action" && <Sparkles className="w-4 h-4 text-purple-500" />}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{suggestion.query}</div>
                      <div className="text-xs text-gray-500">{suggestion.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowAIAssistant(!showAIAssistant)}>
            <Brain className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowBookmarks(!showBookmarks)}>
            <Star className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <Clock className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {(showBookmarks || showHistory || showAIAssistant) && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
            <Tabs defaultValue={showAIAssistant ? "ai" : showBookmarks ? "bookmarks" : "history"} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai" onClick={() => setShowAIAssistant(true)}>
                  <Brain className="w-4 h-4 mr-1" />
                  IA
                </TabsTrigger>
                <TabsTrigger value="bookmarks" onClick={() => setShowBookmarks(true)}>
                  <Star className="w-4 h-4 mr-1" />
                  Favoritos
                </TabsTrigger>
                <TabsTrigger value="history" onClick={() => setShowHistory(true)}>
                  <Clock className="w-4 h-4 mr-1" />
                  Historial
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Asistente IA
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Análisis de Página</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Obtén resúmenes automáticos y análisis de contenido
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Search className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Búsqueda Inteligente</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Resultados personalizados basados en tu contexto
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookmarks" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Favoritos</h3>
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <button
                        key={bookmark.id}
                        onClick={() => navigate(bookmark.url)}
                        className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <div className="font-medium text-sm">{bookmark.title}</div>
                        <div className="text-xs text-gray-500 truncate">{bookmark.url}</div>
                        {bookmark.folder && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {bookmark.folder}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="p-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Historial</h3>
                  <div className="space-y-2">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.url)}
                        className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate">{item.url}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.visitCount} visitas • {item.visitTime.toLocaleTimeString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {activeTab?.url === "aria://speed-dial" ? (
            <div className="p-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Speed Dial</h1>
                  <div className="flex items-center space-x-4">
                    {activeTab.blockedAds > 0 && (
                      <Badge variant="outline" className="text-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        {activeTab.blockedAds} anuncios bloqueados
                      </Badge>
                    )}
                    {activeTab.blockedTrackers > 0 && (
                      <Badge variant="outline" className="text-blue-600">
                        <Eye className="w-3 h-3 mr-1" />
                        {activeTab.blockedTrackers} rastreadores bloqueados
                      </Badge>
                    )}
                  </div>
                </div>

                {["Productividad", "Entretenimiento", "Desarrollo", "Social", "Comunicación"].map((category) => {
                  const sitesInCategory = speedDialSites.filter((site) => site.category === category)
                  if (sitesInCategory.length === 0) return null

                  return (
                    <div key={category} className="mb-8">
                      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">{category}</h2>
                      <div className="grid grid-cols-4 gap-6">
                        {sitesInCategory.map((site) => (
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
                    </div>
                  )
                })}

                {currentProfile?.role === "admin" && (
                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold">IA Navegación Inteligente</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Sugerencias personalizadas basadas en tu historial y preferencias.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Filter className="w-4 h-4 text-green-500" />
                        <span>Bloqueador de anuncios: {adBlockEnabled ? "Activo" : "Inactivo"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <EyeOff className="w-4 h-4 text-blue-500" />
                        <span>Anti-rastreo: {trackerBlockEnabled ? "Activo" : "Inactivo"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  {activeTab?.url?.includes("google.com/search")
                    ? "Resultados de búsqueda de Google"
                    : activeTab?.url?.includes("perplexity.ai")
                      ? "🤖 Búsqueda con IA - Perplexity"
                      : `Navegando a ${activeTab?.url}`}
                </p>
                {activeTab?.isLoading && (
                  <div className="mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-400 mt-2">
                      {activeTab.title.includes("🤖") ? "Procesando con IA..." : "Cargando..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
