"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { WebBrowser } from "@/components/web-browser"
import { AIAssistant } from "@/components/ai-assistant"
import { MediaPlayer } from "@/components/media-player"
import { ProfileSelector } from "@/components/profile-selector"
import { Search, Home, Globe, Bot, X, Cloud, Droplets, Thermometer, MapPin } from "lucide-react"

const Page = () => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(false)
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(false)
  const [currentView, setCurrentView] = useState("home")
  const [selectedSearchEngine, setSelectedSearchEngine] = useState("Google")

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setActiveWindow("browser")
    }
  }

  const searchEngines = [
    { name: "Default", icon: "🔍", color: "bg-red-500" },
    { name: "Google", icon: "G", color: "bg-red-500" },
    { name: "Duck", icon: "🦆", color: "bg-red-500" },
    { name: "Bing", icon: "B", color: "bg-red-500" },
    { name: "Brave", icon: "🦁", color: "bg-red-500" },
  ]

  const bottomApps = [
    { name: "YouTube", icon: "▶️", color: "bg-red-500" },
    { name: "Email", icon: "✉️", color: "bg-red-500" },
    { name: "Telegram", icon: "✈️", color: "bg-red-500" },
    { name: "WhatsApp", icon: "📱", color: "bg-red-500" },
    { name: "Twitter", icon: "🐦", color: "bg-red-500" },
    { name: "Discord", icon: "💬", color: "bg-red-500" },
    { name: "Spotify", icon: "🎵", color: "bg-red-500" },
    { name: "REC", icon: "⏺️", color: "bg-red-500" },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 overflow-hidden relative">
      {/* Left Sidebar */}
      <div
        className={`fixed left-4 top-4 bottom-4 z-40 transition-all duration-300 ease-out ${
          leftSidebarExpanded ? "w-80" : "w-16"
        }`}
        onMouseEnter={() => setLeftSidebarExpanded(true)}
        onMouseLeave={() => setLeftSidebarExpanded(false)}
      >
        <Card className="h-full bg-white/20 backdrop-blur-xl border-white/30 rounded-2xl overflow-hidden">
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              {leftSidebarExpanded && (
                <div className="text-gray-800">
                  <h2 className="font-bold text-lg">ARIA</h2>
                  <p className="text-xs text-gray-600">Navigator AI</p>
                </div>
              )}
            </div>

            <nav className="flex-1 space-y-2">
              <Button
                variant={currentView === "home" ? "secondary" : "ghost"}
                className="w-full justify-start text-gray-800 hover:bg-white/20"
                onClick={() => setCurrentView("home")}
              >
                <Home className="w-5 h-5" />
                {leftSidebarExpanded && <span className="ml-3">Inicio</span>}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-800 hover:bg-white/20"
                onClick={() => setActiveWindow("browser")}
              >
                <Globe className="w-5 h-5" />
                {leftSidebarExpanded && <span className="ml-3">Navegador</span>}
              </Button>
            </nav>

            {leftSidebarExpanded && (
              <div className="mt-auto">
                <ProfileSelector />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed right-4 top-4 bottom-4 z-40 transition-all duration-300 ease-out ${
          rightSidebarExpanded ? "w-80" : "w-16"
        }`}
        onMouseEnter={() => setRightSidebarExpanded(true)}
        onMouseLeave={() => setRightSidebarExpanded(false)}
      >
        <Card className="h-full bg-white/20 backdrop-blur-xl border-white/30 rounded-2xl overflow-hidden">
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-8 h-8 text-red-500" />
              {rightSidebarExpanded && (
                <div className="text-gray-800">
                  <h3 className="font-semibold">ARIA Assistant</h3>
                  <p className="text-xs text-gray-600">Siempre aquí para ayudar</p>
                </div>
              )}
            </div>

            {rightSidebarExpanded && (
              <div className="flex-1">
                <AIAssistant />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-out ${activeWindow ? "px-24" : "px-24"} py-4 h-full flex flex-col`}
      >
        {!activeWindow && currentView === "home" && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative">
            <div className="absolute top-8 left-0 right-0 flex justify-between items-start px-8">
              {/* Weather Widget */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-800 font-semibold text-lg">Despejado</h3>
                    <Cloud className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    <span className="font-medium">Humedad 77%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Thermometer className="w-4 h-4" />
                      <span>8 - 23,4°C</span>
                    </div>
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Santiago</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Temperature Circle */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-full w-32 h-32 shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">12°C</div>
                  <div className="w-8 h-1 bg-blue-400 rounded-full mx-auto mt-2"></div>
                </div>
              </Card>
            </div>

            <div className="mb-8 w-full max-w-2xl">
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-full p-2 shadow-lg">
                <div className="flex items-center">
                  <div className="flex items-center flex-1 px-4">
                    <Search className="w-5 h-5 text-red-500 mr-3" />
                    <Input
                      placeholder="Escribe tu búsqueda..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                      className="border-0 bg-transparent text-gray-800 placeholder-gray-500 focus:ring-0 text-lg"
                    />
                  </div>
                  <Button
                    onClick={() => handleSearch(searchQuery)}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium"
                  >
                    Buscar
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mb-12 flex items-center gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl px-6 py-4 shadow-lg">
                <span className="text-gray-800 font-medium">Buscar con</span>
              </Card>

              <div className="flex gap-3">
                {searchEngines.map((engine) => (
                  <Button
                    key={engine.name}
                    variant={selectedSearchEngine === engine.name ? "default" : "outline"}
                    onClick={() => setSelectedSearchEngine(engine.name)}
                    className={`${
                      selectedSearchEngine === engine.name
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-white/80 hover:bg-white text-gray-800 border-0"
                    } rounded-full px-4 py-2 font-medium shadow-lg`}
                  >
                    <span className="mr-2">{engine.icon}</span>
                    {engine.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Window Content */}
        {activeWindow && (
          <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl border-0 shadow-xl overflow-hidden animate-in slide-in-from-left-5 duration-300">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 bg-white/50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveWindow(null)}
                    className="text-gray-800 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <h3 className="text-gray-800 font-semibold">
                    {activeWindow === "browser" && "Navegador Web"}
                    {activeWindow === "ai" && "Asistente IA"}
                    {activeWindow === "music" && "Reproductor Multimedia"}
                  </h3>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {activeWindow === "browser" && <WebBrowser />}
                {activeWindow === "ai" && <AIAssistant />}
                {activeWindow === "music" && <MediaPlayer onClose={() => setActiveWindow(null)} />}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4">
          {bottomApps.map((app, index) => (
            <Button
              key={index}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full p-0 shadow-lg"
              onClick={() => {
                if (app.name === "Spotify") setActiveWindow("music")
              }}
            >
              <span className="text-lg">{app.icon}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 left-6 z-50">
        <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-red-500" />
            <span className="text-gray-800 font-medium text-sm">Herramientas de IA</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Page
