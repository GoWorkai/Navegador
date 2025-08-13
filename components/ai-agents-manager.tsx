"use client"

import { useState, useEffect } from "react"
import {
  Bot,
  Brain,
  Zap,
  Play,
  Pause,
  Settings,
  Plus,
  Clock,
  TrendingUp,
  Home,
  DollarSign,
  Search,
  Shield,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProfile } from "@/components/profile-provider"

interface AIAgent {
  id: string
  name: string
  type: "financial" | "home" | "productivity" | "security" | "personal" | "research"
  description: string
  isActive: boolean
  isRunning: boolean
  lastRun: Date
  nextRun?: Date
  schedule: "continuous" | "hourly" | "daily" | "weekly" | "manual"
  priority: "high" | "medium" | "low"
  permissions: string[]
  config: Record<string, any>
  metrics: {
    tasksCompleted: number
    successRate: number
    avgExecutionTime: number
    lastResult: string
  }
  triggers: string[]
  actions: string[]
}

interface AIInsight {
  id: string
  agentId: string
  type: "recommendation" | "alert" | "achievement" | "prediction" | "optimization"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  timestamp: Date
  actionable: boolean
  category: string
  impact: number
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  triggers: string[]
  actions: string[]
  requiredPermissions: string[]
}

export function AIAgentsManager() {
  const { currentProfile, hasPermission } = useProfile()
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)
  const [newAgentData, setNewAgentData] = useState({
    name: "",
    type: "personal" as AIAgent["type"],
    description: "",
    schedule: "daily" as AIAgent["schedule"],
    priority: "medium" as AIAgent["priority"],
    triggers: [] as string[],
    actions: [] as string[],
  })

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: "financial_advisor",
      name: "Asesor Financiero Personal",
      description: "Analiza gastos, sugiere optimizaciones y monitorea metas financieras",
      category: "financial",
      triggers: ["new_transaction", "budget_exceeded", "goal_deadline_approaching"],
      actions: ["analyze_spending", "suggest_savings", "update_budget", "send_alert"],
      requiredPermissions: ["finance.view", "finance.edit", "ai.autonomous"],
    },
    {
      id: "home_optimizer",
      name: "Optimizador del Hogar",
      description: "Gestiona dispositivos inteligentes y optimiza consumo energético",
      category: "home",
      triggers: ["time_schedule", "weather_change", "occupancy_detected"],
      actions: ["adjust_temperature", "control_lights", "optimize_energy", "security_check"],
      requiredPermissions: ["system.settings", "ai.autonomous"],
    },
    {
      id: "productivity_assistant",
      name: "Asistente de Productividad",
      description: "Organiza tareas, programa recordatorios y optimiza flujos de trabajo",
      category: "productivity",
      triggers: ["calendar_event", "deadline_approaching", "task_completed"],
      actions: ["schedule_task", "send_reminder", "prioritize_work", "generate_report"],
      requiredPermissions: ["ai.chat", "ai.autonomous"],
    },
    {
      id: "security_monitor",
      name: "Monitor de Seguridad",
      description: "Supervisa actividad sospechosa y mantiene la seguridad del sistema",
      category: "security",
      triggers: ["unusual_activity", "failed_login", "new_device"],
      actions: ["security_scan", "block_threat", "notify_admin", "update_rules"],
      requiredPermissions: ["system.security", "ai.autonomous"],
    },
    {
      id: "research_agent",
      name: "Agente de Investigación",
      description: "Busca información relevante y genera resúmenes personalizados",
      category: "research",
      triggers: ["keyword_mention", "scheduled_research", "user_query"],
      actions: ["web_search", "analyze_content", "generate_summary", "save_findings"],
      requiredPermissions: ["nav.browse", "ai.advanced", "ai.autonomous"],
    },
  ]

  useEffect(() => {
    // Initialize with sample agents
    const sampleAgents: AIAgent[] = [
      {
        id: "agent_1",
        name: "Asesor Financiero Familiar",
        type: "financial",
        description: "Monitorea gastos familiares y sugiere optimizaciones de presupuesto",
        isActive: true,
        isRunning: false,
        lastRun: new Date(Date.now() - 3600000),
        nextRun: new Date(Date.now() + 3600000),
        schedule: "hourly",
        priority: "high",
        permissions: ["finance.view", "finance.edit", "ai.autonomous"],
        config: {
          budgetThreshold: 0.8,
          alertOnOverspend: true,
          suggestSavings: true,
        },
        metrics: {
          tasksCompleted: 156,
          successRate: 94.2,
          avgExecutionTime: 2.3,
          lastResult: "Identificó 3 oportunidades de ahorro por $180/mes",
        },
        triggers: ["new_transaction", "budget_exceeded", "monthly_analysis"],
        actions: ["analyze_spending", "suggest_optimizations", "update_forecasts"],
      },
      {
        id: "agent_2",
        name: "Gestor del Hogar Inteligente",
        type: "home",
        description: "Optimiza el consumo energético y automatiza dispositivos del hogar",
        isActive: true,
        isRunning: true,
        lastRun: new Date(Date.now() - 1800000),
        schedule: "continuous",
        priority: "medium",
        permissions: ["system.settings", "ai.autonomous"],
        config: {
          energySavingMode: true,
          autoAdjustTemperature: true,
          securityMonitoring: true,
        },
        metrics: {
          tasksCompleted: 2847,
          successRate: 98.7,
          avgExecutionTime: 0.8,
          lastResult: "Redujo consumo energético 15% esta semana",
        },
        triggers: ["occupancy_change", "weather_update", "energy_peak"],
        actions: ["adjust_climate", "control_lighting", "optimize_energy"],
      },
      {
        id: "agent_3",
        name: "Investigador Personal",
        type: "research",
        description: "Busca información relevante sobre tus intereses y genera resúmenes",
        isActive: true,
        isRunning: false,
        lastRun: new Date(Date.now() - 7200000),
        nextRun: new Date(Date.now() + 14400000),
        schedule: "daily",
        priority: "low",
        permissions: ["nav.browse", "ai.advanced", "ai.autonomous"],
        config: {
          researchTopics: currentProfile?.aiPersonality.interests || [],
          summaryLength: "medium",
          sourceReliability: "high",
        },
        metrics: {
          tasksCompleted: 89,
          successRate: 91.0,
          avgExecutionTime: 5.2,
          lastResult: "Generó 4 resúmenes sobre tecnología y finanzas",
        },
        triggers: ["daily_schedule", "trending_topics", "user_interest"],
        actions: ["search_web", "analyze_content", "generate_summary"],
      },
    ]

    const sampleInsights: AIInsight[] = [
      {
        id: "insight_1",
        agentId: "agent_1",
        type: "recommendation",
        title: "Oportunidad de Ahorro Detectada",
        description: "Puedes ahorrar $85/mes cancelando suscripciones duplicadas de streaming",
        priority: "high",
        timestamp: new Date(Date.now() - 1800000),
        actionable: true,
        category: "Finanzas",
        impact: 85,
      },
      {
        id: "insight_2",
        agentId: "agent_2",
        type: "achievement",
        title: "Meta de Eficiencia Energética Alcanzada",
        description: "Has reducido el consumo energético un 20% este mes gracias a la automatización",
        priority: "medium",
        timestamp: new Date(Date.now() - 3600000),
        actionable: false,
        category: "Hogar",
        impact: 45,
      },
      {
        id: "insight_3",
        agentId: "agent_3",
        type: "prediction",
        title: "Tendencia Tecnológica Emergente",
        description:
          "Basado en tu historial, podrías estar interesado en las nuevas herramientas de IA para productividad",
        priority: "low",
        timestamp: new Date(Date.now() - 7200000),
        actionable: true,
        category: "Investigación",
        impact: 0,
      },
    ]

    setAgents(sampleAgents)
    setInsights(sampleInsights)
  }, [currentProfile])

  const toggleAgent = (agentId: string) => {
    setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, isActive: !agent.isActive } : agent)))
  }

  const runAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              isRunning: true,
              lastRun: new Date(),
              metrics: {
                ...agent.metrics,
                tasksCompleted: agent.metrics.tasksCompleted + 1,
              },
            }
          : agent,
      ),
    )

    // Simulate agent execution
    setTimeout(() => {
      setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, isRunning: false } : agent)))
    }, 3000)
  }

  const createAgentFromTemplate = (template: WorkflowTemplate) => {
    const newAgent: AIAgent = {
      id: `agent_${Date.now()}`,
      name: template.name,
      type: template.category as AIAgent["type"],
      description: template.description,
      isActive: false,
      isRunning: false,
      lastRun: new Date(),
      schedule: "daily",
      priority: "medium",
      permissions: template.requiredPermissions,
      config: {},
      metrics: {
        tasksCompleted: 0,
        successRate: 0,
        avgExecutionTime: 0,
        lastResult: "Agente recién creado",
      },
      triggers: template.triggers,
      actions: template.actions,
    }

    setAgents((prev) => [...prev, newAgent])
    setIsCreateDialogOpen(false)
  }

  const getAgentIcon = (type: AIAgent["type"]) => {
    switch (type) {
      case "financial":
        return DollarSign
      case "home":
        return Home
      case "productivity":
        return Target
      case "security":
        return Shield
      case "research":
        return Search
      default:
        return Bot
    }
  }

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "recommendation":
        return Sparkles
      case "alert":
        return AlertTriangle
      case "achievement":
        return CheckCircle
      case "prediction":
        return TrendingUp
      case "optimization":
        return Zap
      default:
        return Brain
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!hasPermission("ai.autonomous")) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 dark:text-gray-400">No tienes permisos para gestionar agentes de IA autónomos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-500" />
            Agentes de IA Autónomos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona agentes inteligentes para automatizar tareas y flujos de trabajo
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Agente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Agente de IA</DialogTitle>
              <DialogDescription>Selecciona una plantilla o crea un agente personalizado</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="templates">Plantillas</TabsTrigger>
                <TabsTrigger value="custom">Personalizado</TabsTrigger>
              </TabsList>
              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workflowTemplates.map((template) => {
                    const IconComponent = getAgentIcon(template.category as AIAgent["type"])
                    const hasPermissions = template.requiredPermissions.every((perm) => hasPermission(perm))

                    return (
                      <Card key={template.id} className={!hasPermissions ? "opacity-50" : ""}>
                        <CardHeader>
                          <CardTitle className="flex items-center text-sm">
                            <IconComponent className="w-4 h-4 mr-2" />
                            {template.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                          <div className="space-y-2 mb-4">
                            <div>
                              <span className="text-xs font-medium">Disparadores:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {template.triggers.slice(0, 3).map((trigger, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {trigger}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium">Acciones:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {template.actions.slice(0, 3).map((action, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => createAgentFromTemplate(template)}
                            disabled={!hasPermissions}
                          >
                            {hasPermissions ? "Crear Agente" : "Permisos Insuficientes"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Agente</Label>
                    <Input
                      id="name"
                      value={newAgentData.name}
                      onChange={(e) => setNewAgentData({ ...newAgentData, name: e.target.value })}
                      placeholder="Mi Agente Personalizado"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newAgentData.type}
                      onValueChange={(value: AIAgent["type"]) => setNewAgentData({ ...newAgentData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="financial">Financiero</SelectItem>
                        <SelectItem value="home">Hogar</SelectItem>
                        <SelectItem value="productivity">Productividad</SelectItem>
                        <SelectItem value="security">Seguridad</SelectItem>
                        <SelectItem value="research">Investigación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newAgentData.description}
                    onChange={(e) => setNewAgentData({ ...newAgentData, description: e.target.value })}
                    placeholder="Describe qué hace este agente..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule">Programación</Label>
                    <Select
                      value={newAgentData.schedule}
                      onValueChange={(value: AIAgent["schedule"]) =>
                        setNewAgentData({ ...newAgentData, schedule: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continuous">Continuo</SelectItem>
                        <SelectItem value="hourly">Cada Hora</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={newAgentData.priority}
                      onValueChange={(value: AIAgent["priority"]) =>
                        setNewAgentData({ ...newAgentData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Crear Agente Personalizado</Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">
            <Bot className="w-4 h-4 mr-2" />
            Agentes ({agents.length})
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="w-4 h-4 mr-2" />
            Insights ({insights.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analíticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {agents.map((agent) => {
            const IconComponent = getAgentIcon(agent.type)
            return (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${agent.isActive ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
                      >
                        <IconComponent className={`w-5 h-5 ${agent.isActive ? "text-green-600" : "text-gray-500"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPriorityColor(agent.priority)}>
                            {agent.priority === "high" ? "Alta" : agent.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                          <Badge variant="outline">{agent.type}</Badge>
                          {agent.isRunning && (
                            <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                              <Zap className="w-3 h-3 mr-1" />
                              Ejecutando
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={agent.isActive} onCheckedChange={() => toggleAgent(agent.id)} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runAgent(agent.id)}
                        disabled={agent.isRunning || !agent.isActive}
                      >
                        {agent.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{agent.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{agent.metrics.tasksCompleted}</div>
                      <div className="text-xs text-gray-500">Tareas Completadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{agent.metrics.successRate}%</div>
                      <div className="text-xs text-gray-500">Tasa de Éxito</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{agent.metrics.avgExecutionTime}s</div>
                      <div className="text-xs text-gray-500">Tiempo Promedio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{agent.schedule}</div>
                      <div className="text-xs text-gray-500">Programación</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Última ejecución: {agent.lastRun.toLocaleString()}</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Último resultado: {agent.metrics.lastResult}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => {
            const IconComponent = getInsightIcon(insight.type)
            const agent = agents.find((a) => a.id === insight.agentId)

            return (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        insight.type === "alert"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : insight.type === "recommendation"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : insight.type === "achievement"
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-purple-100 dark:bg-purple-900/20"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          insight.type === "alert"
                            ? "text-red-600"
                            : insight.type === "recommendation"
                              ? "text-blue-600"
                              : insight.type === "achievement"
                                ? "text-green-600"
                                : "text-purple-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          {insight.impact !== 0 && (
                            <Badge variant={insight.impact > 0 ? "default" : "destructive"}>
                              {insight.impact > 0 ? "+" : ""}${insight.impact}
                            </Badge>
                          )}
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Por: {agent?.name}</span>
                          <span>•</span>
                          <span>{insight.timestamp.toLocaleString()}</span>
                          <span>•</span>
                          <span>{insight.category}</span>
                        </div>
                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            Tomar Acción
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agentes Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{agents.filter((a) => a.isActive).length}</div>
                <p className="text-sm text-gray-500">de {agents.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tareas Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {agents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0)}
                </div>
                <p className="text-sm text-gray-500">este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasa de Éxito Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {(agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500">en todas las tareas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tipo de Agente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  agents.reduce(
                    (acc, agent) => {
                      if (!acc[agent.type]) {
                        acc[agent.type] = { count: 0, totalTasks: 0, avgSuccess: 0 }
                      }
                      acc[agent.type].count++
                      acc[agent.type].totalTasks += agent.metrics.tasksCompleted
                      acc[agent.type].avgSuccess += agent.metrics.successRate
                      return acc
                    },
                    {} as Record<string, { count: number; totalTasks: number; avgSuccess: number }>,
                  ),
                ).map(([type, stats]) => {
                  const IconComponent = getAgentIcon(type as AIAgent["type"])
                  return (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium capitalize">{type}</div>
                          <div className="text-sm text-gray-500">{stats.count} agentes</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{stats.totalTasks} tareas</div>
                        <div className="text-sm text-gray-500">
                          {(stats.avgSuccess / stats.count).toFixed(1)}% éxito
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
