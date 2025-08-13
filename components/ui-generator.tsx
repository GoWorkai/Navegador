"use client"

import { useState } from "react"
import { Wand2, Code, Eye, Download, Sparkles, Palette, Layout, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useProfile } from "@/components/profile-provider"

interface GeneratedComponent {
  id: string
  name: string
  description: string
  code: string
  preview: string
  style: "modern" | "classic" | "minimal" | "bold"
  theme: "light" | "dark" | "auto"
  timestamp: Date
}

export function UIGenerator() {
  const { currentProfile, hasPermission } = useProfile()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([])
  const [selectedStyle, setSelectedStyle] = useState<"modern" | "classic" | "minimal" | "bold">("modern")
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "auto">("auto")
  const [includeAnimations, setIncludeAnimations] = useState(true)
  const [responsiveDesign, setResponsiveDesign] = useState(true)

  const generateUI = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const newComponent: GeneratedComponent = {
        id: `comp_${Date.now()}`,
        name: extractComponentName(prompt),
        description: prompt,
        code: generateMockCode(prompt, selectedStyle, selectedTheme),
        preview: generateMockPreview(prompt),
        style: selectedStyle,
        theme: selectedTheme,
        timestamp: new Date(),
      }

      setGeneratedComponents((prev) => [newComponent, ...prev])
      setIsGenerating(false)
      setPrompt("")
    }, 3000)
  }

  const extractComponentName = (prompt: string): string => {
    const words = prompt.toLowerCase().split(" ")
    if (words.includes("button")) return "Custom Button"
    if (words.includes("card")) return "Custom Card"
    if (words.includes("form")) return "Custom Form"
    if (words.includes("navbar") || words.includes("navigation")) return "Navigation Bar"
    if (words.includes("modal")) return "Modal Dialog"
    if (words.includes("dashboard")) return "Dashboard Layout"
    return "Custom Component"
  }

  const generateMockCode = (prompt: string, style: string, theme: string): string => {
    return `import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ${extractComponentName(prompt).replace(/\s+/g, "")}() {
  return (
    <div className="p-6 ${theme === "dark" ? "dark:bg-gray-900" : "bg-white"} ${style === "modern" ? "rounded-xl shadow-lg" : style === "minimal" ? "border" : "shadow-2xl"}">
      <Card className="${style === "bold" ? "border-2 border-blue-500" : ""}">
        <CardHeader>
          <CardTitle className="${style === "modern" ? "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" : "text-xl font-semibold"}">
            Generated Component
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This component was generated based on: "${prompt}"
          </p>
          <Button className="${style === "bold" ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" : ""}">
            Action Button
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}`
  }

  const generateMockPreview = (prompt: string): string => {
    return `<div class="p-6 bg-white rounded-xl shadow-lg">
      <div class="border rounded-lg">
        <div class="p-4 border-b">
          <h3 class="text-xl font-semibold">Generated Component</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">This component was generated based on: "${prompt}"</p>
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Action Button</button>
        </div>
      </div>
    </div>`
  }

  if (!hasPermission("ai.advanced")) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Wand2 className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 dark:text-gray-400">No tienes permisos para usar el generador de UI con IA.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Generador de UI con IA
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Describe tu componente en lenguaje natural y la IA lo creará por ti
        </p>
      </div>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Crear Componente
          </CardTitle>
          <CardDescription>Describe qué tipo de componente necesitas y cómo debería verse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Descripción del Componente</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: Crea un botón moderno con gradiente azul que tenga un icono de estrella y animación hover..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="style">Estilo</Label>
              <Select value={selectedStyle} onValueChange={(value: any) => setSelectedStyle(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Moderno</SelectItem>
                  <SelectItem value="classic">Clásico</SelectItem>
                  <SelectItem value="minimal">Minimalista</SelectItem>
                  <SelectItem value="bold">Audaz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Tema</Label>
              <Select value={selectedTheme} onValueChange={(value: any) => setSelectedTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="animations" checked={includeAnimations} onCheckedChange={setIncludeAnimations} />
              <Label htmlFor="animations">Animaciones</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="responsive" checked={responsiveDesign} onCheckedChange={setResponsiveDesign} />
              <Label htmlFor="responsive">Responsivo</Label>
            </div>
          </div>

          <Button onClick={generateUI} disabled={!prompt.trim() || isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generando Componente...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generar Componente
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Components */}
      {generatedComponents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Componentes Generados</h2>
          {generatedComponents.map((component) => (
            <Card key={component.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Layout className="w-5 h-5 mr-2" />
                      {component.name}
                    </CardTitle>
                    <CardDescription>{component.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{component.style}</Badge>
                    <Badge variant="outline">{component.theme}</Badge>
                    <span className="text-xs text-gray-500">{component.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="preview">
                      <Eye className="w-4 h-4 mr-2" />
                      Vista Previa
                    </TabsTrigger>
                    <TabsTrigger value="code">
                      <Code className="w-4 h-4 mr-2" />
                      Código
                    </TabsTrigger>
                    <TabsTrigger value="customize">
                      <Palette className="w-4 h-4 mr-2" />
                      Personalizar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div dangerouslySetInnerHTML={{ __html: component.preview }} />
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{component.code}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => navigator.clipboard.writeText(component.code)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="customize" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Colores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                            Azul Primario
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                            Púrpura Secundario
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                            Verde Éxito
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tipografía</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <Type className="w-4 h-4 mr-2" />
                            Inter (Actual)
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <Type className="w-4 h-4 mr-2" />
                            Roboto
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <Type className="w-4 h-4 mr-2" />
                            Poppins
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
