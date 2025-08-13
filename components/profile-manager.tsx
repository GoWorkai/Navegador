"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, Lock, UserCheck, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useProfile, type Profile, AVAILABLE_PERMISSIONS, ROLE_TEMPLATES } from "@/components/profile-provider"

interface ProfileFormData {
  name: string
  avatar: string
  role: Profile["role"]
  theme: "light" | "dark" | "auto"
  language: "es" | "en"
  aiPersonality: {
    tone: "formal" | "casual" | "friendly"
    expertise: string[]
    interests: string[]
  }
  privacy: {
    shareHistory: boolean
    shareBookmarks: boolean
    shareAIChats: boolean
  }
  parentalControls?: {
    supervisorId?: string
    contentFilter: "strict" | "moderate" | "minimal" | "none"
    allowSocialMedia: boolean
    allowFinancialAccess: boolean
    requireApproval: string[]
  }
  sessionSettings: {
    autoLock: boolean
    lockTimeout: number
    requirePassword: boolean
    ephemeralMode: boolean
  }
}

export function ProfileManager() {
  const {
    profiles,
    currentProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    hasPermission,
    getRolePermissions,
    isWithinTimeRestrictions,
  } = useProfile()
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    avatar: "👤",
    role: "guest",
    theme: "auto",
    language: "es",
    aiPersonality: {
      tone: "friendly",
      expertise: [],
      interests: [],
    },
    privacy: {
      shareHistory: false,
      shareBookmarks: true,
      shareAIChats: false,
    },
    sessionSettings: {
      autoLock: true,
      lockTimeout: 15,
      requirePassword: false,
      ephemeralMode: false,
    },
  })

  const avatarOptions = ["👤", "👨", "👩", "👶", "👧", "👦", "👴", "👵", "🧑‍💼", "👨‍💻", "👩‍💻", "🧑‍🎓", "👑", "🤖"]
  const expertiseOptions = [
    "navegación",
    "productividad",
    "tecnología",
    "finanzas",
    "seguridad",
    "entretenimiento",
    "educación",
    "salud",
    "deportes",
    "arte",
  ]
  const interestOptions = [
    "noticias",
    "entretenimiento",
    "finanzas",
    "tecnología",
    "deportes",
    "música",
    "películas",
    "libros",
    "viajes",
    "cocina",
  ]

  const handleCreateProfile = () => {
    createProfile(formData)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdateProfile = () => {
    if (selectedProfile) {
      updateProfile(selectedProfile.id, formData)
      setIsEditDialogOpen(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      avatar: "👤",
      role: "guest",
      theme: "auto",
      language: "es",
      aiPersonality: {
        tone: "friendly",
        expertise: [],
        interests: [],
      },
      privacy: {
        shareHistory: false,
        shareBookmarks: true,
        shareAIChats: false,
      },
      sessionSettings: {
        autoLock: true,
        lockTimeout: 15,
        requirePassword: false,
        ephemeralMode: false,
      },
    })
    setSelectedProfile(null)
  }

  const openEditDialog = (profile: Profile) => {
    setSelectedProfile(profile)
    setFormData({
      name: profile.name,
      avatar: profile.avatar,
      role: profile.role,
      theme: profile.theme,
      language: profile.language,
      aiPersonality: profile.aiPersonality,
      privacy: profile.privacy,
      parentalControls: profile.parentalControls,
      sessionSettings: profile.sessionSettings,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleColor = (role: Profile["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "parent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "teen":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "child":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "guest":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPermissionCategoryIcon = (category: string) => {
    switch (category) {
      case "navigation":
        return "🌐"
      case "finance":
        return "💰"
      case "ai":
        return "🤖"
      case "system":
        return "⚙️"
      case "content":
        return "📄"
      case "social":
        return "👥"
      default:
        return "📋"
    }
  }

  if (!hasPermission("system.profiles")) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 dark:text-gray-400">No tienes permisos para gestionar perfiles de usuario.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Perfiles y RBAC</h1>
          <p className="text-gray-600 dark:text-gray-400">Control de acceso basado en roles para gestión familiar</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Perfil</DialogTitle>
              <DialogDescription>Configura un nuevo perfil con permisos y restricciones específicas</DialogDescription>
            </DialogHeader>
            <ProfileForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateProfile}
              avatarOptions={avatarOptions}
              expertiseOptions={expertiseOptions}
              interestOptions={interestOptions}
              profiles={profiles}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Profile Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Estado del Perfil Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{currentProfile?.avatar}</div>
              <div>
                <h3 className="font-semibold">{currentProfile?.name}</h3>
                <Badge className={getRoleColor(currentProfile?.role || "guest")}>{currentProfile?.role}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                {isWithinTimeRestrictions() ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">{isWithinTimeRestrictions() ? "Acceso permitido" : "Fuera de horario"}</span>
              </div>
              <div className="text-xs text-gray-500">{currentProfile?.permissions.length} permisos activos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profiles List */}
      <Card>
        <CardHeader>
          <CardTitle>Perfiles del Sistema</CardTitle>
          <CardDescription>Gestiona todos los perfiles de usuario y sus permisos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.map((profile) => {
              const roleTemplate = getRolePermissions(profile.role)
              return (
                <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{profile.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{profile.name}</h3>
                        {profile.id === currentProfile?.id && <Badge variant="outline">Actual</Badge>}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getRoleColor(profile.role)}>{profile.role}</Badge>
                        {profile.sessionSettings.ephemeralMode && (
                          <Badge variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Efímero
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Última actividad: {profile.lastActive.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <div className="text-sm font-medium">{profile.permissions.length} permisos</div>
                      {roleTemplate.restrictions.maxTabs && (
                        <div className="text-xs text-gray-500">Máx. {roleTemplate.restrictions.maxTabs} pestañas</div>
                      )}
                      {roleTemplate.restrictions.spendingLimit && (
                        <div className="text-xs text-gray-500">Límite: €{roleTemplate.restrictions.spendingLimit}</div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchProfile(profile.id)}
                      disabled={profile.id === currentProfile?.id}
                    >
                      {profile.id === currentProfile?.id ? "Actual" : "Cambiar"}
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => openEditDialog(profile)}>
                      <Edit className="w-4 h-4" />
                    </Button>

                    {profiles.length > 1 && profile.id !== currentProfile?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Plantillas de Roles</CardTitle>
          <CardDescription>Permisos y restricciones predefinidas por tipo de usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLE_TEMPLATES).map(([roleKey, template]) => (
              <Card key={roleKey} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="capitalize">{roleKey}</span>
                    <Badge className={getRoleColor(template.role)}>{template.permissions.length} permisos</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Restricciones:</h4>
                    <div className="space-y-1 text-xs">
                      {template.restrictions.maxTabs && <div>• Máximo {template.restrictions.maxTabs} pestañas</div>}
                      {template.restrictions.spendingLimit && (
                        <div>• Límite de gasto: €{template.restrictions.spendingLimit}</div>
                      )}
                      {template.restrictions.timeRestrictions && (
                        <div>
                          • Horario: {template.restrictions.timeRestrictions.start} -{" "}
                          {template.restrictions.timeRestrictions.end}
                        </div>
                      )}
                      <div>• IA: {template.restrictions.aiInteractionLevel}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Categorías de permisos:</h4>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        new Set(
                          template.permissions
                            .map((permId) => AVAILABLE_PERMISSIONS.find((p) => p.id === permId)?.category)
                            .filter(Boolean),
                        ),
                      ).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {getPermissionCategoryIcon(category!)} {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Modifica la configuración y permisos del perfil</DialogDescription>
          </DialogHeader>
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateProfile}
            avatarOptions={avatarOptions}
            expertiseOptions={expertiseOptions}
            interestOptions={interestOptions}
            profiles={profiles}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ProfileFormProps {
  formData: ProfileFormData
  setFormData: (data: ProfileFormData) => void
  onSubmit: () => void
  avatarOptions: string[]
  expertiseOptions: string[]
  interestOptions: string[]
  profiles: Profile[]
  isEditing?: boolean
}

function ProfileForm({
  formData,
  setFormData,
  onSubmit,
  avatarOptions,
  expertiseOptions,
  interestOptions,
  profiles,
  isEditing,
}: ProfileFormProps) {
  const roleTemplate = ROLE_TEMPLATES[formData.role]

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Básico</TabsTrigger>
        <TabsTrigger value="permissions">Permisos</TabsTrigger>
        <TabsTrigger value="ai">IA</TabsTrigger>
        <TabsTrigger value="security">Seguridad</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del perfil"
            />
          </div>
          <div>
            <Label htmlFor="role">Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value: Profile["role"]) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="parent">Padre/Madre</SelectItem>
                <SelectItem value="teen">Adolescente</SelectItem>
                <SelectItem value="child">Niño</SelectItem>
                <SelectItem value="guest">Invitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Avatar</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {avatarOptions.map((avatar) => (
              <Button
                key={avatar}
                variant={formData.avatar === avatar ? "default" : "outline"}
                size="sm"
                onClick={() => setFormData({ ...formData, avatar })}
                className="text-lg"
              >
                {avatar}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={formData.theme}
              onValueChange={(value: "light" | "dark" | "auto") => setFormData({ ...formData, theme: value })}
            >
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
          <div>
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={formData.language}
              onValueChange={(value: "es" | "en") => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium mb-2">Permisos del rol: {formData.role}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Este rol incluye {roleTemplate.permissions.length} permisos predefinidos
          </p>
          <div className="space-y-3">
            {Object.entries(
              AVAILABLE_PERMISSIONS.reduce(
                (acc, perm) => {
                  if (!acc[perm.category]) acc[perm.category] = []
                  acc[perm.category].push(perm)
                  return acc
                },
                {} as Record<string, typeof AVAILABLE_PERMISSIONS>,
              ),
            ).map(([category, perms]) => (
              <div key={category}>
                <h5 className="font-medium text-sm mb-2 capitalize flex items-center">
                  <span className="mr-2">
                    {category === "navigation"
                      ? "🌐"
                      : category === "finance"
                        ? "💰"
                        : category === "ai"
                          ? "🤖"
                          : category === "system"
                            ? "⚙️"
                            : category === "content"
                              ? "📄"
                              : "👥"}
                  </span>
                  {category}
                </h5>
                <div className="grid grid-cols-1 gap-2">
                  {perms.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <Checkbox checked={roleTemplate.permissions.includes(perm.id)} disabled={true} />
                      <div>
                        <div className="text-sm font-medium">{perm.name}</div>
                        <div className="text-xs text-gray-500">{perm.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="ai" className="space-y-4">
        <div>
          <Label htmlFor="tone">Tono de IA</Label>
          <Select
            value={formData.aiPersonality.tone}
            onValueChange={(value: "formal" | "casual" | "friendly") =>
              setFormData({ ...formData, aiPersonality: { ...formData.aiPersonality, tone: value } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Amigable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Áreas de Expertise</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {expertiseOptions.map((expertise) => (
              <Button
                key={expertise}
                variant={formData.aiPersonality.expertise.includes(expertise) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newExpertise = formData.aiPersonality.expertise.includes(expertise)
                    ? formData.aiPersonality.expertise.filter((e) => e !== expertise)
                    : [...formData.aiPersonality.expertise, expertise]
                  setFormData({ ...formData, aiPersonality: { ...formData.aiPersonality, expertise: newExpertise } })
                }}
              >
                {expertise}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Intereses</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {interestOptions.map((interest) => (
              <Button
                key={interest}
                variant={formData.aiPersonality.interests.includes(interest) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newInterests = formData.aiPersonality.interests.includes(interest)
                    ? formData.aiPersonality.interests.filter((i) => i !== interest)
                    : [...formData.aiPersonality.interests, interest]
                  setFormData({ ...formData, aiPersonality: { ...formData.aiPersonality, interests: newInterests } })
                }}
              >
                {interest}
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Bloqueo automático</Label>
              <p className="text-sm text-gray-600">Bloquear sesión por inactividad</p>
            </div>
            <Switch
              checked={formData.sessionSettings.autoLock}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sessionSettings: { ...formData.sessionSettings, autoLock: checked } })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Requerir contraseña</Label>
              <p className="text-sm text-gray-600">Solicitar contraseña al cambiar perfil</p>
            </div>
            <Switch
              checked={formData.sessionSettings.requirePassword}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sessionSettings: { ...formData.sessionSettings, requirePassword: checked } })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Modo efímero</Label>
              <p className="text-sm text-gray-600">No guardar datos de navegación</p>
            </div>
            <Switch
              checked={formData.sessionSettings.ephemeralMode}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sessionSettings: { ...formData.sessionSettings, ephemeralMode: checked } })
              }
            />
          </div>

          <div>
            <Label htmlFor="lockTimeout">Tiempo de bloqueo (minutos)</Label>
            <Input
              id="lockTimeout"
              type="number"
              value={formData.sessionSettings.lockTimeout}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sessionSettings: { ...formData.sessionSettings, lockTimeout: Number.parseInt(e.target.value) || 15 },
                })
              }
              min="1"
              max="120"
            />
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => {}}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>{isEditing ? "Actualizar" : "Crear"} Perfil</Button>
      </div>
    </Tabs>
  )
}
