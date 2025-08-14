"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Sparkles,
  FolderPlus,
  Settings,
  Clock,
  Globe,
  Star,
  X,
  Zap,
  Target,
  Users,
  Gamepad2,
  BookOpen,
  Coffee,
  Briefcase,
  Home,
  Music,
  ShoppingCart,
  Camera,
} from "lucide-react"

interface Tab {
  id: number
  title: string
  url: string
  active: boolean
  isIncognito?: boolean
  workspaceId: number
  category?: string
  lastAccessed: Date
  timeSpent: number
  favicon?: string
}

interface Workspace {
  id: number
  name: string
  color: string
  icon: string
  tabs: Tab[]
  createdAt: Date
  lastActive: Date
  category: string
  description?: string
  autoGroup: boolean
  rules: WorkspaceRule[]
}

interface WorkspaceRule {
  id: string
  type: "domain" | "keyword" | "time" | "category"
  value: string
  action: "move" | "suggest" | "block"
}

interface WorkspaceManagerProps {
  workspaces: Workspace[]
  currentWorkspace: number
  onWorkspaceChange: (workspaces: Workspace[]) => void
  onSwitchWorkspace: (id: number) => void
  onClose: () => void
}

const workspaceTemplates = [
  {
    name: "Trabajo",
    icon: "💼",
    color: "bg-blue-600",
    category: "productivity",
    description: "Para tareas profesionales y productividad",
  },
  {
    name: "Estudio",
    icon: "📚",
    color: "bg-green-600",
    category: "education",
    description: "Investigación y aprendizaje",
  },
  {
    name: "Entretenimiento",
    icon: "🎮",
    color: "bg-purple-600",
    category: "entertainment",
    description: "Videos, juegos y ocio",
  },
  {
    name: "Compras",
    icon: "🛒",
    color: "bg-orange-600",
    category: "shopping",
    description: "E-commerce y comparación de precios",
  },
  {
    name: "Social",
    icon: "👥",
    color: "bg-pink-600",
    category: "social",
    description: "Redes sociales y comunicación",
  },
  { name: "Noticias", icon: "📰", color: "bg-red-600", category: "news", description: "Información y actualidad" },
  {
    name: "Desarrollo",
    icon: "💻",
    color: "bg-indigo-600",
    category: "development",
    description: "Programación y herramientas",
  },
  { name: "Finanzas", icon: "💰", color: "bg-yellow-600", category: "finance", description: "Banca y inversiones" },
]

const categoryIcons = {
  productivity: Briefcase,
  education: BookOpen,
  entertainment: Gamepad2,
  shopping: ShoppingCart,
  social: Users,
  news: Globe,
  development: Target,
  finance: Star,
  personal: Home,
  music: Music,
  photography: Camera,
  other: Coffee,
}

export function WorkspaceManager({
  workspaces,
  currentWorkspace,
  onWorkspaceChange,
  onSwitchWorkspace,
  onClose,
}: WorkspaceManagerProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    category: "other",
    description: "",
    autoGroup: true,
  })
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    generateAISuggestions()
  }, [workspaces])

  const generateAISuggestions = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const suggestions = []

      // Analyze tab patterns
      const allTabs = workspaces.flatMap((w) => w.tabs)
      const domainGroups = groupTabsByDomain(allTabs)

      // Suggest workspace consolidation
      if (workspaces.length > 5) {
        suggestions.push({
          type: "consolidate",
          title: "Consolidar Workspaces",
          description: `Tienes ${workspaces.length} workspaces. Considera consolidar algunos similares.`,
          action: "consolidate_workspaces",
          priority: "medium",
        })
      }

      // Suggest new workspaces based on domains
      Object.entries(domainGroups).forEach(([domain, tabs]) => {
        if (tabs.length >= 3 && !workspaces.some((w) => w.name.toLowerCase().includes(domain))) {
          suggestions.push({
            type: "create",
            title: `Crear workspace para ${domain}`,
            description: `Tienes ${tabs.length} pestañas de ${domain}. ¿Crear un workspace dedicado?`,
            action: "create_domain_workspace",
            data: { domain, tabs },
            priority: "high",
          })
        }
      })

      // Suggest tab cleanup
      const oldTabs = allTabs.filter((tab) => Date.now() - tab.lastAccessed.getTime() > 7 * 24 * 60 * 60 * 1000)
      if (oldTabs.length > 0) {
        suggestions.push({
          type: "cleanup",
          title: "Limpiar pestañas antiguas",
          description: `${oldTabs.length} pestañas no han sido usadas en más de una semana.`,
          action: "cleanup_old_tabs",
          data: { tabs: oldTabs },
          priority: "low",
        })
      }

      setAiSuggestions(suggestions)
      setIsAnalyzing(false)
    }, 2000)
  }

  const groupTabsByDomain = (tabs: Tab[]) => {
    return tabs.reduce(
      (groups, tab) => {
        try {
          const domain = new URL(tab.url).hostname.replace("www.", "")
          if (!groups[domain]) groups[domain] = []
          groups[domain].push(tab)
        } catch {
          // Invalid URL, skip
        }
        return groups
      },
      {} as Record<string, Tab[]>,
    )
  }

  const createWorkspaceFromTemplate = (template: (typeof workspaceTemplates)[0]) => {
    const newWs: Workspace = {
      id: Date.now(),
      name: template.name,
      color: template.color,
      icon: template.icon,
      category: template.category,
      description: template.description,
      tabs: [],
      createdAt: new Date(),
      lastActive: new Date(),
      autoGroup: true,
      rules: generateDefaultRules(template.category),
    }

    onWorkspaceChange([...workspaces, newWs])
  }

  const generateDefaultRules = (category: string): WorkspaceRule[] => {
    const ruleMap: Record<string, WorkspaceRule[]> = {
      productivity: [
        { id: "1", type: "domain", value: "docs.google.com", action: "move" },
        { id: "2", type: "domain", value: "notion.so", action: "move" },
        { id: "3", type: "keyword", value: "productivity", action: "suggest" },
      ],
      entertainment: [
        { id: "1", type: "domain", value: "youtube.com", action: "move" },
        { id: "2", type: "domain", value: "netflix.com", action: "move" },
        { id: "3", type: "domain", value: "twitch.tv", action: "move" },
      ],
      shopping: [
        { id: "1", type: "domain", value: "amazon.com", action: "move" },
        { id: "2", type: "domain", value: "ebay.com", action: "move" },
        { id: "3", type: "keyword", value: "shop", action: "suggest" },
      ],
    }

    return ruleMap[category] || []
  }

  const applySuggestion = (suggestion: any) => {
    switch (suggestion.action) {
      case "create_domain_workspace":
        const domainWs: Workspace = {
          id: Date.now(),
          name: suggestion.data.domain.charAt(0).toUpperCase() + suggestion.data.domain.slice(1),
          color: "bg-cyan-600",
          icon: "🌐",
          category: "other",
          tabs: [],
          createdAt: new Date(),
          lastActive: new Date(),
          autoGroup: true,
          rules: [{ id: "1", type: "domain", value: suggestion.data.domain, action: "move" }],
        }
        onWorkspaceChange([...workspaces, domainWs])
        break

      case "cleanup_old_tabs":
        const updatedWorkspaces = workspaces.map((ws) => ({
          ...ws,
          tabs: ws.tabs.filter((tab) => !suggestion.data.tabs.includes(tab)),
        }))
        onWorkspaceChange(updatedWorkspaces)
        break
    }

    setAiSuggestions((prev) => prev.filter((s) => s !== suggestion))
  }

  const getWorkspaceStats = (workspace: Workspace) => {
    const totalTabs = workspace.tabs.length
    const activeTabs = workspace.tabs.filter((t) => Date.now() - t.lastAccessed.getTime() < 24 * 60 * 60 * 1000).length
    const totalTime = workspace.tabs.reduce((sum, tab) => sum + tab.timeSpent, 0)

    return { totalTabs, activeTabs, totalTime }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gestión Avanzada de Workspaces</h2>
            <p className="text-indigo-100 text-sm">Organización inteligente con IA</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>Analizando...</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Vista General</span>
          </TabsTrigger>
          <TabsTrigger value="ai-suggestions" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Sugerencias IA</span>
            {aiSuggestions.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {aiSuggestions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Plantillas</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Análisis</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((workspace) => {
                const stats = getWorkspaceStats(workspace)
                const CategoryIcon = categoryIcons[workspace.category as keyof typeof categoryIcons] || Coffee

                return (
                  <Card
                    key={workspace.id}
                    className={`p-4 border-gray-700 transition-all hover:scale-105 ${
                      currentWorkspace === workspace.id ? "bg-indigo-600/20 border-indigo-500" : "bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 ${workspace.color} rounded-lg flex items-center justify-center text-lg`}
                        >
                          {workspace.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{workspace.name}</h3>
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <CategoryIcon className="h-3 w-3" />
                            <span>{workspace.category}</span>
                          </div>
                        </div>
                      </div>
                      {currentWorkspace === workspace.id && <Badge className="bg-green-600">Activo</Badge>}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Pestañas:</span>
                        <span className="text-white">{stats.totalTabs}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Activas hoy:</span>
                        <span className="text-green-400">{stats.activeTabs}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tiempo total:</span>
                        <span className="text-blue-400">{formatTime(stats.totalTime)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onSwitchWorkspace(workspace.id)}
                        className={currentWorkspace === workspace.id ? "bg-indigo-600" : "bg-gray-600"}
                      >
                        {currentWorkspace === workspace.id ? "Activo" : "Cambiar"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="ai-suggestions" className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Sugerencias Inteligentes</h3>
              <Button
                onClick={generateAISuggestions}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Analizando..." : "Actualizar"}
              </Button>
            </div>

            {aiSuggestions.length === 0 ? (
              <Card className="p-8 bg-gray-800 border-gray-700 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">No hay sugerencias disponibles</h4>
                <p className="text-gray-400">La IA está analizando tus patrones de navegación...</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <Card key={index} className="p-4 bg-gray-800 border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <h4 className="text-white font-semibold">{suggestion.title}</h4>
                          <Badge
                            variant={
                              suggestion.priority === "high"
                                ? "destructive"
                                : suggestion.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{suggestion.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Aplicar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAiSuggestions((prev) => prev.filter((s) => s !== suggestion))}
                        >
                          Descartar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="p-6 space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Plantillas de Workspace</h3>
              <p className="text-gray-400">Crea workspaces optimizados para diferentes actividades</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaceTemplates.map((template) => {
                const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || Coffee

                return (
                  <Card
                    key={template.name}
                    className="p-4 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center text-lg`}
                      >
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{template.name}</h4>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <CategoryIcon className="h-3 w-3" />
                          <span>{template.category}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{template.description}</p>

                    <Button
                      size="sm"
                      onClick={() => createWorkspaceFromTemplate(template)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Crear Workspace
                    </Button>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="p-6 space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Análisis de Uso</h3>
              <p className="text-gray-400">Estadísticas detalladas de tus workspaces</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-gray-800 border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{workspaces.length}</div>
                    <div className="text-sm text-gray-400">Workspaces Totales</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-800 border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {workspaces.reduce((sum, ws) => sum + ws.tabs.length, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Pestañas Totales</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-800 border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatTime(
                        workspaces.reduce(
                          (sum, ws) => sum + ws.tabs.reduce((tabSum, tab) => tabSum + tab.timeSpent, 0),
                          0,
                        ),
                      )}
                    </div>
                    <div className="text-sm text-gray-400">Tiempo Total</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              {workspaces.map((workspace) => {
                const stats = getWorkspaceStats(workspace)
                const usage =
                  stats.totalTime > 0
                    ? (stats.totalTime /
                        workspaces.reduce(
                          (sum, ws) => sum + ws.tabs.reduce((tabSum, tab) => tabSum + tab.timeSpent, 0),
                          1,
                        )) *
                      100
                    : 0

                return (
                  <Card key={workspace.id} className="p-4 bg-gray-800 border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 ${workspace.color} rounded-lg flex items-center justify-center text-sm`}
                        >
                          {workspace.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{workspace.name}</h4>
                          <p className="text-gray-400 text-sm">{stats.totalTabs} pestañas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{formatTime(stats.totalTime)}</div>
                        <div className="text-gray-400 text-sm">{usage.toFixed(1)}% del tiempo</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${workspace.color.replace("bg-", "bg-")}`}
                        style={{ width: `${Math.max(usage, 2)}%` }}
                      ></div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}
