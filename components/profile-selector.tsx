"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProfile, type Profile } from "@/components/profile-provider"
import { User, Users, Baby, UserPlus, Settings, X, Check, Trash2 } from "lucide-react"

const roleIcons = {
  main: User,
  partner: Users,
  child: Baby,
  other: UserPlus,
}

const roleLabels = {
  main: "Principal",
  partner: "Pareja",
  child: "Hijo/a",
  other: "Otro",
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
  } = useProfile()

  const [isCreating, setIsCreating] = useState(false)
  const [editingProfile, setEditingProfile] = useState<string | null>(null)
  const [newProfile, setNewProfile] = useState({
    name: "",
    avatar: "👤",
    role: "other" as Profile["role"],
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
  })

  if (!isProfileSelectorOpen) return null

  const handleCreateProfile = () => {
    if (newProfile.name.trim()) {
      createProfile(newProfile)
      setIsCreating(false)
      setNewProfile({
        name: "",
        avatar: "👤",
        role: "other",
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
      })
    }
  }

  const handleUpdateProfile = (profileId: string, updates: Partial<Profile>) => {
    updateProfile(profileId, updates)
    setEditingProfile(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Perfiles de Usuario</h2>
              <p className="text-gray-400">Gestiona los perfiles familiares y sus configuraciones</p>
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

          {/* Current Profile */}
          {currentProfile && (
            <div className="mb-6 p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-purple-600 text-white text-lg">{currentProfile.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold">{currentProfile.name}</h3>
                  <p className="text-purple-200 text-sm">Perfil activo • {roleLabels[currentProfile.role]}</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Profile List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {profiles.map((profile) => {
              const RoleIcon = roleIcons[profile.role]
              const isActive = currentProfile?.id === profile.id
              const isEditing = editingProfile === profile.id

              return (
                <Card
                  key={profile.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isActive ? "bg-purple-600/30 border-purple-500" : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={profile.name}
                        onChange={(e) => handleUpdateProfile(profile.id, { name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Nombre del perfil"
                      />
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
                    <div onClick={() => switchProfile(profile.id)}>
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className={`${isActive ? "bg-purple-600" : "bg-gray-600"} text-white`}>
                            {profile.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{profile.name}</h4>
                          <p className="text-gray-400 text-sm flex items-center">
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleLabels[profile.role]}
                          </p>
                        </div>
                        {isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Última actividad: {profile.lastActive.toLocaleDateString()}</span>
                        <div className="flex space-x-1">
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
                          {profiles.length > 1 && (
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
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Create New Profile */}
          {isCreating ? (
            <Card className="p-4 bg-gray-800 border-gray-700">
              <div className="space-y-4">
                <h4 className="text-white font-medium">Crear Nuevo Perfil</h4>
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
                    <label className="text-sm text-gray-400 mb-1 block">Rol</label>
                    <select
                      value={newProfile.role}
                      onChange={(e) => setNewProfile({ ...newProfile, role: e.target.value as Profile["role"] })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="main">Principal</option>
                      <option value="partner">Pareja</option>
                      <option value="child">Hijo/a</option>
                      <option value="other">Otro</option>
                    </select>
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
              Agregar Nuevo Perfil
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
