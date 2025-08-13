"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, ShieldX, X, Plus, Trash2, Eye, EyeOff, BarChart3, Filter, Globe, Zap } from "lucide-react"

interface AdBlockRule {
  id: string
  domain: string
  type: "block" | "allow"
  category: "ads" | "trackers" | "social" | "analytics" | "custom"
  enabled: boolean
  createdAt: Date
}

interface AdBlockStats {
  totalBlocked: number
  adsBlocked: number
  trackersBlocked: number
  socialBlocked: number
  analyticsBlocked: number
  bandwidthSaved: number
  timesSaved: number
}

interface AdBlockerProps {
  onClose: () => void
  onToggle: (enabled: boolean) => void
  currentUrl?: string
}

const DEFAULT_BLOCK_LISTS = [
  { name: "EasyList", category: "ads", enabled: true, rules: 50000 },
  { name: "EasyPrivacy", category: "trackers", enabled: true, rules: 25000 },
  { name: "Fanboy's Social", category: "social", enabled: false, rules: 15000 },
  { name: "uBlock filters", category: "ads", enabled: true, rules: 30000 },
  { name: "Malware domains", category: "security", enabled: true, rules: 10000 },
]

const COMMON_AD_DOMAINS = [
  "doubleclick.net",
  "googleadservices.com",
  "googlesyndication.com",
  "facebook.com/tr",
  "google-analytics.com",
  "googletagmanager.com",
  "amazon-adsystem.com",
  "adsystem.amazon.com",
  "outbrain.com",
  "taboola.com",
]

export function AdBlocker({ onClose, onToggle, currentUrl }: AdBlockerProps) {
  const [adBlockEnabled, setAdBlockEnabled] = useState(true)
  const [customRules, setCustomRules] = useState<AdBlockRule[]>([
    {
      id: "1",
      domain: "doubleclick.net",
      type: "block",
      category: "ads",
      enabled: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      domain: "google-analytics.com",
      type: "block",
      category: "analytics",
      enabled: true,
      createdAt: new Date(),
    },
  ])

  const [stats, setStats] = useState<AdBlockStats>({
    totalBlocked: 1247,
    adsBlocked: 892,
    trackersBlocked: 234,
    socialBlocked: 67,
    analyticsBlocked: 54,
    bandwidthSaved: 15.7, // MB
    timesSaved: 23.4, // seconds
  })

  const [newRule, setNewRule] = useState("")
  const [ruleType, setRuleType] = useState<"block" | "allow">("block")
  const [ruleCategory, setRuleCategory] = useState<"ads" | "trackers" | "social" | "analytics" | "custom">("custom")
  const [blockLists, setBlockLists] = useState(DEFAULT_BLOCK_LISTS)
  const [aggressiveMode, setAggressiveMode] = useState(false)
  const [allowIntrusive, setAllowIntrusive] = useState(false)
  const [blockSocial, setBlockSocial] = useState(false)

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      if (adBlockEnabled) {
        setStats((prev) => ({
          ...prev,
          totalBlocked: prev.totalBlocked + Math.floor(Math.random() * 3),
          adsBlocked: prev.adsBlocked + Math.floor(Math.random() * 2),
          trackersBlocked: prev.trackersBlocked + Math.floor(Math.random() * 1),
          bandwidthSaved: prev.bandwidthSaved + Math.random() * 0.1,
          timesSaved: prev.timesSaved + Math.random() * 0.5,
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [adBlockEnabled])

  const handleToggleAdBlock = () => {
    const newState = !adBlockEnabled
    setAdBlockEnabled(newState)
    onToggle(newState)
  }

  const addCustomRule = () => {
    if (!newRule.trim()) return

    const rule: AdBlockRule = {
      id: Date.now().toString(),
      domain: newRule.trim(),
      type: ruleType,
      category: ruleCategory,
      enabled: true,
      createdAt: new Date(),
    }

    setCustomRules((prev) => [...prev, rule])
    setNewRule("")
  }

  const removeRule = (id: string) => {
    setCustomRules((prev) => prev.filter((rule) => rule.id !== id))
  }

  const toggleRule = (id: string) => {
    setCustomRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const addQuickRule = (domain: string, type: "block" | "allow") => {
    const rule: AdBlockRule = {
      id: Date.now().toString(),
      domain,
      type,
      category: "custom",
      enabled: true,
      createdAt: new Date(),
    }
    setCustomRules((prev) => [...prev, rule])
  }

  const getCurrentDomain = () => {
    if (!currentUrl) return ""
    try {
      return new URL(currentUrl).hostname
    } catch {
      return ""
    }
  }

  const isCurrentDomainBlocked = () => {
    const domain = getCurrentDomain()
    return customRules.some((rule) => rule.domain === domain && rule.type === "block" && rule.enabled)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ads":
        return "🎯"
      case "trackers":
        return "👁️"
      case "social":
        return "📱"
      case "analytics":
        return "📊"
      default:
        return "🔧"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ads":
        return "text-red-400"
      case "trackers":
        return "text-yellow-400"
      case "social":
        return "text-blue-400"
      case "analytics":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {adBlockEnabled ? (
              <ShieldCheck className="h-5 w-5 text-green-400" />
            ) : (
              <ShieldX className="h-5 w-5 text-red-400" />
            )}
            <span>Bloqueador de Anuncios</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={adBlockEnabled ? "default" : "secondary"}>
              {adBlockEnabled ? "Activo" : "Desactivado"}
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {formatNumber(stats.totalBlocked)} bloqueados
            </Badge>
          </div>
          <Switch checked={adBlockEnabled} onCheckedChange={handleToggleAdBlock} />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="stats" className="text-xs">
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="rules" className="text-xs">
              Reglas
            </TabsTrigger>
            <TabsTrigger value="lists" className="text-xs">
              Listas
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            {/* Current Site */}
            {currentUrl && (
              <div className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Sitio Actual</span>
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{getCurrentDomain()}</span>
                  <div className="flex items-center space-x-2">
                    {isCurrentDomainBlocked() ? (
                      <Badge variant="destructive" className="text-xs">
                        Bloqueado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Permitido
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addQuickRule(getCurrentDomain(), isCurrentDomainBlocked() ? "allow" : "block")}
                    >
                      {isCurrentDomainBlocked() ? "Permitir" : "Bloquear"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs text-gray-400">Anuncios</span>
                </div>
                <span className="text-lg font-bold text-red-400">{formatNumber(stats.adsBlocked)}</span>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-xs text-gray-400">Rastreadores</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">{formatNumber(stats.trackersBlocked)}</span>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs text-gray-400">Social</span>
                </div>
                <span className="text-lg font-bold text-blue-400">{formatNumber(stats.socialBlocked)}</span>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400">Analytics</span>
                </div>
                <span className="text-lg font-bold text-green-400">{formatNumber(stats.analyticsBlocked)}</span>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Ahorros</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Ancho de banda:</span>
                  <span className="ml-2 font-medium text-green-400">{stats.bandwidthSaved.toFixed(1)} MB</span>
                </div>
                <div>
                  <span className="text-gray-400">Tiempo:</span>
                  <span className="ml-2 font-medium text-blue-400">{stats.timesSaved.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            {/* Add New Rule */}
            <div className="bg-gray-800 rounded-lg p-3 space-y-3">
              <h4 className="text-sm font-medium">Agregar Regla Personalizada</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="ejemplo.com"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
                <Select value={ruleType} onValueChange={(value: "block" | "allow") => setRuleType(value)}>
                  <SelectTrigger className="w-24 bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="block">Bloquear</SelectItem>
                    <SelectItem value="allow">Permitir</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addCustomRule} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Custom Rules List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {customRules.map((rule) => (
                <div key={rule.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={getCategoryColor(rule.category)}>{getCategoryIcon(rule.category)}</span>
                    <div>
                      <span className="text-sm font-medium">{rule.domain}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={rule.type === "block" ? "destructive" : "default"} className="text-xs">
                          {rule.type === "block" ? "Bloquear" : "Permitir"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rule.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleRule(rule.id)}>
                      {rule.enabled ? (
                        <Eye className="h-4 w-4 text-green-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Common Domains */}
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Dominios Comunes</h4>
              <div className="flex flex-wrap gap-2">
                {COMMON_AD_DOMAINS.map((domain) => (
                  <Button
                    key={domain}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => addQuickRule(domain, "block")}
                  >
                    {domain}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lists" className="space-y-4">
            {blockLists.map((list, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{list.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatNumber(list.rules)} reglas
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{list.category}</span>
                </div>
                <Switch
                  checked={list.enabled}
                  onCheckedChange={(checked) => {
                    setBlockLists((prev) => prev.map((l, i) => (i === index ? { ...l, enabled: checked } : l)))
                  }}
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Modo Agresivo</span>
                </div>
                <Switch checked={aggressiveMode} onCheckedChange={setAggressiveMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Permitir anuncios intrusivos</span>
                </div>
                <Switch checked={allowIntrusive} onCheckedChange={setAllowIntrusive} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Bloquear widgets sociales</span>
                </div>
                <Switch checked={blockSocial} onCheckedChange={setBlockSocial} />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2">Importar/Exportar</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Importar Reglas
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Exportar Reglas
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
