"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Globe,
  Brain,
  DollarSign,
  Music,
  FileText,
  Settings,
  Calendar,
  Search,
  Shield,
  Wifi,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  X,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Bell,
  Briefcase,
  AlertTriangle,
  Heart,
  Focus,
  Bot,
  ImageIcon,
  StickyNote,
  CheckSquare,
  BarChart3,
} from "lucide-react"

interface TabIsland {
  id: string
  name: string
  tabs: BrowserTab[]
  color: string
}

interface BrowserTab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
  isPinned: boolean
}

interface Workspace {
  id: string
  name: string
  tabIslands: TabIsland[]
  isActive: boolean
}

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
  description?: string
  favicon?: string
}

const desktopApps = [
  {
    id: "navegador",
    name: "Navegador Web",
    icon: Globe,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    description: "Navegación web avanzada",
    category: "Internet",
    size: "large",
  },
  {
    id: "asistente",
    name: "Asistente IA",
    icon: Bot,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    description: "Inteligencia artificial personal",
    category: "IA",
    size: "large",
  },
  {
    id: "finanzas",
    name: "Finanzas",
    icon: DollarSign,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    description: "Gestión financiera personal",
    category: "Finanzas",
    size: "large",
  },
  {
    id: "musica",
    name: "Música",
    icon: Music,
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
    description: "Reproductor de música",
    category: "Multimedia",
    size: "medium",
  },
  {
    id: "documentos",
    name: "Documentos",
    icon: FileText,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    description: "Editor de documentos",
    category: "Productividad",
    size: "medium",
  },
  {
    id: "configuracion",
    name: "Configuración",
    icon: Settings,
    color: "bg-gradient-to-br from-gray-500 to-gray-600",
    description: "Configuración del sistema",
    category: "Sistema",
    size: "medium",
  },
  {
    id: "galeria",
    name: "Galería",
    icon: ImageIcon,
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    description: "Galería de imágenes",
    category: "Multimedia",
    size: "medium",
  },
  {
    id: "notas",
    name: "Notas",
    icon: StickyNote,
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    description: "Bloc de notas inteligente",
    category: "Productividad",
    size: "medium",
  },
  {
    id: "calendario",
    name: "Calendario",
    icon: Calendar,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    description: "Gestión de eventos y citas",
    category: "Productividad",
    size: "medium",
  },
  {
    id: "tareas",
    name: "Tareas",
    icon: CheckSquare,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    description: "Lista de tareas inteligente",
    category: "Productividad",
    size: "medium",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    color: "bg-gradient-to-br from-violet-500 to-violet-600",
    description: "Análisis y métricas",
    category: "Datos",
    size: "medium",
  },
  {
    id: "seguridad",
    name: "Seguridad",
    icon: Shield,
    color: "bg-gradient-to-br from-slate-500 to-slate-600",
    description: "Centro de seguridad",
    category: "Sistema",
    size: "medium",
  },
]

export default function NavegadorIntegralIA() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [isVPNActive, setIsVPNActive] = useState(false)
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("Música de Concentración")
  const [blockedAds, setBlockedAds] = useState(247)
  const [blockedTrackers, setBlockedTrackers] = useState(89)
  const [isVoiceSearch, setIsVoiceSearch] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showBrowser, setShowBrowser] = useState(false)
  const [browserHistory, setBrowserHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [iframeError, setIframeError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pageTitle, setPageTitle] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "personal",
      name: "Personal",
      tabIslands: [],
      isActive: true,
    },
    {
      id: "trabajo",
      name: "Trabajo",
      tabIslands: [],
      isActive: false,
    },
  ])
  const [tabIslands, setTabIslands] = useState<TabIsland[]>([])
  const [splitScreenMode, setSplitScreenMode] = useState(false)
  const [splitScreenUrls, setSplitScreenUrls] = useState<[string, string]>(["", ""])
  const [vpnLocation, setVpnLocation] = useState("Estados Unidos")
  const [pasteProtection, setPasteProtection] = useState(true)
  const [clipboardData, setClipboardData] = useState("")
  const [showVpnMenu, setShowVpnMenu] = useState(false)
  const [showPrivacyStats, setShowPrivacyStats] = useState(false)

  const [webContent, setWebContent] = useState("")
  const [contentType, setContentType] = useState<"iframe" | "native" | "error">("iframe")

  const [showMessaging, setShowMessaging] = useState(false)
  const [showFinancePanel, setShowFinancePanel] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showWorkspaces, setShowWorkspaces] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal")
  const [cryptoWallet, setCryptoWallet] = useState({ btc: 0.0234, eth: 0.156, balance: 2450.67 })

  const [tasks, setTasks] = useState([
    { id: 1, title: "Revisar emails", completed: false, priority: "alta" },
    { id: 2, title: "Actualizar dashboard", completed: true, priority: "media" },
    { id: 3, title: "Llamada con equipo", completed: false, priority: "alta" },
  ])

  const [notifications, setNotifications] = useState([
    { id: 1, type: "info", message: "Sistema actualizado correctamente", time: "hace 5 min" },
    { id: 2, type: "warning", message: "Revisar configuración VPN", time: "hace 15 min" },
    { id: 3, type: "success", message: "Backup completado", time: "hace 1 hora" },
  ])

  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showWellnessMode, setShowWellnessMode] = useState(false)
  const [wellnessBreakTimer, setWellnessBreakTimer] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [personalizedTheme, setPersonalizedTheme] = useState("default")
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [productivityScore, setProductivityScore] = useState(85)
  const [showAdvancedTools, setShowAdvancedTools] = useState(false)
  const [localLLMStatus, setLocalLLMStatus] = useState("disconnected")
  const [biometricData, setBiometricData] = useState({ stress: 25, focus: 78, energy: 65 })
  const [activePanel, setActivePanel] = useState<"notifications" | "productivity" | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = generateAISuggestions(searchQuery)
      setAiSuggestions(suggestions.slice(0, 3))
    } else {
      setAiSuggestions([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const generateAIInsights = async () => {
    const insights = [
      "Tu productividad aumenta 23% los martes por la mañana",
      "Sugerencia: Toma un descanso cada 45 minutos para mantener el foco",
      "Patrón detectado: Mejor rendimiento con música instrumental",
      "Recomendación: Organiza reuniones después de las 2 PM",
      "Tu tiempo de respuesta mejora con el modo oscuro activado",
    ]
    setAiInsights(insights.slice(0, 3))
  }

  const toggleWellnessMode = () => {
    setShowWellnessMode(!showWellnessMode)
    if (!showWellnessMode) {
      setWellnessBreakTimer(25 * 60) // 25 minutos
    }
  }

  const connectLocalLLM = async () => {
    setLocalLLMStatus("connecting")
    // Simular conexión a LLM local
    setTimeout(() => {
      setLocalLLMStatus("connected")
      generateAIInsights()
    }, 2000)
  }

  const navigateToUrl = async (url: string) => {
    if (!url || url.trim() === "") {
      console.log("URL vacía, no se puede navegar")
      return
    }

    // Agregar protocolo si no existe
    let validUrl = url.trim()
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl
    }

    setIsLoading(true)
    setIframeError(false)
    setCurrentUrl(validUrl)
    setShowBrowser(true)
    setShowStartMenu(false)
    setShowSearchResults(false)

    // Actualizar historial
    const newHistory = browserHistory.slice(0, historyIndex + 1)
    newHistory.push(validUrl)
    setBrowserHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    try {
      const urlObj = new URL(validUrl)
      const domain = urlObj.hostname.toLowerCase()
      const problematicSites = ["google.com", "facebook.com", "twitter.com", "instagram.com", "youtube.com"]

      if (problematicSites.some((site) => domain.includes(site))) {
        setContentType("native")
        generateNativeContent(domain)
      } else {
        // Intentar cargar en iframe para sitios compatibles
        setContentType("iframe")
      }

      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error en navegación:", error)
      setContentType("native")
      generateNativeContent("error")
      setIsLoading(false)
    }
  }

  const generateNativeContent = (domain: string) => {
    let content = ""

    if (domain.includes("google")) {
      content = `
        <div class="min-h-screen bg-white">
          <div class="max-w-4xl mx-auto p-8">
            <div class="text-center mb-8">
              <h1 class="text-4xl font-bold text-blue-600 mb-4">🔍 Búsqueda ORBITA</h1>
              <p class="text-gray-600">Motor de búsqueda integrado con IA</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 class="text-xl font-semibold mb-4">Resultados de búsqueda populares:</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded border hover:shadow-md cursor-pointer">
                  <h3 class="font-semibold text-blue-600">Wikipedia</h3>
                  <p class="text-sm text-gray-600">Enciclopedia libre</p>
                </div>
                <div class="bg-white p-4 rounded border hover:shadow-md cursor-pointer">
                  <h3 class="font-semibold text-blue-600">GitHub</h3>
                  <p class="text-sm text-gray-600">Repositorios de código</p>
                </div>
                <div class="bg-white p-4 rounded border hover:shadow-md cursor-pointer">
                  <h3 class="font-semibold text-blue-600">Stack Overflow</h3>
                  <p class="text-sm text-gray-600">Preguntas y respuestas</p>
                </div>
                <div class="bg-white p-4 rounded border hover:shadow-md cursor-pointer">
                  <h3 class="font-semibold text-blue-600">MDN Web Docs</h3>
                  <p class="text-sm text-gray-600">Documentación web</p>
                </div>
              </div>
            </div>
            <div class="text-center">
              <p class="text-gray-500">💡 Usa la barra de búsqueda central para obtener resultados con IA</p>
            </div>
          </div>
        </div>
      `
    } else if (domain.includes("wikipedia")) {
      content = `
        <div class="min-h-screen bg-white">
          <div class="max-w-4xl mx-auto p-8">
            <h1 class="text-3xl font-bold mb-6">📚 Wikipedia - Enciclopedia Libre</h1>
            <div class="prose max-w-none">
              <p class="text-lg mb-4">Bienvenido a Wikipedia, la enciclopedia libre que todos pueden editar.</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div class="bg-blue-50 p-4 rounded">
                  <h3 class="font-semibold text-blue-800">Artículos destacados</h3>
                  <ul class="mt-2 space-y-1 text-sm">
                    <li>• Historia mundial</li>
                    <li>• Ciencia y tecnología</li>
                    <li>• Arte y cultura</li>
                  </ul>
                </div>
                <div class="bg-green-50 p-4 rounded">
                  <h3 class="font-semibold text-green-800">Categorías populares</h3>
                  <ul class="mt-2 space-y-1 text-sm">
                    <li>• Biografías</li>
                    <li>• Geografía</li>
                    <li>• Eventos actuales</li>
                  </ul>
                </div>
                <div class="bg-purple-50 p-4 rounded">
                  <h3 class="font-semibold text-purple-800">Recursos</h3>
                  <ul class="mt-2 space-y-1 text-sm">
                    <li>• Portal de la comunidad</li>
                    <li>• Ayuda</li>
                    <li>• Donaciones</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    } else {
      content = `
        <div class="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white">
          <div class="max-w-4xl mx-auto p-8 text-center">
            <h1 class="text-4xl font-bold mb-6">🌐 ORBITA Navegador</h1>
            <p class="text-xl mb-8">Navegador integral con IA y CRM personal</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-2">🔍 Búsqueda IA</h3>
                <p class="text-sm opacity-80">Búsquedas inteligentes con respuestas contextuales</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-2">🛡️ Privacidad</h3>
                <p class="text-sm opacity-80">VPN integrada y protección avanzada</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-2">💼 CRM Personal</h3>
                <p class="text-sm opacity-80">Gestión integral de tu vida digital</p>
              </div>
            </div>
          </div>
        </div>
      `
    }

    setWebContent(content)
  }

  const refreshPage = () => {
    // Simular recarga
    console.log("Recargando página:", currentUrl)
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

  const goHome = () => {
    setShowBrowser(false)
    setCurrentUrl("")
  }

  const performAISearch = async (query: string) => {
    setIsSearching(true)
    setShowSearchResults(true)

    try {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i
      const isUrl = urlPattern.test(query.trim()) || (query.includes(".") && !query.includes(" ") && query.length > 3)

      if (isUrl) {
        const url = query.startsWith("http") ? query : `https://${query}`
        navigateToUrl(url)
        setIsSearching(false)
        setShowSearchResults(false)
        return
      }

      const webResults: SearchResult[] = [
        {
          content: `Buscar "${query}" en Wikipedia`,
          type: "web_result",
          title: `${query} - Wikipedia`,
          description: "Información enciclopédica confiable - Navegación interna",
          url: `https://es.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          favicon: "📚",
        },
        {
          content: `Información técnica sobre "${query}"`,
          type: "web_result",
          title: `${query} - Stack Overflow`,
          description: "Preguntas y respuestas técnicas - Navegación interna",
          url: `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
          favicon: "💻",
        },
        {
          content: `Código y ejemplos de "${query}"`,
          type: "web_result",
          title: `${query} - GitHub`,
          description: "Repositorios y código fuente - Navegación interna",
          url: `https://github.com/search?q=${encodeURIComponent(query)}`,
          favicon: "🔧",
        },
        {
          content: `Buscar "${query}" en Google`,
          type: "web_result",
          title: `${query} - Google Search`,
          description: "Búsqueda web completa - Navegación interna",
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          favicon: "🔍",
        },
        {
          content: `Videos sobre "${query}"`,
          type: "web_result",
          title: `${query} - YouTube`,
          description: "Videos y contenido multimedia - Navegación interna",
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
          favicon: "🎥",
        },
      ]

      setSearchResults(webResults)

      // Búsqueda IA mejorada
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
                "Eres ARIA, el asistente IA del Navegador Integral CRM. Responde de manera concisa, útil y estructurada. Usa emojis apropiados para hacer la respuesta más visual.",
            },
            {
              role: "user",
              content: query,
            },
          ],
          model: "gemini-2.0-flash-exp",
          max_tokens: 300,
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
            content: `❌ Error: ${data.error}`,
            type: "error",
          },
        ])
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        setSearchResults([
          {
            content: data.choices[0].message.content,
            type: "ai_response",
            title: "🤖 ARIA - Respuesta IA",
          },
          ...webResults,
        ])
      } else {
        setSearchResults([
          ...webResults,
          {
            content: "❌ No se pudo obtener una respuesta válida de la IA.",
            type: "error",
          },
        ])
      }
    } catch (error) {
      console.error("Error en búsqueda IA:", error)
      setSearchResults([
        {
          content: `❌ Error de conexión: ${error instanceof Error ? error.message : "Error desconocido"}`,
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

  const toggleVPNAdvanced = () => {
    setIsVPNActive(!isVPNActive)
    if (!isVPNActive) {
      setBlockedAds((prev) => prev + Math.floor(Math.random() * 10))
      setBlockedTrackers((prev) => prev + Math.floor(Math.random() * 5))
    }
    console.log(`VPN ${!isVPNActive ? "activada" : "desactivada"} - Ubicación: ${vpnLocation}`)
  }

  const changeVpnLocation = (location: string) => {
    setVpnLocation(location)
    setShowVpnMenu(false)
    console.log(`VPN ubicación cambiada a: ${location}`)
  }

  const createTabIsland = (name: string, tabs: BrowserTab[]) => {
    const newIsland: TabIsland = {
      id: Date.now().toString(),
      name,
      tabs,
      color: `bg-gradient-to-r from-${["blue", "purple", "green", "orange", "pink"][Math.floor(Math.random() * 5)]}-500 to-${["blue", "purple", "green", "orange", "pink"][Math.floor(Math.random() * 5)]}-600`,
    }
    setTabIslands((prev) => [...prev, newIsland])
  }

  const toggleSplitScreen = () => {
    setSplitScreenMode(!splitScreenMode)
    if (!splitScreenMode && currentUrl) {
      setSplitScreenUrls([currentUrl, "https://www.wikipedia.org"])
    }
  }

  const handleClipboardProtection = (data: string) => {
    if (pasteProtection && (data.includes("password") || data.includes("card") || /\d{4}/.test(data))) {
      setClipboardData(data)
      console.log("⚠️ Datos sensibles detectados en portapapeles - Protección activada")
      return false
    }
    return true
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

  const generateGoogleSearchContent = (query: string) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: white; color: black; min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="display: flex; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
            <div style="color: #4285f4; font-size: 24px; font-weight: bold; margin-right: 20px;">Google</div>
            <div style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 24px; background: #f8f9fa;">
              ${query || "Búsqueda"}
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="color: #70757a; font-size: 14px;">Aproximadamente 1,234,567 resultados (0.45 segundos)</div>
          </div>
          
          <div style="space-y: 20px;">
            <div style="margin-bottom: 25px;">
              <div style="color: #1a0dab; font-size: 20px; margin-bottom: 5px; cursor: pointer;">
                ${query} - Wikipedia, la enciclopedia libre
              </div>
              <div style="color: #006621; font-size: 14px; margin-bottom: 5px;">
                https://es.wikipedia.org/wiki/${query}
              </div>
              <div style="color: #545454; font-size: 14px; line-height: 1.4;">
                Información completa y verificada sobre ${query}. Artículo enciclopédico con referencias y datos actualizados...
              </div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <div style="color: #1a0dab; font-size: 20px; margin-bottom: 5px; cursor: pointer;">
                ${query} - Definición y ejemplos | Stack Overflow
              </div>
              <div style="color: #006621; font-size: 14px; margin-bottom: 5px;">
                https://stackoverflow.com/questions/tagged/${query}
              </div>
              <div style="color: #545454; font-size: 14px; line-height: 1.4;">
                Preguntas y respuestas técnicas sobre ${query}. Comunidad de desarrolladores con soluciones prácticas...
              </div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <div style="color: #1a0dab; font-size: 20px; margin-bottom: 5px; cursor: pointer;">
                Repositorios de ${query} en GitHub
              </div>
              <div style="color: #006621; font-size: 14px; margin-bottom: 5px;">
                https://github.com/search?q=${query}
              </div>
              <div style="color: #545454; font-size: 14px; line-height: 1.4;">
                Código fuente y proyectos relacionados con ${query}. Ejemplos prácticos y librerías disponibles...
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-weight: bold; margin-bottom: 10px;">💡 Navegador Integral CRM</div>
            <div style="font-size: 14px; color: #666;">
              Este contenido se muestra de forma nativa en tu navegador CRM para mejor rendimiento y privacidad.
            </div>
          </div>
        </div>
      </div>
    `
  }

  const generateWikipediaContent = (query: string) => {
    return `
      <div style="font-family: 'Linux Libertine', Georgia, serif; padding: 20px; background: white; color: black; min-height: 100vh;">
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="border-bottom: 3px solid #a2a9b1; margin-bottom: 20px; padding-bottom: 10px;">
            <h1 style="font-size: 32px; font-weight: normal; margin: 0; color: black;">${query}</h1>
            <div style="font-size: 13px; color: #666; margin-top: 5px;">De Wikipedia, la enciclopedia libre</div>
          </div>
          
          <div style="background: #f8f9fa; border: 1px solid #a2a9b1; padding: 15px; margin-bottom: 20px; border-radius: 3px;">
            <div style="font-weight: bold; margin-bottom: 10px;">📋 Contenido</div>
            <div style="font-size: 14px;">
              <div style="margin-bottom: 5px;">1. Introducción</div>
              <div style="margin-bottom: 5px;">2. Historia</div>
              <div style="margin-bottom: 5px;">3. Características</div>
              <div style="margin-bottom: 5px;">4. Aplicaciones</div>
              <div style="margin-bottom: 5px;">5. Referencias</div>
            </div>
          </div>
          
          <div style="line-height: 1.6; font-size: 14px;">
            <p style="margin-bottom: 15px;">
              <strong>${query}</strong> es un concepto/término/tecnología que se refiere a [descripción general]. 
              Este artículo proporciona información detallada sobre sus características, historia y aplicaciones principales.
            </p>
            
            <h2 style="font-size: 24px; font-weight: normal; border-bottom: 1px solid #a2a9b1; padding-bottom: 5px; margin: 25px 0 15px 0;">Historia</h2>
            <p style="margin-bottom: 15px;">
              El desarrollo de ${query} comenzó en [período histórico] cuando [contexto histórico]. 
              Los principales hitos incluyen [eventos importantes] que llevaron a su estado actual.
            </p>
            
            <h2 style="font-size: 24px; font-weight: normal; border-bottom: 1px solid #a2a9b1; padding-bottom: 5px; margin: 25px 0 15px 0;">Características principales</h2>
            <ul style="margin-bottom: 15px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Característica 1: [descripción detallada]</li>
              <li style="margin-bottom: 8px;">Característica 2: [descripción detallada]</li>
              <li style="margin-bottom: 8px;">Característica 3: [descripción detallada]</li>
            </ul>
            
            <h2 style="font-size: 24px; font-weight: normal; border-bottom: 1px solid #a2a9b1; padding-bottom: 5px; margin: 25px 0 15px 0;">Aplicaciones</h2>
            <p style="margin-bottom: 15px;">
              ${query} se utiliza principalmente en [áreas de aplicación]. Sus usos más comunes incluyen 
              [ejemplos específicos] y [casos de uso prácticos].
            </p>
          </div>
          
          <div style="margin-top: 40px; padding: 15px; background: #eaf3ff; border: 1px solid #a2a9b1; border-radius: 3px;">
            <div style="font-weight: bold; margin-bottom: 8px;">🌐 Navegador Integral CRM</div>
            <div style="font-size: 13px; color: #666;">
              Contenido adaptado y optimizado para tu navegador CRM. Información verificada y actualizada.
            </div>
          </div>
        </div>
      </div>
    `
  }

  const generateGitHubContent = (query: string) => {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; background: #0d1117; color: #e6edf3; min-height: 100vh;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: flex; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #30363d;">
            <div style="font-size: 24px; font-weight: bold; margin-right: 20px;">🐙 GitHub</div>
            <div style="flex: 1; padding: 8px 12px; border: 1px solid #30363d; border-radius: 6px; background: #21262d;">
              Buscar: ${query || "repositorios"}
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <div style="color: #7d8590; font-size: 14px;">Encontramos 1,234 repositorios</div>
          </div>
          
          <div style="space-y: 20px;">
            <div style="border: 1px solid #30363d; border-radius: 6px; padding: 16px; background: #161b22; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="color: #58a6ff; font-size: 16px; font-weight: 600; margin-right: 8px;">
                  awesome-${query}
                </div>
                <div style="background: #21262d; color: #7d8590; padding: 2px 6px; border-radius: 12px; font-size: 12px; border: 1px solid #30363d;">
                  Public
                </div>
              </div>
              <div style="color: #7d8590; font-size: 14px; margin-bottom: 12px;">
                Una colección curada de recursos increíbles sobre ${query}. Incluye librerías, herramientas y ejemplos prácticos.
              </div>
              <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #7d8590;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="width: 12px; height: 12px; background: #f1e05a; border-radius: 50%; display: inline-block;"></span>
                  JavaScript
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  ⭐ 2,345
                </div>
                <div>Actualizado hace 2 días</div>
              </div>
            </div>
            
            <div style="border: 1px solid #30363d; border-radius: 6px; padding: 16px; background: #161b22; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="color: #58a6ff; font-size: 16px; font-weight: 600; margin-right: 8px;">
                  ${query}-tutorial
                </div>
                <div style="background: #21262d; color: #7d8590; padding: 2px 6px; border-radius: 12px; font-size: 12px; border: 1px solid #30363d;">
                  Public
                </div>
              </div>
              <div style="color: #7d8590; font-size: 14px; margin-bottom: 12px;">
                Tutorial completo y guía paso a paso para aprender ${query}. Incluye ejemplos prácticos y ejercicios.
              </div>
              <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #7d8590;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="width: 12px; height: 12px; background: #3572A5; border-radius: 50%; display: inline-block;"></span>
                  Python
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  ⭐ 1,876
                </div>
                <div>Actualizado hace 1 semana</div>
              </div>
            </div>
            
            <div style="border: 1px solid #30363d; border-radius: 6px; padding: 16px; background: #161b22; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="color: #58a6ff; font-size: 16px; font-weight: 600; margin-right: 8px;">
                  ${query}-framework
                </div>
                <div style="background: #21262d; color: #7d8590; padding: 2px 6px; border-radius: 12px; font-size: 12px; border: 1px solid #30363d;">
                  Public
                </div>
              </div>
              <div style="color: #7d8590; font-size: 14px; margin-bottom: 12px;">
                Framework moderno y ligero para ${query}. Fácil de usar, bien documentado y con gran comunidad.
              </div>
              <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #7d8590;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="width: 12px; height: 12px; background: #2b7489; border-radius: 50%; display: inline-block;"></span>
                  TypeScript
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  ⭐ 3,421
                </div>
                <div>Actualizado hace 3 días</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding: 16px; background: #0d1117; border: 1px solid #30363d; border-radius: 6px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #58a6ff;">🚀 Navegador Integral CRM</div>
            <div style="font-size: 14px; color: #7d8590;">
              Contenido de GitHub optimizado para tu navegador CRM. Explora código y proyectos de forma nativa.
            </div>
          </div>
        </div>
      </div>
    `
  }

  const handleMessagingToggle = () => {
    setShowMessaging(!showMessaging)
  }

  const toggleMusicPlayer = () => {
    setShowMusicPlayer(!showMusicPlayer)
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setCurrentTrack("Ambient Focus - Lofi Beats")
    }
  }

  const switchWorkspace = (workspace: string) => {
    setCurrentWorkspace(workspace)
    setShowWorkspaces(false)
  }

  const generateAISuggestions = (query: string) => {
    if (!query.trim()) return []

    const suggestions = [
      `Buscar "${query}" en la web`,
      `Generar contenido sobre "${query}"`,
      `Analizar información de "${query}"`,
      `Crear resumen de "${query}"`,
      `Programar recordatorio sobre "${query}"`,
      `Buscar en documentos: "${query}"`,
    ]

    return suggestions.slice(0, 4)
  }

  const ProductivityPanel = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <CheckSquare className="w-4 h-4" />
        Centro de Productividad
      </h3>
      <div className="space-y-3">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">Tareas Pendientes</span>
            <span className="text-white font-semibold">{tasks.filter((t) => !t.completed).length}</span>
          </div>
          <div className="space-y-1">
            {tasks
              .filter((t) => !t.completed)
              .slice(0, 3)
              .map((task) => (
                <div key={task.id} className="text-white/70 text-xs flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${task.priority === "alta" ? "bg-red-400" : "bg-yellow-400"}`}
                  />
                  {task.title}
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">Tiempo Enfocado</span>
            <span className="text-white font-semibold">2h 45m</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: "68%" }} />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col overflow-hidden relative">
      {/* Fondo estrellado animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Barra superior mejorada */}
      <div className="relative z-40 bg-black/30 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/orbita-logo.png" alt="ORBITA" className="h-8 w-auto" />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.forward()}
                className="text-white/70 hover:text-white"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-white/70 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWorkspaces(!showWorkspaces)}
                className="text-white/70 hover:text-white flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{currentWorkspace}</span>
              </Button>

              {showWorkspaces && (
                <div className="absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-2 min-w-48 z-50">
                  {["Personal", "Trabajo", "Finanzas", "Desarrollo"].map((workspace) => (
                    <div
                      key={workspace}
                      className="p-2 rounded hover:bg-white/10 cursor-pointer text-white text-sm"
                      onClick={() => switchWorkspace(workspace)}
                    >
                      {workspace}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white/70 hover:text-white relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {notifications.length}
                  </div>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-4 w-80 z-50">
                  <h3 className="text-white font-semibold mb-3">Notificaciones</h3>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 rounded-lg bg-white/5 mb-2">
                      <div className="text-white text-sm">{notif.message}</div>
                      <div className="text-white/60 text-xs mt-1">{notif.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-white/70">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">VPN: España</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="text-white/70 hover:text-white"
                title="Panel de IA Avanzada"
              >
                <Brain className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleWellnessMode}
                className="text-white/70 hover:text-white"
                title="Modo Bienestar"
              >
                <Heart className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                className="text-white/70 hover:text-white"
                title="Herramientas Avanzadas"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFocusMode(!focusMode)}
                className={`${focusMode ? "text-green-400" : "text-white/70"} hover:text-white`}
                title="Modo Concentración"
              >
                <Focus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar lateral mejorado */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-4 gap-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMessagingToggle}
            className={`text-white/70 hover:text-white p-2 ${showMessaging ? "bg-white/20" : ""}`}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMusicPlayer}
            className={`text-white/70 hover:text-white p-2 ${showMusicPlayer ? "bg-white/20" : ""}`}
          >
            <Music className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFinancePanel(!showFinancePanel)}
            className={`text-white/70 hover:text-white p-2 ${showFinancePanel ? "bg-white/20" : ""}`}
          >
            <DollarSign className="w-5 h-5" />
          </Button>

          {/* Redes sociales integradas */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
              <Instagram className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
              <Facebook className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showMessaging && (
          <div className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Mensajería</h3>
            </div>
            <div className="flex-1 p-4 space-y-3">
              {["WhatsApp", "Telegram", "Discord", "Slack"].map((app) => (
                <div key={app} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                  <div className="text-white text-sm font-medium">{app}</div>
                  <div className="text-white/60 text-xs">Sin mensajes nuevos</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showFinancePanel && (
          <div className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Panel Financiero</h3>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4">
                <div className="text-white text-sm">Balance Total</div>
                <div className="text-white text-2xl font-bold">${cryptoWallet.balance}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white text-sm">BTC</span>
                  <span className="text-white font-medium">{cryptoWallet.btc}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white text-sm">ETH</span>
                  <span className="text-white font-medium">{cryptoWallet.eth}</span>
                </div>
              </div>

              <div className="bg-yellow-500/20 rounded-lg p-3">
                <div className="text-white text-sm">💰 Cashback Disponible</div>
                <div className="text-white font-bold">$12.50</div>
              </div>
            </div>
          </div>
        )}

        {showAIPanel && (
          <div className="w-96 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5" />
                ARIA - IA Avanzada
              </h3>
              <div
                className={`w-3 h-3 rounded-full ${localLLMStatus === "connected" ? "bg-green-400" : "bg-yellow-400"}`}
              ></div>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {/* Estado del LLM Local */}
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4">
                <div className="text-white text-sm mb-2">LLM Local</div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">
                    {localLLMStatus === "connected" ? "Llama 3.1 - 8B" : "Desconectado"}
                  </span>
                  <Button
                    size="sm"
                    onClick={connectLocalLLM}
                    disabled={localLLMStatus === "connecting"}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {localLLMStatus === "connecting" ? "Conectando..." : "Conectar"}
                  </Button>
                </div>
              </div>

              {/* Insights de IA */}
              <div className="space-y-2">
                <div className="text-white text-sm font-medium">💡 Insights Personalizados</div>
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/80 text-xs">{insight}</div>
                  </div>
                ))}
              </div>

              {/* Generación de Contenido */}
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg p-4">
                <div className="text-white text-sm mb-2">🎨 Generador de Contenido</div>
                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    Generar Imagen
                  </Button>
                  <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                    Escribir Texto
                  </Button>
                </div>
              </div>

              {/* Puntuación de Productividad */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4">
                <div className="text-white text-sm mb-2">📊 Productividad</div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-2xl font-bold">{productivityScore}%</span>
                  <div className="text-right">
                    <div className="text-white/60 text-xs">Hoy</div>
                    <div className="text-green-400 text-xs">+12% vs ayer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showWellnessMode && (
          <div className="fixed top-20 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-80 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Modo Bienestar
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWellnessMode(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Métricas Biométricas */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Nivel de Estrés</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/20 rounded-full">
                    <div
                      className="h-full bg-green-400 rounded-full"
                      style={{ width: `${100 - biometricData.stress}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{biometricData.stress}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Concentración</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/20 rounded-full">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${biometricData.focus}%` }}></div>
                  </div>
                  <span className="text-white text-sm">{biometricData.focus}%</span>
                </div>
              </div>
            </div>

            {/* Temporizador Pomodoro */}
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4 mb-4">
              <div className="text-white text-sm mb-2">🍅 Sesión de Enfoque</div>
              <div className="text-white text-2xl font-bold text-center">
                {Math.floor(wellnessBreakTimer / 60)}:{(wellnessBreakTimer % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Ejercicios de Respiración */}
            <div className="space-y-2">
              <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700">
                🫁 Ejercicio de Respiración
              </Button>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                🧘 Meditación 5 min
              </Button>
              <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                🎵 Sonidos Binaurales
              </Button>
            </div>
          </div>
        )}

        {showAdvancedTools && (
          <div className="fixed bottom-20 left-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-72 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">🛠️ Herramientas</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedTools(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="text-white text-sm">📐 Convertidor de Unidades</div>
                <div className="text-white/60 text-xs">Conversiones automáticas</div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="text-white text-sm">📁 Easy Files</div>
                <div className="text-white/60 text-xs">Gestión simplificada</div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="text-white text-sm">🎬 Video Pop-out</div>
                <div className="text-white/60 text-xs">Videos flotantes</div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer">
                <div className="text-white text-sm">📖 Modo Lectura</div>
                <div className="text-white/60 text-xs">Lectura sin distracciones</div>
              </div>
            </div>
          </div>
        )}

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          {showBrowser ? (
            <div className="h-full flex flex-col">
              {/* Barra de direcciones */}
              <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-4 py-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <input
                      type="text"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && currentUrl.trim()) {
                          navigateToUrl(currentUrl)
                        }
                      }}
                      className="flex-1 bg-transparent text-white text-sm outline-none"
                      placeholder="Ingresa una URL..."
                    />
                  </div>
                </div>
              </div>

              {/* Contenido del navegador */}
              <div className="flex-1 relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-2"></div>
                      <div>Cargando {pageTitle}...</div>
                      <div className="text-xs text-white/60 mt-1">Verificando compatibilidad...</div>
                    </div>
                  </div>
                )}

                {iframeError ? (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                    <div className="text-center text-white p-8 max-w-md">
                      <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Sitio con Restricciones</h3>
                      <p className="text-white/70 mb-6">
                        Este sitio no permite ser mostrado dentro de otros sitios por seguridad.
                      </p>
                      <div className="space-y-3">
                        <Button
                          onClick={() => {
                            try {
                              if (currentUrl && currentUrl.trim()) {
                                let validUrl = currentUrl.trim()
                                if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
                                  validUrl = "https://" + validUrl
                                }
                                const domain = new URL(validUrl).hostname
                                generateNativeContent(domain)
                                setContentType("native")
                                setIframeError(false)
                              }
                            } catch (error) {
                              console.error("Error procesando URL:", error)
                              generateNativeContent("error")
                              setContentType("native")
                              setIframeError(false)
                            }
                          }}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Ver Contenido Alternativo
                        </Button>
                        <Button
                          onClick={() => {
                            setShowBrowser(false)
                            setSearchQuery(pageTitle.replace(".com", "").replace("www.", ""))
                            performAISearch(pageTitle.replace(".com", "").replace("www.", ""))
                          }}
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Buscar con IA
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : currentUrl ? (
                  contentType === "native" ? (
                    <div
                      className="w-full h-full overflow-auto bg-white"
                      dangerouslySetInnerHTML={{ __html: webContent }}
                    />
                  ) : (
                    <iframe
                      src={currentUrl}
                      className="w-full h-full border-0"
                      title="Navegador Web"
                      onLoad={() => setIsLoading(false)}
                      onError={() => {
                        console.log("Error cargando iframe, generando contenido nativo")
                        try {
                          if (currentUrl && currentUrl.trim()) {
                            let validUrl = currentUrl.trim()
                            if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
                              validUrl = "https://" + validUrl
                            }
                            const domain = new URL(validUrl).hostname
                            generateNativeContent(domain)
                          } else {
                            generateNativeContent("error")
                          }
                        } catch (error) {
                          console.error("Error procesando URL en onError:", error)
                          generateNativeContent("error")
                        }
                        setContentType("native")
                        setIframeError(false)
                        setIsLoading(false)
                      }}
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  )
                ) : null}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                  <div className="relative mb-8">
                    <div className="relative">
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar en la web, preguntar a ARIA o navegar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && performAISearch(searchQuery)}
                        className="w-full h-16 pl-6 pr-32 text-lg bg-black/20 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 shadow-2xl"
                      />

                      <div className="absolute right-2 top-2 flex items-center gap-2">
                        <Button
                          onClick={() => performAISearch(searchQuery)}
                          disabled={isSearching}
                          className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl shadow-lg"
                        >
                          {isSearching ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Search className="w-5 h-5 mr-2" />
                              Buscar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {[
                        "¿Cómo está el clima?",
                        "Noticias tecnología",
                        "Convertir 100 USD a EUR",
                        "Recetas saludables",
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery(suggestion)
                            performAISearch(suggestion)
                          }}
                          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm border border-white/20"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Resultados de búsqueda */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-4">
                      <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4 max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg mb-2 last:mb-0 cursor-pointer transition-all duration-200 ${
                              result.type === "ai_response"
                                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30"
                                : result.type === "web_result"
                                  ? "bg-white/5 hover:bg-white/10"
                                  : "bg-red-500/20"
                            }`}
                            onClick={() => {
                              if (result.url) {
                                navigateToUrl(result.url)
                              }
                            }}
                          >
                            {result.title && (
                              <div className="text-white font-medium text-sm mb-1 flex items-center gap-2">
                                {result.favicon && <span>{result.favicon}</span>}
                                {result.title}
                              </div>
                            )}
                            <div className="text-white/80 text-sm">{result.content}</div>
                            {result.description && (
                              <div className="text-white/60 text-xs mt-1">{result.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Iconos del escritorio - organizados para pantalla completa */}
              <div className="flex-1 px-8 pb-20 overflow-hidden">
                <div className="h-full flex items-center justify-center">
                  <div className="grid grid-cols-6 gap-8 max-w-6xl">
                    {desktopApps.slice(0, 18).map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-110 transition-all duration-300"
                        onClick={() => handleAppLaunch(app.id)}
                      >
                        <div
                          className={`w-16 h-16 ${app.color} rounded-2xl shadow-2xl flex items-center justify-center group-hover:shadow-3xl transition-all duration-300 border border-white/20 group-hover:border-white/40`}
                        >
                          <app.icon className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium text-xs group-hover:text-purple-200 transition-colors">
                            {app.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showMusicPlayer && (
          <div className="fixed bottom-20 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-80 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Reproductor</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMusicPlayer(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-white text-sm mb-3">{currentTrack}</div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleMusicPlayer} className="text-white/70 hover:text-white">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Barra inferior fija */}
        <div className="relative z-50 bg-black/40 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Botón de inicio */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStartMenu(!showStartMenu)}
                className="text-white/70 hover:text-white flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-sm">Inicio</span>
              </Button>

              {/* Indicadores de aplicaciones */}
              <div className="flex items-center gap-2">
                {showBrowser && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/60 text-xs">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span>Conectado</span>
              </div>
              <div>{new Date().toLocaleTimeString()}</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Menú de inicio flotante */}
        {showStartMenu && (
          <div className="absolute bottom-16 left-4 z-50">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 w-80 shadow-2xl">
              <div className="text-white font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                AURA CRM - Menú Principal
              </div>

              <div className="space-y-2">
                {desktopApps.slice(0, 8).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => {
                      handleAppLaunch(app.id)
                      setShowStartMenu(false)
                    }}
                  >
                    <div className={`w-8 h-8 ${app.color} rounded-lg flex items-center justify-center`}>
                      <app.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{app.name}</div>
                      <div className="text-white/60 text-xs">{app.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {activePanel === "productivity" && (
        <div className="p-4 space-y-4">
          <ProductivityPanel />

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Próximos Eventos
            </h3>
            <div className="space-y-2">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-white text-sm font-medium">Reunión de equipo</div>
                <div className="text-white/60 text-xs">Hoy 15:00</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-white text-sm font-medium">Presentación proyecto</div>
                <div className="text-white/60 text-xs">Mañana 10:30</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
