"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Shield,
  Brain,
  DollarSign,
  Users,
  Music,
  Phone,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  MessageSquare,
  Headphones,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Sparkles,
  Mic,
  MicOff,
  Command,
  Menu,
  X,
  Loader2,
  FileText,
  Camera,
  Settings,
  Calculator,
  Calendar,
  Mail,
  Globe,
  Star,
  Power,
  Home,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react"

interface DesktopApp {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
  category: string
  size?: "large" | "medium" | "small"
  url?: string
}

interface SearchResult {
  content: string
  type: "ai_response" | "suggestion" | "error" | "web_result"
  url?: string
  title?: string
}

const desktopApps: DesktopApp[] = [
  {
    id: "navegador",
    name: "Navegador Web",
    icon: Globe,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    description: "Navegar por internet",
    category: "Internet",
    size: "large",
    url: "https://www.google.com",
  },
  {
    id: "asistente",
    name: "Asistente IA",
    icon: Brain,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    description: "Inteligencia artificial",
    category: "IA",
    size: "large",
  },
  {
    id: "finanzas",
    name: "Finanzas",
    icon: DollarSign,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    description: "Gestión financiera",
    category: "Finanzas",
    size: "large",
  },
  {
    id: "callwave",
    name: "CallWave",
    icon: Phone,
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    description: "Automatización de llamadas",
    category: "Comunicación",
    size: "large",
  },
  {
    id: "crm",
    name: "CRM Personal",
    icon: Users,
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    description: "Gestión de contactos",
    category: "CRM",
    size: "large",
  },
  {
    id: "musica",
    name: "Música",
    icon: Music,
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
    description: "Reproductor musical",
    category: "Multimedia",
    size: "medium",
    url: "https://open.spotify.com",
  },
  {
    id: "documentos",
    name: "Documentos",
    icon: FileText,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    description: "Editor de documentos",
    category: "Productividad",
    size: "medium",
    url: "https://docs.google.com",
  },
  {
    id: "galeria",
    name: "Galería",
    icon: Camera,
    color: "bg-gradient-to-br from-teal-500 to-teal-600",
    description: "Fotos y videos",
    category: "Multimedia",
    size: "medium",
    url: "https://photos.google.com",
  },
  {
    id: "configuracion",
    name: "Configuración",
    icon: Settings,
    color: "bg-gradient-to-br from-gray-500 to-gray-600",
    description: "Ajustes del sistema",
    category: "Sistema",
    size: "small",
  },
  {
    id: "calculadora",
    name: "Calculadora",
    icon: Calculator,
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    description: "Calculadora científica",
    category: "Utilidades",
    size: "small",
    url: "https://www.google.com/search?q=calculator",
  },
  {
    id: "calendario",
    name: "Calendario",
    icon: Calendar,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    description: "Agenda y eventos",
    category: "Productividad",
    size: "small",
    url: "https://calendar.google.com",
  },
  {
    id: "correo",
    name: "Correo",
    icon: Mail,
    color: "bg-gradient-to-br from-blue-600 to-blue-700",
    description: "Cliente de email",
    category: "Comunicación",
    size: "small",
    url: "https://mail.google.com",
  },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUrl, setCurrentUrl] = useState("") // Agregar estado para URL actual
  const [isVPNActive, setIsVPNActive] = useState(false)
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("Música de Concentración")
  const [blockedAds, setBlockedAds] = useState(247)
  const [blockedTrackers, setBlockedTrackers] = useState(89)
  const [isVoiceSearch, setIsVoiceSearch] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false) // Estado para mostrar navegador
  const [browserHistory, setBrowserHistory] = useState<string[]>([]) // Historial de navegación
  const [historyIndex, setHistoryIndex] = useState(-1) // Índice del historial

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = [
        `Buscar "${searchQuery}" con IA`,
        `Analizar finanzas de "${searchQuery}"`,
        `Crear contacto CRM para "${searchQuery}"`,
        `Programar llamada CallWave sobre "${searchQuery}"`,
        `Crear nota sobre "${searchQuery}"`,
      ]
      setAiSuggestions(suggestions.slice(0, 3))
    } else {
      setAiSuggestions([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const navigateToUrl = (url: string) => {
    setCurrentUrl(url)
    setShowBrowser(true)
    setShowStartMenu(false)

    // Actualizar historial
    const newHistory = browserHistory.slice(0, historyIndex + 1)
    newHistory.push(url)
    setBrowserHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentUrl(browserHistory[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < browserHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentUrl(browserHistory[historyIndex + 1])
    }
  }

  const reload = () => {
    // Simular recarga
    console.log("Recargando página:", currentUrl)
  }

  const goHome = () => {
    setShowBrowser(false)
    setCurrentUrl("")
  }

  const performAISearch = async (query: string) => {
    setIsSearching(true)
    setShowSearchResults(true)

    try {
      if (query.includes(".") && (query.startsWith("http") || !query.includes(" "))) {
        const url = query.startsWith("http") ? query : `https://${query}`
        navigateToUrl(url)
        setIsSearching(false)
        setShowSearchResults(false)
        return
      }

      // Simular resultados web mientras se procesa la IA
      const webResults: SearchResult[] = [
        {
          content: `Resultados web para "${query}"`,
          type: "web_result",
          title: `Búsqueda: ${query}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        },
      ]

      setSearchResults(webResults)

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Eres ARIA, el asistente IA del Navegador Integral CRM. Responde de manera concisa y útil. Si la pregunta es sobre navegación web, también sugiere búsquedas relevantes.",
            },
            {
              role: "user",
              content: query,
            },
          ],
          model: "gemini-2.0-flash-exp",
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        setSearchResults([
          ...webResults,
          {
            content: `Error: ${data.error}`,
            type: "error",
          },
        ])
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        setSearchResults([
          ...webResults,
          {
            content: data.choices[0].message.content,
            type: "ai_response",
          },
        ])
      } else {
        setSearchResults([
          ...webResults,
          {
            content: "No se pudo obtener una respuesta válida de la IA.",
            type: "error",
          },
        ])
      }
    } catch (error) {
      console.error("Error en búsqueda IA:", error)
      setSearchResults([
        {
          content: `Error de conexión: ${error instanceof Error ? error.message : "Error desconocido"}`,
          type: "error",
        },
      ])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Búsqueda inteligente con IA:", searchQuery)
      await performAISearch(searchQuery)
      setAiSuggestions([])
    }
  }

  const toggleVPN = () => {
    setIsVPNActive(!isVPNActive)
    console.log(`VPN ${!isVPNActive ? "activada" : "desactivada"}`)
  }

  const togglePrivateMode = () => {
    setIsPrivateMode(!isPrivateMode)
    console.log(`Modo privado ${!isPrivateMode ? "activado" : "desactivado"}`)
  }

  const toggleVoiceSearch = () => {
    setIsVoiceSearch(!isVoiceSearch)
    if (!isVoiceSearch) {
      console.log("Iniciando búsqueda por voz...")
      setTimeout(async () => {
        const voiceQuery = "¿Cómo optimizar mis finanzas personales?"
        setSearchQuery(voiceQuery)
        setIsVoiceSearch(false)
        await performAISearch(voiceQuery)
      }, 2000)
    }
  }

  const handleAppLaunch = (appId: string) => {
    console.log(`Lanzando aplicación: ${appId}`)
    const app = desktopApps.find((a) => a.id === appId)

    if (app?.url) {
      navigateToUrl(app.url)
    } else {
      setShowStartMenu(false)
    }
  }

  const handleSuggestionClick = async (suggestion: string) => {
    setSearchQuery(suggestion)
    setAiSuggestions([])
    await performAISearch(suggestion)
  }

  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu)
  }

  const getAppSize = (size?: string) => {
    switch (size) {
      case "large":
        return "w-32 h-32"
      case "medium":
        return "w-24 h-24"
      case "small":
        return "w-20 h-20"
      default:
        return "w-24 h-24"
    }
  }

  const getIconSize = (size?: string) => {
    switch (size) {
      case "large":
        return "w-16 h-16"
      case "medium":
        return "w-12 h-12"
      case "small":
        return "w-10 h-10"
      default:
        return "w-12 h-12"
    }
  }

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl font-space-grotesk">Iniciando Navegador Integral de IA...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex flex-col overflow-hidden relative">
      {/* Fondo estrellado animado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Barra superior del navegador */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center gap-4 relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-space-grotesk font-bold hidden md:block">Navegador Integral IA</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white disabled:opacity-30"
            onClick={goBack}
            disabled={historyIndex <= 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white disabled:opacity-30"
            onClick={goForward}
            disabled={historyIndex >= browserHistory.length - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={reload}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={goHome}>
            <Home className="w-4 h-4" />
          </Button>
        </div>

        {/* Barra de búsqueda inteligente mejorada */}
        <div className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  showBrowser
                    ? currentUrl || "Ingresa una URL o busca..."
                    : "Buscar en la web, preguntar a la IA o navegar..."
                }
                className="pl-10 pr-20 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 rounded-full"
                disabled={isSearching}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isSearching && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceSearch}
                  className={`p-1 ${isVoiceSearch ? "text-red-400" : "text-white/50"} hover:text-white`}
                  disabled={isSearching}
                >
                  {isVoiceSearch ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                  IA
                </Badge>
              </div>
            </div>
          </form>

          {/* Sugerencias de IA */}
          {aiSuggestions.length > 0 && !showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-2 z-50">
              <div className="text-xs text-white/50 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sugerencias de IA
              </div>
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left text-white/70 hover:text-white hover:bg-white/10 text-sm py-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Command className="w-3 h-3 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          {/* Resultados de búsqueda mejorados */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-white/50 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Resultados de ARIA
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearchResults(false)}
                  className="text-white/50 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isSearching ? (
                <div className="flex items-center gap-2 text-white/70">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando con IA...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        result.type === "error"
                          ? "bg-red-500/20 border border-red-500/30"
                          : result.type === "web_result"
                            ? "bg-blue-500/20 border border-blue-500/30"
                            : "bg-purple-500/20 border border-purple-500/30"
                      }`}
                    >
                      {result.type === "web_result" && result.url && (
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 text-sm underline"
                          >
                            {result.title || "Resultado web"}
                          </a>
                        </div>
                      )}
                      <div className={`text-sm ${result.type === "error" ? "text-red-300" : "text-white"}`}>
                        {result.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controles de privacidad y seguridad */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVPN}
            className={`${isVPNActive ? "text-green-400" : "text-white/70"} hover:text-white hidden md:flex`}
          >
            {isVPNActive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={togglePrivateMode}
            className={`${isPrivateMode ? "text-blue-400" : "text-white/70"} hover:text-white hidden md:flex`}
          >
            {isPrivateMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>

          <div className="hidden md:flex items-center gap-1 text-xs text-white/50">
            <Shield className="w-3 h-3" />
            <span>{blockedAds + blockedTrackers}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white/70 hover:text-white md:hidden"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {showBrowser ? (
          // Vista del navegador
          <div className="h-full w-full bg-white">
            <iframe
              src={currentUrl}
              className="w-full h-full border-0"
              title="Navegador Web"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        ) : (
          // Vista del escritorio
          <div className="h-full overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {/* Escritorio con iconos grandes estilo Windows */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 auto-rows-max">
                {desktopApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-all duration-200"
                    onClick={() => handleAppLaunch(app.id)}
                  >
                    <div
                      className={`${getAppSize(app.size)} ${app.color} rounded-2xl shadow-2xl flex items-center justify-center group-hover:shadow-3xl transition-all duration-200 border border-white/20`}
                    >
                      <app.icon className={`${getIconSize(app.size)} text-white drop-shadow-lg`} />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                        {app.name}
                      </div>
                      <div className="text-white/50 text-xs hidden group-hover:block">{app.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {showStartMenu && (
        <div className="absolute bottom-20 left-6 w-[420px] bg-black/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden">
          {/* Efecto de cristal esmerilado en el header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-14 h-14 ring-2 ring-white/20">
                  <AvatarImage src="/diverse-user-avatars.png" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg font-bold">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black/50"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-lg">Usuario IA</div>
                <div className="text-white/60 text-sm">CRM Personal Activo</div>
                <div className="text-white/40 text-xs mt-1">Última actividad: hace 2 min</div>
              </div>
            </div>
          </div>

          {/* Aplicaciones frecuentes con mejor diseño */}
          <div className="p-6 border-b border-white/5">
            <div className="text-white/60 text-xs font-semibold mb-4 tracking-wider">APLICACIONES FRECUENTES</div>
            <div className="grid grid-cols-3 gap-4">
              {desktopApps.slice(0, 6).map((app) => (
                <Button
                  key={app.id}
                  variant="ghost"
                  className="flex flex-col items-center gap-3 h-auto p-4 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 group"
                  onClick={() => handleAppLaunch(app.id)}
                >
                  <div
                    className={`w-10 h-10 ${app.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                  >
                    <app.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium">{app.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Reproductor de música integrado mejorado */}
          <div className="p-6 border-b border-white/5">
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-white text-sm font-semibold">Reproduciendo</span>
                  <div className="text-white/60 text-xs">{currentTrack}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mensajería integrada mejorada */}
          <div className="p-6 border-b border-white/5">
            <div className="text-white/60 text-xs font-semibold mb-4 tracking-wider">MENSAJERÍA</div>
            <div className="space-y-2">
              {[
                { name: "WhatsApp", icon: MessageSquare, color: "text-green-400", unread: 3, status: "En línea" },
                { name: "Telegram", icon: MessageSquare, color: "text-blue-400", unread: 0, status: "Hace 5 min" },
                { name: "Discord", icon: MessageSquare, color: "text-purple-400", unread: 7, status: "En línea" },
              ].map((app) => (
                <Button
                  key={app.name}
                  variant="ghost"
                  className="w-full justify-between text-white/70 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center`}>
                      <app.icon className={`w-4 h-4 ${app.color}`} />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{app.name}</div>
                      <div className="text-xs text-white/40">{app.status}</div>
                    </div>
                  </div>
                  {app.unread > 0 && (
                    <Badge variant="secondary" className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full">
                      {app.unread}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Opciones del sistema mejoradas */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5"
              >
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Configuración</span>
              </Button>
              <Button variant="ghost" className="text-white/70 hover:text-red-400 p-3 rounded-xl hover:bg-red-500/10">
                <Power className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Barra inferior estilo Windows */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs text-white/50 relative z-40">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleStartMenu}
            className={`text-white/70 hover:text-white flex items-center gap-2 ${showStartMenu ? "bg-white/10" : ""}`}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
            <span className="hidden md:inline">Inicio</span>
          </Button>

          <div className="flex items-center gap-2">
            <span>VPN: {isVPNActive ? "Activa" : "Inactiva"}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">
              Bloqueados: {blockedAds} anuncios, {blockedTrackers} rastreadores
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block">IA: Activa</span>
          {isVoiceSearch && (
            <>
              <span className="hidden md:inline">•</span>
              <span className="text-red-400 animate-pulse">🎤 Escuchando...</span>
            </>
          )}
          <div className="flex flex-col items-end text-xs">
            <span className="font-medium text-white">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="text-white/50 hidden md:block">
              {currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </footer>

      {showStartMenu && <div className="fixed inset-0 z-30" onClick={() => setShowStartMenu(false)} />}
    </div>
  )
}
