"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Shield,
  X,
  Plus,
  Settings,
  Globe,
  Lock,
  Clock,
  Cpu,
  HardDrive,
  Search,
  Trash2,
  Download,
  Upload,
  Cookie,
  NotebookTabsIcon as Tabs,
  ChevronRight,
  MessageCircle,
  MessageSquare,
  Send,
  Hash,
  Smartphone,
  Monitor,
  QrCode,
  Play,
} from "lucide-react"

interface WebBrowserProps {
  onClose?: () => void
}

interface Tab {
  id: number
  title: string
  url: string
  active: boolean
  isIncognito?: boolean
}

interface HistoryItem {
  url: string
  title: string
  timestamp: Date
  favicon?: string
}

interface Favorite {
  url: string
  title: string
  favicon?: string
  color?: string
}

interface QuickAccess {
  name: string
  url: string
  icon: string
  color: string
}

export function WebBrowser({ onClose }: WebBrowserProps) {
  const [url, setUrl] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: "Página de Inicio", url: "", active: true }])
  const [activeTab, setActiveTab] = useState(1)
  const [showHistory, setShowHistory] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showStartPage, setShowStartPage] = useState(true)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([
    { url: "https://www.google.com", title: "Google", color: "bg-blue-500" },
    { url: "https://www.youtube.com", title: "YouTube", color: "bg-red-500" },
    { url: "https://www.github.com", title: "GitHub", color: "bg-gray-800" },
    { url: "https://www.wikipedia.org", title: "Wikipedia", color: "bg-gray-600" },
  ])
  const [searchEngine, setSearchEngine] = useState("google")
  const [homePage, setHomePage] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [cpuUsage, setCpuUsage] = useState(45)
  const [ramUsage, setRamUsage] = useState(62)
  const [networkLimit, setNetworkLimit] = useState(false)
  const [hotTabsKiller, setHotTabsKiller] = useState(true)
  const [showGXControl, setShowGXControl] = useState(false)
  const [showGXCleaner, setShowGXCleaner] = useState(false)
  const [ramLimitGB, setRamLimitGB] = useState(11.5)
  const [downloadSpeed, setDownloadSpeed] = useState(200)
  const [uploadSpeed, setUploadSpeed] = useState(50)
  const [cleaningLevel, setCleaningLevel] = useState("MED")
  const [tempFiles, setTempFiles] = useState(94)
  const [cookiesCount, setCookiesCount] = useState(10)
  const [downloadsSize, setDownloadsSize] = useState(0)

  const [showMessaging, setShowMessaging] = useState(false)
  const [showWorkspaces, setShowWorkspaces] = useState(false)
  const [showVPN, setShowVPN] = useState(false)
  const [showAdBlocker, setShowAdBlocker] = useState(false)
  const [showFlow, setShowFlow] = useState(false)
  const [showMediaPlayer, setShowMediaPlayer] = useState(false)
  const [showAICommand, setShowAICommand] = useState(false)
  const [vpnEnabled, setVpnEnabled] = useState(false)
  const [vpnLocation, setVpnLocation] = useState("Estados Unidos")
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(true)
  const [blockedAds, setBlockedAds] = useState(247)
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: "Trabajo", color: "bg-blue-500", tabs: [] },
    { id: 2, name: "Ocio", color: "bg-green-500", tabs: [] },
    { id: 3, name: "Estudio", color: "bg-purple-500", tabs: [] },
  ])
  const [currentWorkspace, setCurrentWorkspace] = useState(1)
  const [aiCommand, setAiCommand] = useState("")

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const quickAccess: QuickAccess[] = [
    { name: "Medium", url: "https://www.medium.com", icon: "📝", color: "bg-gray-700/80" },
    { name: "Twitch", url: "https://www.twitch.tv", icon: "🎮", color: "bg-gray-700/80" },
    { name: "Reddit", url: "https://www.reddit.com", icon: "🔴", color: "bg-gray-700/80" },
    { name: "Twitter", url: "https://www.twitter.com", icon: "🐦", color: "bg-gray-700/80" },
    { name: "Airbnb", url: "https://www.airbnb.com", icon: "🏠", color: "bg-gray-700/80" },
    { name: "YouTube", url: "https://www.youtube.com", icon: "🎥", color: "bg-gray-700/80" },
    { name: "Netflix", url: "https://www.netflix.com", icon: "🎬", color: "bg-gray-700/80" },
    { name: "Spotify", url: "https://www.spotify.com", icon: "🎵", color: "bg-gray-700/80" },
  ]

  useEffect(() => {
    const savedHistory = localStorage.getItem("browser-history")
    const savedFavorites = localStorage.getItem("browser-favorites")

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30)
      setRamUsage(Math.floor(Math.random() * 40) + 40)
    }, 3000)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        setShowAICommand(true)
      }
      if (e.key === "Escape") {
        setShowAICommand(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const addToHistory = (url: string, title: string) => {
    const newItem: HistoryItem = {
      url,
      title,
      timestamp: new Date(),
    }
    const updatedHistory = [newItem, ...history.slice(0, 99)]
    setHistory(updatedHistory)
    localStorage.setItem("browser-history", JSON.stringify(updatedHistory))
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const getSearchUrl = (query: string) => {
    const engines = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    }
    return engines[searchEngine as keyof typeof engines] || engines.google
  }

  const handleNavigate = (targetUrl?: string) => {
    const navigationUrl = targetUrl || url
    if (navigationUrl) {
      setIsLoading(true)
      setShowStartPage(false)
      let finalUrl = navigationUrl

      if (!isValidUrl(navigationUrl) && !navigationUrl.includes(".")) {
        finalUrl = getSearchUrl(navigationUrl)
      } else if (!navigationUrl.startsWith("http")) {
        finalUrl = `https://${navigationUrl}`
      }

      setCurrentUrl(finalUrl)
      setUrl(finalUrl)
      const title = getDomainFromUrl(finalUrl)

      setTabs(tabs.map((tab) => (tab.id === activeTab ? { ...tab, url: finalUrl, title } : tab)))
      addToHistory(finalUrl, title)

      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  const handleUrlChange = (value: string) => {
    setUrl(value)
    if (value.length > 1) {
      const urlSuggestions = history
        .filter(
          (item) =>
            item.url.toLowerCase().includes(value.toLowerCase()) ||
            item.title.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5)
        .map((item) => item.url)

      const favSuggestions = favorites
        .filter(
          (fav) =>
            fav.url.toLowerCase().includes(value.toLowerCase()) ||
            fav.title.toLowerCase().includes(value.toLowerCase()),
        )
        .map((fav) => fav.url)

      setSuggestions([...new Set([...favSuggestions, ...urlSuggestions])])
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleBack = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.back()
      } catch (e) {
        console.log("Cannot access iframe history")
      }
    }
  }

  const handleForward = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.forward()
      } catch (e) {
        console.log("Cannot access iframe history")
      }
    }
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl
    }
  }

  const goHome = () => {
    setShowStartPage(true)
    setCurrentUrl("")
    setUrl("")
    setTabs(tabs.map((tab) => (tab.id === activeTab ? { ...tab, url: "", title: "Página de Inicio" } : tab)))
  }

  const toggleFavorite = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab)
    if (!currentTab) return

    const isFavorite = favorites.some((fav) => fav.url === currentTab.url)

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.url !== currentTab.url)
      setFavorites(updatedFavorites)
      localStorage.setItem("browser-favorites", JSON.stringify(updatedFavorites))
    } else {
      const newFavorite: Favorite = {
        url: currentTab.url,
        title: currentTab.title,
        color: "bg-blue-500",
      }
      const updatedFavorites = [...favorites, newFavorite]
      setFavorites(updatedFavorites)
      localStorage.setItem("browser-favorites", JSON.stringify(updatedFavorites))
    }
  }

  const addNewTab = (isIncognito = false) => {
    const newTab: Tab = {
      id: Date.now(),
      title: isIncognito ? "Nueva pestaña (Incógnito)" : "Página de Inicio",
      url: "",
      active: false,
      isIncognito,
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
    setUrl("")
    setCurrentUrl("")
    setShowStartPage(true)
  }

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id)
      setUrl(newTabs[0].url)
      setCurrentUrl(newTabs[0].url)
      setShowStartPage(newTabs[0].url === "")
    }
  }

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const isFavorite = favorites.some((fav) => fav.url === currentUrl)

  return (
    <Card className="w-full h-full bg-gray-900 border-0 shadow-2xl overflow-hidden text-white">
      {showAICommand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-purple-500">
            <h3 className="text-lg font-bold mb-4 text-purple-400">Asistente IA</h3>
            <Input
              value={aiCommand}
              onChange={(e) => setAiCommand(e.target.value)}
              placeholder="¿En qué puedo ayudarte?"
              className="mb-4 bg-gray-700 border-gray-600 text-white"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setShowAICommand(false)}>
                Cancelar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">Enviar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Browser Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="flex items-center mb-2 space-x-2">
          {workspaces.map((workspace) => (
            <Button
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace.id)}
              className={`px-3 py-1 text-xs rounded-full ${
                currentWorkspace === workspace.id
                  ? `${workspace.color} text-white`
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {workspace.name}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-gray-700">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center mb-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 mr-1 rounded-t-lg cursor-pointer transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 border-t border-l border-r border-purple-500"
                  : "bg-gray-700 hover:bg-gray-600"
              } ${tab.isIncognito ? "bg-gray-900 text-purple-300" : ""}`}
              onClick={() => {
                setActiveTab(tab.id)
                setUrl(tab.url)
                setCurrentUrl(tab.url)
                setShowStartPage(tab.url === "")
              }}
            >
              {tab.isIncognito && <Lock className="h-3 w-3 mr-1 text-purple-400" />}
              <span className="text-sm truncate max-w-32">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 hover:bg-gray-600 text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addNewTab()}
            className="ml-2 h-8 w-8 p-0 text-purple-400 hover:bg-gray-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addNewTab(true)}
            className="h-8 w-8 p-0 text-purple-400 hover:bg-gray-700"
            title="Nueva pestaña incógnito"
          >
            <Lock className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto h-8 w-8 p-0 text-red-400 hover:bg-red-900"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-gray-300 hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleForward} className="text-gray-300 hover:bg-gray-700">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-gray-300 hover:bg-gray-700">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goHome} className="text-gray-300 hover:bg-gray-700">
            <Home className="h-4 w-4" />
          </Button>

          <div className="flex-1 flex items-center space-x-2 relative">
            <div className="flex items-center bg-gray-700 rounded-full px-3 py-1 flex-1 border border-gray-600 relative">
              {vpnEnabled ? (
                <Shield className="h-4 w-4 text-green-400 mr-2" />
              ) : (
                <Globe className="h-4 w-4 text-gray-400 mr-2" />
              )}
              <Input
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNavigate()}
                onFocus={() => url.length > 1 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="border-0 bg-transparent focus:ring-0 text-sm text-white placeholder-gray-400"
                placeholder="Buscar en Google o escribir URL"
              />
              {adBlockerEnabled && <div className="text-xs text-green-400 mr-2">{blockedAds} bloqueados</div>}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 mt-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
                    onClick={() => {
                      setUrl(suggestion)
                      setShowSuggestions(false)
                      handleNavigate()
                    }}
                  >
                    <Globe className="h-4 w-4 inline mr-2" />
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVPN(!showVPN)}
            className={`${vpnEnabled ? "text-green-400" : "text-gray-400"} hover:bg-gray-700`}
            title="VPN"
          >
            <Shield className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdBlocker(!showAdBlocker)}
            className={`${adBlockerEnabled ? "text-green-400" : "text-gray-400"} hover:bg-gray-700`}
            title="Bloqueador de anuncios"
          >
            <Shield className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFlow(!showFlow)}
            className="text-blue-400 hover:bg-gray-700"
            title="Flow - Sincronización"
          >
            <Globe className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMediaPlayer(!showMediaPlayer)}
            className="text-purple-400 hover:bg-gray-700"
            title="Reproductor multimedia"
          >
            <Play className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGXControl(!showGXControl)}
            className="text-purple-400 hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGXCleaner(!showGXCleaner)}
            className="text-pink-400 hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMessaging(!showMessaging)}
            className="w-10 h-10 p-0 text-green-400 hover:bg-gray-700"
            title="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-blue-400 hover:bg-gray-700" title="Messenger">
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-cyan-400 hover:bg-gray-700" title="Telegram">
            <Send className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-indigo-400 hover:bg-gray-700" title="Discord">
            <Hash className="h-5 w-5" />
          </Button>

          <div className="border-t border-gray-700 w-8 my-2"></div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGXControl(!showGXControl)}
            className="w-10 h-10 p-0 text-purple-400 hover:bg-gray-700"
            title="GX Control"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGXCleaner(!showGXCleaner)}
            className="w-10 h-10 p-0 text-pink-400 hover:bg-gray-700"
            title="GX Cleaner"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        {/* GX Control */}
        {showGXControl && (
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 text-purple-400">GX CONTROL</h3>
              <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs inline-block mb-4">FEEDBACK</div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-red-400">RAM LIMITER</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHotTabsKiller(!hotTabsKiller)}
                    className={`h-6 w-12 rounded-full ${hotTabsKiller ? "bg-red-600" : "bg-gray-600"}`}
                  >
                    <div
                      className={`h-4 w-4 bg-white rounded-full transition-transform ${hotTabsKiller ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </Button>
                </div>

                {/* Medidor circular */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(ramUsage / 100) * 251.2} 251.2`}
                        className="text-red-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {((ramLimitGB * ramUsage) / 100).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">GB</span>
                    </div>
                  </div>
                </div>

                {/* Memory Limiter Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Memory Limiter (GB)</span>
                    <span>{ramLimitGB}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="32"
                      step="0.5"
                      value={ramLimitGB}
                      onChange={(e) => setRamLimitGB(Number.parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>MIN</span>
                      <span>MAX</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center text-sm text-gray-300">
                    <input type="checkbox" className="mr-2" />
                    HARTE GRENZE
                  </label>
                  <p className="text-xs text-gray-500">Der Speicherverbrauch wird nicht überschritten</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-purple-400">NETZWERKBEGRENZER</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNetworkLimit(!networkLimit)}
                    className={`h-6 w-12 rounded-full ${networkLimit ? "bg-purple-600" : "bg-gray-600"}`}
                  >
                    <div
                      className={`h-4 w-4 bg-white rounded-full transition-transform ${networkLimit ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Download className="h-4 w-4 mr-2 text-purple-400" />
                      <span className="text-sm">Download</span>
                    </div>
                    <select
                      value={downloadSpeed}
                      onChange={(e) => setDownloadSpeed(Number.parseInt(e.target.value))}
                      className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    >
                      <option value={50}>50 Mbps</option>
                      <option value={100}>100 Mbps</option>
                      <option value={200}>200 Mbps</option>
                      <option value={500}>500 Mbps</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Upload className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-sm">Hochladen</span>
                    </div>
                    <select
                      value={uploadSpeed}
                      onChange={(e) => setUploadSpeed(Number.parseInt(e.target.value))}
                      className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    >
                      <option value={25}>25 Mbps</option>
                      <option value={50}>50 Mbps</option>
                      <option value={100}>100 Mbps</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hot Tabs Killer */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-pink-400">HOT TABS KILLER</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Vernichte Tabs, die deine Ressourcen stehlen</p>

                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white text-sm py-2">
                    <Cpu className="h-4 w-4 mr-1" />
                    CPU
                  </Button>
                  <Button className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2">
                    <HardDrive className="h-4 w-4 mr-1" />
                    RAM
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GX Cleaner */}
        {showGXCleaner && (
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 text-pink-400">GX Cleaner</h3>
              <div className="bg-pink-600 text-white px-2 py-1 rounded text-xs inline-block mb-4">Feedback</div>

              {/* Estadísticas */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">{tempFiles}</div>
                <div className="text-sm text-gray-400">TEMPORARY FILES</div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{downloadsSize}</div>
                    <div className="text-xs text-gray-400">DOWNLOADS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{cookiesCount}</div>
                    <div className="text-xs text-gray-400">SAVED</div>
                  </div>
                </div>
              </div>

              {/* Niveles de limpieza */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {["MIN", "MED", "MAX"].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setCleaningLevel(level)}
                    className={`${
                      cleaningLevel === level ? "bg-pink-600 border-pink-400" : "bg-gray-700 border-gray-600"
                    } border-2 text-white hover:bg-pink-700`}
                  >
                    {level}
                  </Button>
                ))}
              </div>

              {/* Opciones de limpieza */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: HardDrive, label: "Cache", enabled: true },
                  { icon: Cookie, label: "Cookies", enabled: false },
                  { icon: Tabs, label: "Tabs", enabled: true },
                  { icon: Clock, label: "Browsing history", enabled: false },
                  { icon: Download, label: "Downloads", enabled: true },
                  { icon: Settings, label: "Sidebar icons", enabled: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>

              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3">START CLEANING</Button>
            </div>
          </div>
        )}

        {showVPN && (
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-green-400">VPN Nativo</h3>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Estado VPN</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVpnEnabled(!vpnEnabled)}
                  className={`h-6 w-12 rounded-full ${vpnEnabled ? "bg-green-600" : "bg-gray-600"}`}
                >
                  <div
                    className={`h-4 w-4 bg-white rounded-full transition-transform ${vpnEnabled ? "translate-x-6" : "translate-x-0"}`}
                  />
                </Button>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-300 mb-2 block">Ubicación</label>
                <select
                  value={vpnLocation}
                  onChange={(e) => setVpnLocation(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                >
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Alemania">Alemania</option>
                  <option value="Japón">Japón</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="text-sm text-gray-400">
                <p>• Navegación anónima y segura</p>
                <p>• Acceso a contenido geo-restringido</p>
                <p>• Cifrado de extremo a extremo</p>
              </div>
            </div>
          </div>
        )}

        {showFlow && (
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-blue-400">Flow - Sincronización</h3>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Dispositivos conectados</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-sm">iPhone de Juan</span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div className="flex items-center">
                    <Monitor className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-sm">PC Escritorio</span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-3">Enviar a dispositivo</h4>
              <div className="flex space-x-2">
                <Input placeholder="URL o texto" className="flex-1 bg-gray-700 border-gray-600 text-white" />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-800" />
              </div>
              <p className="text-xs text-gray-400">Escanea para conectar dispositivo</p>
            </div>
          </div>
        )}

        {/* Browser Content */}
        <div className="flex-1 relative">
          {showStartPage ? (
            <div className="h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-3000"></div>
              </div>
              {/* Ondas adicionales para más dinamismo */}
              <div className="absolute inset-0 opacity-20">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                  <path d="M0,400 C300,200 600,600 1200,300 L1200,800 L0,800 Z" fill="url(#wave1)" />
                  <path d="M0,500 C400,300 800,700 1200,400 L1200,800 L0,800 Z" fill="url(#wave2)" />
                  <defs>
                    <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Contenido de la página de inicio */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                <div className="mb-16">
                  <div className="flex items-center bg-gray-800/60 backdrop-blur-md rounded-full px-6 py-4 w-[500px] border border-gray-600/30 shadow-2xl">
                    <div className="bg-white rounded-full p-2 mr-4 shadow-lg">
                      <Search className="h-5 w-5 text-gray-800" />
                    </div>
                    <Input
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleNavigate()}
                      className="border-0 bg-transparent focus:ring-0 text-white placeholder-gray-400 text-lg flex-1"
                      placeholder="Buscar en la web"
                    />
                    <Button
                      onClick={() => handleNavigate()}
                      className="bg-purple-600 hover:bg-purple-700 rounded-full ml-2 shadow-lg"
                      size="sm"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 max-w-4xl">
                  {quickAccess.map((site, index) => (
                    <div key={index} onClick={() => handleNavigate(site.url)} className="group cursor-pointer">
                      <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 h-32 flex flex-col items-center justify-center hover:scale-105 hover:bg-gray-700/70 transition-all duration-300 shadow-xl border border-gray-600/20">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                          {site.icon}
                        </div>
                        <span className="text-gray-200 font-medium text-sm group-hover:text-white transition-colors">
                          {site.name}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="group cursor-pointer">
                    <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 h-32 flex flex-col items-center justify-center hover:scale-105 hover:bg-gray-700/50 transition-all duration-300 border-2 border-dashed border-gray-500/50 hover:border-purple-400/70 shadow-xl">
                      <Plus className="h-8 w-8 text-gray-400 mb-3 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-200" />
                      <span className="text-gray-400 font-medium text-sm group-hover:text-purple-400 transition-colors">
                        Agregar sitio
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="w-full h-full border-0"
                title="Web Browser"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
