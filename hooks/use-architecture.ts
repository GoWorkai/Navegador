"use client"

import { useState, useEffect } from "react"
import { processManager } from "@/lib/architecture/process-manager"
import { hardwareDetector } from "@/lib/architecture/hardware-detection"
import { KnowledgeGraph } from "@/lib/architecture/knowledge-graph"
import { useProfile } from "@/components/profile-provider"
import type { HardwareAcceleration, MemoryOptimization } from "@/lib/architecture/types"

export function useArchitecture() {
  const { currentProfile } = useProfile()
  const [hardwareInfo, setHardwareInfo] = useState<HardwareAcceleration | null>(null)
  const [memoryInfo, setMemoryInfo] = useState<MemoryOptimization | null>(null)
  const [processStats, setProcessStats] = useState<any>(null)
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null)

  useEffect(() => {
    // Initialize hardware detection
    hardwareDetector.detectHardware().then(setHardwareInfo)

    // Initialize knowledge graph for current user
    if (currentProfile) {
      const kg = new KnowledgeGraph(currentProfile.id)
      setKnowledgeGraph(kg)
    }

    // Set up periodic updates
    const interval = setInterval(() => {
      setMemoryInfo(processManager.getMemoryUsage())
      setProcessStats(processManager.getProcessStats())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [currentProfile])

  const createTabProcess = (tabId: string, url: string) => {
    return processManager.createTabProcess(tabId, url)
  }

  const suspendTab = (tabId: string) => {
    return processManager.suspendTab(tabId)
  }

  const resumeTab = (tabId: string) => {
    return processManager.resumeTab(tabId)
  }

  const addKnowledgeNode = (nodeData: any) => {
    if (knowledgeGraph) {
      return knowledgeGraph.addNode(nodeData)
    }
    return null
  }

  const searchKnowledge = (query: string) => {
    if (knowledgeGraph) {
      return knowledgeGraph.semanticSearch(query)
    }
    return []
  }

  const getOptimalProcessingUnit = () => {
    return hardwareDetector.getOptimalProcessingUnit()
  }

  return {
    // Hardware info
    hardwareInfo,
    isGPUAvailable: hardwareInfo?.gpu.available || false,
    isNPUAvailable: hardwareInfo?.npu.available || false,
    optimalProcessingUnit: getOptimalProcessingUnit(),

    // Memory and process management
    memoryInfo,
    processStats,
    createTabProcess,
    suspendTab,
    resumeTab,

    // Knowledge graph
    knowledgeGraph,
    addKnowledgeNode,
    searchKnowledge,
    knowledgeStats: knowledgeGraph?.getStats() || null,
  }
}
