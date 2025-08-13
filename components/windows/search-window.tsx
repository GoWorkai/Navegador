"use client"

import { useState } from "react"
import { Search, Brain, Globe, FileText, ImageIcon, Video, Music, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfile } from "@/components/profile-provider"

export function SearchWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchTypes = [
    { id: "all", name: "Todo", icon: Search },
    { id: "web", name: "Web", icon: Globe },
    { id: "documents", name: "Documentos", icon: FileText },
    { id: "images", name: "Imágenes", icon: ImageIcon },
    { id: "videos", name: "Videos", icon: Video },
    { id: "music", name: "Música", icon: Music },
  ]

  const mockResults = [
    {
      type: "web",
      title: "Navegador Opera - Características principales",
      url: "https://opera.com/features",
      description:
        "Descubre las características únicas del navegador Opera, incluyendo VPN gratuita, bloqueador de anuncios y espacios de trabajo.",
      relevance: 95,
    },
    {
      type: "document",
      title: "Manual de Usuario - Navegador IA.pdf",
      path: "/documents/manual-usuario.pdf",
      description: "Guía completa para usar todas las funciones del navegador con IA integrada.",
      relevance: 88,
    },
    {
      type: "ai_insight",
      title: "Insight de IA: Patrones de navegación",
      description:
        "Basado en tu historial, podrías estar interesado en herramientas de productividad y desarrollo web.",
      relevance: 92,
    },
  ]

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    // Simular búsqueda
    setTimeout(() => {
      setResults(
        mockResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()),
        ),
      )
      setIsSearching(false)
    }, 1000)
  }

  const aiSuggestions = [
    "¿Cómo optimizar mi navegación web?",
    "Mejores extensiones para productividad",
    "Configurar control parental",
    "Gestión de contraseñas segura",
    "Privacidad en línea",
  ]

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Búsqueda Inteligente</h1>
          <p className="text-gray-600 dark:text-gray-400">Búsqueda potenciada por IA con grafos de conocimiento</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar en web, documentos, historial y más..."
                className="pl-10 pr-4 py-3 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <Button onClick={handleSearch} size="lg" disabled={isSearching}>
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>

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

        {/* Resultados */}
        {results.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Resultados de búsqueda</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                          {result.title}
                        </h3>
                        {result.url && <p className="text-sm text-green-600 mb-1">{result.url}</p>}
                        {result.path && <p className="text-sm text-gray-500 mb-1">{result.path}</p>}
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{result.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500">Relevancia: {result.relevance}%</div>
                        <div
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            result.type === "web"
                              ? "bg-blue-100 text-blue-800"
                              : result.type === "document"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {result.type === "ai_insight" ? "IA" : result.type}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sugerencias de IA */}
        {hasPermission("ai.chat") && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Sugerencias de IA
              </CardTitle>
              <CardDescription>Preguntas populares basadas en tu perfil y actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiSuggestions.map((suggestion, index) => (
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
