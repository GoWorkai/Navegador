"use client"

import { useState } from "react"
import {
  Search,
  Brain,
  Globe,
  FileText,
  Zap,
  Network,
  TrendingUp,
  Clock,
  Tag,
  Users,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/components/profile-provider"

interface SearchResult {
  id: string
  type: "web" | "document" | "ai_insight" | "knowledge_graph" | "semantic" | "personal"
  title: string
  url?: string
  path?: string
  description: string
  relevance: number
  entities?: string[]
  sentiment?: "positive" | "negative" | "neutral"
  category?: string
  timestamp?: Date
  connections?: string[]
}

interface KnowledgeNode {
  id: string
  label: string
  type: "person" | "place" | "concept" | "document" | "event"
  connections: string[]
  relevance: number
}

interface SemanticCluster {
  id: string
  theme: string
  results: SearchResult[]
  confidence: number
}

export function SearchWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState("intelligent")
  const [results, setResults] = useState<SearchResult[]>([])
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([])
  const [semanticClusters, setSemanticClusters] = useState<SemanticCluster[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchIntent, setSearchIntent] = useState<string>("")
  const [extractedEntities, setExtractedEntities] = useState<string[]>([])
  const [searchContext, setSearchContext] = useState<string>("")

  const searchTypes = [
    { id: "intelligent", name: "IA Inteligente", icon: Brain },
    { id: "semantic", name: "Semántica", icon: Network },
    { id: "web", name: "Web", icon: Globe },
    { id: "documents", name: "Documentos", icon: FileText },
    { id: "knowledge", name: "Conocimiento", icon: Sparkles },
    { id: "personal", name: "Personal", icon: Users },
  ]

  const analyzeQuery = (searchQuery: string) => {
    const entities: string[] = []
    let intent = "general"
    let context = ""

    // Simulación de NER (Named Entity Recognition)
    const personRegex = /\b(juan|maría|pedro|ana|carlos|lucia)\b/gi
    const placeRegex = /\b(madrid|barcelona|valencia|sevilla|españa|francia)\b/gi
    const conceptRegex = /\b(navegador|privacidad|seguridad|productividad|finanzas)\b/gi
    const dateRegex = /\b(hoy|ayer|mañana|esta semana|este mes)\b/gi

    const personMatches = searchQuery.match(personRegex)
    const placeMatches = searchQuery.match(placeRegex)
    const conceptMatches = searchQuery.match(conceptRegex)
    const dateMatches = searchQuery.match(dateRegex)

    if (personMatches) entities.push(...personMatches.map((p) => `persona:${p}`))
    if (placeMatches) entities.push(...placeMatches.map((p) => `lugar:${p}`))
    if (conceptMatches) entities.push(...conceptMatches.map((p) => `concepto:${p}`))
    if (dateMatches) entities.push(...dateMatches.map((p) => `tiempo:${p}`))

    // Análisis de intención
    if (searchQuery.includes("cómo") || searchQuery.includes("como")) {
      intent = "tutorial"
      context = "El usuario busca instrucciones o guías"
    } else if (searchQuery.includes("qué") || searchQuery.includes("que")) {
      intent = "informational"
      context = "El usuario busca información o definiciones"
    } else if (searchQuery.includes("dónde") || searchQuery.includes("donde")) {
      intent = "location"
      context = "El usuario busca ubicaciones o lugares"
    } else if (searchQuery.includes("cuándo") || searchQuery.includes("cuando")) {
      intent = "temporal"
      context = "El usuario busca información temporal"
    } else if (searchQuery.includes("mejor") || searchQuery.includes("recomend")) {
      intent = "recommendation"
      context = "El usuario busca recomendaciones"
    }

    return { entities, intent, context }
  }

  const generateKnowledgeGraph = (searchQuery: string, entities: string[]) => {
    const nodes: KnowledgeNode[] = []

    entities.forEach((entity, index) => {
      const [type, value] = entity.split(":")
      nodes.push({
        id: `node_${index}`,
        label: value,
        type: type as any,
        connections: entities.filter((e) => e !== entity).map((_, i) => `node_${i}`),
        relevance: Math.random() * 100,
      })
    })

    // Añadir nodos relacionados basados en el contexto
    if (searchQuery.includes("navegador") || searchQuery.includes("browser")) {
      nodes.push({
        id: "browser_concept",
        label: "Navegador Web",
        type: "concept",
        connections: ["privacy_concept", "security_concept"],
        relevance: 95,
      })
    }

    return nodes
  }

  const createSemanticClusters = (results: SearchResult[]) => {
    const clusters: SemanticCluster[] = []

    // Agrupar por categorías semánticas
    const categories = ["productividad", "seguridad", "entretenimiento", "educación", "trabajo"]

    categories.forEach((category) => {
      const categoryResults = results.filter(
        (r) => r.description.toLowerCase().includes(category) || r.title.toLowerCase().includes(category),
      )

      if (categoryResults.length > 0) {
        clusters.push({
          id: `cluster_${category}`,
          theme: category.charAt(0).toUpperCase() + category.slice(1),
          results: categoryResults,
          confidence: Math.random() * 100,
        })
      }
    })

    return clusters
  }

  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "web",
      title: "Navegador Opera - Características principales",
      url: "https://opera.com/features",
      description:
        "Descubre las características únicas del navegador Opera, incluyendo VPN gratuita, bloqueador de anuncios y espacios de trabajo.",
      relevance: 95,
      entities: ["concepto:navegador", "concepto:privacidad"],
      sentiment: "positive",
      category: "productividad",
      timestamp: new Date(),
      connections: ["2", "3"],
    },
    {
      id: "2",
      type: "knowledge_graph",
      title: "Grafo: Navegación Segura",
      description: "Red de conceptos relacionados con navegación segura, privacidad y protección de datos.",
      relevance: 88,
      entities: ["concepto:seguridad", "concepto:privacidad"],
      sentiment: "neutral",
      category: "seguridad",
      connections: ["1", "4"],
    },
    {
      id: "3",
      type: "semantic",
      title: "Búsqueda Semántica: Productividad Digital",
      description: "Resultados agrupados semánticamente sobre herramientas y técnicas de productividad digital.",
      relevance: 92,
      entities: ["concepto:productividad"],
      sentiment: "positive",
      category: "productividad",
      connections: ["1", "5"],
    },
    {
      id: "4",
      type: "ai_insight",
      title: "Insight de IA: Patrones de navegación",
      description:
        "Basado en tu historial, podrías estar interesado en herramientas de productividad y desarrollo web.",
      relevance: 85,
      entities: ["concepto:navegador", "concepto:productividad"],
      sentiment: "positive",
      category: "productividad",
    },
    {
      id: "5",
      type: "personal",
      title: "Tus documentos relacionados",
      path: "/documents/navegacion-tips.pdf",
      description: "Documento personal con consejos de navegación y configuración de privacidad.",
      relevance: 78,
      entities: ["concepto:navegador", "concepto:privacidad"],
      sentiment: "neutral",
      category: "educación",
    },
  ]

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)

    const analysis = analyzeQuery(query)
    setSearchIntent(analysis.intent)
    setExtractedEntities(analysis.entities)
    setSearchContext(analysis.context)

    // Simular búsqueda con delay
    setTimeout(() => {
      const filteredResults = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          (result.entities && result.entities.some((entity) => entity.toLowerCase().includes(query.toLowerCase()))),
      )

      setResults(filteredResults)

      const nodes = generateKnowledgeGraph(query, analysis.entities)
      setKnowledgeNodes(nodes)

      const clusters = createSemanticClusters(filteredResults)
      setSemanticClusters(clusters)

      setIsSearching(false)
    }, 1500)
  }

  const getContextualSuggestions = () => {
    const baseSuggestions = [
      "¿Cómo optimizar mi navegación web?",
      "Mejores extensiones para productividad",
      "Configurar control parental",
      "Gestión de contraseñas segura",
      "Privacidad en línea",
    ]

    if (currentProfile?.role === "admin") {
      return [
        ...baseSuggestions,
        "Configuración avanzada de seguridad",
        "Análisis de tráfico de red",
        "Gestión de usuarios y permisos",
      ]
    }

    if (currentProfile?.role === "child") {
      return [
        "Sitios educativos recomendados",
        "Juegos seguros en línea",
        "¿Cómo reportar contenido inapropiado?",
        "Configurar tiempo de pantalla",
      ]
    }

    return baseSuggestions
  }

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Brain className="w-8 h-8 mr-3 text-blue-500" />
            Búsqueda Inteligente
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Búsqueda potenciada por IA con comprensión de intención y grafos de conocimiento
          </p>
        </div>

        {/* Barra de búsqueda mejorada */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar con comprensión de intención y análisis semántico..."
                className="pl-10 pr-4 py-3 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

              {query && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {extractedEntities.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {extractedEntities.length}
                    </Badge>
                  )}
                  {searchIntent && (
                    <Badge variant="secondary" className="text-xs">
                      {searchIntent}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleSearch} size="lg" disabled={isSearching}>
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Brain className="w-5 h-5" />
              )}
            </Button>
          </div>

          {searchContext && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Análisis de Intención</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{searchContext}</p>
              {extractedEntities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {extractedEntities.map((entity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {entity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tipos de búsqueda */}
          <div className="flex flex-wrap gap-2">
            {searchTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <Button
                  key={type.id}
                  variant={searchType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType(type.id)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {type.name}
                </Button>
              )
            })}
          </div>
        </div>

        {results.length > 0 && (
          <Tabs defaultValue="results" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="results">
                <Search className="w-4 h-4 mr-2" />
                Resultados ({results.length})
              </TabsTrigger>
              <TabsTrigger value="semantic">
                <Network className="w-4 h-4 mr-2" />
                Semántica ({semanticClusters.length})
              </TabsTrigger>
              <TabsTrigger value="knowledge">
                <Sparkles className="w-4 h-4 mr-2" />
                Conocimiento ({knowledgeNodes.length})
              </TabsTrigger>
              <TabsTrigger value="insights">
                <TrendingUp className="w-4 h-4 mr-2" />
                Insights IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                            {result.title}
                          </h3>
                          {result.sentiment && (
                            <Badge
                              variant={result.sentiment === "positive" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {result.sentiment}
                            </Badge>
                          )}
                        </div>
                        {result.url && <p className="text-sm text-green-600 mb-1">{result.url}</p>}
                        {result.path && <p className="text-sm text-gray-500 mb-1">{result.path}</p>}
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{result.description}</p>

                        {result.entities && result.entities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {result.entities.map((entity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {entity.split(":")[1]}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500 mb-1">Relevancia: {result.relevance}%</div>
                        <Badge variant={result.type === "ai_insight" ? "default" : "secondary"} className="text-xs">
                          {result.type === "ai_insight"
                            ? "IA"
                            : result.type === "knowledge_graph"
                              ? "Grafo"
                              : result.type === "semantic"
                                ? "Semántica"
                                : result.type}
                        </Badge>
                        {result.timestamp && (
                          <div className="text-xs text-gray-400 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {result.timestamp.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="semantic" className="space-y-4">
              {semanticClusters.map((cluster) => (
                <Card key={cluster.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Network className="w-5 h-5 mr-2" />
                        {cluster.theme}
                      </span>
                      <Badge variant="outline">Confianza: {Math.round(cluster.confidence)}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {cluster.results.map((result) => (
                        <div key={result.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <h4 className="font-medium text-sm">{result.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{result.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Grafo de Conocimiento
                  </CardTitle>
                  <CardDescription>Red de conceptos y entidades relacionadas con tu búsqueda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {knowledgeNodes.map((node) => (
                      <div key={node.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center space-x-2 mb-2">
                          {node.type === "person" && <Users className="w-4 h-4 text-blue-500" />}
                          {node.type === "place" && <MapPin className="w-4 h-4 text-green-500" />}
                          {node.type === "concept" && <Brain className="w-4 h-4 text-purple-500" />}
                          {node.type === "document" && <FileText className="w-4 h-4 text-orange-500" />}
                          {node.type === "event" && <Calendar className="w-4 h-4 text-red-500" />}
                          <span className="font-medium text-sm">{node.label}</span>
                        </div>
                        <div className="text-xs text-gray-500">Relevancia: {Math.round(node.relevance)}%</div>
                        <div className="text-xs text-gray-400 mt-1">{node.connections.length} conexiones</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Insights de IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Patrón de Búsqueda Detectado</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tus búsquedas recientes sugieren interés en productividad y herramientas de navegación.
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Recomendación Personalizada</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Basado en tu perfil, podrías beneficiarte de configurar espacios de trabajo personalizados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Sugerencias de IA contextuales */}
        {hasPermission("ai.chat") && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Sugerencias Contextuales
              </CardTitle>
              <CardDescription>
                Preguntas personalizadas basadas en tu perfil ({currentProfile?.role}) y actividad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getContextualSuggestions().map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-3 text-left bg-transparent"
                    onClick={() => setQuery(suggestion)}
                  >
                    <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Búsquedas recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Búsquedas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "configuración de privacidad",
                "extensiones de productividad",
                "navegación segura para niños",
                "gestión de contraseñas",
              ].map((recentSearch, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => setQuery(recentSearch)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {recentSearch}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
