"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Shield,
  Zap,
  Brain,
  DollarSign,
  Users,
  Home,
  Music,
  Gamepad2,
  GraduationCap,
  Microscope,
  Clapperboard,
  Building,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  MessageSquare,
  Phone,
  Headphones,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Maximize2,
  ChevronDown,
  TrendingUp,
  Activity,
  Calculator,
  Calendar,
  FileText,
  Settings,
  Mail,
  Camera,
  Globe,
  Sparkles,
  Mic,
  MicOff,
  Command,
} from "lucide-react"

interface NavigadorIntegralIAProps {
  onSwitchToDesktop: () => void
  onAppLaunch: (appId: string) => void
}

interface TabIsland {
  id: string
  name: string
  tabs: Tab[]
  color: string
}

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive?: boolean
}

interface Workspace {
  id: string
  name: string
  description: string
  tabIslands: TabIsland[]
  aiSuggestions: string[]
}

interface DesktopApp {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
  category: string
}

export default function NavigadorIntegralIA({ onSwitchToDesktop, onAppLaunch }: NavigadorIntegralIAProps) {
  const [currentUrl, setCurrentUrl] = useState("https://navegador-integral.ai/inicio")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVPNActive, setIsVPNActive] = useState(false)
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState("personal")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState("inicio")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("Música de Concentración")
  const [splitScreenMode, setSplitScreenMode] = useState(false)
  const [blockedAds, setBlockedAds] = useState(247)
  const [blockedTrackers, setBlockedTrackers] = useState(89)
  const [isVoiceSearch, setIsVoiceSearch] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showDesktopApps, setShowDesktopApps] = useState(false)

  const desktopApps: DesktopApp[] = [
    {
      id: "callwave",
      name: "CallWave IA",
      icon: Phone,
      color: "bg-purple-500",
      description: "Automatización de llamadas",
      category: "Negocios",
    },
    {
      id: "finanzas",
      name: "Finanzas",
      icon: DollarSign,
      color: "bg-green-500",
      description: "Gestión financiera personal",
      category: "Finanzas",
    },
    {
      id: "calendario",
      name: "Calendario",
      icon: Calendar,
      color: "bg-blue-500",
      description: "Organización de tiempo",
      category: "Productividad",
    },
    {
      id: "notas",
      name: "Notas IA",
      icon: FileText,
      color: "bg-yellow-500",
      description: "Notas inteligentes",
      category: "Productividad",
    },
    {
      id: "calculadora",
      name: "Calculadora",
      icon: Calculator,
      color: "bg-gray-500",
      description: "Cálculos avanzados",
      category: "Utilidades",
    },
    {
      id: "correo",
      name: "Correo",
      icon: Mail,
      color: "bg-red-500",
      description: "Gestión de emails",
      category: "Comunicación",
    },
    {
      id: "camara",
      name: "Cámara",
      icon: Camera,
      color: "bg-pink-500",
      description: "Fotos y videos",
      category: "Multimedia",
    },
    {
      id: "navegador",
      name: "Navegador",
      icon: Globe,
      color: "bg-indigo-500",
      description: "Navegación web",
      category: "Internet",
    },
    {
      id: "configuracion",
      name: "Configuración",
      icon: Settings,
      color: "bg-slate-500",
      description: "Ajustes del sistema",
      category: "Sistema",
    },
  ]

  const [workspaces] = useState<Workspace[]>([
    {
      id: "personal",
      name: "Personal",
      description: "Gestión personal y finanzas",
      tabIslands: [
        {
          id: "finance",
          name: "Finanzas",
          color: "bg-green-500",
          tabs: [
            { id: "1", title: "Dashboard Financiero", url: "/finance/dashboard", isActive: true },
            { id: "2", title: "Presupuestos", url: "/finance/budgets" },
            { id: "3", title: "Inversiones", url: "/finance/investments" },
          ],
        },
        {
          id: "productivity",
          name: "Productividad",
          color: "bg-blue-500",
          tabs: [
            { id: "4", title: "Calendario", url: "/calendar" },
            { id: "5", title: "Notas", url: "/notes" },
            { id: "6", title: "Tareas", url: "/tasks" },
          ],
        },
      ],
      aiSuggestions: ["Revisar gastos de la semana", "Programar reunión familiar", "Actualizar presupuesto mensual"],
    },
    {
      id: "trabajo",
      name: "Trabajo",
      description: "Proyectos y colaboración",
      tabIslands: [
        {
          id: "callwave",
          name: "CallWave",
          color: "bg-purple-500",
          tabs: [
            { id: "7", title: "CallWave Dashboard", url: "/callwave/dashboard", isActive: true },
            { id: "8", title: "Agentes IA", url: "/callwave/agents" },
            { id: "9", title: "Campañas", url: "/callwave/campaigns" },
          ],
        },
      ],
      aiSuggestions: [
        "Optimizar campaña de llamadas",
        "Revisar métricas de agentes IA",
        "Configurar nuevo agente de voz",
      ],
    },
  ])

  const currentWorkspaceData = workspaces.find((w) => w.id === currentWorkspace) || workspaces[0]

  const sidebarCategories = [
    { id: "inicio", name: "Home", icon: Home, color: "text-blue-400" },
    { id: "aplicaciones", name: "Apps", icon: Building, color: "text-purple-400" },
    { id: "musica", name: "Music", icon: Music, color: "text-pink-400" },
    { id: "gaming", name: "Gaming", icon: Gamepad2, color: "text-green-400" },
    { id: "educacion", name: "Education", icon: GraduationCap, color: "text-yellow-400" },
    { id: "ciencia", name: "Science & Tech", icon: Microscope, color: "text-purple-400" },
    { id: "entretenimiento", name: "Entertainment", icon: Clapperboard, color: "text-red-400" },
    { id: "negocios", name: "Business", icon: Building, color: "text-indigo-400" },
  ]

  const featuredCommunities = [
    {
      id: "callwave-ai",
      name: "CallWave AI",
      description: "Automatización de llamadas con IA",
      members: "15.2K",
      image: "/ai-call-center.png",
      category: "IA & Tecnología",
      trending: true,
    },
    {
      id: "finanzas-personales",
      name: "Finanzas Personales",
      description: "Gestión inteligente del dinero",
      members: "28.5K",
      image: "/personal-finance-dashboard.png",
      category: "Finanzas",
      trending: true,
    },
    {
      id: "productividad-ia",
      name: "Productividad con IA",
      description: "Optimiza tu flujo de trabajo",
      members: "42.1K",
      image: "/ai-productivity-tools.png",
      category: "Productividad",
    },
  ]

  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = [
        `Buscar "${searchQuery}" en CallWave`,
        `Analizar finanzas relacionadas con "${searchQuery}"`,
        `Crear nota sobre "${searchQuery}"`,
        `Programar recordatorio para "${searchQuery}"`,
        `Buscar comunidades sobre "${searchQuery}"`,
      ]
      setAiSuggestions(suggestions.slice(0, 3))
    } else {
      setAiSuggestions([])
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Búsqueda inteligente con IA:", searchQuery)
      setCurrentUrl(`https://navegador-integral.ai/search?q=${encodeURIComponent(searchQuery)}`)
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
      // Simular búsqueda por voz
      setTimeout(() => {
        setSearchQuery("¿Cómo optimizar mis finanzas personales?")
        setIsVoiceSearch(false)
      }, 2000)
    }
  }

  const handleAppLaunch = (appId: string) => {
    console.log(`Lanzando aplicación: ${appId}`)
    onAppLaunch(appId)
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-space-grotesk font-bold">Navegador Integral IA</span>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            ←
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            →
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            ↻
          </Button>
        </div>

        <div className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Búsqueda inteligente con IA - Pregunta cualquier cosa..."
                className="pl-10 pr-20 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceSearch}
                  className={`p-1 ${isVoiceSearch ? "text-red-400" : "text-white/50"} hover:text-white`}
                >
                  {isVoiceSearch ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                  IA
                </Badge>
              </div>
            </div>
          </form>

          {/* AI Search Suggestions */}
          {aiSuggestions.length > 0 && (
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
                  onClick={() => {
                    setSearchQuery(suggestion)
                    setAiSuggestions([])
                  }}
                >
                  <Command className="w-3 h-3 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Privacy & Security Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVPN}
            className={`${isVPNActive ? "text-green-400" : "text-white/70"} hover:text-white`}
          >
            {isVPNActive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={togglePrivateMode}
            className={`${isPrivateMode ? "text-blue-400" : "text-white/70"} hover:text-white`}
          >
            {isPrivateMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>

          <div className="flex items-center gap-1 text-xs text-white/50">
            <Shield className="w-3 h-3" />
            <span>{blockedAds + blockedTrackers}</span>
          </div>

          <Button variant="ghost" size="sm" onClick={onSwitchToDesktop} className="text-white/70 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`${sidebarCollapsed ? "w-16" : "w-80"} bg-black/30 backdrop-blur-md border-r border-white/10 flex flex-col transition-all duration-300`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback className="bg-purple-500 text-white">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-medium">Usuario IA</div>
                    <div className="text-white/50 text-sm">@usuario.ia</div>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white/70 hover:text-white"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "rotate-90" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Categories */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {sidebarCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      activeView === category.id
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setActiveView(category.id)}
                  >
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Integrated Music Player */}
              <div className="p-4 border-t border-white/10">
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm font-medium">Música</span>
                  </div>
                  <div className="text-white/70 text-xs mb-2">{currentTrack}</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white/70 hover:text-white p-1"
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-1">
                      <SkipForward className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white p-1">
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Integrated Messaging */}
              <div className="p-4 border-t border-white/10">
                <div className="space-y-2">
                  <div className="text-white/50 text-xs font-medium mb-2">MENSAJERÍA</div>
                  {[
                    { name: "WhatsApp", icon: MessageSquare, color: "text-green-400", unread: 3 },
                    { name: "Telegram", icon: MessageSquare, color: "text-blue-400", unread: 0 },
                    { name: "Discord", icon: MessageSquare, color: "text-purple-400", unread: 7 },
                  ].map((app) => (
                    <Button
                      key={app.name}
                      variant="ghost"
                      className="w-full justify-between text-white/70 hover:text-white hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <app.icon className={`w-4 h-4 ${app.color}`} />
                        <span className="text-sm">{app.name}</span>
                      </div>
                      {app.unread > 0 && (
                        <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                          {app.unread}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Islands and Workspace Management */}
          <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-2">
            <div className="flex items-center gap-4">
              {/* Workspace Selector */}
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">Espacio:</span>
                <select
                  value={currentWorkspace}
                  onChange={(e) => setCurrentWorkspace(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                >
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id} className="bg-slate-800">
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab Islands */}
              <div className="flex items-center gap-2 flex-1">
                {currentWorkspaceData.tabIslands.map((island) => (
                  <div key={island.id} className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                    <div className={`w-2 h-2 rounded-full ${island.color}`} />
                    <span className="text-white text-xs px-2">{island.name}</span>
                    <div className="flex">
                      {island.tabs.map((tab) => (
                        <Button
                          key={tab.id}
                          variant="ghost"
                          size="sm"
                          className={`text-xs px-2 py-1 h-6 ${
                            tab.isActive ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                          }`}
                        >
                          {tab.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Split Screen Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSplitScreenMode(!splitScreenMode)}
                className={`${splitScreenMode ? "text-blue-400" : "text-white/70"} hover:text-white`}
              >
                <div className="w-4 h-4 border border-current">
                  <div className="w-full h-1/2 border-b border-current" />
                </div>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeView === "inicio" ? (
              <div className="h-full overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                  {/* Welcome Section with AI Insights */}
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 font-space-grotesk">
                      Bienvenido a tu Navegador Integral de IA
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                      Tu asistente personal para gestionar finanzas, automatizar llamadas con CallWave, y optimizar tu
                      productividad con inteligencia artificial.
                    </p>
                  </div>

                  {/* AI Dashboard Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          Finanzas Personales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-white/70">Balance total</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">+5.2% este mes</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-purple-400" />
                          CallWave IA
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-white/70">Llamadas automatizadas</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Activity className="w-3 h-3 text-purple-400" />
                          <span className="text-xs text-purple-400">98% eficiencia</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Brain className="w-4 h-4 text-blue-400" />
                          Asistente IA
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">24/7</div>
                        <p className="text-xs text-white/70">Disponibilidad</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Zap className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-400">Activo</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-400" />
                          Privacidad
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{blockedAds + blockedTrackers}</div>
                        <p className="text-xs text-white/70">Elementos bloqueados</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Lock className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-400">Protegido</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Featured Communities */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white font-space-grotesk">Comunidades Destacadas</h2>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        Ver todas
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredCommunities.map((community) => (
                        <Card
                          key={community.id}
                          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                  {community.name}
                                  {community.trending && (
                                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 text-xs">
                                      Trending
                                    </Badge>
                                  )}
                                </CardTitle>
                                <p className="text-white/70 text-sm mt-1">{community.description}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-white/50" />
                                <span className="text-sm text-white/70">{community.members} miembros</span>
                              </div>
                              <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                                {community.category}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">Sugerencias de IA para hoy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentWorkspaceData.aiSuggestions.map((suggestion, index) => (
                        <Card
                          key={index}
                          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border-white/20 text-white"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span className="text-sm font-medium">IA Sugiere</span>
                            </div>
                            <p className="text-sm">{suggestion}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeView === "aplicaciones" ? (
              <div className="h-full overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
                      Aplicaciones del Escritorio
                    </h1>
                    <p className="text-white/70 text-lg">
                      Accede a todas tus aplicaciones integradas con inteligencia artificial
                    </p>
                  </div>

                  {/* App Categories */}
                  {["Negocios", "Finanzas", "Productividad", "Comunicación", "Multimedia", "Utilidades", "Sistema"].map(
                    (category) => {
                      const categoryApps = desktopApps.filter((app) => app.category === category)
                      if (categoryApps.length === 0) return null

                      return (
                        <div key={category} className="mb-8">
                          <h2 className="text-xl font-bold text-white mb-4 font-space-grotesk">{category}</h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {categoryApps.map((app) => (
                              <Card
                                key={app.id}
                                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-200 cursor-pointer group"
                                onClick={() => handleAppLaunch(app.id)}
                              >
                                <CardContent className="p-6 text-center">
                                  <div
                                    className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                                  >
                                    <app.icon className="w-8 h-8 text-white" />
                                  </div>
                                  <h3 className="font-medium text-sm mb-1">{app.name}</h3>
                                  <p className="text-xs text-white/60">{app.description}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )
                    },
                  )}

                  {/* Quick Actions */}
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-white mb-4 font-space-grotesk">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border-white/20 text-white cursor-pointer hover:bg-green-500/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-green-400" />
                            <div>
                              <h3 className="font-medium">Revisar Finanzas</h3>
                              <p className="text-sm text-white/70">Dashboard financiero</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 backdrop-blur-md border-white/20 text-white cursor-pointer hover:bg-purple-500/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-8 h-8 text-purple-400" />
                            <div>
                              <h3 className="font-medium">CallWave IA</h3>
                              <p className="text-sm text-white/70">Automatizar llamadas</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border-white/20 text-white cursor-pointer hover:bg-blue-500/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Brain className="w-8 h-8 text-blue-400" />
                            <div>
                              <h3 className="font-medium">Asistente IA</h3>
                              <p className="text-sm text-white/70">Consultar IA</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sección en Desarrollo</h2>
                  <p className="text-white/70">
                    La sección "{sidebarCategories.find((c) => c.id === activeView)?.name}" estará disponible pronto.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center gap-4">
          <span>Navegador Integral IA v1.0</span>
          <div className="flex items-center gap-2">
            <span>VPN: {isVPNActive ? "Activa" : "Inactiva"}</span>
            <span>•</span>
            <span>
              Bloqueados: {blockedAds} anuncios, {blockedTrackers} rastreadores
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Espacio: {currentWorkspaceData.name}</span>
          <span>•</span>
          <span>IA: Activa</span>
          {isVoiceSearch && (
            <>
              <span>•</span>
              <span className="text-red-400 animate-pulse">🎤 Escuchando...</span>
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
