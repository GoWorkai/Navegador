"use client"

import { useState } from "react"
import {
  Folder,
  File,
  Search,
  Upload,
  Download,
  Trash2,
  Copy,
  Move,
  Star,
  Grid3X3,
  List,
  ArrowUp,
  Home,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FileItem {
  id: string
  name: string
  type: "folder" | "file"
  size?: string
  modified: Date
  isStarred: boolean
  extension?: string
  path: string
}

export function FilesWindow() {
  const [currentPath, setCurrentPath] = useState("/")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const files: FileItem[] = [
    {
      id: "1",
      name: "Documentos",
      type: "folder",
      modified: new Date("2024-01-15"),
      isStarred: true,
      path: "/Documentos",
    },
    {
      id: "2",
      name: "Imágenes",
      type: "folder",
      modified: new Date("2024-01-14"),
      isStarred: false,
      path: "/Imágenes",
    },
    {
      id: "3",
      name: "Descargas",
      type: "folder",
      modified: new Date("2024-01-13"),
      isStarred: false,
      path: "/Descargas",
    },
    {
      id: "4",
      name: "Proyecto_Final.pdf",
      type: "file",
      size: "2.4 MB",
      modified: new Date("2024-01-12"),
      isStarred: true,
      extension: "pdf",
      path: "/Proyecto_Final.pdf",
    },
    {
      id: "5",
      name: "Presentación.pptx",
      type: "file",
      size: "5.1 MB",
      modified: new Date("2024-01-11"),
      isStarred: false,
      extension: "pptx",
      path: "/Presentación.pptx",
    },
    {
      id: "6",
      name: "Datos.xlsx",
      type: "file",
      size: "1.8 MB",
      modified: new Date("2024-01-10"),
      isStarred: false,
      extension: "xlsx",
      path: "/Datos.xlsx",
    },
    {
      id: "7",
      name: "Código_Fuente.zip",
      type: "file",
      size: "12.3 MB",
      modified: new Date("2024-01-09"),
      isStarred: true,
      extension: "zip",
      path: "/Código_Fuente.zip",
    },
    {
      id: "8",
      name: "Notas.txt",
      type: "file",
      size: "0.5 MB",
      modified: new Date("2024-01-08"),
      isStarred: false,
      extension: "txt",
      path: "/Notas.txt",
    },
  ]

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Carpetas primero
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1
    }

    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "modified":
        return b.modified.getTime() - a.modified.getTime()
      case "size":
        if (!a.size || !b.size) return 0
        return Number.parseFloat(b.size) - Number.parseFloat(a.size)
      default:
        return 0
    }
  })

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      return <Folder className="w-5 h-5 text-blue-500" />
    }

    switch (file.extension) {
      case "pdf":
        return <File className="w-5 h-5 text-red-500" />
      case "pptx":
        return <File className="w-5 h-5 text-orange-500" />
      case "xlsx":
        return <File className="w-5 h-5 text-green-500" />
      case "zip":
        return <File className="w-5 h-5 text-purple-500" />
      case "txt":
        return <File className="w-5 h-5 text-gray-500" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  const toggleSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const toggleStar = (itemId: string) => {
    // En una implementación real, esto actualizaría el estado del archivo
    console.log("Toggle star for item:", itemId)
  }

  const pathSegments = currentPath.split("/").filter(Boolean)

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4">Explorador</h2>

        <nav className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
            <Folder className="w-5 h-5" />
            <span>Documentos</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
            <Download className="w-5 h-5" />
            <span>Descargas</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
            <Star className="w-5 h-5" />
            <span>Favoritos</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
            <Trash2 className="w-5 h-5" />
            <span>Papelera</span>
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-4">
            <Button variant="ghost" size="sm">
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-1 text-sm">
              <button className="hover:text-blue-500">Inicio</button>
              {pathSegments.map((segment, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <button className="hover:text-blue-500">{segment}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar archivos y carpetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Ordenar */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="modified">Fecha</SelectItem>
                  <SelectItem value="size">Tamaño</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              {/* Vista */}
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Subir
              </Button>
            </div>
          </div>

          {/* Acciones para elementos seleccionados */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2 mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium">{selectedItems.length} elemento(s) seleccionado(s)</span>
              <div className="flex space-x-1 ml-auto">
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar
                </Button>
                <Button size="sm" variant="outline">
                  <Move className="w-4 h-4 mr-1" />
                  Mover
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Descargar
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de archivos */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sortedFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedItems.includes(file.id) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => toggleSelection(file.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-2 flex justify-center">{getFileIcon(file)}</div>
                    <h3 className="text-sm font-medium truncate mb-1">{file.name}</h3>
                    {file.size && <p className="text-xs text-gray-500">{file.size}</p>}
                    <p className="text-xs text-gray-400">{file.modified.toLocaleDateString()}</p>
                    {file.isStarred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mx-auto mt-1" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                    selectedItems.includes(file.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => toggleSelection(file.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(file.id)}
                    onChange={() => toggleSelection(file.id)}
                    className="rounded"
                  />

                  {getFileIcon(file)}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                  </div>

                  <div className="text-sm text-gray-500 w-24 text-right">{file.size || "-"}</div>

                  <div className="text-sm text-gray-500 w-32 text-right">{file.modified.toLocaleDateString()}</div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(file.id)
                    }}
                  >
                    <Star className={`w-4 h-4 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
