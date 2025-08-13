"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Globe,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Star,
  Shield,
  Search,
  Download,
  Lock,
  Settings,
  Menu,
  Brain,
  TrendingUp,
  Youtube,
  MessageCircle,
  Github,
  Twitter,
  Instagram,
  Music,
  Twitch,
  Gamepad2,
  Chrome,
  ShieldCheck,
  EyeOff,
  Zap,
  AlertTriangle,
  Copy,
  Layers,
  SplitSquareHorizontal,
  Maximize2,
  Minimize2,
  Send,
  Database,
  Heart,
  Wind,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProfile } from "@/components/profile-provider"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

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
  islandId?: string
  emoji?: string
  domain?: string
  category?: string
}

interface TabIsland {
  id: string
  name: string
  color: string
  tabIds: string[]
  isCollapsed: boolean
  category: string
}

interface SidebarApp {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  category: "messaging" | "social" | "productivity" | "entertainment"
  isActive?: boolean
  hasNotifications?: boolean
  notificationCount?: number
  url?: string
}

interface MessagingPanel {
  appId: string
  isOpen: boolean
  conversations: Conversation[]
}

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  isOnline?: boolean
}

interface SpeedDialSite {
  name: string
  url: string
  icon: React.ReactNode
  color: string
  category: string
}

interface VPNState {
  isEnabled: boolean
  location: string
  status: "connected" | "connecting" | "disconnected"
}

interface PrivacyStats {
  totalBlockedAds: number
  totalBlockedTrackers: number
  totalBlockedCrypto: number
}

interface ClipboardProtection {
  isEnabled: boolean
  lastProtectedData: string | null
  protectionActive: boolean
}

interface LocalModel {
  id: string
  name: string
  size: string
  status: "available" | "downloading" | "not-downloaded" | "installing"
  provider: string
  progress?: number
}

interface AIMessage {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export function BrowserWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const { toast } = useToast()

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Speed Dial",
      url: "opera://startpage",
      isActive: true,
      isLoading: false,
      isPrivate: false,
      blockedAds: 0,
      blockedTrackers: 0,
      domain: "opera",
      category: "browser",
    },
  ])

  const [tabIslands, setTabIslands] = useState<TabIsland[]>([])
  const [splitScreenMode, setSplitScreenMode] = useState<{
    enabled: boolean
    leftTabId?: string
    rightTabId?: string
  }>({
    enabled: false,
  })

  const [addressBar, setAddressBar] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeMessagingApp, setActiveMessagingApp] = useState<string | null>(null)
  const [messagingPanels, setMessagingPanels] = useState<MessagingPanel[]>([])

  const [vpnState, setVpnState] = useState<VPNState>({
    isEnabled: false,
    location: "Europe",
    status: "disconnected",
  })

  const [privacyStats, setPrivacyStats] = useState<PrivacyStats>({
    totalBlockedAds: 1247,
    totalBlockedTrackers: 892,
    totalBlockedCrypto: 23,
  })

  const [clipboardProtection, setClipboardProtection] = useState<ClipboardProtection>({
    isEnabled: true,
    lastProtectedData: null,
    protectionActive: false,
  })

  const [showPrivacyPanel, setShowPrivacyPanel] = useState(false)

  const [localModels, setLocalModels] = useState<LocalModel[]>([
    { id: "llama-3.1-8b", name: "Llama 3.1 8B", size: "4.7 GB", status: "available", provider: "Meta" },
    { id: "gemma-2-9b", name: "Gemma 2 9B", size: "5.4 GB", status: "downloading", provider: "Google", progress: 65 },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", size: "26.9 GB", status: "not-downloaded", provider: "Mistral AI" },
    { id: "vicuna-13b", name: "Vicuna 13B", size: "7.8 GB", status: "available", provider: "LMSYS" },
    { id: "codellama-7b", name: "Code Llama 7B", size: "3.8 GB", status: "available", provider: "Meta" },
  ])

  const [selectedModel, setSelectedModel] = useState("llama-3.1-8b")
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [aiConversation, setAiConversation] = useState<AIMessage[]>([
    {
      role: "assistant",
      content: "Hola! Soy ARIA, tu asistente de IA local. ¿En qué puedo ayudarte hoy?",
      timestamp: Date.now(),
    },
  ])
  const [aiInput, setAiInput] = useState("")
  const [modelManagerOpen, setModelManagerOpen] = useState(false)

  const downloadModel = async (modelId: string) => {
    setLocalModels((prev) =>
      prev.map((model) => (model.id === modelId ? { ...model, status: "downloading", progress: 0 } : model)),
    )

    // Simulate download progress
    const interval = setInterval(() => {
      setLocalModels((prev) =>
        prev.map((model) => {
          if (model.id === modelId && model.status === "downloading") {
            const newProgress = (model.progress || 0) + Math.random() * 15
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...model, status: "available", progress: 100 }
            }
            return { ...model, progress: newProgress }
          }
          return model
        }),
      )
    }, 1000)

    toast({
      title: "Descargando Modelo",
      description: `Iniciando descarga de ${localModels.find((m) => m.id === modelId)?.name}`,
    })
  }

  const sendAIMessage = async () => {
    if (!aiInput.trim()) return

    const userMessage: AIMessage = {
      role: "user",
      content: aiInput,
      timestamp: Date.now(),
    }

    setAiConversation((prev) => [...prev, userMessage])
    setAiInput("")

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Como ARIA, asistente de IA local ejecutándose en el modelo ${selectedModel}, responde de manera útil y conversacional: ${aiInput}`,
          type: "chat",
          model: selectedModel,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: AIMessage = {
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
        }
        setAiConversation((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error sending AI message:", error)
    }
  }

  const analyzeTabForGrouping = (tab: Tab): { category: string; domain: string } => {
    const url = tab.url.toLowerCase()
    const title = tab.title.toLowerCase()

    // Extract domain
    let domain = "unknown"
    try {
      if (url.startsWith("http")) {
        domain = new URL(url).hostname.replace("www.", "")
      } else if (url.includes("://")) {
        domain = url.split("://")[1].split("/")[0]
      }
    } catch (e) {
      domain = url.split("/")[0] || "unknown"
    }

    // Categorize based on content
    let category = "general"
    if (url.includes("github.com") || title.includes("code") || title.includes("dev")) {
      category = "development"
    } else if (url.includes("youtube.com") || url.includes("twitch.tv") || url.includes("netflix.com")) {
      category = "entertainment"
    } else if (url.includes("gmail.com") || url.includes("outlook.com") || title.includes("mail")) {
      category = "communication"
    } else if (url.includes("docs.google.com") || url.includes("notion.so") || title.includes("document")) {
      category = "productivity"
    } else if (url.includes("amazon.com") || url.includes("shop") || title.includes("buy")) {
      category = "shopping"
    } else if (url.includes("news") || url.includes("reddit.com") || url.includes("twitter.com")) {
      category = "news"
    }

    return { category, domain }
  }

  const autoGroupTabs = () => {
    const ungroupedTabs = tabs.filter((tab) => !tab.islandId)
    const groupsByDomain: { [key: string]: Tab[] } = {}
    const groupsByCategory: { [key: string]: Tab[] } = {}

    ungroupedTabs.forEach((tab) => {
      const analysis = analyzeTabForGrouping(tab)
      tab.domain = analysis.domain
      tab.category = analysis.category

      // Group by domain if more than 2 tabs from same domain
      if (!groupsByDomain[analysis.domain]) {
        groupsByDomain[analysis.domain] = []
      }
      groupsByDomain[analysis.domain].push(tab)

      // Group by category
      if (!groupsByCategory[analysis.category]) {
        groupsByCategory[analysis.category] = []
      }
      groupsByCategory[analysis.category].push(tab)
    })

    // Create islands for domains with 2+ tabs
    Object.entries(groupsByDomain).forEach(([domain, domainTabs]) => {
      if (domainTabs.length >= 2 && domain !== "unknown") {
        const islandId = `island-${domain}-${Date.now()}`
        const island: TabIsland = {
          id: islandId,
          name: domain,
          color: getIslandColor(domain),
          tabIds: domainTabs.map((t) => t.id),
          isCollapsed: false,
          category: domainTabs[0].category || "general",
        }

        setTabIslands((prev) => [...prev, island])
        setTabs((prev) =>
          prev.map((tab) =>
            domainTabs.find((dt) => dt.id === tab.id)
              ? { ...tab, islandId, domain, category: domainTabs[0].category }
              : tab,
          ),
        )
      }
    })

    toast({
      title: "Pestañas Agrupadas",
      description: "Las pestañas relacionadas se han organizado automáticamente en islas.",
    })
  }

  const getIslandColor = (domain: string): string => {
    const colors = [
      "bg-sky-400/80",
      "bg-emerald-400/80",
      "bg-violet-400/80",
      "bg-amber-400/80",
      "bg-rose-400/80",
      "bg-indigo-400/80",
      "bg-teal-400/80",
      "bg-orange-400/80",
    ]
    const hash = domain.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const toggleSplitScreen = () => {
    if (splitScreenMode.enabled) {
      setSplitScreenMode({ enabled: false })
      toast({
        title: "Pantalla Dividida Desactivada",
        description: "Volviendo a vista de pestaña única",
      })
    } else {
      const activeTabs = tabs.filter((tab) => tab.isActive || tabs.indexOf(tab) === 1).slice(0, 2)
      if (activeTabs.length >= 1) {
        setSplitScreenMode({
          enabled: true,
          leftTabId: activeTabs[0].id,
          rightTabId: activeTabs[1]?.id || activeTabs[0].id,
        })
        toast({
          title: "Pantalla Dividida Activada",
          description: "Ahora puedes ver dos pestañas simultáneamente",
        })
      }
    }
  }

  const addEmojiToTab = (tabId: string, emoji: string) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, emoji } : tab)))
  }

  const toggleIslandCollapse = (islandId: string) => {
    setTabIslands((prev) =>
      prev.map((island) => (island.id === islandId ? { ...island, isCollapsed: !island.isCollapsed } : island)),
    )
  }

  const speedDialSites: SpeedDialSite[] = [
    {
      name: "Twitch",
      url: "https://twitch.tv",
      icon: <Twitch className="w-8 h-8" />,
      color: "bg-gradient-to-br from-violet-400/80 to-purple-500/80",
      category: "popular",
    },
    {
      name: "Discord",
      url: "https://discord.com",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "bg-gradient-to-br from-indigo-400/80 to-blue-500/80",
      category: "popular",
    },
    {
      name: "Reddit",
      url: "https://reddit.com",
      icon: <Chrome className="w-8 h-8" />,
      color: "bg-gradient-to-br from-orange-400/80 to-red-400/80",
      category: "popular",
    },
    {
      name: "YouTube",
      url: "https://youtube.com",
      icon: <Youtube className="w-8 h-8" />,
      color: "bg-gradient-to-br from-red-400/80 to-pink-400/80",
      category: "popular",
    },
    {
      name: "Free Games",
      url: "https://store.epicgames.com/free-games",
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "bg-gradient-to-br from-emerald-400/80 to-teal-500/80",
      category: "games",
    },
  ]

  const sidebarApps: SidebarApp[] = [
    // Messaging Apps
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "text-emerald-400",
      category: "messaging",
      hasNotifications: true,
      notificationCount: 3,
      url: "https://web.whatsapp.com",
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "text-sky-400",
      category: "messaging",
      hasNotifications: true,
      notificationCount: 1,
      url: "https://web.telegram.org",
    },
    {
      id: "discord",
      name: "Discord",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "text-indigo-400",
      category: "messaging",
      hasNotifications: false,
      url: "https://discord.com/app",
    },
    {
      id: "slack",
      name: "Slack",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "text-violet-400",
      category: "messaging",
      hasNotifications: true,
      notificationCount: 7,
    },

    // Social Media
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: <Twitter className="w-5 h-5" />,
      color: "text-slate-300",
      category: "social",
      url: "https://x.com",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      color: "text-rose-400",
      category: "social",
      url: "https://instagram.com",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: <Music className="w-5 h-5" />,
      color: "text-pink-400",
      category: "social",
    },

    // Entertainment & Productivity
    {
      id: "youtube",
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      color: "text-red-400",
      category: "entertainment",
      url: "https://youtube.com",
    },
    {
      id: "spotify",
      name: "Spotify",
      icon: <Music className="w-5 h-5" />,
      color: "text-emerald-500",
      category: "entertainment",
    },
    {
      id: "github",
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      color: "text-slate-400",
      category: "productivity",
      url: "https://github.com",
    },
  ]

  const handleSidebarAppClick = (app: SidebarApp) => {
    if (app.category === "messaging") {
      if (activeMessagingApp === app.id) {
        setActiveMessagingApp(null)
        setSidebarExpanded(false)
      } else {
        setActiveMessagingApp(app.id)
        setSidebarExpanded(true)

        // Initialize messaging panel if not exists
        if (!messagingPanels.find((panel) => panel.appId === app.id)) {
          const newPanel: MessagingPanel = {
            appId: app.id,
            isOpen: true,
            conversations: generateMockConversations(app.id),
          }
          setMessagingPanels((prev) => [...prev, newPanel])
        }
      }
    } else if (app.url) {
      // Open social media or other apps in iframe or new tab
      window.open(app.url, "_blank")
    }

    toast({
      title: `${app.name} Abierto`,
      description:
        app.category === "messaging" ? "Panel de mensajería integrado activado" : "Aplicación abierta en nueva pestaña",
    })
  }

  const generateMockConversations = (appId: string): Conversation[] => {
    const conversations: { [key: string]: Conversation[] } = {
      whatsapp: [
        {
          id: "1",
          name: "María García",
          lastMessage: "Hola, ¿cómo estás?",
          timestamp: "10:30",
          unread: 2,
          isOnline: true,
        },
        {
          id: "2",
          name: "Equipo Trabajo",
          lastMessage: "Reunión a las 3pm",
          timestamp: "09:15",
          unread: 1,
          isOnline: false,
        },
        {
          id: "3",
          name: "Carlos López",
          lastMessage: "Perfecto, nos vemos mañana",
          timestamp: "Ayer",
          unread: 0,
          isOnline: true,
        },
      ],
      telegram: [
        {
          id: "1",
          name: "Ana Rodríguez",
          lastMessage: "Enviando archivo...",
          timestamp: "11:45",
          unread: 1,
          isOnline: true,
        },
        {
          id: "2",
          name: "Grupo Desarrollo",
          lastMessage: "Nueva actualización disponible",
          timestamp: "08:30",
          unread: 0,
          isOnline: false,
        },
      ],
      discord: [
        {
          id: "1",
          name: "Servidor Gaming",
          lastMessage: "¿Alguien para una partida?",
          timestamp: "12:00",
          unread: 0,
          isOnline: true,
        },
        {
          id: "2",
          name: "Comunidad Tech",
          lastMessage: "Nuevo tutorial publicado",
          timestamp: "10:00",
          unread: 0,
          isOnline: true,
        },
      ],
      slack: [
        {
          id: "1",
          name: "#general",
          lastMessage: "Buen trabajo en el proyecto",
          timestamp: "14:20",
          unread: 3,
          isOnline: false,
        },
        {
          id: "2",
          name: "#desarrollo",
          lastMessage: "Bug reportado en producción",
          timestamp: "13:45",
          unread: 2,
          isOnline: false,
        },
        {
          id: "3",
          name: "Pedro Martín",
          lastMessage: "Revisión de código lista",
          timestamp: "12:30",
          unread: 2,
          isOnline: true,
        },
      ],
    }
    return conversations[appId] || []
  }

  const toggleVPN = async () => {
    if (vpnState.isEnabled) {
      setVpnState((prev) => ({ ...prev, status: "disconnected", isEnabled: false }))
      toast({
        title: "VPN Desconectada",
        description: "Tu conexión ya no está protegida por VPN",
      })
    } else {
      setVpnState((prev) => ({ ...prev, status: "connecting" }))

      // Simulate connection process
      setTimeout(() => {
        setVpnState((prev) => ({
          ...prev,
          status: "connected",
          isEnabled: true,
        }))
        toast({
          title: "VPN Conectada",
          description: `Conectado a servidor en ${vpnState.location}. Tu IP está protegida.`,
        })
      }, 2000)
    }
  }

  useEffect(() => {
    if (!clipboardProtection.isEnabled) return

    const handleCopy = (e: ClipboardEvent) => {
      const copiedText = e.clipboardData?.getData("text") || ""

      // Check if copied data contains sensitive information
      const sensitivePatterns = [
        /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/, // Credit card
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/, // Strong password pattern
      ]

      const isSensitive = sensitivePatterns.some((pattern) => pattern.test(copiedText))

      if (isSensitive) {
        setClipboardProtection((prev) => ({
          ...prev,
          lastProtectedData: copiedText.substring(0, 20) + "...",
          protectionActive: true,
        }))

        toast({
          title: "Datos Sensibles Detectados",
          description: "Protección de portapapeles activada. Tus datos están seguros.",
          variant: "default",
        })

        // Auto-disable protection after 30 seconds
        setTimeout(() => {
          setClipboardProtection((prev) => ({ ...prev, protectionActive: false }))
        }, 30000)
      }
    }

    document.addEventListener("copy", handleCopy)
    return () => document.removeEventListener("copy", handleCopy)
  }, [clipboardProtection.isEnabled, toast])

  const simulateBlocking = (url: string) => {
    const adDomains = ["doubleclick.net", "googleadservices.com", "facebook.com/tr", "google-analytics.com"]
    const trackerDomains = ["scorecardresearch.com", "quantserve.com", "outbrain.com"]
    const cryptoDomains = ["coinhive.com", "crypto-loot.com", "webminepool.com"]

    let blockedAds = 0
    let blockedTrackers = 0
    let blockedCrypto = 0

    adDomains.forEach((domain) => {
      if (url.includes(domain)) blockedAds++
    })

    trackerDomains.forEach((domain) => {
      if (url.includes(domain)) blockedTrackers++
    })

    cryptoDomains.forEach((domain) => {
      if (url.includes(domain)) blockedCrypto++
    })

    // Update stats
    setPrivacyStats((prev) => ({
      totalBlockedAds: prev.totalBlockedAds + blockedAds,
      totalBlockedTrackers: prev.totalBlockedTrackers + blockedTrackers,
      totalBlockedCrypto: prev.totalBlockedCrypto + blockedCrypto,
    }))

    // Update active tab stats
    setTabs((prev) =>
      prev.map((tab) =>
        tab.isActive
          ? {
              ...tab,
              blockedAds: tab.blockedAds + blockedAds,
              blockedTrackers: tab.blockedTrackers + blockedTrackers,
            }
          : tab,
      ),
    )
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)

    // Check if it's a URL
    if (query.includes(".") && !query.includes(" ")) {
      const url = query.startsWith("http") ? query : `https://${query}`
      try {
        simulateBlocking(url)

        // Open in new tab for real navigation
        window.open(url, "_blank")
        setAddressBar(url)
        setTabs((prev) =>
          prev.map((tab) =>
            tab.isActive
              ? {
                  ...tab,
                  url: url,
                  title: query,
                  isLoading: false,
                }
              : tab,
          ),
        )
      } catch (error) {
        console.error("Navigation error:", error)
      }
      setIsSearching(false)
      return
    }

    // Perform AI search
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Busca información sobre: "${query}". Proporciona resultados útiles y relevantes con enlaces si es posible. Incluye fuentes confiables y información actualizada.`,
          type: "search",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults([
          {
            title: `Resultados para: ${query}`,
            content: data.response,
            url: `search://results?q=${encodeURIComponent(query)}`,
            type: "ai-search",
          },
        ])

        // Update tab
        setTabs((prev) =>
          prev.map((tab) =>
            tab.isActive
              ? {
                  ...tab,
                  url: `search://results?q=${encodeURIComponent(query)}`,
                  title: `🔍 ${query}`,
                  isLoading: false,
                }
              : tab,
          ),
        )
      } else {
        // Fallback to Google search
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
        window.open(googleUrl, "_blank")
      }
    } catch (error) {
      console.error("Search error:", error)
      // Fallback to Google search
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
      window.open(googleUrl, "_blank")
    } finally {
      setIsSearching(false)
    }
  }

  const addTab = (isPrivate = false) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: isPrivate ? "Nueva pestaña privada" : "Nueva pestaña",
      url: "opera://startpage",
      isActive: true,
      isLoading: false,
      isPrivate,
      blockedAds: 0,
      blockedTrackers: 0,
      domain: "opera",
      category: "browser",
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

  const navigate = (url: string) => {
    if (!hasPermission("nav.browse")) {
      alert("No tienes permisos para navegar")
      return
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      simulateBlocking(url)
      window.open(url, "_blank")
    } else if (!url.includes(".") && !url.startsWith("opera://")) {
      // Es una búsqueda
      performSearch(url)
      setAddressBar(`Buscando: ${url}`)
      setTabs((prev) =>
        prev.map((tab) =>
          tab.isActive
            ? {
                ...tab,
                url: `search://results?q=${encodeURIComponent(url)}`,
                title: `🔍 ${url}`,
                isLoading: true,
              }
            : tab,
        ),
      )
    } else {
      // Intentar como URL
      const fullUrl = url.startsWith("http") ? url : `https://${url}`
      simulateBlocking(fullUrl)
      window.open(fullUrl, "_blank")
    }
  }

  const activeTab = tabs.find((tab) => tab.isActive)

  const groupedTabs = () => {
    const islands: { [key: string]: { island: TabIsland; tabs: Tab[] } } = {}
    const ungroupedTabs: Tab[] = []

    tabs.forEach((tab) => {
      if (tab.islandId) {
        const island = tabIslands.find((i) => i.id === tab.islandId)
        if (island) {
          if (!islands[island.id]) {
            islands[island.id] = { island, tabs: [] }
          }
          islands[island.id].tabs.push(tab)
        } else {
          ungroupedTabs.push(tab)
        }
      } else {
        ungroupedTabs.push(tab)
      }
    })

    return { islands: Object.values(islands), ungroupedTabs }
  }

  const [showMindfulnessReminder, setShowMindfulnessReminder] = useState(false)
  const [breathingExerciseActive, setBreathingExerciseActive] = useState(false)

  useEffect(() => {
    const mindfulnessInterval = setInterval(
      () => {
        setShowMindfulnessReminder(true)
        setTimeout(() => setShowMindfulnessReminder(false), 10000) // Hide after 10 seconds
      },
      30 * 60 * 1000,
    ) // Every 30 minutes

    return () => clearInterval(mindfulnessInterval)
  }, [])

  const startBreathingExercise = () => {
    setBreathingExerciseActive(true)
    setShowMindfulnessReminder(false)

    // Simple breathing exercise timer
    setTimeout(() => {
      setBreathingExerciseActive(false)
      toast({
        title: "Ejercicio Completado",
        description: "Te sientes más relajado y enfocado.",
      })
    }, 60000) // 1 minute breathing exercise
  }

  const { islands, ungroupedTabs } = groupedTabs()

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 text-slate-800 dark:text-slate-100 overflow-hidden">
      {showMindfulnessReminder && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <Wind className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-1">Momento de Pausa</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Has estado navegando por un tiempo. ¿Te gustaría tomar un respiro?
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={startBreathingExercise}
                  className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0 text-xs"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Respirar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowMindfulnessReminder(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs"
                >
                  Más tarde
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {breathingExerciseActive && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-sky-100/95 to-blue-200/95 dark:from-slate-900/95 dark:to-indigo-900/95 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-sky-300 to-blue-400 rounded-full animate-ping opacity-40"></div>
              <div className="absolute inset-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Wind className="w-8 h-8 text-sky-500" />
              </div>
            </div>
            <h2 className="text-2xl font-light text-slate-800 dark:text-slate-100 mb-2">Respira Profundamente</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Inhala... Exhala... Encuentra tu centro</p>
            <Button
              variant="ghost"
              onClick={() => setBreathingExerciseActive(false)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Terminar ejercicio
            </Button>
          </div>
        </div>
      )}

      {showSidebar && (
        <div className="flex">
          <div className="w-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-sky-200/50 dark:border-sky-500/20 flex flex-col items-center py-4 space-y-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/80 dark:hover:bg-sky-500/20 rounded-xl transition-all duration-300"
              onClick={() => {
                setShowSidebar(false)
                setSidebarExpanded(false)
                setActiveMessagingApp(null)
              }}
            >
              <Menu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </Button>

            <div className="w-8 h-px bg-sky-200/60 dark:bg-sky-500/30" />

            <div className="flex flex-col space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-1">Chat</span>
              {sidebarApps
                .filter((app) => app.category === "messaging")
                .map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    size="sm"
                    className={`relative p-2 rounded-xl transition-all duration-300 ${app.color} ${
                      activeMessagingApp === app.id
                        ? "bg-white/60 dark:bg-slate-800/60 backdrop-blur ring-2 ring-sky-300/50 dark:ring-sky-500/30"
                        : "hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur"
                    }`}
                    title={app.name}
                    onClick={() => handleSidebarAppClick(app)}
                  >
                    {app.icon}
                    {app.hasNotifications && app.notificationCount && app.notificationCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-400 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                        {app.notificationCount > 9 ? "9+" : app.notificationCount}
                      </div>
                    )}
                  </Button>
                ))}
            </div>

            <div className="w-8 h-px bg-sky-200/60 dark:bg-sky-500/30" />

            <div className="flex flex-col space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-1">Social</span>
              {sidebarApps
                .filter((app) => app.category === "social")
                .map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    size="sm"
                    className={`p-2 hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur rounded-xl transition-all duration-300 ${app.color}`}
                    title={app.name}
                    onClick={() => handleSidebarAppClick(app)}
                  >
                    {app.icon}
                  </Button>
                ))}
            </div>

            <div className="w-8 h-px bg-sky-200/60 dark:bg-sky-500/30" />

            <div className="flex flex-col space-y-2">
              {sidebarApps
                .filter((app) => !["messaging", "social"].includes(app.category))
                .map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    size="sm"
                    className={`p-2 hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur rounded-xl transition-all duration-300 ${app.color}`}
                    title={app.name}
                    onClick={() => handleSidebarAppClick(app)}
                  >
                    {app.icon}
                  </Button>
                ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
              className={`w-full justify-start p-3 rounded-xl transition-all duration-300 ${
                aiAssistantOpen
                  ? "bg-gradient-to-br from-violet-100/80 to-purple-100/80 dark:from-violet-500/20 dark:to-purple-500/20 text-violet-600 dark:text-violet-400"
                  : "hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur text-slate-600 dark:text-slate-400"
              }`}
              title="Asistente IA Local (ARIA)"
            >
              <Brain className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">ARIA AI</span>
              <div className="ml-auto flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModelManagerOpen(!modelManagerOpen)}
              className="w-full justify-start p-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur text-slate-600 dark:text-slate-400 transition-all duration-300"
              title="Gestor de Modelos Locales"
            >
              <Database className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Modelos IA</span>
              <Badge
                variant="secondary"
                className="ml-auto text-xs bg-sky-100/80 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
              >
                {localModels.filter((m) => m.status === "available").length}
              </Badge>
            </Button>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="sm"
              className={`p-2 rounded-xl transition-all duration-300 ${
                vpnState.isEnabled
                  ? "bg-gradient-to-br from-emerald-100/80 to-green-100/80 dark:from-emerald-500/20 dark:to-green-500/20 text-emerald-600 dark:text-emerald-400 hover:from-emerald-200/80 hover:to-green-200/80 dark:hover:from-emerald-500/30 dark:hover:to-green-500/30"
                  : "hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur text-slate-600 dark:text-slate-400"
              }`}
              onClick={toggleVPN}
              title={`VPN ${vpnState.isEnabled ? "Conectada" : "Desconectada"}`}
            >
              {vpnState.status === "connecting" ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur rounded-xl transition-all duration-300"
            >
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>

          {sidebarExpanded && activeMessagingApp && (
            <div className="w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-sky-200/50 dark:border-slate-700/50 flex flex-col">
              <div className="p-4 border-b border-sky-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                    {sidebarApps.find((app) => app.id === activeMessagingApp)?.icon}
                    <span className="ml-2">{sidebarApps.find((app) => app.id === activeMessagingApp)?.name}</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSidebarExpanded(false)
                      setActiveMessagingApp(null)
                    }}
                    className="p-1 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-lg transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-3">
                  <Input
                    placeholder="Buscar conversaciones..."
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur border-sky-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm rounded-xl focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {messagingPanels
                  .find((panel) => panel.appId === activeMessagingApp)
                  ?.conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center p-3 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 cursor-pointer border-b border-sky-200/30 dark:border-slate-800/30"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {conversation.name.charAt(0)}
                        </div>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900"></div>
                        )}
                      </div>

                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {conversation.unread > 0 && (
                        <div className="ml-2 bg-gradient-to-br from-rose-400 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="p-4 border-t border-sky-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Escribir mensaje..."
                    className="flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur border-sky-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm rounded-xl focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-sky-500/30"
                  />
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0 rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-sky-200/50 dark:border-sky-500/20">
          {!showSidebar && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 ml-2 rounded-xl transition-all duration-300"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <div className="flex flex-1 overflow-x-auto">
            {islands.map(({ island, tabs: islandTabs }) => (
              <div key={island.id} className="flex items-center">
                <div
                  className={`flex items-center px-2 py-1 mx-1 rounded-xl ${island.color}/30 backdrop-blur border border-white/30 dark:border-slate-700/30`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg transition-all duration-300"
                    onClick={() => toggleIslandCollapse(island.id)}
                  >
                    {island.isCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                  </Button>
                  <Layers className="w-3 h-3 mx-1 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mr-1">{island.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">({islandTabs.length})</span>
                </div>

                {!island.isCollapsed &&
                  islandTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex items-center min-w-0 max-w-xs px-3 py-2 cursor-pointer transition-all duration-300 border-l-2 ${island.color.replace("bg-", "border-l-").replace("/80", "")} ${
                        tab.isActive
                          ? "bg-white/60 dark:bg-slate-900/60 backdrop-blur border-b-2 border-sky-400 dark:border-sky-500 shadow-lg"
                          : "hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur"
                      } ${tab.isPrivate ? "bg-violet-100/60 dark:bg-violet-900/30" : ""}`}
                      onClick={() => switchTab(tab.id)}
                    >
                      {tab.emoji && <span className="mr-1 text-sm">{tab.emoji}</span>}
                      {tab.isPrivate ? (
                        <Lock className="w-3 h-3 mr-2 flex-shrink-0 text-violet-500 dark:text-violet-400" />
                      ) : (
                        <Globe className="w-3 h-3 mr-2 flex-shrink-0 text-sky-500 dark:text-sky-400" />
                      )}
                      <span className="truncate text-xs font-medium">{tab.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-3 w-3 hover:bg-rose-400/20 rounded transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeTab(tab.id)
                        }}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </div>
                  ))}
              </div>
            ))}

            {ungroupedTabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center min-w-0 max-w-xs px-4 py-3 cursor-pointer transition-all duration-300 ${
                  tab.isActive
                    ? "bg-white/60 dark:bg-slate-900/60 backdrop-blur border-b-2 border-sky-400 dark:border-sky-500 shadow-lg"
                    : "hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur"
                } ${tab.isPrivate ? "bg-violet-100/60 dark:bg-violet-900/30" : ""}`}
                onClick={() => switchTab(tab.id)}
              >
                {tab.emoji && <span className="mr-2 text-sm">{tab.emoji}</span>}
                {tab.isPrivate ? (
                  <Lock className="w-4 h-4 mr-2 flex-shrink-0 text-violet-500 dark:text-violet-400" />
                ) : (
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0 text-sky-500 dark:text-sky-400" />
                )}
                <span className="truncate text-sm font-medium">{tab.title}</span>
                {tabs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0 h-4 w-4 hover:bg-rose-400/20 rounded transition-all duration-300"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={autoGroupTabs}
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
              title="Agrupar pestañas automáticamente"
            >
              <Layers className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSplitScreen}
              className={`p-2 rounded-xl transition-all duration-300 ${
                splitScreenMode.enabled
                  ? "bg-gradient-to-br from-violet-100/80 to-purple-100/80 dark:from-violet-500/20 dark:to-purple-500/20 text-violet-600 dark:text-violet-400"
                  : "hover:bg-sky-100/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
              }`}
              title="Pantalla dividida"
            >
              <SplitSquareHorizontal className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => addTab(false)}
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            </Button>
          </div>
        </div>

        <div className="flex items-center p-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-sky-200/50 dark:border-sky-500/20">
          <div className="flex items-center space-x-2 mr-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              {vpnState.isEnabled && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center bg-emerald-100/80 dark:bg-emerald-500/20 backdrop-blur rounded-full px-2 py-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mr-1" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">VPN</span>
                  </div>
                </div>
              )}

              <Search
                className={`absolute ${vpnState.isEnabled ? "left-20" : "left-4"} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400`}
              />
              <Input
                value={addressBar}
                onChange={(e) => setAddressBar(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(addressBar)
                  }
                }}
                className={`${vpnState.isEnabled ? "pl-28" : "pl-12"} pr-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur border-sky-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 rounded-full focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-sky-500/30 focus:border-sky-400/50 dark:focus:border-sky-500/30 transition-all duration-300`}
                placeholder="Escribir búsqueda o dirección web"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
            >
              <Star className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl relative transition-all duration-300"
              onClick={() => setShowPrivacyPanel(!showPrivacyPanel)}
            >
              <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              {(activeTab?.blockedAds || 0) + (activeTab?.blockedTrackers || 0) > 0 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-400 to-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                  {(activeTab?.blockedAds || 0) + (activeTab?.blockedTrackers || 0)}
                </div>
              )}
            </Button>

            {clipboardProtection.protectionActive && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
              >
                <Copy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
            >
              <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>
        </div>

        {showPrivacyPanel && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-sky-200/50 dark:border-slate-700/50 p-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-emerald-500 dark:text-emerald-400" />
                Centro de Privacidad y Seguridad
              </h3>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-white/40 dark:bg-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">VPN</span>
                    <div className={`w-2 h-2 rounded-full ${vpnState.isEnabled ? "bg-emerald-400" : "bg-slate-500"}`} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {vpnState.isEnabled ? `Conectado - ${vpnState.location}` : "Desconectado"}
                  </p>
                </div>

                <div className="bg-white/40 dark:bg-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Anuncios Bloqueados</span>
                    <Zap className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {privacyStats.totalBlockedAds.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/40 dark:bg-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Rastreadores Bloqueados</span>
                    <EyeOff className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {privacyStats.totalBlockedTrackers.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/40 dark:bg-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Crypto Minería</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {privacyStats.totalBlockedCrypto}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVPN}
                    className={`${vpnState.isEnabled ? "bg-emerald-100/80 dark:bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-slate-600 dark:border-slate-500"}`}
                  >
                    {vpnState.status === "connecting"
                      ? "Conectando..."
                      : vpnState.isEnabled
                        ? "Desconectar VPN"
                        : "Conectar VPN"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setClipboardProtection((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
                    className={`${clipboardProtection.isEnabled ? "bg-amber-100/80 dark:bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400" : "border-slate-600 dark:border-slate-500"}`}
                  >
                    {clipboardProtection.isEnabled ? "Protección Activa" : "Activar Protección"}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivacyPanel(false)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {aiAssistantOpen && (
          <div className="absolute left-16 top-0 w-96 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-r border-sky-200/50 dark:border-slate-700/50 z-50">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-sky-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 text-violet-500 dark:text-violet-400 mr-2" />
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">ARIA AI</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Modelo: {localModels.find((m) => m.id === selectedModel)?.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiAssistantOpen(false)}
                    className="p-1 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiConversation.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-xl ${
                        message.role === "user"
                          ? "bg-violet-100/80 dark:bg-violet-500/20 text-violet-700 dark:text-violet-100"
                          : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-sky-200/50 dark:border-slate-700/50">
                <div className="flex space-x-2">
                  <Input
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Pregunta a ARIA..."
                    className="flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur border-sky-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-sky-500/30"
                    onKeyPress={(e) => e.key === "Enter" && sendAIMessage()}
                  />
                  <Button
                    onClick={sendAIMessage}
                    size="sm"
                    className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0 rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modelManagerOpen && (
          <div className="absolute left-16 top-0 w-96 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-r border-sky-200/50 dark:border-slate-700/50 z-50">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-sky-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="w-6 h-6 text-sky-500 dark:text-sky-400 mr-2" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Modelos Locales</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setModelManagerOpen(false)}
                    className="p-1 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Gestiona tus modelos de IA locales para máxima privacidad
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {localModels.map((model) => (
                    <div key={model.id} className="bg-white/40 dark:bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-slate-100">{model.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {model.provider} • {model.size}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {model.status === "available" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedModel(model.id)}
                              className={`text-xs ${selectedModel === model.id ? "bg-violet-100/80 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400" : "text-slate-600 dark:text-slate-400"}`}
                            >
                              {selectedModel === model.id ? "Activo" : "Usar"}
                            </Button>
                          )}
                          {model.status === "not-downloaded" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadModel(model.id)}
                              className="text-xs text-sky-500 dark:text-sky-400 hover:bg-sky-100/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Descargar
                            </Button>
                          )}
                        </div>
                      </div>

                      {model.status === "downloading" && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span>Descargando...</span>
                            <span>{Math.round(model.progress || 0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${model.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center mt-2">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            model.status === "available"
                              ? "bg-emerald-400"
                              : model.status === "downloading"
                                ? "bg-sky-500 animate-pulse"
                                : "bg-slate-500"
                          }`}
                        ></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {model.status === "available"
                            ? "Disponible"
                            : model.status === "downloading"
                              ? "Descargando"
                              : model.status === "not-downloaded"
                                ? "No descargado"
                                : "Instalando"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white/40 dark:bg-slate-800/30 rounded-xl border border-white/20 dark:border-slate-700/20">
                  <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                    Privacidad Local
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Todos los modelos se ejecutan localmente en tu dispositivo. Tus datos nunca salen de tu computadora,
                    garantizando máxima privacidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-auto relative ${splitScreenMode.enabled ? "flex" : ""}`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
                </linearGradient>
              </defs>
              <path d="M0,300 Q300,100 600,300 T1200,250 L1200,800 L0,800 Z" fill="url(#gradient1)" />
              <path d="M0,500 Q400,200 800,500 T1200,400 L1200,800 Z" fill="url(#gradient2)" opacity="0.7" />
              <path d="M0,650 Q600,450 1200,600 L1200,800 Z" fill="url(#gradient1)" opacity="0.3" />
            </svg>
          </div>

          {splitScreenMode.enabled ? (
            <>
              <div className="flex-1 relative border-r border-sky-200/50 dark:border-slate-700/50">
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-violet-100/80 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs px-2 py-1 rounded-lg backdrop-blur">
                    Izquierda
                  </span>
                </div>
                {activeTab?.url === "opera://startpage" ? (
                  <div className="relative z-10 p-4">
                    <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8 mt-10">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-400/80 to-blue-500/80 backdrop-blur rounded-xl flex items-center justify-center mr-3 shadow-xl">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <h1 className="text-2xl font-light text-slate-800 dark:text-slate-100">Buscar en la web</h1>
                        </div>
                        <div className="max-w-xl mx-auto">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <Input
                              value={addressBar}
                              onChange={(e) => setAddressBar(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  navigate(addressBar)
                                }
                              }}
                              className="pl-10 pr-4 py-3 bg-white/60 dark:bg-slate-800/80 backdrop-blur border-sky-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-300 rounded-full focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-sky-500/30 focus:border-transparent transition-all duration-300"
                              placeholder="Buscar en la web"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {speedDialSites.slice(0, 6).map((site) => (
                          <button
                            key={site.name}
                            onClick={() => navigate(site.url)}
                            className="group flex flex-col items-center p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 backdrop-blur hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-white/20 dark:border-slate-700/20"
                          >
                            <div
                              className={`w-12 h-12 ${site.color} backdrop-blur rounded-2xl flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform shadow-xl`}
                            >
                              {site.icon}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                              {site.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                      <Globe className="w-12 h-12 mx-auto mb-3 text-slate-500 dark:text-slate-400" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Panel Izquierdo</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <div className="absolute top-2 left-2 z-20">
                  <span className="bg-violet-100/80 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs px-2 py-1 rounded-lg backdrop-blur">
                    Derecha
                  </span>
                </div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-3 text-slate-500 dark:text-slate-400" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Panel Derecho</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {activeTab?.url === "opera://startpage" ? (
                <div className="relative z-10 p-8">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 mt-20">
                      <div className="flex items-center justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-400/80 to-blue-500/80 backdrop-blur rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                          <Globe className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-light text-slate-800 dark:text-slate-100">Buscar en la web</h1>
                      </div>

                      <div className="max-w-2xl mx-auto">
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                              <span className="text-xs font-bold text-blue-500">G</span>
                            </div>
                          </div>
                          <Input
                            value={addressBar}
                            onChange={(e) => setAddressBar(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                navigate(addressBar)
                              }
                            }}
                            className="pl-16 pr-6 py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-sky-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-300 rounded-full text-lg focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-sky-500/30 focus:border-transparent shadow-2xl transition-all duration-300"
                            placeholder="Buscar en la web"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-8 mb-16">
                      {speedDialSites.map((site) => (
                        <button
                          key={site.name}
                          onClick={() => navigate(site.url)}
                          className="group flex flex-col items-center p-8 rounded-3xl bg-white/60 dark:bg-slate-800/40 backdrop-blur hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20 dark:border-slate-700/20"
                        >
                          <div
                            className={`w-20 h-20 ${site.color} backdrop-blur rounded-3xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-xl`}
                          >
                            {site.icon}
                          </div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {site.name}
                          </span>
                        </button>
                      ))}

                      <button className="group flex flex-col items-center p-8 rounded-3xl bg-white/40 dark:bg-slate-800/20 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-700/30 transition-all duration-300 hover:scale-105 border-2 border-dashed border-sky-300/50 dark:border-slate-600/50 hover:border-sky-400/70 dark:hover:border-sky-500/50">
                        <div className="w-20 h-20 bg-slate-200/60 dark:bg-slate-700/60 backdrop-blur rounded-3xl flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4 group-hover:bg-sky-400/80 group-hover:text-white transition-all shadow-lg">
                          <Plus className="w-8 h-8" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          Añadir un sitio
                        </span>
                      </button>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-3 text-sky-500 dark:text-sky-400" />
                        Sugerencias
                      </h3>
                      <div className="grid grid-cols-6 gap-4">
                        {[
                          {
                            name: "per...patria.org.ve",
                            url: "https://per.patria.org.ve",
                            color: "bg-gradient-to-br from-teal-400/80 to-cyan-500/80",
                          },
                          {
                            name: "ivss.gov.ve",
                            url: "https://ivss.gov.ve",
                            color: "bg-gradient-to-br from-blue-400/80 to-indigo-500/80",
                          },
                          {
                            name: "ivss.gob.ve",
                            url: "https://ivss.gob.ve",
                            color: "bg-gradient-to-br from-violet-400/80 to-purple-500/80",
                          },
                          {
                            name: "goldensun.shop",
                            url: "https://goldensun.shop",
                            color: "bg-gradient-to-br from-amber-400/80 to-orange-500/80",
                          },
                          {
                            name: "MediaFire",
                            url: "https://mediafire.com",
                            color: "bg-gradient-to-br from-sky-400/80 to-blue-500/80",
                          },
                          {
                            name: "otnolatmup.com",
                            url: "https://otnolatmup.com",
                            color: "bg-gradient-to-br from-rose-400/80 to-pink-500/80",
                          },
                        ].map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => navigate(suggestion.url)}
                            className="flex flex-col items-center p-4 rounded-2xl bg-white/40 dark:bg-slate-700/40 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 border border-white/20 dark:border-slate-600/20"
                          >
                            <div
                              className={`w-12 h-12 ${suggestion.color} backdrop-blur rounded-xl flex items-center justify-center mb-2 shadow-lg`}
                            >
                              <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-300 text-center font-medium">
                              {suggestion.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="relative z-10 p-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-sky-500 dark:text-sky-400" />
                      Resultados de búsqueda con IA
                    </h2>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-white/60 dark:bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-4 border border-white/20 dark:border-slate-700/20 shadow-lg"
                      >
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                          {result.title}
                        </h3>
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{result.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                    <p className="text-slate-500 dark:text-slate-400">
                      {activeTab?.isLoading ? "Cargando..." : "Página no disponible"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
