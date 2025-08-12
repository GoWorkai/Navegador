"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Profile {
  id: string
  name: string
  avatar: string
  role: "main" | "partner" | "child" | "other"
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
  createdAt: Date
  lastActive: Date
}

interface ProfileContextType {
  profiles: Profile[]
  currentProfile: Profile | null
  switchProfile: (profileId: string) => void
  createProfile: (profile: Omit<Profile, "id" | "createdAt" | "lastActive">) => void
  updateProfile: (profileId: string, updates: Partial<Profile>) => void
  deleteProfile: (profileId: string) => void
  isProfileSelectorOpen: boolean
  setProfileSelectorOpen: (open: boolean) => void
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
    id: "main",
    name: "Usuario Principal",
    avatar: "👤",
    role: "main",
    theme: "dark",
    language: "es",
    aiPersonality: {
      tone: "friendly",
      expertise: ["navegación", "productividad", "tecnología"],
      interests: ["noticias", "entretenimiento", "finanzas"],
    },
    privacy: {
      shareHistory: false,
      shareBookmarks: true,
      shareAIChats: false,
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

  const createProfile = (profileData: Omit<Profile, "id" | "createdAt" | "lastActive">) => {
    const newProfile: Profile = {
      ...profileData,
      id: `profile-${Date.now()}`,
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
