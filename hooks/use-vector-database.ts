"use client"

import { useState, useEffect } from "react"
import { vectorManager } from "@/lib/vector-database/vector-manager"
import { useProfile } from "@/components/profile-provider"

export function useVectorDatabase() {
  const { currentProfile } = useProfile()
  const [isInitialized, setIsInitialized] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeVectorDB = async () => {
      try {
        await vectorManager.initialize()
        setIsInitialized(true)

        if (currentProfile) {
          const userStats = await vectorManager.getContentStats(currentProfile.id)
          setStats(userStats)
        }
      } catch (error) {
        console.error("Failed to initialize vector database:", error)
      }
    }

    initializeVectorDB()
  }, [currentProfile])

  const addContent = async (
    content: string,
    metadata: Record<string, any> = {},
    contentType: "text" | "image" | "audio" | "document" = "text",
  ) => {
    if (!currentProfile || !isInitialized) return null

    setIsLoading(true)
    try {
      const id = await vectorManager.addContent(content, metadata, contentType, currentProfile.id)

      // Update stats
      const newStats = await vectorManager.getContentStats(currentProfile.id)
      setStats(newStats)

      return id
    } catch (error) {
      console.error("Failed to add content:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const semanticSearch = async (
    query: string,
    options: {
      limit?: number
      threshold?: number
      filters?: Record<string, any>
    } = {},
  ) => {
    if (!currentProfile || !isInitialized) return []

    setIsLoading(true)
    try {
      return await vectorManager.semanticSearch(query, {
        ...options,
        userId: currentProfile.id,
      })
    } catch (error) {
      console.error("Semantic search failed:", error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const organizeContent = async () => {
    if (!currentProfile || !isInitialized) return null

    setIsLoading(true)
    try {
      return await vectorManager.organizeUserContent(currentProfile.id)
    } catch (error) {
      console.error("Content organization failed:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const findSimilar = async (contentId: string, limit = 5) => {
    if (!isInitialized) return []

    setIsLoading(true)
    try {
      return await vectorManager.findSimilarContent(contentId, limit)
    } catch (error) {
      console.error("Similar content search failed:", error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const deleteContent = async (id: string) => {
    if (!isInitialized) return false

    setIsLoading(true)
    try {
      const success = await vectorManager.deleteContent(id)

      if (success && currentProfile) {
        // Update stats
        const newStats = await vectorManager.getContentStats(currentProfile.id)
        setStats(newStats)
      }

      return success
    } catch (error) {
      console.error("Failed to delete content:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isInitialized,
    isLoading,
    stats,
    addContent,
    semanticSearch,
    organizeContent,
    findSimilar,
    deleteContent,
  }
}
