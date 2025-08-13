"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/components/profile-provider"
import {
  Bot,
  Play,
  Pause,
  Square,
  Plus,
  X,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Search,
  MessageSquare,
  BarChart3,
  Shield,
  Cpu,
  Eye,
  Save,
  RefreshCw,
} from "lucide-react"

interface AutonomousAgent {
  id: string
  name: string
  type: "research" | "task_manager" | "data_analyst" | "communicator" | "system_monitor" | "custom"
  description: string
  status: "idle" | "running" | "paused" | "completed" | "error"
  capabilities: string[]
  currentTask?: AgentTask
  taskHistory: AgentTask[]
  configuration: AgentConfiguration
  performance: AgentPerformance
  createdAt: Date
  lastActive: Date
  profileId: string
}

interface AgentTask {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled"
  progress: number
  startTime?: Date
  endTime?: Date
  estimatedDuration: number
  actualDuration?: number
  results?: any
  logs: AgentLog[]
  dependencies: string[]
}

interface AgentConfiguration {
  autonomyLevel: "supervised" | "semi_autonomous" | "fully_autonomous"
  maxConcurrentTasks: number
  allowedActions: string[]
  restrictions: string[]
  apiKeys: Record<string, string>
  preferences: Record<string, any>
  learningEnabled: boolean
  reportingFrequency: "real_time" | "hourly" | "daily" | "weekly"
}

interface AgentPerformance {
  tasksCompleted: number
  successRate: number
  averageTaskDuration: number
  totalRuntime: number
  errorCount: number
  lastErrorTime?: Date
  efficiency: number
  learningProgress: number
}

interface AgentLog {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  message: string
  details?: any
}

interface AutonomousAgentsProps {
  onClose?: () => void
}

const AGENT_TYPES = [
  {
    id: "research",
    name: "Investigador Web",
    icon: Search,
    color: "bg-blue-500",
    description: "Busca y analiza información en la web",
    capabilities: ["web_search", "content_analysis", "fact_checking", "report_generation"],
  },
  {
    id: "task_manager",
    name: "Gestor de Tareas",
    icon: Target,
    color: "bg-green-500",
    description: "Organiza y ejecuta tareas complejas",
    capabilities: ["task_planning", "scheduling", "progress_tracking", "resource_management"],
  },
  {
    id: "data_analyst",
    name: "Analista de Datos",
    icon: BarChart3,
    color: "bg-purple-500",
    description: "Analiza datos y genera insights",
    capabilities: ["data_processing", "statistical_analysis", "visualization", "pattern_recognition"],
  },
  {
    id: "communicator",
    name: "Comunicador",
    icon: MessageSquare,
    color: "bg-orange-500",
    description: "Gestiona comunicaciones y respuestas",
    capabilities: ["email_management", "chat_responses", "content_creation", "social_media"],
  },
  {
    id: "system_monitor",
    name: "Monitor del Sistema",
    icon: Shield,
    color: "bg-red-500",
    description: "Monitorea el sistema y detecta anomalías",
    capabilities: ["system_monitoring", "anomaly_detection", "performance_analysis", "alerting"],
  },
  {
    id: "custom",
    name: "Personalizado",
    icon: Cpu,
    color: "bg-gray-500",
    description: "Agente personalizable para tareas específicas",
    capabilities: ["custom_logic", "api_integration", "workflow_automation", "data_transformation"],
  },
]

const AUTONOMY_LEVELS = [
  {
    id: "supervised",
    name: "Supervisado",
    description: "Requiere aprobación para cada acción",
    color: "bg-yellow-500",
  },
  {
    id: "semi_autonomous",
    name: "Semi-autónomo",
    description: "Ejecuta tareas con supervisión ocasional",
    color: "bg-blue-500",
  },
  {
    id: "fully_autonomous",
    name: "Completamente autónomo",
    description: "Ejecuta tareas sin supervisión",
    color: "bg-green-500",
  },
]

export function AutonomousAgents({ onClose }: AutonomousAgentsProps) {
  const { currentProfile, hasPermission } = useProfile()
  const [activeTab, setActiveTab] = useState("agents")
  const [agents, setAgents] = useState<AutonomousAgent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AutonomousAgent | null>(null)
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // New agent form
  const [newAgent, setNewAgent] = useState({
    name: "",
    type: "research" as AutonomousAgent["type"],
    description: "",
    autonomyLevel: "semi_autonomous" as AgentConfiguration["autonomyLevel"],
    maxConcurrentTasks: 3,
    learningEnabled: true,
  })

  // New task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as AgentTask["priority"],
    estimatedDuration: 60,
    agentId: "",
  })

  useEffect(() => {
    if (!hasPermission("ai.autonomous")) {
      return
    }
    loadAgents()
    startAgentMonitoring()
  }, [currentProfile])

  const loadAgents = () => {
    if (!currentProfile) return

    const savedAgents = localStorage.getItem(`aria-agents-${currentProfile.id}`)
    if (savedAgents) {
      setAgents(
        JSON.parse(savedAgents).map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          lastActive: new Date(a.lastActive),
          taskHistory: a.taskHistory.map((t: any) => ({
            ...t,
            startTime: t.startTime ? new Date(t.startTime) : undefined,
            endTime: t.endTime ? new Date(t.endTime) : undefined,
            logs: t.logs.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })),
          })),
        })),
      )
    }
  }

  const saveAgents = () => {
    if (currentProfile) {
      localStorage.setItem(`aria-agents-${currentProfile.id}`, JSON.stringify(agents))
    }
  }

  useEffect(() => {
    saveAgents()
  }, [agents])

  const startAgentMonitoring = () => {
    // Simulate agent monitoring and updates
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status === "running" && agent.currentTask) {
            const updatedTask = { ...agent.currentTask }
            updatedTask.progress = Math.min(updatedTask.progress + Math.random() * 10, 100)

            // Add random log entry
            const logMessages = [
              "Procesando datos...",
              "Analizando resultados...",
              "Ejecutando acción...",
              "Verificando progreso...",
              "Optimizando rendimiento...",
            ]

            updatedTask.logs.push({
              id: Date.now().toString(),
              timestamp: new Date(),
              level: "info",
              message: logMessages[Math.floor(Math.random() * logMessages.length)],
            })

            // Complete task if progress reaches 100%
            if (updatedTask.progress >= 100) {
              updatedTask.status = "completed"
              updatedTask.endTime = new Date()
              updatedTask.actualDuration = updatedTask.endTime.getTime() - (updatedTask.startTime?.getTime() || 0)

              return {
                ...agent,
                status: "idle" as const,
                currentTask: undefined,
                taskHistory: [updatedTask, ...agent.taskHistory],
                performance: {
                  ...agent.performance,
                  tasksCompleted: agent.performance.tasksCompleted + 1,
                  successRate: ((agent.performance.tasksCompleted + 1) / (agent.performance.tasksCompleted + 1)) * 100,
                },
                lastActive: new Date(),
              }
            }

            return {
              ...agent,
              currentTask: updatedTask,
              lastActive: new Date(),
            }
          }
          return agent
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }

  const createAgent = () => {
    if (!newAgent.name || !currentProfile) return

    const agentType = AGENT_TYPES.find((t) => t.id === newAgent.type)!

    const agent: AutonomousAgent = {
      id: Date.now().toString(),
      name: newAgent.name,
      type: newAgent.type,
      description: newAgent.description || agentType.description,
      status: "idle",
      capabilities: agentType.capabilities,
      taskHistory: [],
      configuration: {
        autonomyLevel: newAgent.autonomyLevel,
        maxConcurrentTasks: newAgent.maxConcurrentTasks,
        allowedActions: agentType.capabilities,
        restrictions: [],
        apiKeys: {},
        preferences: {},
        learningEnabled: newAgent.learningEnabled,
        reportingFrequency: "hourly",
      },
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageTaskDuration: 0,
        totalRuntime: 0,
        errorCount: 0,
        efficiency: 0,
        learningProgress: 0,
      },
      createdAt: new Date(),
      lastActive: new Date(),
      profileId: currentProfile.id,
    }

    setAgents((prev) => [...prev, agent])
    setNewAgent({
      name: "",
      type: "research",
      description: "",
      autonomyLevel: "semi_autonomous",
      maxConcurrentTasks: 3,
      learningEnabled: true,
    })
    setIsCreatingAgent(false)
  }

  const assignTask = () => {
    if (!newTask.title || !newTask.agentId) return

    const task: AgentTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: "pending",
      progress: 0,
      estimatedDuration: newTask.estimatedDuration,
      logs: [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          level: "info",
          message: "Tarea creada y asignada",
        },
      ],
      dependencies: [],
    }

    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === newTask.agentId ? { ...agent, taskHistory: [task, ...agent.taskHistory] } : agent,
      ),
    )

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      estimatedDuration: 60,
      agentId: "",
    })
    setIsCreatingTask(false)
  }

  const startAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId && agent.status === "idle") {
          const pendingTask = agent.taskHistory.find((t) => t.status === "pending")
          if (pendingTask) {
            const updatedTask = {
              ...pendingTask,
              status: "in_progress" as const,
              startTime: new Date(),
              logs: [
                ...pendingTask.logs,
                {
                  id: Date.now().toString(),
                  timestamp: new Date(),
                  level: "info" as const,
                  message: "Iniciando ejecución de tarea",
                },
              ],
            }

            return {
              ...agent,
              status: "running" as const,
              currentTask: updatedTask,
              taskHistory: agent.taskHistory.map((t) => (t.id === pendingTask.id ? updatedTask : t)),
              lastActive: new Date(),
            }
          }
        }
        return agent
      }),
    )
  }

  const pauseAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, status: "paused" as const, lastActive: new Date() } : agent,
      ),
    )
  }

  const stopAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status: "idle" as const,
              currentTask: undefined,
              lastActive: new Date(),
            }
          : agent,
      ),
    )
  }

  const filteredAgents = useMemo(() => {
    let filtered = agents
    if (filterStatus !== "all") {
      filtered = filtered.filter((agent) => agent.status === filterStatus)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    return filtered
  }, [agents, filterStatus, searchQuery])

  const getAgentTypeInfo = (type: string) => {
    return AGENT_TYPES.find((t) => t.id === type) || AGENT_TYPES[0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return Play
      case "paused":
        return Pause
      case "error":
        return AlertTriangle
      case "completed":
        return CheckCircle
      default:
        return Clock
    }
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Agentes de IA Autónomos</h2>
            <p className="text-cyan-100 text-sm">Automatización inteligente avanzada</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>Monitoreando...</span>
            </div>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasPermission("ai.autonomous") && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none">
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>Agentes</span>
              <Badge variant="secondary" className="ml-1">
                {agents.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Tareas</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Monitoreo</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Análisis</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="agents" className="p-6 space-y-6">
              {/* Agent Management */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar agentes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="idle">Inactivo</option>
                    <option value="running">Ejecutando</option>
                    <option value="paused">Pausado</option>
                    <option value="completed">Completado</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <Button onClick={() => setIsCreatingAgent(true)} className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Agente
                </Button>
              </div>

              {/* Create Agent Form */}
              {isCreatingAgent && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Crear Nuevo Agente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                      <Input
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                        placeholder="Nombre del agente"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                      <select
                        value={newAgent.type}
                        onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value as AutonomousAgent["type"] })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        {AGENT_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                      <Input
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                        placeholder="Descripción del agente"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nivel de Autonomía</label>
                      <select
                        value={newAgent.autonomyLevel}
                        onChange={(e) =>
                          setNewAgent({
                            ...newAgent,
                            autonomyLevel: e.target.value as AgentConfiguration["autonomyLevel"],
                          })
                        }
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        {AUTONOMY_LEVELS.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Tareas Concurrentes</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={newAgent.maxConcurrentTasks}
                        onChange={(e) =>
                          setNewAgent({ ...newAgent, maxConcurrentTasks: Number.parseInt(e.target.value) || 3 })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={createAgent} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Crear Agente
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingAgent(false)}>
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}

              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map((agent) => {
                  const typeInfo = getAgentTypeInfo(agent.type)
                  const IconComponent = typeInfo.icon
                  const StatusIcon = getStatusIcon(agent.status)

                  return (
                    <Card
                      key={agent.id}
                      className="p-4 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{agent.name}</h4>
                            <p className="text-gray-400 text-sm">{typeInfo.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${getStatusColor(agent.status)} rounded-full`}></div>
                          <StatusIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3">{agent.description}</p>

                      {/* Current Task Progress */}
                      {agent.currentTask && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{agent.currentTask.title}</span>
                            <span>{agent.currentTask.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${agent.currentTask.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Performance Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="text-center p-2 bg-gray-700 rounded">
                          <div className="text-white font-semibold">{agent.performance.tasksCompleted}</div>
                          <div className="text-gray-400">Completadas</div>
                        </div>
                        <div className="text-center p-2 bg-gray-700 rounded">
                          <div className="text-white font-semibold">{agent.performance.successRate.toFixed(0)}%</div>
                          <div className="text-gray-400">Éxito</div>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex space-x-2">
                        {agent.status === "idle" && (
                          <Button
                            size="sm"
                            onClick={() => startAgent(agent.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        {agent.status === "running" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => pauseAgent(agent.id)}
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                            >
                              <Pause className="h-3 w-3 mr-1" />
                              Pausar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => stopAgent(agent.id)}
                              variant="outline"
                              className="border-gray-600"
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        {agent.status === "paused" && (
                          <Button
                            size="sm"
                            onClick={() => startAgent(agent.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Reanudar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAgent(agent)}
                          className="border-gray-600"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Agent Details Modal */}
              {selectedAgent && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Detalles del Agente: {selectedAgent.name}</h3>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedAgent(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Estado</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${getStatusColor(selectedAgent.status)} rounded-full`}></div>
                          <span className="text-white capitalize">{selectedAgent.status}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Capacidades</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedAgent.capabilities.map((cap) => (
                            <Badge key={cap} variant="outline" className="text-xs">
                              {cap.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Configuración</label>
                        <div className="text-white text-sm">
                          <p>Autonomía: {selectedAgent.configuration.autonomyLevel}</p>
                          <p>Tareas máximas: {selectedAgent.configuration.maxConcurrentTasks}</p>
                          <p>
                            Aprendizaje: {selectedAgent.configuration.learningEnabled ? "Habilitado" : "Deshabilitado"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Rendimiento</label>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Tareas completadas:</span>
                            <span className="text-white">{selectedAgent.performance.tasksCompleted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Tasa de éxito:</span>
                            <span className="text-white">{selectedAgent.performance.successRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Errores:</span>
                            <span className="text-white">{selectedAgent.performance.errorCount}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Historial Reciente</label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {selectedAgent.taskHistory.slice(0, 5).map((task) => (
                            <div key={task.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300 truncate">{task.title}</span>
                              <Badge
                                variant={task.status === "completed" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {task.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="p-6 space-y-6">
              {/* Task Assignment */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Gestión de Tareas</h3>
                <Button onClick={() => setIsCreatingTask(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Tarea
                </Button>
              </div>

              {/* Create Task Form */}
              {isCreatingTask && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Asignar Nueva Tarea</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Título</label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Título de la tarea"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Agente</label>
                      <select
                        value={newTask.agentId}
                        onChange={(e) => setNewTask({ ...newTask, agentId: e.target.value })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Seleccionar agente</option>
                        {agents
                          .filter((a) => a.status === "idle")
                          .map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                      <Input
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Descripción de la tarea"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Prioridad</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as AgentTask["priority"] })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Duración Estimada (min)</label>
                      <Input
                        type="number"
                        min="1"
                        value={newTask.estimatedDuration}
                        onChange={(e) =>
                          setNewTask({ ...newTask, estimatedDuration: Number.parseInt(e.target.value) || 60 })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={assignTask} className="bg-green-600 hover:bg-green-700">
                      <Target className="h-4 w-4 mr-2" />
                      Asignar Tarea
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingTask(false)}>
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}

              {/* Tasks Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {agents.reduce(
                          (sum, agent) => sum + agent.taskHistory.filter((t) => t.status === "pending").length,
                          0,
                        )}
                      </div>
                      <div className="text-sm text-gray-400">Pendientes</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {agents.filter((a) => a.status === "running").length}
                      </div>
                      <div className="text-sm text-gray-400">En Progreso</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {agents.reduce((sum, agent) => sum + agent.performance.tasksCompleted, 0)}
                      </div>
                      <div className="text-sm text-gray-400">Completadas</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {agents.reduce((sum, agent) => sum + agent.performance.errorCount, 0)}
                      </div>
                      <div className="text-sm text-gray-400">Errores</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Monitoreo en Tiempo Real</h3>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>

              {/* Real-time Agent Status */}
              <div className="space-y-4">
                {agents
                  .filter((a) => a.status === "running")
                  .map((agent) => (
                    <Card key={agent.id} className="p-4 bg-gray-800 border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <h4 className="text-white font-medium">{agent.name}</h4>
                          <Badge className="bg-green-600">Ejecutando</Badge>
                        </div>
                        <div className="text-sm text-gray-400">{agent.lastActive.toLocaleTimeString()}</div>
                      </div>

                      {agent.currentTask && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">{agent.currentTask.title}</span>
                            <span className="text-white">{agent.currentTask.progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${agent.currentTask.progress}%` }}
                            ></div>
                          </div>

                          {/* Recent Logs */}
                          <div className="mt-3">
                            <h5 className="text-sm text-gray-400 mb-2">Logs Recientes:</h5>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {agent.currentTask.logs.slice(-5).map((log) => (
                                <div key={log.id} className="flex items-center space-x-2 text-xs">
                                  <span className="text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                                  <span
                                    className={
                                      log.level === "error"
                                        ? "text-red-400"
                                        : log.level === "warning"
                                          ? "text-yellow-400"
                                          : log.level === "success"
                                            ? "text-green-400"
                                            : "text-gray-300"
                                    }
                                  >
                                    {log.message}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>

              {agents.filter((a) => a.status === "running").length === 0 && (
                <Card className="p-8 bg-gray-800 border-gray-700 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-white font-semibold mb-2">No hay agentes ejecutándose</h4>
                  <p className="text-gray-400">Los agentes activos aparecerán aquí con monitoreo en tiempo real.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="p-6 space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Análisis de Rendimiento</h3>
                <p className="text-gray-400">Métricas y estadísticas de tus agentes autónomos</p>
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{agents.length}</div>
                      <div className="text-sm text-gray-400">Agentes Totales</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {agents.length > 0
                          ? (
                              agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-400">Tasa de Éxito Promedio</div>
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
                        {agents.reduce((sum, agent) => sum + agent.performance.totalRuntime, 0).toFixed(0)}h
                      </div>
                      <div className="text-sm text-gray-400">Tiempo Total de Ejecución</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Agent Performance Breakdown */}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h4 className="text-white font-semibold mb-4">Rendimiento por Agente</h4>
                <div className="space-y-3">
                  {agents.map((agent) => {
                    const typeInfo = getAgentTypeInfo(agent.type)
                    const IconComponent = typeInfo.icon

                    return (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${typeInfo.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-white font-medium">{agent.name}</h5>
                            <p className="text-gray-400 text-sm">{typeInfo.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="text-white font-semibold">{agent.performance.tasksCompleted}</div>
                            <div className="text-gray-400">Tareas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold">{agent.performance.successRate.toFixed(0)}%</div>
                            <div className="text-gray-400">Éxito</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold">{agent.performance.errorCount}</div>
                            <div className="text-gray-400">Errores</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {!hasPermission("ai.autonomous") && (
        <Card className="w-full h-full bg-gray-900 border-gray-700 flex items-center justify-center">
          <div className="text-center">
            <Bot className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Acceso Restringido</h3>
            <p className="text-gray-400">Necesitas permisos de agentes autónomos para acceder a esta funcionalidad.</p>
          </div>
        </Card>
      )}
    </Card>
  )
}
