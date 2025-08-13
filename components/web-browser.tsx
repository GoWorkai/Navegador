"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Brain, Shield, ShieldCheck, Battery, Puzzle } from "lucide-react"
import { VPNManager } from "@/components/vpn-manager"
import { AdBlocker } from "@/components/ad-blocker"
import { PowerDataSaver } from "@/components/power-data-saver"
import { ExtensionManager } from "@/components/extension-manager"
import { WorkspaceManager } from "@/components/workspace-manager"

interface WebBrowserProps {
  onClose?: () => void
  searchQuery?: string // Added searchQuery prop
  searchEngine?: string // Added searchEngine prop
}

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isActive: boolean
  workspaceId: number
  category?: string
  lastAccessed: Date
  timeSpent: number
}

interface Workspace {
  id: number
  name: string
  icon: string
  color: string
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

interface VPNLocation {
  id: string
  name: string
  country: string
  flag: string
  ping: number
  load: number
}

export function WebBrowser({ onClose, searchQuery, searchEngine = "Google" }: WebBrowserProps) {
  const [showVPNManager, setShowVPNManager] = useState<boolean>(false)
  const [showAdBlocker, setShowAdBlocker] = useState<boolean>(false)
  const [showPowerSaver, setShowPowerSaver] = useState<boolean>(false)
  const [showExtensionManager, setShowExtensionManager] = useState<boolean>(false)
  const [showWorkspaceManager, setShowWorkspaceManager] = useState<boolean>(false)

  const [vpnEnabled, setVpnEnabled] = useState<boolean>(false)
  const [vpnLocation, setVpnLocation] = useState<VPNLocation | null>(null)
  const [adBlockEnabled, setAdBlockEnabled] = useState<boolean>(true)
  const [adsBlocked, setAdsBlocked] = useState<number>(127)
  const [batterySaverEnabled, setBatterySaverEnabled] = useState<boolean>(false)
  const [dataSaverEnabled, setDataSaverEnabled] = useState<boolean>(false)
  const [installedExtensions, setInstalledExtensions] = useState<string[]>(["ublock-origin", "dark-reader"])

  const [currentWorkspace, setCurrentWorkspace] = useState<number>(1)
  const [currentUrl, setCurrentUrl] = useState<string>("https://www.google.com")
  const [activeTab, setActiveTab] = useState<string | null>("tab-1")

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 1,
      name: "Personal",
      icon: "🏠",
      color: "bg-blue-500",
      category: "personal",
      description: "Navegación personal y entretenimiento",
      autoGroup: true,
      createdAt: new Date(),
      lastActive: new Date(),
      rules: [
        { id: "1", type: "domain", value: "youtube.com", action: "move" },
        { id: "2", type: "domain", value: "netflix.com", action: "move" },
      ],
      tabs: [
        {
          id: "tab-1",
          title: "Google",
          url: "https://www.google.com",
          isActive: true,
          workspaceId: 1,
          category: "search",
          lastAccessed: new Date(),
          timeSpent: 45,
        },
        {
          id: "tab-2",
          title: "YouTube",
          url: "https://www.youtube.com",
          isActive: false,
          workspaceId: 1,
          category: "entertainment",
          lastAccessed: new Date(Date.now() - 300000),
          timeSpent: 120,
        },
      ],
    },
    {
      id: 2,
      name: "Trabajo",
      icon: "💼",
      color: "bg-green-500",
      category: "productivity",
      description: "Herramientas de trabajo y productividad",
      autoGroup: true,
      createdAt: new Date(),
      lastActive: new Date(Date.now() - 3600000),
      rules: [
        { id: "1", type: "domain", value: "gmail.com", action: "move" },
        { id: "2", type: "domain", value: "docs.google.com", action: "move" },
        { id: "3", type: "keyword", value: "productivity", action: "suggest" },
      ],
      tabs: [
        {
          id: "tab-3",
          title: "Gmail",
          url: "https://mail.google.com",
          isActive: false,
          workspaceId: 2,
          category: "email",
          lastAccessed: new Date(Date.now() - 3600000),
          timeSpent: 90,
        },
      ],
    },
    {
      id: 3,
      name: "Estudio",
      icon: "📚",
      color: "bg-purple-500",
      category: "education",
      description: "Recursos educativos y aprendizaje",
      autoGroup: true,
      createdAt: new Date(),
      lastActive: new Date(Date.now() - 7200000),
      rules: [
        { id: "1", type: "domain", value: "wikipedia.org", action: "move" },
        { id: "2", type: "keyword", value: "tutorial", action: "suggest" },
        { id: "3", type: "keyword", value: "course", action: "suggest" },
      ],
      tabs: [],
    },
  ])

  const [tabs, setTabs] = useState<Tab[]>(workspaces.find((w) => w.id === currentWorkspace)?.tabs || [])

  const handleVPNToggle = (enabled: boolean, location?: VPNLocation) => {
    setVpnEnabled(enabled)
    if (location) {
      setVpnLocation(location)
    }
  }

  const handleAdBlockToggle = (enabled: boolean) => {
    setAdBlockEnabled(enabled)
  }

  const handleBatterySaverToggle = (enabled: boolean) => {
    setBatterySaverEnabled(enabled)
  }

  const handleDataSaverToggle = (enabled: boolean) => {
    setDataSaverEnabled(enabled)
  }

  const handleExtensionToggle = (extensionId: string, enabled: boolean) => {
    if (enabled) {
      setInstalledExtensions((prev) => [...prev.filter((id) => id !== extensionId), extensionId])
    } else {
      setInstalledExtensions((prev) => prev.filter((id) => id !== extensionId))
    }
  }

  const switchWorkspace = (workspaceId: number) => {
    setCurrentWorkspace(workspaceId)
    const workspace = workspaces.find((w) => w.id === workspaceId)
    if (workspace) {
      setTabs(workspace.tabs)
      // Update last active time
      setWorkspaces((prev) => prev.map((w) => (w.id === workspaceId ? { ...w, lastActive: new Date() } : w)))
      // Set active tab to first tab in workspace or null if no tabs
      const firstTab = workspace.tabs.find((t) => t.isActive) || workspace.tabs[0]
      setActiveTab(firstTab?.id || null)
      if (firstTab) {
        setCurrentUrl(firstTab.url)
      }
    }
  }

  const handleWorkspaceChange = (updatedWorkspaces: Workspace[]) => {
    setWorkspaces(updatedWorkspaces)
    // Update tabs if current workspace was modified
    const currentWs = updatedWorkspaces.find((w) => w.id === currentWorkspace)
    if (currentWs) {
      setTabs(currentWs.tabs)
    }
  }

  const createNewTab = (url: string, title: string) => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title,
      url,
      isActive: true,
      workspaceId: currentWorkspace,
      category: categorizeUrl(url),
      lastAccessed: new Date(),
      timeSpent: 0,
    }

    // Apply workspace rules to determine if tab should be moved
    const currentWs = workspaces.find((w) => w.id === currentWorkspace)
    if (currentWs) {
      const suggestedWorkspace = findBestWorkspaceForTab(newTab)
      if (suggestedWorkspace && suggestedWorkspace.id !== currentWorkspace) {
        newTab.workspaceId = suggestedWorkspace.id
        // Add tab to suggested workspace
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.id === suggestedWorkspace.id
              ? { ...w, tabs: [...w.tabs.map((t) => ({ ...t, isActive: false })), newTab] }
              : w,
          ),
        )
        // Switch to suggested workspace
        switchWorkspace(suggestedWorkspace.id)
      } else {
        // Add to current workspace
        setTabs((prev) => [...prev.map((t) => ({ ...t, isActive: false })), newTab])
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.id === currentWorkspace ? { ...w, tabs: [...w.tabs.map((t) => ({ ...t, isActive: false })), newTab] } : w,
          ),
        )
      }
    }

    setActiveTab(newTab.id)
    setCurrentUrl(url)
  }

  const categorizeUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname.toLowerCase()
      if (domain.includes("youtube") || domain.includes("netflix") || domain.includes("twitch")) return "entertainment"
      if (domain.includes("gmail") || domain.includes("outlook") || domain.includes("mail")) return "email"
      if (domain.includes("docs.google") || domain.includes("notion") || domain.includes("trello"))
        return "productivity"
      if (domain.includes("github") || domain.includes("stackoverflow") || domain.includes("dev")) return "development"
      if (domain.includes("amazon") || domain.includes("ebay") || domain.includes("shop")) return "shopping"
      if (domain.includes("facebook") || domain.includes("twitter") || domain.includes("instagram")) return "social"
      if (domain.includes("wikipedia") || domain.includes("coursera") || domain.includes("udemy")) return "education"
      return "general"
    } catch {
      return "general"
    }
  }

  const findBestWorkspaceForTab = (tab: Tab): Workspace | null => {
    let bestMatch: Workspace | null = null
    let bestScore = 0

    for (const workspace of workspaces) {
      let score = 0

      // Check rules
      for (const rule of workspace.rules) {
        if (rule.action === "move" || rule.action === "suggest") {
          if (rule.type === "domain" && tab.url.includes(rule.value)) {
            score += 10
          } else if (
            rule.type === "keyword" &&
            (tab.title.toLowerCase().includes(rule.value) || tab.url.toLowerCase().includes(rule.value))
          ) {
            score += 5
          } else if (rule.type === "category" && tab.category === rule.value) {
            score += 8
          }
        }
      }

      // Category matching
      if (workspace.category === tab.category) {
        score += 3
      }

      // Existing similar tabs
      const similarTabs = workspace.tabs.filter((t) => t.category === tab.category).length
      score += similarTabs

      if (score > bestScore) {
        bestScore = score
        bestMatch = workspace
      }
    }

    return bestScore > 3 ? bestMatch : null
  }

  const currentWorkspaceData = workspaces.find((w) => w.id === currentWorkspace)

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      const query = encodeURIComponent(searchQuery.trim())
      let searchUrl = ""

      // Generate search URL based on search engine
      switch (searchEngine) {
        case "Google":
          searchUrl = `https://www.google.com/search?q=${query}`
          break
        case "Duck":
          searchUrl = `https://duckduckgo.com/?q=${query}`
          break
        case "Bing":
          searchUrl = `https://www.bing.com/search?q=${query}`
          break
        case "Brave":
          searchUrl = `https://search.brave.com/search?q=${query}`
          break
        default:
          searchUrl = `https://www.google.com/search?q=${query}`
      }

      createNewTab(searchUrl, `${searchQuery} - ${searchEngine}`)
    }
  }, [searchQuery, searchEngine])

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* VPN Manager Modal */}
      {showVPNManager && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <VPNManager
            onClose={() => setShowVPNManager(false)}
            onVPNToggle={handleVPNToggle}
            currentTab={activeTab || undefined}
          />
        </div>
      )}

      {/* Ad Blocker Modal */}
      {showAdBlocker && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <AdBlocker onClose={() => setShowAdBlocker(false)} onToggle={handleAdBlockToggle} currentUrl={currentUrl} />
        </div>
      )}

      {/* Power Data Saver Modal */}
      {showPowerSaver && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <PowerDataSaver
            onClose={() => setShowPowerSaver(false)}
            onBatterySaverToggle={handleBatterySaverToggle}
            onDataSaverToggle={handleDataSaverToggle}
            isMobile={false}
          />
        </div>
      )}

      {/* Extension Manager Modal */}
      {showExtensionManager && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <ExtensionManager onClose={() => setShowExtensionManager(false)} onExtensionToggle={handleExtensionToggle} />
        </div>
      )}

      {showWorkspaceManager && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <WorkspaceManager
            workspaces={workspaces}
            currentWorkspace={currentWorkspace}
            onWorkspaceChange={handleWorkspaceChange}
            onSwitchWorkspace={switchWorkspace}
            onClose={() => setShowWorkspaceManager(false)}
          />
        </div>
      )}

      {/* Browser Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {workspaces.map((workspace) => (
              <Button
                key={workspace.id}
                onClick={() => switchWorkspace(workspace.id)}
                className={`px-3 py-1 text-xs rounded-full flex items-center space-x-1 transition-all ${
                  currentWorkspace === workspace.id
                    ? `${workspace.color} text-white shadow-lg`
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>{workspace.icon}</span>
                <span>{workspace.name}</span>
                {workspace.tabs.length > 0 && (
                  <span className="bg-white/20 px-1 rounded-full text-xs">{workspace.tabs.length}</span>
                )}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:bg-gray-700"
              onClick={() => setShowWorkspaceManager(true)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${
                vpnEnabled ? "text-green-400 hover:text-green-300" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setShowVPNManager(true)}
            >
              <Shield className="h-3 w-3" />
              {vpnEnabled && vpnLocation && <span className="text-xs">{vpnLocation.flag}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${
                adBlockEnabled ? "text-green-400 hover:text-green-300" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setShowAdBlocker(true)}
            >
              <ShieldCheck className="h-3 w-3" />
              {adBlockEnabled && <span className="text-xs">{adsBlocked}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${
                batterySaverEnabled || dataSaverEnabled
                  ? "text-green-400 hover:text-green-300"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setShowPowerSaver(true)}
            >
              <Battery className="h-3 w-3" />
              {(batterySaverEnabled || dataSaverEnabled) && (
                <span className="text-xs">
                  {batterySaverEnabled && dataSaverEnabled ? "B+D" : batterySaverEnabled ? "B" : "D"}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-1 ${
                installedExtensions.length > 0
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setShowExtensionManager(true)}
            >
              <Puzzle className="h-3 w-3" />
              {installedExtensions.length > 0 && <span className="text-xs">{installedExtensions.length}</span>}
            </Button>

            <span className="text-xs text-gray-400">
              {currentWorkspaceData?.name} • {tabs.length} pestañas
              {vpnEnabled && " • VPN"}
              {adBlockEnabled && " • AdBlock"}
              {(batterySaverEnabled || dataSaverEnabled) && " • Ahorro"}
              {installedExtensions.length > 0 && ` • ${installedExtensions.length} ext`}
            </span>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => setShowWorkspaceManager(true)}
            >
              <Brain className="h-3 w-3 mr-1" />
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mt-4">
          {currentUrl && currentUrl !== "https://www.google.com" ? (
            <div className="w-full h-96 bg-white rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2 border-b flex items-center space-x-2">
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-700">{currentUrl}</div>
              </div>
              <iframe
                src={currentUrl}
                className="w-full h-full border-0"
                title="Browser Content"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <h3 className="text-lg font-semibold mb-2">ARIA Navigator</h3>
              <p className="text-sm">Navegador web completo con IA integrada</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-white">Workspaces Inteligentes</div>
                  <div>Organización automática con IA</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-white">IA Integrada</div>
                  <div>Asistente Gemini</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-white">Privacidad</div>
                  <div>VPN + AdBlock</div>
                </div>
                <div className="bg-gray-700 p-3 rounded">
                  <div className="font-semibold text-white">Extensiones</div>
                  <div>Soporte CRX</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
