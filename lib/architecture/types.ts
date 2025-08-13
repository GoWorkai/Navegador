export interface ProcessManager {
  id: string
  type: "main" | "renderer" | "worker" | "ai" | "storage"
  status: "active" | "suspended" | "terminated"
  memoryUsage: number
  cpuUsage: number
  createdAt: Date
  lastActivity: Date
}

export interface TabProcess {
  tabId: string
  processId: string
  url: string
  title: string
  favicon?: string
  memoryUsage: number
  suspended: boolean
  lastAccessed: Date
  priority: "high" | "medium" | "low"
}

export interface KnowledgeGraphNode {
  id: string
  type: "webpage" | "document" | "note" | "contact" | "task" | "event"
  title: string
  content: string
  metadata: Record<string, any>
  embeddings?: number[]
  connections: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface VectorSearchResult {
  node: KnowledgeGraphNode
  similarity: number
  relevanceScore: number
  context: string
}

export interface AIAgent {
  id: string
  name: string
  type: "assistant" | "financial" | "productivity" | "security" | "automation"
  status: "active" | "idle" | "learning" | "suspended"
  capabilities: string[]
  permissions: string[]
  personality: {
    tone: "formal" | "casual" | "friendly" | "professional"
    expertise: string[]
    responseStyle: "concise" | "detailed" | "conversational"
  }
  autonomyLevel: "supervised" | "semi-autonomous" | "autonomous"
  userId: string
  createdAt: Date
}

export interface HardwareAcceleration {
  gpu: {
    available: boolean
    vendor: string
    model: string
    memory: number
  }
  npu: {
    available: boolean
    vendor: string
    model: string
    performance: number
  }
  webgl: {
    version: string
    extensions: string[]
  }
}

export interface MemoryOptimization {
  totalMemory: number
  usedMemory: number
  availableMemory: number
  suspendedTabs: number
  activeProcesses: number
  gcFrequency: number
  optimizationLevel: "aggressive" | "balanced" | "conservative"
}
