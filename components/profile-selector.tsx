"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useProfile, type Profile, AVAILABLE_PERMISSIONS } from "@/components/profile-provider"
import {
  User,
  Baby,
  UserPlus,
  Settings,
  X,
  Check,
  Trash2,
  Shield,
  Clock,
  DollarSign,
  Brain,
  Eye,
  Crown,
  UserCheck,
} from "lucide-react"

const roleIcons = {
  admin: Crown,
  parent: User,
  teen: UserCheck,
  child: Baby,
  guest: UserPlus,
}

const roleLabels = {
  admin: "Administrador",
  parent: "Padre/Madre",
  teen: "Adolescente",
  child: "Niño/a",
  guest: "Invitado",
}

const roleColors = {
  admin: "bg-purple-600",
  parent: "bg-blue-600",
  teen: "bg-green-600",
  child: "bg-yellow-600",
  guest: "bg-gray-600",
}

export function ProfileSelector() {
  const {
    profiles,
    currentProfile,
    switchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    isProfileSelectorOpen,
    setProfileSelectorOpen,
    hasPermission,
    getRolePermissions,
    isWithinTimeRestrictions,
  } = useProfile()

  const [isCreating, setIsCreating] = useState(false)
  const [editingProfile, setEditingProfile] = useState<string | null>(null)
  const [showPermissions, setShowPermissions] = useState<string | null>(null)
  const [newProfile, setNewProfile] = useState({
    name: "",
    avatar: "👤",
    role: "guest" as Profile["role"],
    theme: "dark" as Profile["theme"],
    language: "es" as Profile["language"],
    aiPersonality: {
      tone: "friendly" as Profile["aiPersonality"]["tone"],
      expertise: [] as string[],
      interests: [] as string[],
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

  if (!isProfileSelectorOpen) return null

  const handleCreateProfile = () => {
    if (newProfile.name.trim()) {
      createProfile(newProfile)
      setIsCreating(false)
      setNewProfile({
        name: "",
        avatar: "👤",
        role: "guest",
        theme: "dark",
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
    }
  }

  const handleUpdateProfile = (profileId: string, updates: Partial<Profile>) => {
    updateProfile(profileId, updates)
    setEditingProfile(null)
  }

  const getPermissionsByCategory = (permissions: string[]) => {
    const categories: Record<string, typeof AVAILABLE_PERMISSIONS> = {}
    permissions.forEach((permId) => {
      const perm = AVAILABLE_PERMISSIONS.find((p) => p.id === permId)
      if (perm) {
        if (!categories[perm.category]) categories[perm.category] = []
        categories[perm.category].push(perm)
      }
    })
    return categories
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Gestión de Perfiles Familiares</h2>
              <p className="text-gray-400">Sistema de Control de Acceso Basado en Roles (RBAC)</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProfileSelectorOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Current Profile Status */}
          {currentProfile && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${roleColors[currentProfile.role]} text-white text-lg`}>
                      {currentProfile.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold flex items-center">
                      {currentProfile.name}
                      <Badge className={`ml-2 ${roleColors[currentProfile.role]} text-white`}>
                        {roleLabels[currentProfile.role]}
                      </Badge>
                    </h3>
                    <p className="text-purple-200 text-sm">
                      Perfil activo • {currentProfile.permissions.length} permisos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {!isWithinTimeRestrictions() && (
                    <Badge variant="destructive" className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Fuera de horario
                    </Badge>
                  )}
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Profile List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {profiles.map((profile) => {
              const RoleIcon = roleIcons[profile.role]
              const isActive = currentProfile?.id === profile.id
              const isEditing = editingProfile === profile.id
              const roleTemplate = getRolePermissions(profile.role)

              return (
                <Card
                  key={profile.id}
                  className={`p-4 transition-all duration-200 ${
                    isActive ? "bg-purple-600/30 border-purple-500" : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={profile.name}
                        onChange={(e) => handleUpdateProfile(profile.id, { name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Nombre del perfil"
                      />

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Rol</label>
                        <select
                          value={profile.role}
                          onChange={(e) => handleUpdateProfile(profile.id, { role: e.target.value as Profile["role"] })}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        >
                          <option value="admin">Administrador</option>
                          <option value="parent">Padre/Madre</option>
                          <option value="teen">Adolescente</option>
                          <option value="child">Niño/a</option>
                          <option value="guest">Invitado</option>
                        </select>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setEditingProfile(null)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProfile(null)}
                          className="border-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="cursor-pointer" onClick={() => switchProfile(profile.id)}>
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className={`${roleColors[profile.role]} text-white`}>
                              {profile.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="text-white font-medium flex items-center">
                              {profile.name}
                              {isActive && <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>}
                            </h4>
                            <p className="text-gray-400 text-sm flex items-center">
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {roleLabels[profile.role]}
                            </p>
                          </div>
                        </div>

                        {/* Role Restrictions Summary */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          {roleTemplate.restrictions.maxTabs && (
                            <div className="flex items-center text-gray-400">
                              <Eye className="h-3 w-3 mr-1" />
                              Max {roleTemplate.restrictions.maxTabs} pestañas
                            </div>
                          )}
                          {roleTemplate.restrictions.spendingLimit && (
                            <div className="flex items-center text-gray-400">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Límite ${roleTemplate.restrictions.spendingLimit}
                            </div>
                          )}
                          <div className="flex items-center text-gray-400">
                            <Brain className="h-3 w-3 mr-1" />
                            IA {roleTemplate.restrictions.aiInteractionLevel}
                          </div>
                          {roleTemplate.restrictions.timeRestrictions && (
                            <div className="flex items-center text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {roleTemplate.restrictions.timeRestrictions.start}-
                              {roleTemplate.restrictions.timeRestrictions.end}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-700">
                        <span>Última actividad: {profile.lastActive.toLocaleDateString()}</span>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowPermissions(showPermissions === profile.id ? null : profile.id)
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          >
                            <Shield className="h-3 w-3" />
                          </Button>
                          {hasPermission("system.profiles") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingProfile(profile.id)
                              }}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          )}
                          {profiles.length > 1 && hasPermission("system.profiles") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteProfile(profile.id)
                              }}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Permissions Detail */}
                      {showPermissions === profile.id && (
                        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
                          <h5 className="text-white font-medium mb-2 flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Permisos del Rol
                          </h5>
                          <div className="space-y-2">
                            {Object.entries(getPermissionsByCategory(profile.permissions)).map(([category, perms]) => (
                              <div key={category}>
                                <h6 className="text-xs font-medium text-gray-300 uppercase tracking-wide mb-1">
                                  {category}
                                </h6>
                                <div className="flex flex-wrap gap-1">
                                  {perms.map((perm) => (
                                    <Badge key={perm.id} variant="secondary" className="text-xs">
                                      {perm.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Create New Profile */}
          {hasPermission("system.profiles") && (
            <>
              {isCreating ? (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Crear Nuevo Perfil Familiar</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                        <Input
                          value={newProfile.name}
                          onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                          placeholder="Nombre del perfil"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Rol Familiar</label>
                        <select
                          value={newProfile.role}
                          onChange={(e) => setNewProfile({ ...newProfile, role: e.target.value as Profile["role"] })}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        >
                          <option value="admin">Administrador</option>
                          <option value="parent">Padre/Madre</option>
                          <option value="teen">Adolescente</option>
                          <option value="child">Niño/a</option>
                          <option value="guest">Invitado</option>
                        </select>
                      </div>
                    </div>

                    {/* Role Preview */}
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <h5 className="text-white text-sm font-medium mb-2">Vista previa del rol:</h5>
                      <div className="text-xs text-gray-300">
                        <p>• {getRolePermissions(newProfile.role).permissions.length} permisos incluidos</p>
                        <p>• Nivel de IA: {getRolePermissions(newProfile.role).restrictions.aiInteractionLevel}</p>
                        {getRolePermissions(newProfile.role).restrictions.maxTabs && (
                          <p>• Máximo {getRolePermissions(newProfile.role).restrictions.maxTabs} pestañas</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleCreateProfile} className="bg-purple-600 hover:bg-purple-700">
                        Crear Perfil
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 border-dashed text-gray-400 hover:text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Agregar Nuevo Perfil Familiar
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
