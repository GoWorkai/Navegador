"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import { useProfile } from "@/components/profile-provider"
import { Palette, Sun, Moon, Monitor, Sparkles, ImageIcon, Brush, Eye, X, Download, Upload, Zap } from "lucide-react"

interface CustomTheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  backgroundType: "solid" | "gradient" | "image" | "animated"
  backgroundValue: string
  borderRadius: number
  animations: boolean
  glassEffect: boolean
  colorMode: "light" | "dark" | "auto"
}

interface ThemeCustomizerProps {
  onClose?: () => void
}

const presetThemes: CustomTheme[] = [
  {
    id: "ocean",
    name: "Ocean Breeze",
    primary: "#0ea5e9",
    secondary: "#0284c7",
    accent: "#06b6d4",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    borderRadius: 12,
    animations: true,
    glassEffect: true,
    colorMode: "dark",
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    primary: "#f59e0b",
    secondary: "#f97316",
    accent: "#ef4444",
    background: "#1c1917",
    surface: "#292524",
    text: "#fafaf9",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(135deg, #1c1917 0%, #292524 30%, #451a03 70%, #7c2d12 100%)",
    borderRadius: 16,
    animations: true,
    glassEffect: true,
    colorMode: "dark",
  },
  {
    id: "forest",
    name: "Forest Green",
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#15803d",
    background: "#0f1419",
    surface: "#1a2332",
    text: "#f0fdf4",
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(135deg, #0f1419 0%, #1a2332 40%, #14532d 80%, #166534 100%)",
    borderRadius: 8,
    animations: true,
    glassEffect: false,
    colorMode: "dark",
  },
  {
    id: "minimal",
    name: "Minimal Light",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#a855f7",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    backgroundType: "solid",
    backgroundValue: "#ffffff",
    borderRadius: 6,
    animations: false,
    glassEffect: false,
    colorMode: "light",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    primary: "#ff0080",
    secondary: "#00ffff",
    accent: "#ffff00",
    background: "#000000",
    surface: "#1a0033",
    text: "#ffffff",
    backgroundType: "animated",
    backgroundValue: "matrix",
    borderRadius: 0,
    animations: true,
    glassEffect: true,
    colorMode: "dark",
  },
]

export function ThemeCustomizer({ onClose }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme()
  const { currentProfile, updateProfile } = useProfile()
  const [activeTab, setActiveTab] = useState<"presets" | "custom" | "backgrounds">("presets")
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    id: "custom",
    name: "Mi Tema",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#a855f7",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    backgroundType: "solid",
    backgroundValue: "#0f172a",
    borderRadius: 12,
    animations: true,
    glassEffect: true,
    colorMode: "dark",
  })
  const [savedThemes, setSavedThemes] = useState<CustomTheme[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("aria-custom-themes")
    if (saved) {
      setSavedThemes(JSON.parse(saved))
    }
  }, [])

  const applyTheme = (themeConfig: CustomTheme) => {
    const root = document.documentElement

    root.style.setProperty("--theme-primary", themeConfig.primary)
    root.style.setProperty("--theme-secondary", themeConfig.secondary)
    root.style.setProperty("--theme-accent", themeConfig.accent)
    root.style.setProperty("--theme-background", themeConfig.background)
    root.style.setProperty("--theme-surface", themeConfig.surface)
    root.style.setProperty("--theme-text", themeConfig.text)
    root.style.setProperty("--theme-radius", `${themeConfig.borderRadius}px`)

    const body = document.body
    body.className = body.className.replace(/theme-\w+/g, "")

    switch (themeConfig.backgroundType) {
      case "gradient":
        body.style.background = themeConfig.backgroundValue
        break
      case "image":
        body.style.background = `url(${themeConfig.backgroundValue}) center/cover fixed`
        break
      case "animated":
        body.classList.add(`theme-${themeConfig.backgroundValue}`)
        break
      default:
        body.style.background = themeConfig.backgroundValue
    }

    if (themeConfig.glassEffect) {
      root.classList.add("glass-effect")
    } else {
      root.classList.remove("glass-effect")
    }

    if (themeConfig.animations) {
      root.classList.add("animations-enabled")
    } else {
      root.classList.remove("animations-enabled")
    }

    setTheme(themeConfig.colorMode)

    if (currentProfile) {
      updateProfile(currentProfile.id, {
        theme: themeConfig.colorMode as any,
        customTheme: themeConfig,
      })
    }
  }

  const saveCustomTheme = () => {
    const newTheme = { ...customTheme, id: `custom-${Date.now()}` }
    const updated = [...savedThemes, newTheme]
    setSavedThemes(updated)
    localStorage.setItem("aria-custom-themes", JSON.stringify(updated))
  }

  const exportTheme = () => {
    const themeData = JSON.stringify(customTheme, null, 2)
    const blob = new Blob([themeData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${customTheme.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setCustomTheme(imported)
      } catch (error) {
        console.error("Error importing theme:", error)
      }
    }
    reader.readAsText(file)
  }

  const generateRandomTheme = () => {
    const colors = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#eab308",
      "#84cc16",
      "#22c55e",
      "#10b981",
      "#14b8a6",
      "#06b6d4",
      "#0ea5e9",
      "#3b82f6",
      "#6366f1",
      "#8b5cf6",
      "#a855f7",
      "#d946ef",
      "#ec4899",
      "#f43f5e",
    ]

    const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

    setCustomTheme((prev) => ({
      ...prev,
      primary: randomColor(),
      secondary: randomColor(),
      accent: randomColor(),
      borderRadius: Math.floor(Math.random() * 20) + 4,
      animations: Math.random() > 0.5,
      glassEffect: Math.random() > 0.5,
    }))
  }

  return (
    <Card className="w-full h-full bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Palette className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Personalización de Temas</h2>
            <p className="text-purple-100 text-sm">Personaliza la apariencia de ARIA</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={generateRandomTheme} className="text-white hover:bg-white/20">
            <Zap className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="flex space-x-1">
          {[
            { id: "presets", label: "Temas Predefinidos", icon: Sparkles },
            { id: "custom", label: "Personalizado", icon: Brush },
            { id: "backgrounds", label: "Fondos", icon: ImageIcon },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 ${
                activeTab === id ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Preset Themes */}
        {activeTab === "presets" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetThemes.map((preset) => (
                <Card
                  key={preset.id}
                  className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => applyTheme(preset)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{preset.name}</h3>
                    <div className="flex items-center space-x-1">
                      {preset.colorMode === "light" ? (
                        <Sun className="h-4 w-4 text-yellow-400" />
                      ) : preset.colorMode === "dark" ? (
                        <Moon className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Monitor className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: preset.primary }}
                    ></div>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: preset.secondary }}
                    ></div>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: preset.accent }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Radius: {preset.borderRadius}px</div>
                    <div className="flex space-x-3">
                      <span>Animaciones: {preset.animations ? "✓" : "✗"}</span>
                      <span>Cristal: {preset.glassEffect ? "✓" : "✗"}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {savedThemes.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Temas Guardados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedThemes.map((saved) => (
                    <Card
                      key={saved.id}
                      className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => applyTheme(saved)}
                    >
                      <h4 className="text-white font-medium mb-2">{saved.name}</h4>
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: saved.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: saved.secondary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: saved.accent }}></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Theme Editor */}
        {activeTab === "custom" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Editor de Tema Personalizado</h3>
              <div className="flex space-x-2">
                <Button size="sm" onClick={saveCustomTheme} className="bg-green-600 hover:bg-green-700">
                  Guardar
                </Button>
                <Button size="sm" onClick={exportTheme} variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
                <label className="cursor-pointer">
                  <Button size="sm" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-1" />
                      Importar
                    </span>
                  </Button>
                  <input type="file" accept=".json" onChange={importTheme} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Nombre del Tema</label>
                  <Input
                    value={customTheme.name}
                    onChange={(e) => setCustomTheme((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Color Primario</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={customTheme.primary}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, primary: e.target.value }))}
                      className="w-12 h-10 rounded border-gray-600"
                    />
                    <Input
                      value={customTheme.primary}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, primary: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Color Secundario</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={customTheme.secondary}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, secondary: e.target.value }))}
                      className="w-12 h-10 rounded border-gray-600"
                    />
                    <Input
                      value={customTheme.secondary}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, secondary: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Color de Acento</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={customTheme.accent}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, accent: e.target.value }))}
                      className="w-12 h-10 rounded border-gray-600"
                    />
                    <Input
                      value={customTheme.accent}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, accent: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Radio de Bordes: {customTheme.borderRadius}px
                  </label>
                  <Slider
                    value={[customTheme.borderRadius]}
                    onValueChange={([value]) => setCustomTheme((prev) => ({ ...prev, borderRadius: value }))}
                    max={24}
                    min={0}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Modo de Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "light", label: "Claro", icon: Sun },
                      { value: "dark", label: "Oscuro", icon: Moon },
                      { value: "auto", label: "Auto", icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <Button
                        key={value}
                        variant={customTheme.colorMode === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCustomTheme((prev) => ({ ...prev, colorMode: value as any }))}
                        className="flex items-center space-x-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Animaciones</span>
                    <Button
                      variant={customTheme.animations ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCustomTheme((prev) => ({ ...prev, animations: !prev.animations }))}
                    >
                      {customTheme.animations ? "Activadas" : "Desactivadas"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Efecto Cristal</span>
                    <Button
                      variant={customTheme.glassEffect ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCustomTheme((prev) => ({ ...prev, glassEffect: !prev.glassEffect }))}
                    >
                      {customTheme.glassEffect ? "Activado" : "Desactivado"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => applyTheme(customTheme)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-2"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa del Tema
              </Button>
            </div>
          </div>
        )}

        {/* Background Settings */}
        {activeTab === "backgrounds" && (
          <div className="space-y-6">
            <h3 className="text-white font-semibold">Configuración de Fondos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Tipo de Fondo</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "solid", label: "Sólido" },
                    { value: "gradient", label: "Degradado" },
                    { value: "image", label: "Imagen" },
                    { value: "animated", label: "Animado" },
                  ].map(({ value, label }) => (
                    <Button
                      key={value}
                      variant={customTheme.backgroundType === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCustomTheme((prev) => ({ ...prev, backgroundType: value as any }))}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  {customTheme.backgroundType === "solid" && "Color de Fondo"}
                  {customTheme.backgroundType === "gradient" && "CSS Gradient"}
                  {customTheme.backgroundType === "image" && "URL de Imagen"}
                  {customTheme.backgroundType === "animated" && "Tipo de Animación"}
                </label>

                {customTheme.backgroundType === "solid" && (
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={customTheme.backgroundValue}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, backgroundValue: e.target.value }))}
                      className="w-12 h-10 rounded border-gray-600"
                    />
                    <Input
                      value={customTheme.backgroundValue}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, backgroundValue: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                    />
                  </div>
                )}

                {customTheme.backgroundType === "gradient" && (
                  <Input
                    value={customTheme.backgroundValue}
                    onChange={(e) => setCustomTheme((prev) => ({ ...prev, backgroundValue: e.target.value }))}
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                )}

                {customTheme.backgroundType === "image" && (
                  <Input
                    value={customTheme.backgroundValue}
                    onChange={(e) => setCustomTheme((prev) => ({ ...prev, backgroundValue: e.target.value }))}
                    placeholder="https://example.com/background.jpg"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                )}

                {customTheme.backgroundType === "animated" && (
                  <div className="grid grid-cols-2 gap-2">
                    {["matrix", "particles", "waves", "geometric"].map((animation) => (
                      <Button
                        key={animation}
                        variant={customTheme.backgroundValue === animation ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCustomTheme((prev) => ({ ...prev, backgroundValue: animation }))}
                      >
                        {animation.charAt(0).toUpperCase() + animation.slice(1)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Ocean", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                { name: "Sunset", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                { name: "Forest", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
                { name: "Purple", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
              ].map((preset) => (
                <div
                  key={preset.name}
                  className="h-20 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-purple-500 transition-colors"
                  style={{ background: preset.gradient }}
                  onClick={() =>
                    setCustomTheme((prev) => ({
                      ...prev,
                      backgroundType: "gradient",
                      backgroundValue: preset.gradient,
                    }))
                  }
                >
                  <div className="h-full flex items-end p-2">
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">{preset.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
