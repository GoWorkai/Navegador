"use client"

import { useState } from "react"
import { Grid3X3, List, Search, Upload, Heart, Share, Trash2, Download, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Photo {
  id: string
  src: string
  title: string
  date: Date
  size: string
  location?: string
  tags: string[]
  isLiked: boolean
}

export function PhotosWindow() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [sortBy, setSortBy] = useState("date")

  const photos: Photo[] = [
    {
      id: "1",
      src: "/placeholder.svg?height=300&width=400",
      title: "Montañas al amanecer",
      date: new Date("2024-01-15"),
      size: "2.4 MB",
      location: "Cordillera de los Andes",
      tags: ["naturaleza", "montañas", "amanecer"],
      isLiked: true,
    },
    {
      id: "2",
      src: "/placeholder.svg?height=300&width=400",
      title: "Ciudad nocturna",
      date: new Date("2024-01-14"),
      size: "3.1 MB",
      location: "Buenos Aires",
      tags: ["ciudad", "noche", "arquitectura"],
      isLiked: false,
    },
    {
      id: "3",
      src: "/placeholder.svg?height=300&width=400",
      title: "Atardecer en la playa",
      date: new Date("2024-01-13"),
      size: "1.8 MB",
      location: "Mar del Plata",
      tags: ["playa", "atardecer", "océano"],
      isLiked: true,
    },
    {
      id: "4",
      src: "/placeholder.svg?height=300&width=400",
      title: "Bosque encantado",
      date: new Date("2024-01-12"),
      size: "2.7 MB",
      location: "Bariloche",
      tags: ["bosque", "árboles", "naturaleza"],
      isLiked: false,
    },
    {
      id: "5",
      src: "/placeholder.svg?height=300&width=400",
      title: "Reunión familiar",
      date: new Date("2024-01-11"),
      size: "1.5 MB",
      tags: ["familia", "retrato", "celebración"],
      isLiked: true,
    },
    {
      id: "6",
      src: "/placeholder.svg?height=300&width=400",
      title: "Cena especial",
      date: new Date("2024-01-10"),
      size: "1.2 MB",
      tags: ["comida", "cena", "restaurante"],
      isLiked: false,
    },
  ]

  const filteredPhotos = photos.filter(
    (photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (photo.location && photo.location.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return b.date.getTime() - a.date.getTime()
      case "name":
        return a.title.localeCompare(b.title)
      case "size":
        return Number.parseFloat(b.size) - Number.parseFloat(a.size)
      default:
        return 0
    }
  })

  const toggleLike = (photoId: string) => {
    // En una implementación real, esto actualizaría el estado de la foto
    console.log("Toggle like for photo:", photoId)
  }

  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Galería de Fotos</h1>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Subir Fotos
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, etiquetas o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="size">Tamaño</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 h-[calc(100%-120px)] overflow-auto">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedPhotos.map((photo) => (
              <Card key={photo.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onClick={() => openPhotoModal(photo)}
                    />

                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => openPhotoModal(photo)}>
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => toggleLike(photo.id)}>
                          <Heart className={`w-4 h-4 ${photo.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Indicador de favorito */}
                    {photo.isLiked && (
                      <div className="absolute top-2 right-2">
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{photo.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{photo.date.toLocaleDateString()}</p>
                    {photo.location && <p className="text-xs text-gray-400 truncate">{photo.location}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPhotos.map((photo) => (
              <Card key={photo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.title}
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                      onClick={() => openPhotoModal(photo)}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{photo.title}</h3>
                      <p className="text-sm text-gray-500">
                        {photo.date.toLocaleDateString()} • {photo.size}
                      </p>
                      {photo.location && <p className="text-sm text-gray-400">{photo.location}</p>}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {photo.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => toggleLike(photo.id)}>
                        <Heart className={`w-4 h-4 ${photo.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de foto */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold">{selectedPhoto.title}</h2>
                <p className="text-sm text-gray-500">
                  {selectedPhoto.date.toLocaleDateString()} • {selectedPhoto.size}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => toggleLike(selectedPhoto.id)}>
                  <Heart className={`w-4 h-4 ${selectedPhoto.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={closePhotoModal}>
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-4">
              <img
                src={selectedPhoto.src || "/placeholder.svg"}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[70vh] mx-auto rounded"
              />

              {selectedPhoto.location && (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-2">📍 {selectedPhoto.location}</p>
              )}

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {selectedPhoto.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
