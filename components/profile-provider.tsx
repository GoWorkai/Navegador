"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Permission {
  id: string
  name: string
  description: string
  category: "navigation" | "finance" | "ai" | "system" | "content" | "social"
}

export interface RolePermissions {
  role: "parent" | "child" | "teen" | "guest" | "admin"
  permissions: string[]
  restrictions: {
    maxTabs?: number
    allowedSites?: string[]
    blockedSites?: string[]
    timeRestrictions?: {
      start: string
      end: string
      days: number[]
    }
    spendingLimit?: number
    aiInteractionLevel: "full" | "supervised" | "basic" | "none"
  }
}

export interface Profile {
  id: string
  name: string
  avatar: string
  role: "parent" | "child" | "teen" | "guest" | "admin"
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
  permissions: string[]
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
  createdAt: Date
  lastActive: Date
}

export const AVAILABLE_PERMISSIONS: Permission[] = [
  // Navigation permissions
  { id: "nav.browse", name: "Navegación Web", description: "Acceso a navegación web general", category: "navigation" },
  {
    id: "nav.incognito",
    name: "Modo Incógnito",
    description: "Usar modo de navegación privada",
    category: "navigation",
  },
  { id: "nav.downloads", name: "Descargas", description: "Descargar archivos", category: "navigation" },
  {
    id: "nav.extensions",
    name: "Extensiones",
    description: "Instalar y gestionar extensiones",
    category: "navigation",
  },

  // Financial permissions
  { id: "finance.view", name: "Ver Finanzas", description: "Ver información financiera familiar", category: "finance" },
  { id: "finance.edit", name: "Editar Finanzas", description: "Modificar presupuestos y gastos", category: "finance" },
  {
    id: "finance.transactions",
    name: "Transacciones",
    description: "Realizar transacciones financieras",
    category: "finance",
  },
  {
    id: "finance.reports",
    name: "Reportes Financieros",
    description: "Generar reportes financieros",
    category: "finance",
  },

  // AI permissions
  { id: "ai.chat", name: "Chat con IA", description: "Interactuar con el asistente de IA", category: "ai" },
  { id: "ai.advanced", name: "IA Avanzada", description: "Usar funciones avanzadas de IA", category: "ai" },
  { id: "ai.training", name: "Entrenar IA", description: "Personalizar y entrenar modelos de IA", category: "ai" },
  { id: "ai.autonomous", name: "Agentes Autónomos", description: "Usar agentes de IA autónomos", category: "ai" },

  // System permissions
  {
    id: "system.settings",
    name: "Configuración",
    description: "Modificar configuraciones del sistema",
    category: "system",
  },
  { id: "system.profiles", name: "Gestión de Perfiles", description: "Crear y gestionar perfiles", category: "system" },
  { id: "system.security", name: "Seguridad", description: "Configurar opciones de seguridad", category: "system" },
  { id: "system.backup", name: "Respaldos", description: "Crear y restaurar respaldos", category: "system" },

  // Content permissions
  {
    id: "content.adult",
    name: "Contenido Adulto",
    description: "Acceso a contenido para adultos",
    category: "content",
  },
  { id: "content.social", name: "Redes Sociales", description: "Acceso a redes sociales", category: "content" },
  { id: "content.gaming", name: "Juegos", description: "Acceso a juegos y entretenimiento", category: "content" },
  { id: "content.news", name: "Noticias", description: "Acceso a sitios de noticias", category: "content" },

  // Social permissions
  { id: "social.messaging", name: "Mensajería", description: "Usar servicios de mensajería", category: "social" },
  { id: "social.sharing", name: "Compartir", description: "Compartir contenido y archivos", category: "social" },
  { id: "social.contacts", name: "Contactos", description: "Gestionar contactos", category: "social" },
]

export const ROLE_TEMPLATES: Record<Profile["role"], RolePermissions> = {
  admin: {
    role: "admin",
    permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
    restrictions: {
      aiInteractionLevel: "full",
    },
  },
  parent: {
    role: "parent",
    permissions: [
      "nav.browse",
      "nav.incognito",
      "nav.downloads",
      "nav.extensions",
      "finance.view",
      "finance.edit",
      "finance.transactions",
      "finance.reports",
      "ai.chat",
      "ai.advanced",
      "ai.training",
      "ai.autonomous",
      "system.settings",
      "system.profiles",
      "system.security",
      "system.backup",
      "content.adult",
      "content.social",
      "content.gaming",
      "content.news",
      "social.messaging",
      "social.sharing",
      "social.contacts",
    ],
    restrictions: {
      aiInteractionLevel: "full",
    },
  },
  teen: {
    role: "teen",
    permissions: [
      "nav.browse",
      "nav.downloads",
      "finance.view",
      "ai.chat",
      "ai.advanced",
      "content.social",
      "content.gaming",
      "content.news",
      "social.messaging",
      "social.sharing",
      "social.contacts",
    ],
    restrictions: {
      maxTabs: 20,
      spendingLimit: 100,
      aiInteractionLevel: "supervised",
      timeRestrictions: {
        start: "06:00",
        end: "22:00",
        days: [1, 2, 3, 4, 5, 6, 0],
      },
    },
  },
  child: {
    role: "child",
    permissions: ["nav.browse", "ai.chat", "content.gaming", "content.news", "social.messaging"],
    restrictions: {
      maxTabs: 10,
      aiInteractionLevel: "basic",
      timeRestrictions: {
        start: "07:00",
        end: "20:00",
        days: [1, 2, 3, 4, 5, 6, 0],
      },
    },
  },
  guest: {
    role: "guest",
    permissions: ["nav.browse", "content.news"],
    restrictions: {
      maxTabs: 5,
      aiInteractionLevel: "none",
    },
  },
}

interface ProfileContextType {
  profiles: Profile[]
  currentProfile: Profile | null
  switchProfile: (profileId: string) => void
  createProfile: (profile: Omit<Profile, "id" | "createdAt" | "lastActive" | "permissions">) => void
  updateProfile: (profileId: string, updates: Partial<Profile>) => void
  deleteProfile: (profileId: string) => void
  isProfileSelectorOpen: boolean
  setProfileSelectorOpen: (open: boolean) => void
  hasPermission: (permission: string) => boolean
  canAccess: (resource: string) => boolean
  getRolePermissions: (role: Profile["role"]) => RolePermissions
  isWithinTimeRestrictions: () => boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}

const defaultProfiles: Profile[] = [
  {
    id: "admin",
    name: "Administrador",
    avatar: "👑",
    role: "admin",
    theme: "dark",
    language: "es",
    aiPersonality: {
      tone: "friendly",
      expertise: ["navegación", "productividad", "tecnología", "finanzas", "seguridad"],
      interests: ["noticias", "entretenimiento", "finanzas", "tecnología"],
    },
    privacy: {
      shareHistory: false,
      shareBookmarks: true,
      shareAIChats: false,
    },
    permissions: ROLE_TEMPLATES.admin.permissions,
    sessionSettings: {
      autoLock: false,
      lockTimeout: 30,
      requirePassword: true,
      ephemeralMode: false,
    },
    createdAt: new Date(),
    lastActive: new Date(),
  },
]

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [isProfileSelectorOpen, setProfileSelectorOpen] = useState(false)

  // Load profiles from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem("aria-profiles")
    const savedCurrentProfile = localStorage.getItem("aria-current-profile")

    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        lastActive: new Date(p.lastActive),
      }))
      setProfiles(parsedProfiles)

      if (savedCurrentProfile) {
        const current = parsedProfiles.find((p: Profile) => p.id === savedCurrentProfile)
        setCurrentProfile(current || parsedProfiles[0])
      } else {
        setCurrentProfile(parsedProfiles[0])
      }
    } else {
      setCurrentProfile(defaultProfiles[0])
    }
  }, [])

  // Save profiles to localStorage when they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem("aria-profiles", JSON.stringify(profiles))
    }
  }, [profiles])

  // Save current profile to localStorage when it changes
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem("aria-current-profile", currentProfile.id)
    }
  }, [currentProfile])

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      // Update last active time
      const updatedProfile = { ...profile, lastActive: new Date() }
      setProfiles((prev) => prev.map((p) => (p.id === profileId ? updatedProfile : p)))
      setCurrentProfile(updatedProfile)
      setProfileSelectorOpen(false)
    }
  }

  const createProfile = (profileData: Omit<Profile, "id" | "createdAt" | "lastActive" | "permissions">) => {
    const roleTemplate = ROLE_TEMPLATES[profileData.role]
    const newProfile: Profile = {
      ...profileData,
      id: `profile-${Date.now()}`,
      permissions: roleTemplate.permissions,
      createdAt: new Date(),
      lastActive: new Date(),
    }
    setProfiles((prev) => [...prev, newProfile])
  }

  const updateProfile = (profileId: string, updates: Partial<Profile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, ...updates, lastActive: new Date() } : p)))

    if (currentProfile?.id === profileId) {
      setCurrentProfile((prev) => (prev ? { ...prev, ...updates, lastActive: new Date() } : null))
    }
  }

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return // Don't delete the last profile

    setProfiles((prev) => prev.filter((p) => p.id !== profileId))

    if (currentProfile?.id === profileId) {
      const remainingProfiles = profiles.filter((p) => p.id !== profileId)
      setCurrentProfile(remainingProfiles[0])
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!currentProfile) return false
    return currentProfile.permissions.includes(permission)
  }

  const canAccess = (resource: string): boolean => {
    if (!currentProfile) return false

    // Check basic permissions
    if (!hasPermission(resource)) return false

    // Check time restrictions
    if (!isWithinTimeRestrictions()) return false

    // Check parental controls
    if (currentProfile.parentalControls?.requireApproval.includes(resource)) {
      // Would need approval system implementation
      return false
    }

    return true
  }

  const getRolePermissions = (role: Profile["role"]): RolePermissions => {
    return ROLE_TEMPLATES[role]
  }

  const isWithinTimeRestrictions = (): boolean => {
    if (!currentProfile) return true

    const roleTemplate = ROLE_TEMPLATES[currentProfile.role]
    const timeRestrictions = roleTemplate.restrictions.timeRestrictions

    if (!timeRestrictions) return true

    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    // Check if current day is allowed
    if (!timeRestrictions.days.includes(currentDay)) return false

    // Check if current time is within allowed range
    const [startHour, startMin] = timeRestrictions.start.split(":").map(Number)
    const [endHour, endMin] = timeRestrictions.end.split(":").map(Number)
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin

    return currentTime >= startTime && currentTime <= endTime
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        switchProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        isProfileSelectorOpen,
        setProfileSelectorOpen,
        hasPermission,
        canAccess,
        getRolePermissions,
        isWithinTimeRestrictions,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
