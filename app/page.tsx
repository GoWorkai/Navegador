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
  Mic,
  MicOff,
  Wifi,
  Battery,
  Volume2,
  User,
  Power,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Shield,
  Filter,
  Clock,
  BookOpen,
  Video,
  Newspaper,
  MapPin,
  ShoppingCart,
  Zap,
} from "lucide-react"

export default function NavegadorIntegralIA() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>({})
  const [aiResponse, setAiResponse] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)
  const [showSearchMenu, setShowSearchMenu] = useState(false)
  const [activeSearchTab, setActiveSearchTab] = useState("todo")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

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

  const handleSearch = async (query: string, category = "todo") => {
    if (!query.trim()) return

    setIsSearching(true)
    setSearchResults({})
    setAiResponse("")
    setShowSearchMenu(true)

    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev.slice(0, 9)])
    }

    try {
      const isUrl = query.includes(".") && !query.includes(" ")

      if (isUrl) {
        const url = query.startsWith("http") ? query : `https://${query}`
        setCurrentUrl(url)
        setShowBrowser(true)
        setIsNavigating(true)
        setTimeout(() => setIsNavigating(false), 2000)
        return
      }

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Responde de manera concisa y útil: ${query}` }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponseText = data.choices?.[0]?.message?.content || "No se pudo obtener respuesta"
        setAiResponse(aiResponseText)
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
            thumbnail: "/placeholder.svg?height=100&width=100&query=" + encodeURIComponent(query + " professional"),
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
              setCurrentUrl(result.url)
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

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src="/orbita-logo.png" alt="ORBITA" className="h-8 w-auto" />
          <span className="text-white font-semibold">ORBITA Browser</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
          <Volume2 className="w-4 h-4" />
        </div>
      </div>

      {!showBrowser && !showSearchMenu && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
          <div className="grid grid-cols-4 gap-8 mb-12">
            {desktopApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleAppClick(app.id)}
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.color} shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105 flex items-center justify-center`}
                >
                  <app.icon className="w-10 h-10 text-white" />
                </div>
                <span className="text-white text-sm mt-2 text-center">{app.name}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-4xl mb-8">
            <div className="relative">
              <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-white/20">
                <Search className="w-5 h-5 text-gray-500 ml-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                  onFocus={() => setShowSearchMenu(true)}
                  placeholder="Buscar en la web, preguntar a la IA o navegar..."
                  className="flex-1 border-0 bg-transparent focus:ring-0 text-gray-800 placeholder-gray-500 text-lg py-4"
                />
                <div className="flex items-center gap-2 mr-2">
                  <Button
                    size="sm"
                    onClick={handleVoiceSearch}
                    className={`rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSearch(searchQuery)}
                    disabled={isSearching}
                    className="rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "IA"
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 justify-center">
                {searchCategories.slice(0, 8).map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveSearchTab(category.id)
                      if (searchQuery) handleSearch(searchQuery, category.id)
                      else setShowSearchMenu(true)
                    }}
                    className="bg-white/80 hover:bg-white/90 text-gray-700 border-white/30 rounded-full text-xs flex items-center gap-1"
                  >
                    <category.icon className="w-3 h-3" />
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {quickSearches.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      handleSearch(suggestion)
                    }}
                    className="bg-white/80 hover:bg-white/90 text-gray-700 border-white/30 rounded-full text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSearchMenu && !showBrowser && (
        <div className="relative z-10 flex-1 bg-white/95 backdrop-blur-sm m-4 rounded-lg shadow-xl border border-white/20">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Resultados de búsqueda</h2>
              {searchQuery && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">"{searchQuery}"</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSearchMenu(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex">
            <div className="w-64 border-r border-gray-200 p-4">
              <div className="space-y-2">
                {searchCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveSearchTab(category.id)
                      if (searchQuery) handleSearch(searchQuery, category.id)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeSearchTab === category.id
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                    {searchResults[category.id] && (
                      <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {searchResults[category.id].length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {searchHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Historial reciente
                  </h3>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(query)
                          handleSearch(query)
                        }}
                        className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 p-6">
              {aiResponse && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-700">Respuesta IA</h3>
                    <Zap className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
                </div>
              )}

              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Buscando resultados...</p>
                  </div>
                </div>
              ) : (
                <div>
                  {searchResults[activeSearchTab] && searchResults[activeSearchTab].length > 0 ? (
                    renderSearchResults()
                  ) : searchQuery ? (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No se encontraron resultados para "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Ingresa un término de búsqueda para comenzar</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showBrowser && (
        <div className="relative z-10 flex-1 flex flex-col bg-white/95 backdrop-blur-sm m-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 p-3 border-b bg-gray-50 rounded-t-lg">
            <Button size="sm" variant="ghost" onClick={() => setShowBrowser(false)}>
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="flex-1 mx-2">
              <Input
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(currentUrl)}
                className="text-sm"
                placeholder="Ingresa una URL..."
              />
            </div>
            <Button size="sm" variant="ghost">
              <Shield className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 relative">
            {isNavigating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando...</p>
                </div>
              </div>
            ) : currentUrl ? (
              <iframe
                src={currentUrl}
                className="w-full h-full border-0"
                title="Navegador"
                onError={() => {
                  setIsNavigating(false)
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Ingresa una URL para navegar</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 rounded-full"
              onClick={toggleStartMenu}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-white/80">
              <Globe className="w-4 h-4" />
              <FileText className="w-4 h-4" />
              <Settings className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              <span>Conectado</span>
            </div>
            <div className="text-right">
              <div>{currentTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</div>
              <div className="text-xs opacity-70">
                {currentTime.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isStartMenuOpen && (
        <div className="fixed bottom-16 left-4 z-30 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Menú de Inicio</h3>
            <Button size="sm" variant="ghost" onClick={toggleStartMenu} className="text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {desktopApps.slice(0, 6).map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer text-white"
                onClick={() => {
                  handleAppClick(app.id)
                  setIsStartMenuOpen(false)
                }}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                  <app.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm">{app.name}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-3">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer text-white">
              <User className="w-5 h-5" />
              <span className="text-sm">Usuario</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer text-white">
              <Power className="w-5 h-5" />
              <span className="text-sm">Apagar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
