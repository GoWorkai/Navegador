"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Puzzle, X, Download, Trash2, Settings, Star, Shield, Search, Plus, AlertTriangle } from "lucide-react"

interface Extension {
  id: string
  name: string
  version: string
  description: string
  author: string
  enabled: boolean
  permissions: string[]
  category: "productivity" | "privacy" | "developer" | "social" | "entertainment" | "other"
  rating: number
  downloads: number
  size: string
  icon?: string
  installDate: Date
  updateAvailable?: boolean
  verified: boolean
}

interface ExtensionStore {
  id: string
  name: string
  version: string
  description: string
  author: string
  permissions: string[]
  category: "productivity" | "privacy" | "developer" | "social" | "entertainment" | "other"
  rating: number
  downloads: number
  size: string
  icon?: string
  verified: boolean
  price: number
}

interface ExtensionManagerProps {
  onClose: () => void
  onExtensionToggle: (extensionId: string, enabled: boolean) => void
}

const INSTALLED_EXTENSIONS: Extension[] = [
  {
    id: "ublock-origin",
    name: "uBlock Origin",
    version: "1.52.2",
    description: "Bloqueador de anuncios eficiente y de código abierto",
    author: "Raymond Hill",
    enabled: true,
    permissions: ["activeTab", "storage", "webRequest"],
    category: "privacy",
    rating: 4.8,
    downloads: 10000000,
    size: "2.1 MB",
    icon: "🛡️",
    installDate: new Date(Date.now() - 86400000 * 30),
    verified: true,
  },
  {
    id: "dark-reader",
    name: "Dark Reader",
    version: "4.9.63",
    description: "Modo oscuro para todos los sitios web",
    author: "Dark Reader Ltd",
    enabled: true,
    permissions: ["activeTab", "storage"],
    category: "productivity",
    rating: 4.6,
    downloads: 5000000,
    size: "1.8 MB",
    icon: "🌙",
    installDate: new Date(Date.now() - 86400000 * 15),
    verified: true,
  },
  {
    id: "react-devtools",
    name: "React Developer Tools",
    version: "4.28.5",
    description: "Herramientas de desarrollo para React",
    author: "Meta",
    enabled: false,
    permissions: ["activeTab", "debugger"],
    category: "developer",
    rating: 4.4,
    downloads: 3000000,
    size: "3.2 MB",
    icon: "⚛️",
    installDate: new Date(Date.now() - 86400000 * 7),
    updateAvailable: true,
    verified: true,
  },
]

const STORE_EXTENSIONS: ExtensionStore[] = [
  {
    id: "lastpass",
    name: "LastPass",
    version: "4.108.0",
    description: "Gestor de contraseñas gratuito",
    author: "LastPass",
    permissions: ["activeTab", "storage", "identity"],
    category: "privacy",
    rating: 4.2,
    downloads: 8000000,
    size: "4.5 MB",
    icon: "🔐",
    verified: true,
    price: 0,
  },
  {
    id: "grammarly",
    name: "Grammarly",
    version: "14.1097.0",
    description: "Asistente de escritura con IA",
    author: "Grammarly Inc.",
    permissions: ["activeTab", "storage", "contextMenus"],
    category: "productivity",
    rating: 4.5,
    downloads: 12000000,
    size: "6.8 MB",
    icon: "✍️",
    verified: true,
    price: 0,
  },
  {
    id: "honey",
    name: "Honey",
    version: "13.8.3",
    description: "Encuentra cupones automáticamente",
    author: "Honey Science LLC",
    permissions: ["activeTab", "storage", "webRequest"],
    category: "other",
    rating: 4.7,
    downloads: 17000000,
    size: "2.9 MB",
    icon: "🍯",
    verified: true,
    price: 0,
  },
  {
    id: "momentum",
    name: "Momentum",
    version: "1.7.1",
    description: "Nueva pestaña personalizada",
    author: "Momentum Dash LLC",
    permissions: ["activeTab", "storage", "geolocation"],
    category: "productivity",
    rating: 4.3,
    downloads: 4000000,
    size: "8.1 MB",
    icon: "🌅",
    verified: true,
    price: 0,
  },
]

export function ExtensionManager({ onClose, onExtensionToggle }: ExtensionManagerProps) {
  const [extensions, setExtensions] = useState<Extension[]>(INSTALLED_EXTENSIONS)
  const [storeExtensions, setStoreExtensions] = useState<ExtensionStore[]>(STORE_EXTENSIONS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "downloads" | "recent">("rating")
  const [showDeveloperMode, setShowDeveloperMode] = useState(false)

  const enabledExtensions = extensions.filter((ext) => ext.enabled)
  const updatesAvailable = extensions.filter((ext) => ext.updateAvailable).length

  const filteredStoreExtensions = storeExtensions.filter((ext) => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || ext.category === selectedCategory
    const notInstalled = !extensions.some((installed) => installed.id === ext.id)

    return matchesSearch && matchesCategory && notInstalled
  })

  const sortedStoreExtensions = [...filteredStoreExtensions].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "rating":
        return b.rating - a.rating
      case "downloads":
        return b.downloads - a.downloads
      default:
        return 0
    }
  })

  const toggleExtension = (extensionId: string) => {
    setExtensions((prev) => prev.map((ext) => (ext.id === extensionId ? { ...ext, enabled: !ext.enabled } : ext)))

    const extension = extensions.find((ext) => ext.id === extensionId)
    if (extension) {
      onExtensionToggle(extensionId, !extension.enabled)
    }
  }

  const installExtension = (storeExt: ExtensionStore) => {
    const newExtension: Extension = {
      ...storeExt,
      enabled: true,
      installDate: new Date(),
    }

    setExtensions((prev) => [...prev, newExtension])
    setStoreExtensions((prev) => prev.filter((ext) => ext.id !== storeExt.id))
  }

  const uninstallExtension = (extensionId: string) => {
    setExtensions((prev) => prev.filter((ext) => ext.id !== extensionId))

    const extension = STORE_EXTENSIONS.find((ext) => ext.id === extensionId)
    if (extension) {
      setStoreExtensions((prev) => [...prev, extension])
    }
  }

  const updateExtension = (extensionId: string) => {
    setExtensions((prev) =>
      prev.map((ext) => (ext.id === extensionId ? { ...ext, updateAvailable: false, version: "1.0.0" } : ext)),
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "productivity":
        return "⚡"
      case "privacy":
        return "🔒"
      case "developer":
        return "👨‍💻"
      case "social":
        return "👥"
      case "entertainment":
        return "🎮"
      default:
        return "🧩"
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"}`}
      />
    ))
  }

  return (
    <Card className="w-full max-w-4xl bg-gray-900 border-gray-700 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Puzzle className="h-5 w-5 text-purple-400" />
            <span>Gestor de Extensiones</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-purple-600">
            {enabledExtensions.length} activas
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {extensions.length} instaladas
          </Badge>
          {updatesAvailable > 0 && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              {updatesAvailable} actualizaciones
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="installed" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="installed" className="text-xs">
              Instaladas
            </TabsTrigger>
            <TabsTrigger value="store" className="text-xs">
              Tienda
            </TabsTrigger>
            <TabsTrigger value="developer" className="text-xs">
              Desarrollador
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="installed" className="space-y-4">
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  Actualizar todas
                </Button>
                <Button size="sm" variant="outline">
                  Exportar lista
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Modo desarrollador</span>
                <Switch checked={showDeveloperMode} onCheckedChange={setShowDeveloperMode} />
              </div>
            </div>

            {/* Extensions List */}
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {extensions.map((extension) => (
                  <Card key={extension.id} className="bg-gray-800 border-gray-700 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{extension.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-white">{extension.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              v{extension.version}
                            </Badge>
                            {extension.verified && <Shield className="h-3 w-3 text-green-400" />}
                            {extension.updateAvailable && (
                              <Badge className="text-xs bg-yellow-600">Actualización disponible</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{extension.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Por {extension.author}</span>
                            <span>
                              {getCategoryIcon(extension.category)} {extension.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              {renderStars(extension.rating)}
                              <span>({extension.rating})</span>
                            </div>
                            <span>{formatNumber(extension.downloads)} descargas</span>
                            <span>{extension.size}</span>
                          </div>
                          {showDeveloperMode && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">
                                Permisos: {extension.permissions.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={extension.enabled} onCheckedChange={() => toggleExtension(extension.id)} />
                        {extension.updateAvailable && (
                          <Button size="sm" variant="outline" onClick={() => updateExtension(extension.id)}>
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => uninstallExtension(extension.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="store" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar extensiones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="productivity">Productividad</SelectItem>
                  <SelectItem value="privacy">Privacidad</SelectItem>
                  <SelectItem value="developer">Desarrollador</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="entertainment">Entretenimiento</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="rating">Valoración</SelectItem>
                  <SelectItem value="downloads">Descargas</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Store Extensions */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 gap-4">
                {sortedStoreExtensions.map((extension) => (
                  <Card key={extension.id} className="bg-gray-800 border-gray-700 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{extension.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-white">{extension.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              v{extension.version}
                            </Badge>
                            {extension.verified && <Shield className="h-3 w-3 text-green-400" />}
                            {extension.price === 0 && <Badge className="text-xs bg-green-600">Gratis</Badge>}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{extension.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Por {extension.author}</span>
                            <span>
                              {getCategoryIcon(extension.category)} {extension.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              {renderStars(extension.rating)}
                              <span>({extension.rating})</span>
                            </div>
                            <span>{formatNumber(extension.downloads)} descargas</span>
                            <span>{extension.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => installExtension(extension)} className="bg-purple-600 hover:bg-purple-700">
                        <Download className="h-4 w-4 mr-2" />
                        Instalar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="developer" className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                Modo Desarrollador
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Permite cargar extensiones no empaquetadas y acceder a funciones avanzadas.
              </p>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Cargar extensión desempaquetada
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Instalar desde archivo .crx
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Herramientas de desarrollador
                </Button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">API de Extensiones</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>chrome.tabs</span>
                  <Badge variant="outline" className="text-xs">
                    Disponible
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>chrome.storage</span>
                  <Badge variant="outline" className="text-xs">
                    Disponible
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>chrome.webRequest</span>
                  <Badge variant="outline" className="text-xs">
                    Disponible
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>chrome.contextMenus</span>
                  <Badge variant="outline" className="text-xs">
                    Disponible
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Actualizaciones automáticas</span>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Permitir extensiones en incógnito</span>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Mostrar notificaciones de extensiones</span>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Verificar compatibilidad</span>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Estadísticas</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Extensiones instaladas:</span>
                  <div className="font-medium">{extensions.length}</div>
                </div>
                <div>
                  <span className="text-gray-400">Extensiones activas:</span>
                  <div className="font-medium">{enabledExtensions.length}</div>
                </div>
                <div>
                  <span className="text-gray-400">Espacio utilizado:</span>
                  <div className="font-medium">24.7 MB</div>
                </div>
                <div>
                  <span className="text-gray-400">Última actualización:</span>
                  <div className="font-medium">Hace 2 días</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Restablecer todas las extensiones
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-400 border-red-400 hover:bg-red-400 hover:text-white bg-transparent"
              >
                Desinstalar todas las extensiones
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
