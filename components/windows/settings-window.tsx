"use client"

import { useState } from "react"
import { Settings, Shield, Palette, Globe, Bell, Zap, Users, Lock, Bot, Wand2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfile } from "@/components/profile-provider"
import { ProfileManager } from "@/components/profile-manager"
import { AIAgentsManager } from "@/components/ai-agents-manager"
import { UIGenerator } from "@/components/ui-generator"

export function SettingsWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const [activeSection, setActiveSection] = useState("general")

  const settingSections = [
    { id: "general", name: "General", icon: Settings },
    { id: "profiles", name: "Perfiles", icon: Users },
    { id: "ai-agents", name: "Agentes IA", icon: Bot },
    { id: "ui-generator", name: "Generador UI", icon: Wand2 },
    { id: "privacy", name: "Privacidad", icon: Shield },
    { id: "appearance", name: "Apariencia", icon: Palette },
    { id: "language", name: "Idioma", icon: Globe },
    { id: "notifications", name: "Notificaciones", icon: Bell },
    { id: "ai", name: "IA", icon: Zap },
    { id: "security", name: "Seguridad", icon: Lock },
  ]

  if (!hasPermission("system.settings")) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No tienes permisos para acceder a la configuración del sistema.
          </p>
        </div>
      </div>
    )
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Ajustes básicos del navegador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Página de inicio</h4>
              <p className="text-sm text-gray-600">Configurar página que se abre al iniciar</p>
            </div>
            <Select defaultValue="speed-dial">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="speed-dial">Speed Dial</SelectItem>
                <SelectItem value="blank">Página en blanco</SelectItem>
                <SelectItem value="custom">URL personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Restaurar pestañas</h4>
              <p className="text-sm text-gray-600">Abrir pestañas de la sesión anterior</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Descargas automáticas</h4>
              <p className="text-sm text-gray-600">Preguntar dónde guardar archivos</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Privacidad</CardTitle>
          <CardDescription>Controla tu privacidad y datos personales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Modo incógnito por defecto</h4>
              <p className="text-sm text-gray-600">Navegar siempre en modo privado</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Bloquear rastreadores</h4>
              <p className="text-sm text-gray-600">Prevenir seguimiento de terceros</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Limpiar datos al cerrar</h4>
              <p className="text-sm text-gray-600">Eliminar cookies y caché automáticamente</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">VPN integrada</h4>
              <p className="text-sm text-gray-600">Usar VPN gratuita de Opera</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAISettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de IA</CardTitle>
          <CardDescription>Personalizar asistente de IA y funciones inteligentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Asistente IA activo</h4>
              <p className="text-sm text-gray-600">Habilitar asistente de IA integrado</p>
            </div>
            <Switch defaultChecked={hasPermission("ai.chat")} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sugerencias inteligentes</h4>
              <p className="text-sm text-gray-600">Mostrar sugerencias basadas en IA</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Personalidad de IA</h4>
              <p className="text-sm text-gray-600">Tono del asistente</p>
            </div>
            <Select defaultValue={currentProfile?.aiPersonality.tone}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Amigable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasPermission("ai.autonomous") && (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Agentes autónomos</h4>
                <p className="text-sm text-gray-600">Permitir agentes de IA independientes</p>
              </div>
              <Switch />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings()
      case "profiles":
        return <ProfileManager />
      case "ai-agents":
        return <AIAgentsManager />
      case "ui-generator":
        return <UIGenerator />
      case "privacy":
        return renderPrivacySettings()
      case "ai":
        return renderAISettings()
      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Sección en desarrollo</h3>
              <p className="text-gray-600">Esta sección estará disponible pronto.</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4">Configuración</h2>
        <nav className="space-y-1">
          {settingSections.map((section) => {
            const IconComponent = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{section.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  )
}
