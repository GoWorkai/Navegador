"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WebBrowser } from "@/components/web-browser"
import { AIAssistant } from "@/components/ai-assistant"
import {
  Search,
  Plus,
  Home,
  Globe,
  MessageCircle,
  DollarSign,
  CheckSquare,
  Music,
  Users,
  Settings,
  Library,
  Play,
  Heart,
  MoreHorizontal,
} from "lucide-react"

const quickAccess = [
  { id: "navegador", name: "Navegador Web", icon: "🌐", color: "from-blue-500 to-cyan-500", component: "browser" },
  { id: "asistente", name: "Asistente IA", icon: "🤖", color: "from-purple-500 to-pink-500", component: "ai-chat" },
  { id: "social", name: "Social Hub", icon: "👥", color: "from-green-500 to-emerald-500", component: "social" },
  { id: "finanzas", name: "Finanzas", icon: "💰", color: "from-yellow-500 to-orange-500", component: "finance" },
  { id: "tareas", name: "Productividad", icon: "✅", color: "from-indigo-500 to-purple-500", component: "tasks" },
  { id: "musica", name: "Multimedia", icon: "🎵", color: "from-pink-500 to-rose-500", component: "music" },
]

const recentlyUsed = [
  { name: "Google Search", artist: "Navegación", image: "🔍", color: "bg-blue-600" },
  { name: "ChatGPT", artist: "IA Assistant", image: "🤖", color: "bg-green-600" },
  { name: "YouTube", artist: "Entretenimiento", image: "▶️", color: "bg-red-600" },
  { name: "GitHub", artist: "Desarrollo", image: "🐙", color: "bg-gray-800" },
]

const topApps = [
  { name: "Navegador IA", description: "Navegación inteligente", color: "from-blue-500 to-purple-600" },
  { name: "Asistente Personal", description: "Chat con IA", color: "from-purple-500 to-pink-500" },
  { name: "Gestor Financiero", description: "Control de gastos", color: "from-green-500 to-blue-500" },
  { name: "Organizador", description: "Tareas y notas", color: "from-orange-500 to-red-500" },
]

export default function AriaNavigator() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("home")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveWindow("browser")
    }
  }

  const openModule = (component: string) => {
    setActiveWindow(component)
  }

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Active Window */}
      {activeWindow && (
        <div className="fixed inset-0 z-50">
          {activeWindow === "browser" && <WebBrowser onClose={() => setActiveWindow(null)} />}
          {activeWindow === "ai-chat" && <AIAssistant onClose={() => setActiveWindow(null)} />}
          {/* Other modules */}
          {activeWindow === "social" && (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Users className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Social Hub</h2>
                <p className="text-gray-400 mb-4">Conexiones y comunidades</p>
                <Button onClick={() => setActiveWindow(null)} variant="outline">
                  Cerrar
                </Button>
              </div>
            </div>
          )}
          {activeWindow === "finance" && (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Gestor Financiero</h2>
                <p className="text-gray-400 mb-4">Control de finanzas personales</p>
                <Button onClick={() => setActiveWindow(null)} variant="outline">
                  Cerrar
                </Button>
              </div>
            </div>
          )}
          {activeWindow === "tasks" && (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <CheckSquare className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Organizador</h2>
                <p className="text-gray-400 mb-4">Tareas y productividad</p>
                <Button onClick={() => setActiveWindow(null)} variant="outline">
                  Cerrar
                </Button>
              </div>
            </div>
          )}
          {activeWindow === "music" && (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Music className="h-16 w-16 text-pink-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Centro Multimedia</h2>
                <p className="text-gray-400 mb-4">Música y entretenimiento</p>
                <Button onClick={() => setActiveWindow(null)} variant="outline">
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Spotify Style */}
        <div className="w-64 bg-black flex flex-col">
          {/* Navigation */}
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold">ARIA</h1>
              <p className="text-gray-400 text-sm">Navegador IA</p>
            </div>

            <nav className="space-y-4">
              <Button
                variant="ghost"
                className={`w-full justify-start text-left ${activeSection === "home" ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveSection("home")}
              >
                <Home className="h-5 w-5 mr-3" />
                Inicio
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left ${activeSection === "search" ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveSection("search")}
              >
                <Search className="h-5 w-5 mr-3" />
                Buscar
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left ${activeSection === "library" ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveSection("library")}
              >
                <Library className="h-5 w-5 mr-3" />
                Tu Biblioteca
              </Button>
            </nav>
          </div>

          {/* Library Section */}
          <div className="flex-1 px-6 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-gray-400 text-sm font-semibold">APLICACIONES</h3>
              <Plus className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Apps Favoritas</p>
                  <p className="text-gray-400 text-xs">6 aplicaciones</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Sitios Web</p>
                  <p className="text-gray-400 text-xs">Guardados y descargados</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">IA Assistant</p>
                  <p className="text-gray-400 text-xs">Conversaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Spotify Style */}
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-black overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-white text-3xl font-bold mb-2">Buenos días</h1>
              <p className="text-gray-400">Listo para explorar la web con IA</p>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {quickAccess.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => openModule(item.component)}
                  className={`h-20 bg-gradient-to-r ${item.color} hover:scale-105 transition-all duration-200 rounded-lg flex items-center justify-start space-x-4 p-4`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-semibold">{item.name}</span>
                </Button>
              ))}
            </div>

            {/* Recently Used Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">Usados recientemente</h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
                  Mostrar todo
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {recentlyUsed.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors group"
                  >
                    <div
                      className={`w-full h-32 ${item.color} rounded-lg mb-4 flex items-center justify-center text-4xl`}
                    >
                      {item.image}
                    </div>
                    <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.artist}</p>
                    <Button
                      size="sm"
                      className="mt-2 bg-green-500 hover:bg-green-600 rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="h-5 w-5 text-black fill-black" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Apps Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">Tus aplicaciones principales</h2>
                <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
                  Mostrar todo
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {topApps.map((app, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-full h-32 bg-gradient-to-br ${app.color} rounded-lg mb-4 flex items-center justify-center`}
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">⚡</span>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{app.name}</h3>
                    <p className="text-gray-400 text-sm">{app.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-80 bg-gray-900 border-l border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Aria Assistant</h3>
                  <p className="text-gray-400 text-sm">En línea</p>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="p-4 space-y-4 h-96 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-300 text-sm">¡Hola! ¿En qué puedo ayudarte hoy?</p>
            </div>

            <div className="bg-purple-600/20 rounded-lg p-3 ml-8">
              <p className="text-purple-200 text-sm">¿Cuáles son las noticias más importantes de hoy?</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-300 text-sm">
                Te puedo ayudar a buscar las últimas noticias. ¿Hay algún tema específico que te interese?
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 text-sm"
              />
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Player/Control Bar - Spotify Style */}
      <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6">
        {/* Left - Current Activity */}
        <div className="flex items-center space-x-4 w-1/3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Navegador Web</p>
            <p className="text-gray-400 text-xs">Listo para navegar</p>
          </div>
          <Heart className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
        </div>

        {/* Center - Quick Actions */}
        <div className="flex items-center space-x-4 w-1/3 justify-center">
          <Button
            onClick={() => setActiveWindow("browser")}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setActiveWindow("ai-chat")}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setActiveWindow("music")}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Music className="h-5 w-5" />
          </Button>
        </div>

        {/* Right - System Info */}
        <div className="flex items-center space-x-4 w-1/3 justify-end">
          <div className="text-xs text-gray-400">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
