"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Globe,
  Bot,
  Calculator,
  Music,
  FileText,
  Settings,
  ImageIcon,
  StickyNote,
  Search,
  User,
  BookOpen,
  Video,
  Newspaper,
  MapPin,
  ShoppingCart,
  Zap,
} from "lucide-react"

interface Tab {
  id: string
  title: string
  url: string
  isLoading: boolean
  favicon?: string
  history: string[]
  historyIndex: number
}

interface BookmarkItem {
  id: string
  title: string
  url: string
  favicon?: string
  dateAdded: Date
}

export default function NavegadorIntegralIA() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>({})
  const [aiResponse, setAiResponse] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)
  const [showSearchMenu, setShowSearchMenu] = useState(false)
  const [activeSearchTab, setActiveSearchTab] = useState("todo")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showBookmarks, setShowBookmarks] = useState(false)

  const [urlSuggestions, setUrlSuggestions] = useState<string[]>([])
  const [showUrlSuggestions, setShowUrlSuggestions] = useState(false)

  // Popular websites for autocomplete
  const popularSites = [
    "google.com",
    "youtube.com",
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "linkedin.com",
    "github.com",
    "stackoverflow.com",
    "wikipedia.org",
    "amazon.com",
    "netflix.com",
    "reddit.com",
  ]

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Nueva pestaña",
      url: "",
      isLoading: false,
      favicon: "🌐",
      history: [],
      historyIndex: -1,
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: "1",
      title: "Google",
      url: "https://www.google.com",
      favicon: "🔍",
      dateAdded: new Date(),
    },
    {
      id: "2",
      title: "YouTube",
      url: "https://www.youtube.com",
      favicon: "📺",
      dateAdded: new Date(),
    },
    {
      id: "3",
      title: "GitHub",
      url: "https://github.com",
      favicon: "💻",
      dateAdded: new Date(),
    },
  ])

  const desktopApps = [
    {
      id: "navegador",
      name: "Navegador Web",
      icon: Globe,
      color: "from-blue-500 to-blue-600",
      description: "Navegación web avanzada",
    },
    {
      id: "asistente",
      name: "Asistente IA",
      icon: Bot,
      color: "from-purple-500 to-purple-600",
      description: "Inteligencia artificial personal",
    },
    {
      id: "finanzas",
      name: "Finanzas",
      icon: Calculator,
      color: "from-green-500 to-green-600",
      description: "Gestión financiera personal",
    },
    {
      id: "musica",
      name: "Música",
      icon: Music,
      color: "from-pink-500 to-pink-600",
      description: "Reproductor de música",
    },
    {
      id: "documentos",
      name: "Documentos",
      icon: FileText,
      color: "from-orange-500 to-orange-600",
      description: "Editor de documentos",
    },
    {
      id: "configuracion",
      name: "Configuración",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
      description: "Configuración del sistema",
    },
    {
      id: "galeria",
      name: "Galería",
      icon: ImageIcon,
      color: "from-indigo-500 to-indigo-600",
      description: "Galería de imágenes",
    },
    {
      id: "notas",
      name: "Notas",
      icon: StickyNote,
      color: "from-red-500 to-red-600",
      description: "Bloc de notas",
    },
  ]

  const searchCategories = [
    { id: "todo", name: "Todo", icon: Search, color: "purple" },
    { id: "web", name: "Web", icon: Globe, color: "blue" },
    { id: "imagenes", name: "Imágenes", icon: ImageIcon, color: "green" },
    { id: "videos", name: "Videos", icon: Video, color: "red" },
    { id: "noticias", name: "Noticias", icon: Newspaper, color: "orange" },
    { id: "academico", name: "Académico", icon: BookOpen, color: "indigo" },
    { id: "compras", name: "Compras", icon: ShoppingCart, color: "pink" },
    { id: "mapas", name: "Mapas", icon: MapPin, color: "teal" },
    { id: "social", name: "Social", icon: User, color: "cyan" },
    { id: "herramientas", name: "Herramientas", icon: Zap, color: "yellow" },
  ]

  const quickSearches = [
    "¿Qué es la inteligencia artificial?",
    "Noticias de tecnología hoy",
    "Recetas de cocina fáciles",
    "Ejercicios en casa para principiantes",
    "Cursos online gratis 2024",
    "Películas más vistas 2024",
    "Clima de hoy",
    "Convertir monedas",
    "Traductor español inglés",
    "Calculadora científica",
    "Música relajante",
    "Tutoriales de programación",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "Nueva pestaña",
      url: "",
      isLoading: false,
      favicon: "🌐",
      history: [],
      historyIndex: -1,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return

    setTabs((prev) => prev.filter((tab) => tab.id !== tabId))

    if (activeTabId === tabId) {
      const currentIndex = tabs.findIndex((tab) => tab.id === tabId)
      const newActiveTab = tabs[currentIndex - 1] || tabs[currentIndex + 1]
      setActiveTabId(newActiveTab.id)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string.startsWith("http") ? string : `https://${string}`)
      return string.includes(".") && !string.includes(" ")
    } catch {
      return false
    }
  }

  const getEnhancedPageTitle = (url: string) => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.replace("www.", "")

      // Enhanced titles for popular sites
      const siteNames: { [key: string]: string } = {
        "google.com": "Google",
        "youtube.com": "YouTube",
        "facebook.com": "Facebook",
        "twitter.com": "Twitter",
        "instagram.com": "Instagram",
        "linkedin.com": "LinkedIn",
        "github.com": "GitHub",
        "stackoverflow.com": "Stack Overflow",
        "wikipedia.org": "Wikipedia",
        "amazon.com": "Amazon",
        "netflix.com": "Netflix",
        "reddit.com": "Reddit",
      }

      return siteNames[hostname] || hostname.charAt(0).toUpperCase() + hostname.slice(1)
    } catch {
      return "Nueva pestaña"
    }
  }

  const getUrlSuggestions = (input: string) => {
    if (!input.trim()) return []

    const suggestions = []

    // Add matching popular sites
    const matchingSites = popularSites.filter((site) => site.toLowerCase().includes(input.toLowerCase())).slice(0, 5)

    suggestions.push(...matchingSites)

    // Add matching bookmarks
    const matchingBookmarks = bookmarks
      .filter(
        (bookmark) =>
          bookmark.url.toLowerCase().includes(input.toLowerCase()) ||
          bookmark.title.toLowerCase().includes(input.toLowerCase()),
      )
      .map((bookmark) => bookmark.url.replace("https://", "").replace("http://", ""))
      .slice(0, 3)

    suggestions.push(...matchingBookmarks)

    // Add matching search history
    const matchingHistory = searchHistory
      .filter((item) => item.toLowerCase().includes(input.toLowerCase()) && isValidUrl(item))
      .slice(0, 2)

    suggestions.push(...matchingHistory)

    return [...new Set(suggestions)].slice(0, 8)
  }

  const updateTabUrl = (tabId: string, url: string, addToHistory = true) => {
    if (!url.trim()) return

    const fullUrl = url.startsWith("http") ? url : `https://${url}`

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === tabId) {
          let newHistory = [...tab.history]
          let newHistoryIndex = tab.historyIndex

          if (addToHistory) {
            if (tab.historyIndex < tab.history.length - 1) {
              newHistory = tab.history.slice(0, tab.historyIndex + 1)
            }
            newHistory.push(fullUrl)
            newHistoryIndex = newHistory.length - 1
          }

          return {
            ...tab,
            url: fullUrl,
            title: getEnhancedPageTitle(fullUrl),
            isLoading: true,
            history: newHistory,
            historyIndex: newHistoryIndex,
          }
        }
        return tab
      }),
    )

    setTimeout(() => {
      setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, isLoading: false } : tab)))
    }, 2000)
  }

  const getPageTitle = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return "Nueva pestaña"
    }
  }

  const getCurrentTab = () => {
    return tabs.find((tab) => tab.id === activeTabId) || tabs[0]
  }

  const addBookmark = (url: string, title: string) => {
    if (!url) return

    const existingBookmark = bookmarks.find((bookmark) => bookmark.url === url)
    if (existingBookmark) return

    const newBookmark: BookmarkItem = {
      id: Date.now().toString(),
      title: title || getPageTitle(url),
      url,
      favicon: "⭐",
      dateAdded: new Date(),
    }

    setBookmarks((prev) => [newBookmark, ...prev])
  }

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
  }

  const isBookmarked = (url: string) => {
    return bookmarks.some((bookmark) => bookmark.url === url)
  }

  const toggleBookmark = () => {
    const currentTab = getCurrentTab()
    if (!currentTab.url) return

    if (isBookmarked(currentTab.url)) {
      const bookmark = bookmarks.find((b) => b.url === currentTab.url)
      if (bookmark) {
        removeBookmark(bookmark.id)
      }
    } else {
      addBookmark(currentTab.url, currentTab.title)
    }
  }

  const goBack = () => {
    const currentTab = getCurrentTab()
    if (currentTab.historyIndex > 0) {
      const newIndex = currentTab.historyIndex - 1
      const url = currentTab.history[newIndex]

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                url,
                title: getPageTitle(url),
                isLoading: true,
                historyIndex: newIndex,
              }
            : tab,
        ),
      )

      setTimeout(() => {
        setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? { ...tab, isLoading: false } : tab)))
      }, 1500)
    }
  }

  const goForward = () => {
    const currentTab = getCurrentTab()
    if (currentTab.historyIndex < currentTab.history.length - 1) {
      const newIndex = currentTab.historyIndex + 1
      const url = currentTab.history[newIndex]

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                url,
                title: getPageTitle(url),
                isLoading: true,
                historyIndex: newIndex,
              }
            : tab,
        ),
      )

      setTimeout(() => {
        setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? { ...tab, isLoading: false } : tab)))
      }, 1500)
    }
  }

  const reloadPage = () => {
    const currentTab = getCurrentTab()
    if (currentTab.url) {
      setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? { ...tab, isLoading: true } : tab)))

      setTimeout(() => {
        setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? { ...tab, isLoading: false } : tab)))
      }, 2000)
    }
  }

  const canGoBack = () => {
    const currentTab = getCurrentTab()
    return currentTab.historyIndex > 0
  }

  const canGoForward = () => {
    const currentTab = getCurrentTab()
    return currentTab.historyIndex < currentTab.history.length - 1
  }

  const handleSearch = async (query: string, category = "todo") => {
    if (!query.trim()) return

    setIsSearching(true)
    setSearchResults({})
    setAiResponse("")
    setShowSearchMenu(true)
    setShowUrlSuggestions(false)

    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev.slice(0, 9)])
    }

    try {
      if (isValidUrl(query)) {
        const url = query.startsWith("http") ? query : `https://${query}`
        updateTabUrl(activeTabId, url)
        setShowBrowser(true)
        setShowSearchMenu(false)
        return
      }

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: `Responde de manera concisa y útil: ${query}` }],
          }),
        })

        const data = await response.json()

        if (response.ok) {
          const aiResponseText = data.choices?.[0]?.message?.content || "No se pudo obtener respuesta"
          setAiResponse(aiResponseText)
        } else {
          // Manejar errores de la API con fallback
          if (data.fallback) {
            if (data.error?.includes("GEMINI_API_KEY")) {
              setAiResponse(
                "🔧 **Configuración requerida**: La clave de API de Gemini no está configurada. " +
                  "Para habilitar las respuestas de IA, configura la variable de entorno GEMINI_API_KEY en tu proyecto. " +
                  "Mientras tanto, puedes usar las funciones de búsqueda web normalmente.",
              )
            } else {
              setAiResponse(
                `⚠️ **Servicio temporalmente no disponible**: ${data.error || "Error en el servicio de IA"}. ` +
                  "Las funciones de búsqueda web siguen funcionando normalmente.",
              )
            }
          } else {
            // Solo lanzar error si no hay fallback disponible
            console.error("Error de API sin fallback:", data.error)
            setAiResponse(
              "❌ **Error del servicio**: No se pudo procesar la solicitud. " +
                "Las funciones de búsqueda web están disponibles.",
            )
          }
        }
      } catch (apiError) {
        console.error("Error al conectar con la API de Gemini:", apiError)
        setAiResponse(
          "🌐 **Modo sin conexión a IA**: No se pudo conectar con el asistente de IA. " +
            "Las funciones de búsqueda web están disponibles. Verifica tu conexión a internet.",
        )
      }

      const results: any = {}

      if (category === "todo" || category === "web") {
        results.web = [
          {
            title: `${query} - Wikipedia`,
            url: `https://es.wikipedia.org/wiki/${encodeURIComponent(query)}`,
            description: `Información completa sobre ${query} en Wikipedia`,
            favicon: "📖",
            type: "encyclopedia",
          },
          {
            title: `${query} - Google`,
            url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            description: `Resultados de búsqueda para ${query}`,
            favicon: "🔍",
            type: "search",
          },
          {
            title: `${query} - DuckDuckGo`,
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            description: `Búsqueda privada para ${query}`,
            favicon: "🦆",
            type: "private",
          },
          {
            title: `${query} - Bing`,
            url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            description: `Resultados de Bing para ${query}`,
            favicon: "🅱️",
            type: "search",
          },
        ]
      }

      if (category === "todo" || category === "imagenes") {
        results.imagenes = [
          {
            title: `Imágenes de ${query}`,
            url: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
            description: `Galería de imágenes relacionadas con ${query}`,
            thumbnail: "/placeholder.svg?height=100&width=100&query=" + encodeURIComponent(query),
            type: "gallery",
          },
          {
            title: `${query} - Unsplash`,
            url: `https://unsplash.com/s/photos/${encodeURIComponent(query)}`,
            description: `Fotos profesionales de ${query}`,
            thumbnail: "/placeholder.svg?height=100&width=150&query=" + encodeURIComponent(query + " professional"),
            type: "professional",
          },
        ]
      }

      if (category === "todo" || category === "videos") {
        results.videos = [
          {
            title: `${query} - YouTube`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
            description: `Videos sobre ${query}`,
            thumbnail: "/placeholder.svg?height=100&width=150&query=" + encodeURIComponent(query + " video"),
            duration: "Varios",
            type: "video",
          },
          {
            title: `${query} - Vimeo`,
            url: `https://vimeo.com/search?q=${encodeURIComponent(query)}`,
            description: `Videos profesionales de ${query}`,
            thumbnail:
              "/placeholder.svg?height=100&width=150&query=" + encodeURIComponent(query + " professional video"),
            duration: "HD",
            type: "professional",
          },
        ]
      }

      if (category === "todo" || category === "noticias") {
        results.noticias = [
          {
            title: `Noticias sobre ${query}`,
            url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
            description: `Últimas noticias sobre ${query}`,
            favicon: "📰",
            type: "news",
            time: "Hace 2 horas",
          },
        ]
      }

      if (category === "todo" || category === "academico") {
        results.academico = [
          {
            title: `${query} - Google Scholar`,
            url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
            description: `Artículos académicos sobre ${query}`,
            favicon: "🎓",
            type: "academic",
          },
        ]
      }

      if (category === "todo" || category === "compras") {
        results.compras = [
          {
            title: `Comprar ${query}`,
            url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
            description: `Productos relacionados con ${query}`,
            favicon: "🛒",
            type: "shopping",
            price: "Desde $XX",
          },
        ]
      }

      if (category === "todo" || category === "mapas") {
        results.mapas = [
          {
            title: `${query} en Google Maps`,
            url: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
            description: `Ubicaciones de ${query}`,
            favicon: "🗺️",
            type: "location",
          },
        ]
      }

      setSearchResults(results)
    } catch (error) {
      console.error("Error en búsqueda:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) return

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = "es-ES"
    recognition.continuous = false

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognition.start()

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        handleSearch(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
    }
  }

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen)
  }

  const handleAppClick = (appId: string) => {
    if (appId === "navegador") {
      setShowBrowser(true)
    }
  }

  const renderSearchResults = () => {
    const categoryData = searchResults[activeSearchTab] || []

    return (
      <div className="space-y-4">
        {categoryData.map((result: any, index: number) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-purple-200 group"
            onClick={() => {
              updateTabUrl(activeTabId, result.url)
              setShowBrowser(true)
              setShowSearchMenu(false)
            }}
          >
            <div className="flex items-start gap-3">
              {result.thumbnail && (
                <img
                  src={result.thumbnail || "/placeholder.svg"}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  {result.favicon && <span className="mr-2">{result.favicon}</span>}
                  {result.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  {result.duration && <span className="flex items-center gap-1">⏱️ {result.duration}</span>}
                  {result.price && <span className="flex items-center gap-1">💰 {result.price}</span>}
                  {result.time && <span className="flex items-center gap-1">🕒 {result.time}</span>}
                  {result.type && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{result.type}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const currentTab = getCurrentTab()

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* ... existing background stars ... */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Browser Interface */}
      {showBrowser && (
        <div className="absolute inset-0 z-50 bg-slate-900">
          {/* Browser Header */}
          <div className="bg-slate-800 border-b border-slate-700 p-2">
            <div className="flex items-center gap-2 mb-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowBrowser(false)}
                className="text-slate-400 hover:text-white"
              >
                ← Volver al inicio
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-t-lg cursor-pointer transition-colors ${
                    activeTabId === tab.id
                      ? "bg-slate-700 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span className="text-xs">{tab.favicon}</span>
                  <span className="text-sm max-w-32 truncate">{tab.title}</span>
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeTab(tab.id)
                      }}
                      className="text-slate-500 hover:text-white ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <Button size="sm" variant="ghost" onClick={createNewTab} className="text-slate-400 hover:text-white px-2">
                +
              </Button>
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={goBack}
                  disabled={!canGoBack()}
                  className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                  ←
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={goForward}
                  disabled={!canGoForward()}
                  className="text-slate-400 hover:text-white disabled:opacity-30"
                >
                  →
                </Button>
                <Button size="sm" variant="ghost" onClick={reloadPage} className="text-slate-400 hover:text-white">
                  ↻
                </Button>
              </div>

              <div className="flex-1 relative">
                <Input
                  value={currentTab.url}
                  onChange={(e) => {
                    const newUrl = e.target.value
                    setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? { ...tab, url: newUrl } : tab)))

                    if (newUrl.trim()) {
                      const suggestions = getUrlSuggestions(newUrl)
                      setUrlSuggestions(suggestions)
                      setShowUrlSuggestions(suggestions.length > 0)
                    } else {
                      setShowUrlSuggestions(false)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      updateTabUrl(activeTabId, currentTab.url)
                      setShowUrlSuggestions(false)
                    }
                  }}
                  onFocus={() => {
                    if (currentTab.url) {
                      const suggestions = getUrlSuggestions(currentTab.url)
                      setUrlSuggestions(suggestions)
                      setShowUrlSuggestions(suggestions.length > 0)
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowUrlSuggestions(false), 200)}
                  placeholder="Buscar o escribir URL..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pr-20"
                />

                {/* URL Suggestions */}
                {showUrlSuggestions && urlSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-slate-700 border border-slate-600 rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {urlSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-slate-600 cursor-pointer text-white text-sm"
                        onClick={() => {
                          updateTabUrl(activeTabId, suggestion)
                          setShowUrlSuggestions(false)
                        }}
                      >
                        🌐 {suggestion}
                      </div>
                    ))}
                  </div>
                )}

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleBookmark}
                    className={`p-1 ${
                      isBookmarked(currentTab.url) ? "text-yellow-400" : "text-slate-400"
                    } hover:text-yellow-400`}
                  >
                    ⭐
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    📚
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-white p-8 overflow-auto">
            {currentTab.isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando {currentTab.url}...</p>
                </div>
              </div>
            ) : currentTab.url ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentTab.title}</h1>
                  <p className="text-gray-600">Simulación de navegación web para: {currentTab.url}</p>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700">
                    Esta es una simulación del navegador web. En una implementación real, aquí se cargaría el contenido
                    de la página web.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Nueva pestaña</h2>
                  <p className="text-gray-500">Escribe una URL o realiza una búsqueda</p>
                </div>
              </div>
            )}
          </div>

          {/* Bookmarks Sidebar */}
          {showBookmarks && (
            <div className="absolute right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Marcadores</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowBookmarks(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 cursor-pointer group"
                    onClick={() => {
                      updateTabUrl(activeTabId, bookmark.url)
                      setShowBookmarks(false)
                    }}
                  >
                    <span className="text-sm">{bookmark.favicon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{bookmark.title}</div>
                      <div className="text-slate-400 text-xs truncate">{bookmark.url}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBookmark(bookmark.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1"
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Menu */}
      {showSearchMenu && !showBrowser && (
        <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-4 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Búsqueda Avanzada</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowSearchMenu(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </Button>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative mb-4">
                <div className="flex items-center bg-slate-800 rounded-xl shadow-lg border border-slate-600">
                  <Search className="w-5 h-5 text-slate-400 ml-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleSearch(searchQuery, activeSearchTab)
                      }
                    }}
                    placeholder="Buscar en la web..."
                    className="flex-1 border-0 bg-transparent focus:ring-0 text-white placeholder-slate-400 py-3 px-3"
                    autoComplete="off"
                  />
                  <Button
                    onClick={handleVoiceSearch}
                    className={`mr-2 ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-slate-700 hover:bg-slate-600"}`}
                  >
                    🎤
                  </Button>
                  <Button
                    onClick={() => handleSearch(searchQuery, activeSearchTab)}
                    disabled={isSearching}
                    className="rounded-xl bg-purple-600 hover:bg-purple-700 mr-2 px-4"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Buscar"
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {searchCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeSearchTab === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSearchTab(category.id)}
                    className={`${
                      activeSearchTab === category.id
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {/* AI Response */}
              {aiResponse && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-medium">Respuesta de IA</span>
                  </div>
                  <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</div>
                </div>
              )}

              {/* Search Results */}
              {Object.keys(searchResults).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Resultados de búsqueda</h3>
                  <div className="max-h-96 overflow-y-auto">{renderSearchResults()}</div>
                </div>
              )}

              {/* Quick Searches */}
              {!isSearching && Object.keys(searchResults).length === 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-4">Búsquedas rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickSearches.map((search, index) => (
                      <div
                        key={index}
                        className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors border border-slate-600"
                        onClick={() => {
                          setSearchQuery(search)
                          handleSearch(search, activeSearchTab)
                        }}
                      >
                        <span className="text-slate-300 text-sm">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Bento Grid Interface */}
      {!showBrowser && !showSearchMenu && (
        <div className="absolute inset-0 z-10 flex flex-col">
          <div className="flex-1 p-2 min-h-0">
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <div className="grid grid-cols-12 grid-rows-6 gap-3 h-full">
                  {/* Navegador Web - Left tall card */}
                  <div
                    className="col-span-3 row-span-3 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-700/50 cursor-pointer hover:bg-slate-700/80 transition-colors"
                    onClick={() => setShowBrowser(true)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white text-sm lg:text-xl font-bold mb-1 lg:mb-2">Navegador</h3>
                    <h3 className="text-white text-sm lg:text-xl font-bold mb-1 lg:mb-4">Web</h3>
                    <h3 className="text-white text-sm lg:text-xl font-bold mb-3 lg:mb-6">Avanzado</h3>
                    <div className="text-slate-400 text-xs lg:text-sm">{tabs.length} pestañas abiertas</div>
                    <div className="text-slate-400 text-xs lg:text-sm">{bookmarks.length} marcadores</div>
                  </div>

                  {/* Main center card - Your AI Prompt Companion */}
                  <div className="col-span-6 row-span-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-purple-400/30 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2 lg:mb-4">
                      <span className="text-white text-xs lg:text-sm">🎯 PromptPal</span>
                    </div>
                    <h2 className="text-lg lg:text-4xl font-bold text-white text-center mb-3 lg:mb-8 leading-tight">
                      Your AI Prompt
                      <br />
                      Companion
                    </h2>

                    {/* Central AI Visualization */}
                    <div className="relative mb-3 lg:mb-6">
                      <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-purple-400/30 to-orange-500/30 backdrop-blur-sm border border-purple-300/30 flex items-center justify-center relative overflow-hidden">
                        {/* Animated energy effect */}
                        <div className="absolute inset-0 rounded-full">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full animate-pulse opacity-80" />
                          <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse opacity-60"
                            style={{ animationDelay: "0.5s" }}
                          />
                        </div>
                        {/* Binary code ring */}
                        <div className="absolute inset-0 rounded-full border border-purple-300/20">
                          <div className="text-purple-300/40 text-xs absolute -top-1 lg:-top-2 left-1/2 transform -translate-x-1/2">
                            1001010110
                          </div>
                          <div className="text-purple-300/40 text-xs absolute -bottom-1 lg:-bottom-2 left-1/2 transform -translate-x-1/2">
                            0110101001
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="w-full max-w-xs lg:max-w-md">
                      <div className="relative">
                        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl shadow-lg border border-white/20">
                          <Search className="w-4 h-4 lg:w-5 lg:h-5 text-white/70 ml-3 lg:ml-4" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleSearch(searchQuery)
                              }
                            }}
                            onFocus={() => setShowSearchMenu(true)}
                            placeholder="Ask AI anything..."
                            className="flex-1 border-0 bg-transparent focus:ring-0 text-white placeholder-white/50 py-2 lg:py-3 px-2 lg:px-3 text-sm lg:text-base"
                            autoComplete="off"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSearch(searchQuery)}
                            disabled={isSearching}
                            className="rounded-lg bg-white/20 hover:bg-white/30 mr-2 px-2 lg:px-3"
                          >
                            {isSearching ? (
                              <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Bot className="w-3 h-3 lg:w-4 lg:h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apps launcher - Top right card */}
                  <div
                    className="col-span-3 row-span-1 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-700/50 flex items-center justify-center cursor-pointer hover:bg-slate-700/80 transition-colors"
                    onClick={toggleStartMenu}
                  >
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm lg:text-xl">⚡</span>
                    </div>
                  </div>

                  {/* Search History - 25M searches */}
                  <div className="col-span-3 row-span-2 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-700/50">
                    <div className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">
                      {searchHistory.length > 0 ? searchHistory.length : "25M"}
                    </div>
                    <div className="text-slate-400 text-xs lg:text-sm">
                      {searchHistory.length > 0 ? "búsquedas realizadas" : "created prompts"}
                    </div>
                    <div className="mt-2 lg:mt-4 flex items-center gap-2">
                      <div className="text-slate-500 text-xs">[</div>
                      <div className="text-slate-500 text-xs">]</div>
                    </div>
                  </div>

                  {/* Bookmarks - 12K bookmarks */}
                  <div
                    className="col-span-3 row-span-2 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-700/50 cursor-pointer hover:bg-slate-700/80 transition-colors"
                    onClick={() => {
                      setShowBrowser(true)
                      setShowBookmarks(true)
                    }}
                  >
                    <div className="text-xl lg:text-3xl font-bold text-orange-400 mb-1 lg:mb-2">
                      {bookmarks.length}K
                    </div>
                    <div className="text-slate-400 text-xs lg:text-sm mb-2 lg:mb-4">marcadores guardados</div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      {bookmarks.slice(0, 3).map((bookmark, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-xs"
                        >
                          {bookmark.favicon}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generate/Search button */}
                  <div className="col-span-3 row-span-1 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-700/50">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 rounded-lg lg:rounded-xl py-1.5 lg:py-2 text-sm lg:text-base"
                      onClick={() => setShowSearchMenu(true)}
                    >
                      <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      Generate
                    </Button>
                  </div>

                  {/* Voice Search templates */}
                  <div className="col-span-3 row-span-2 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-slate-700/50">
                    <h4 className="text-white font-medium mb-1 lg:mb-2 text-sm lg:text-base">Búsqueda por voz</h4>
                    <p className="text-slate-400 text-xs lg:text-sm mb-2 lg:mb-4">Usa comandos de voz para navegar.</p>
                    <Button
                      size="sm"
                      onClick={handleVoiceSearch}
                      className={`${
                        isListening
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      } text-xs px-2 lg:px-3 py-1 rounded-full border`}
                    >
                      🎤 {isListening ? "Escuchando..." : "Activar voz"}
                    </Button>
                    <div className="mt-2 lg:mt-4 flex flex-col gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg"></div>
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg"></div>
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div className="col-span-3 row-span-1 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-700/50 flex items-center gap-2 lg:gap-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs lg:text-sm">🌿</span>
                    </div>
                    <div>
                      <div className="text-white text-xs lg:text-sm font-medium">Controles de navegación</div>
                      <div className="text-slate-400 text-xs">Atrás, adelante, recargar páginas.</div>
                    </div>
                  </div>

                  {/* Tab management */}
                  <div className="col-span-3 row-span-1 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-700/50 flex items-center gap-2 lg:gap-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs lg:text-sm">📑</span>
                    </div>
                    <div>
                      <div className="text-white text-xs lg:text-sm font-medium">Gestión de pestañas</div>
                      <div className="text-slate-400 text-xs">Crear, cerrar y cambiar pestañas.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-700/50">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                    <img src="/professional-headshot.png" alt="Ivan Volti" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm lg:text-base">Ivan Volti</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Menu */}
      {isStartMenuOpen && (
        <div className="absolute bottom-16 left-4 z-30 bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 w-80">
          <h3 className="text-white font-semibold mb-4">Aplicaciones</h3>
          <div className="grid grid-cols-2 gap-3">
            {desktopApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-700/50 cursor-pointer transition-colors"
                onClick={() => {
                  handleAppClick(app.id)
                  setIsStartMenuOpen(false)
                }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mb-2`}
                >
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm font-medium text-center">{app.name}</span>
                <span className="text-slate-400 text-xs text-center mt-1">{app.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
