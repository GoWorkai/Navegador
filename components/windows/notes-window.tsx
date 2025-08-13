"use client"

import { useState } from "react"
import { Plus, Search, FileText, Star, Trash2, Edit3, Brain, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isStarred: boolean
  tags: string[]
}

export function NotesWindow() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Ideas para el navegador",
      content:
        "- Integrar IA más profundamente\n- Mejorar la gestión de pestañas\n- Añadir espacios de trabajo personalizados",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      isStarred: true,
      tags: ["desarrollo", "ideas"],
    },
    {
      id: "2",
      title: "Lista de compras",
      content: "- Leche\n- Pan\n- Huevos\n- Frutas\n- Verduras",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
      isStarred: false,
      tags: ["personal", "compras"],
    },
  ])

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nueva nota",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isStarred: false,
      tags: [],
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
    setIsEditing(true)
    setEditContent("")
  }

  const toggleStar = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isStarred: !note.isStarred } : note)))
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.find((note) => note.id !== noteId) || null)
    }
  }

  const startEditing = () => {
    setIsEditing(true)
    setEditContent(selectedNote?.content || "")
  }

  const saveNote = () => {
    if (!selectedNote) return

    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNote.id ? { ...note, content: editContent, updatedAt: new Date() } : note,
      ),
    )
    setSelectedNote((prev) => (prev ? { ...prev, content: editContent, updatedAt: new Date() } : null))
    setIsEditing(false)
  }

  const getAISuggestions = () => {
    if (!selectedNote) return []

    // Simulación de sugerencias de IA basadas en el contenido
    const suggestions = [
      "Agregar fecha límite para las tareas",
      "Organizar por prioridad",
      "Crear recordatorio",
      "Compartir con equipo",
      "Convertir en lista de tareas",
    ]

    return suggestions.slice(0, 3)
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar con lista de notas */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Notas</h2>
            <Button size="sm" onClick={createNewNote}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de notas */}
        <div className="flex-1 overflow-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedNote?.id === note.id ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm truncate flex-1">{note.title}</h3>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(note.id)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Star
                      className={`w-3 h-3 ${note.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {note.content.substring(0, 100)}...
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{note.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor de notas */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Header del editor */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <h1 className="text-xl font-semibold">{selectedNote.title}</h1>
                  {selectedNote.isStarred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                </div>

                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <Button onClick={saveNote} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  ) : (
                    <Button onClick={startEditing} variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Creado: {selectedNote.createdAt.toLocaleDateString()}</span>
                <span>Modificado: {selectedNote.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Contenido del editor */}
            <div className="flex-1 p-4 bg-white dark:bg-gray-800">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Escribe tu nota aquí..."
                  className="w-full h-full resize-none border-none focus:ring-0 text-base"
                />
              ) : (
                <div className="h-full overflow-auto">
                  <pre className="whitespace-pre-wrap text-base font-sans">{selectedNote.content}</pre>
                </div>
              )}
            </div>

            {/* Sugerencias de IA */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Sugerencias de IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {getAISuggestions().map((suggestion, index) => (
                      <Button key={index} variant="outline" size="sm" className="text-xs bg-transparent">
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Selecciona una nota</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Elige una nota de la lista o crea una nueva</p>
              <Button onClick={createNewNote}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Nota
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
