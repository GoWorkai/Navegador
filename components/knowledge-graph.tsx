"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/components/profile-provider"
import {
  Brain,
  Search,
  Plus,
  X,
  Link,
  User,
  MapPin,
  Calendar,
  FileText,
  Tag,
  Zap,
  Network,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Edit,
  Save,
  ArrowRight,
  Lightbulb,
  Target,
  Clock,
  Star,
} from "lucide-react"

interface KnowledgeNode {
  id: string
  label: string
  type: "person" | "place" | "concept" | "event" | "document" | "project" | "task" | "note"
  description?: string
  properties: Record<string, any>
  connections: string[]
  createdAt: Date
  lastModified: Date
  importance: number
  tags: string[]
  profileId: string
}

interface KnowledgeEdge {
  id: string
  source: string
  target: string
  relationship: string
  strength: number
  properties: Record<string, any>
  createdAt: Date
}

interface SemanticQuery {
  id: string
  query: string
  results: KnowledgeNode[]
  timestamp: Date
  relevanceScore: number
}

interface KnowledgeGraphProps {
  onClose?: () => void
}

const NODE_TYPES = [
  { id: "person", name: "Persona", icon: User, color: "bg-blue-500" },
  { id: "place", name: "Lugar", icon: MapPin, color: "bg-green-500" },
  { id: "concept", name: "Concepto", icon: Lightbulb, color: "bg-yellow-500" },
  { id: "event", name: "Evento", icon: Calendar, color: "bg-purple-500" },
  { id: "document", name: "Documento", icon: FileText, color: "bg-gray-500" },
  { id: "project", name: "Proyecto", icon: Target, color: "bg-orange-500" },
  { id: "task", name: "Tarea", icon: Clock, color: "bg-red-500" },
  { id: "note", name: "Nota", icon: Tag, color: "bg-pink-500" },
]

const RELATIONSHIP_TYPES = [
  "relacionado con",
  "trabaja en",
  "vive en",
  "conoce a",
  "parte de",
  "depende de",
  "influye en",
  "similar a",
  "opuesto a",
  "causa de",
  "resultado de",
  "colabora con",
]

export function KnowledgeGraph({ onClose }: KnowledgeGraphProps) {
  const { currentProfile, hasPermission } = useProfile()
  const [activeTab, setActiveTab] = useState("graph")
  const [nodes, setNodes] = useState<KnowledgeNode[]>([])
  const [edges, setEdges] = useState<KnowledgeEdge[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [isCreatingNode, setIsCreatingNode] = useState(false)
  const [isCreatingEdge, setIsCreatingEdge] = useState(false)
  const [semanticQueries, setSemanticQueries] = useState<SemanticQuery[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showConnections, setShowConnections] = useState(true)
  const [filterType, setFilterType] = useState<string>("all")

  // New node form
  const [newNode, setNewNode] = useState({
    label: "",
    type: "concept" as KnowledgeNode["type"],
    description: "",
    tags: [] as string[],
    importance: 5,
  })

  // New edge form
  const [newEdge, setNewEdge] = useState({
    source: "",
    target: "",
    relationship: "relacionado con",
    strength: 5,
  })

  useEffect(() => {
    if (!hasPermission("ai.advanced")) {
      return
    }
    loadKnowledgeGraph()
    generateSemanticInsights()
  }, [currentProfile])

  const loadKnowledgeGraph = () => {
    if (!currentProfile) return

    const savedNodes = localStorage.getItem(`aria-knowledge-nodes-${currentProfile.id}`)
    const savedEdges = localStorage.getItem(`aria-knowledge-edges-${currentProfile.id}`)
    const savedQueries = localStorage.getItem(`aria-semantic-queries-${currentProfile.id}`)

    if (savedNodes) {
      setNodes(
        JSON.parse(savedNodes).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          lastModified: new Date(n.lastModified),
        })),
      )
    }
    if (savedEdges) {
      setEdges(
        JSON.parse(savedEdges).map((e: any) => ({
          ...e,
          createdAt: new Date(e.createdAt),
        })),
      )
    }
    if (savedQueries) {
      setSemanticQueries(
        JSON.parse(savedQueries).map((q: any) => ({
          ...q,
          timestamp: new Date(q.timestamp),
        })),
      )
    }
  }

  const saveKnowledgeGraph = () => {
    if (currentProfile) {
      localStorage.setItem(`aria-knowledge-nodes-${currentProfile.id}`, JSON.stringify(nodes))
      localStorage.setItem(`aria-knowledge-edges-${currentProfile.id}`, JSON.stringify(edges))
      localStorage.setItem(`aria-semantic-queries-${currentProfile.id}`, JSON.stringify(semanticQueries))
    }
  }

  useEffect(() => {
    saveKnowledgeGraph()
  }, [nodes, edges, semanticQueries])

  const generateSemanticInsights = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis for semantic insights
    setTimeout(() => {
      const insights = []

      // Find highly connected nodes
      const nodeConnections = nodes.map((node) => ({
        node,
        connectionCount: edges.filter((edge) => edge.source === node.id || edge.target === node.id).length,
      }))

      const highlyConnected = nodeConnections
        .filter((nc) => nc.connectionCount >= 3)
        .sort((a, b) => b.connectionCount - a.connectionCount)
        .slice(0, 3)

      highlyConnected.forEach((nc) => {
        insights.push({
          type: "hub",
          title: `${nc.node.label} es un nodo central`,
          description: `Este ${nc.node.type} tiene ${nc.connectionCount} conexiones, lo que lo convierte en un elemento clave de tu red de conocimiento.`,
          nodeId: nc.node.id,
          priority: "high",
        })
      })

      // Find isolated nodes
      const isolatedNodes = nodes.filter(
        (node) => !edges.some((edge) => edge.source === node.id || edge.target === node.id),
      )

      if (isolatedNodes.length > 0) {
        insights.push({
          type: "isolated",
          title: `${isolatedNodes.length} nodos sin conexiones`,
          description:
            "Estos elementos podrían beneficiarse de más conexiones para enriquecer tu grafo de conocimiento.",
          nodes: isolatedNodes.slice(0, 3),
          priority: "medium",
        })
      }

      // Suggest potential connections
      const personNodes = nodes.filter((n) => n.type === "person")
      const projectNodes = nodes.filter((n) => n.type === "project")

      if (personNodes.length > 0 && projectNodes.length > 0) {
        insights.push({
          type: "suggestion",
          title: "Conexiones potenciales detectadas",
          description: "La IA sugiere conectar personas con proyectos relacionados basándose en patrones semánticos.",
          suggestions: personNodes.slice(0, 2).map((person) => ({
            person: person.label,
            project: projectNodes[0]?.label,
          })),
          priority: "low",
        })
      }

      setSemanticQueries((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          query: "Análisis automático de insights",
          results: highlyConnected.map((nc) => nc.node),
          timestamp: new Date(),
          relevanceScore: 0.9,
        },
      ])

      setIsAnalyzing(false)
    }, 2000)
  }

  const addNode = () => {
    if (!newNode.label || !currentProfile) return

    const node: KnowledgeNode = {
      id: Date.now().toString(),
      label: newNode.label,
      type: newNode.type,
      description: newNode.description,
      properties: {},
      connections: [],
      createdAt: new Date(),
      lastModified: new Date(),
      importance: newNode.importance,
      tags: newNode.tags,
      profileId: currentProfile.id,
    }

    setNodes((prev) => [...prev, node])
    setNewNode({
      label: "",
      type: "concept",
      description: "",
      tags: [],
      importance: 5,
    })
    setIsCreatingNode(false)
  }

  const addEdge = () => {
    if (!newEdge.source || !newEdge.target || newEdge.source === newEdge.target) return

    const edge: KnowledgeEdge = {
      id: Date.now().toString(),
      source: newEdge.source,
      target: newEdge.target,
      relationship: newEdge.relationship,
      strength: newEdge.strength,
      properties: {},
      createdAt: new Date(),
    }

    setEdges((prev) => [...prev, edge])
    setNewEdge({
      source: "",
      target: "",
      relationship: "relacionado con",
      strength: 5,
    })
    setIsCreatingEdge(false)
  }

  const performSemanticSearch = async (query: string) => {
    if (!query.trim()) return

    setIsAnalyzing(true)

    // Simulate semantic search
    setTimeout(() => {
      const results = nodes.filter((node) => {
        const searchText = `${node.label} ${node.description} ${node.tags.join(" ")}`.toLowerCase()
        const queryWords = query.toLowerCase().split(" ")
        return queryWords.some((word) => searchText.includes(word))
      })

      const semanticQuery: SemanticQuery = {
        id: Date.now().toString(),
        query,
        results,
        timestamp: new Date(),
        relevanceScore: results.length > 0 ? 0.8 : 0.2,
      }

      setSemanticQueries((prev) => [semanticQuery, ...prev.slice(0, 9)])
      setIsAnalyzing(false)
    }, 1000)
  }

  const getNodeConnections = (nodeId: string) => {
    return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)
  }

  const getConnectedNodes = (nodeId: string) => {
    const connections = getNodeConnections(nodeId)
    const connectedNodeIds = connections.map((edge) => (edge.source === nodeId ? edge.target : edge.source))
    return nodes.filter((node) => connectedNodeIds.includes(node.id))
  }

  const filteredNodes = useMemo(() => {
    let filtered = nodes
    if (filterType !== "all") {
      filtered = filtered.filter((node) => node.type === filterType)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (node) =>
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
    return filtered
  }, [nodes, filterType, searchQuery])

  const getNodeTypeInfo = (type: string) => {
    return NODE_TYPES.find((nt) => nt.id === type) || NODE_TYPES[0]
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Grafos de Conocimiento Personal</h2>
            <p className="text-indigo-100 text-sm">Red semántica de tu información</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>Analizando...</span>
            </div>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasPermission("ai.advanced") && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none">
            <TabsTrigger value="graph" className="flex items-center space-x-2">
              <Network className="h-4 w-4" />
              <span>Grafo</span>
            </TabsTrigger>
            <TabsTrigger value="nodes" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Nodos</span>
              <Badge variant="secondary" className="ml-1">
                {nodes.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Búsqueda Semántica</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="graph" className="p-6 space-y-6">
              {/* Graph Visualization */}
              <Card className="p-6 bg-gray-800 border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Visualización del Grafo</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConnections(!showConnections)}
                      className="border-gray-600"
                    >
                      {showConnections ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>

                {/* Simple Graph Representation */}
                <div className="bg-gray-900 rounded-lg p-6 min-h-96 relative overflow-hidden">
                  {nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Network className="h-12 w-12 mx-auto mb-4" />
                        <p>No hay nodos en tu grafo de conocimiento</p>
                        <p className="text-sm">Comienza agregando algunos conceptos, personas o lugares</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {filteredNodes.slice(0, 12).map((node, index) => {
                        const typeInfo = getNodeTypeInfo(node.type)
                        const IconComponent = typeInfo.icon
                        const connections = getNodeConnections(node.id)

                        return (
                          <div
                            key={node.id}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                              selectedNode?.id === node.id
                                ? "border-purple-500 bg-purple-600/20"
                                : "border-gray-600 bg-gray-700 hover:border-gray-500"
                            }`}
                            onClick={() => setSelectedNode(node)}
                          >
                            <div
                              className={`w-12 h-12 ${typeInfo.color} rounded-full flex items-center justify-center mb-3 mx-auto`}
                            >
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-white font-medium text-center text-sm mb-2">{node.label}</h4>
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                              <Link className="h-3 w-3" />
                              <span>{connections.length}</span>
                            </div>

                            {/* Connection Lines (simplified) */}
                            {showConnections && connections.length > 0 && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </Card>

              {/* Selected Node Details */}
              {selectedNode && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Detalles del Nodo</h3>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedNode(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-400">Nombre</label>
                          <p className="text-white font-medium">{selectedNode.label}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Tipo</label>
                          <p className="text-white">{getNodeTypeInfo(selectedNode.type).name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Descripción</label>
                          <p className="text-gray-300 text-sm">{selectedNode.description || "Sin descripción"}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Importancia</label>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= selectedNode.importance ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                            <span className="text-white text-sm">{selectedNode.importance}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-400">Conexiones</label>
                          <div className="space-y-2">
                            {getConnectedNodes(selectedNode.id)
                              .slice(0, 5)
                              .map((connectedNode) => (
                                <div key={connectedNode.id} className="flex items-center space-x-2 text-sm">
                                  <ArrowRight className="h-3 w-3 text-gray-400" />
                                  <span className="text-white">{connectedNode.label}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {getNodeTypeInfo(connectedNode.type).name}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400">Etiquetas</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedNode.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400">Creado</label>
                          <p className="text-gray-300 text-sm">{selectedNode.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="nodes" className="p-6 space-y-6">
              {/* Node Management */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar nodos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">Todos los tipos</option>
                    {NODE_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setIsCreatingNode(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Nodo
                  </Button>
                  <Button onClick={() => setIsCreatingEdge(true)} variant="outline" className="border-gray-600">
                    <Link className="h-4 w-4 mr-2" />
                    Nueva Conexión
                  </Button>
                </div>
              </div>

              {/* Create Node Form */}
              {isCreatingNode && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Crear Nuevo Nodo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                      <Input
                        value={newNode.label}
                        onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                        placeholder="Nombre del nodo"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                      <select
                        value={newNode.type}
                        onChange={(e) => setNewNode({ ...newNode, type: e.target.value as KnowledgeNode["type"] })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        {NODE_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                      <Input
                        value={newNode.description}
                        onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                        placeholder="Descripción opcional"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Importancia (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={newNode.importance}
                        onChange={(e) => setNewNode({ ...newNode, importance: Number.parseInt(e.target.value) || 5 })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={addNode} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Crear Nodo
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingNode(false)}>
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}

              {/* Create Edge Form */}
              {isCreatingEdge && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Crear Nueva Conexión</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nodo Origen</label>
                      <select
                        value={newEdge.source}
                        onChange={(e) => setNewEdge({ ...newEdge, source: e.target.value })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Seleccionar origen</option>
                        {nodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Relación</label>
                      <select
                        value={newEdge.relationship}
                        onChange={(e) => setNewEdge({ ...newEdge, relationship: e.target.value })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        {RELATIONSHIP_TYPES.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nodo Destino</label>
                      <select
                        value={newEdge.target}
                        onChange={(e) => setNewEdge({ ...newEdge, target: e.target.value })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Seleccionar destino</option>
                        {nodes
                          .filter((node) => node.id !== newEdge.source)
                          .map((node) => (
                            <option key={node.id} value={node.id}>
                              {node.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={addEdge} className="bg-blue-600 hover:bg-blue-700">
                      <Link className="h-4 w-4 mr-2" />
                      Crear Conexión
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingEdge(false)}>
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}

              {/* Nodes List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNodes.map((node) => {
                  const typeInfo = getNodeTypeInfo(node.type)
                  const IconComponent = typeInfo.icon
                  const connections = getNodeConnections(node.id)

                  return (
                    <Card key={node.id} className="p-4 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${typeInfo.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{node.label}</h4>
                            <p className="text-gray-400 text-sm">{typeInfo.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {node.description && <p className="text-gray-300 text-sm mb-3">{node.description}</p>}

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Link className="h-3 w-3" />
                          <span>{connections.length} conexiones</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= node.importance ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="search" className="p-6 space-y-6">
              {/* Semantic Search */}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-semibold mb-4">Búsqueda Semántica</h3>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar conceptos, relaciones o patrones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && performSemanticSearch(searchQuery)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => performSemanticSearch(searchQuery)}
                    disabled={isAnalyzing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {isAnalyzing ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </Card>

              {/* Search History */}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-semibold mb-4">Historial de Búsquedas</h3>
                <div className="space-y-3">
                  {semanticQueries.slice(0, 10).map((query) => (
                    <div key={query.id} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{query.query}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{query.results.length} resultados</Badge>
                          <span className="text-xs text-gray-400">{query.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {query.results.slice(0, 5).map((result) => (
                          <Badge key={result.id} variant="outline" className="text-xs">
                            {result.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Insights del Grafo de Conocimiento</h3>
                <Button
                  onClick={generateSemanticInsights}
                  disabled={isAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analizando..." : "Generar Insights"}
                </Button>
              </div>

              {/* Knowledge Graph Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{nodes.length}</div>
                      <div className="text-sm text-gray-400">Nodos Totales</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Link className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{edges.length}</div>
                      <div className="text-sm text-gray-400">Conexiones</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{semanticQueries.length}</div>
                      <div className="text-sm text-gray-400">Consultas Semánticas</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Insights Placeholder */}
              <Card className="p-8 bg-gray-800 border-gray-700 text-center">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">Insights Inteligentes</h4>
                <p className="text-gray-400">
                  Los insights de IA aparecerán aquí basados en el análisis de tu grafo de conocimiento.
                </p>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      )}

      {!hasPermission("ai.advanced") && (
        <Card className="w-full h-full bg-gray-900 border-gray-700 flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Acceso Restringido</h3>
            <p className="text-gray-400">
              Necesitas permisos de IA avanzada para acceder a los grafos de conocimiento.
            </p>
          </div>
        </Card>
      )}
    </Card>
  )
}
