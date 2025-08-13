interface KnowledgeGraphNode {
  id: string
  title: string
  content: string
  type: string
  createdAt: Date
  updatedAt: Date
  userId: string
  connections: string[]
  embeddings: number[]
}

interface VectorSearchResult {
  node: KnowledgeGraphNode
  similarity: number
  relevanceScore: number
  context: string
}

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeGraphNode> = new Map()
  private connections: Map<string, Set<string>> = new Map()
  private embeddings: Map<string, number[]> = new Map()

  constructor(private userId: string) {
    this.loadFromStorage()
  }

  addNode(node: Omit<KnowledgeGraphNode, "id" | "createdAt" | "updatedAt" | "userId">): string {
    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const knowledgeNode: KnowledgeGraphNode = {
      ...node,
      id,
      userId: this.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      connections: [],
      embeddings: [],
    }

    this.nodes.set(id, knowledgeNode)
    this.connections.set(id, new Set())

    // Generate embeddings for semantic search
    this.generateEmbeddings(knowledgeNode)

    this.saveToStorage()
    return id
  }

  connectNodes(nodeId1: string, nodeId2: string, bidirectional = true) {
    if (!this.connections.has(nodeId1)) {
      this.connections.set(nodeId1, new Set())
    }
    if (!this.connections.has(nodeId2)) {
      this.connections.set(nodeId2, new Set())
    }

    this.connections.get(nodeId1)!.add(nodeId2)

    if (bidirectional) {
      this.connections.get(nodeId2)!.add(nodeId1)
    }

    // Update node connections
    const node1 = this.nodes.get(nodeId1)
    const node2 = this.nodes.get(nodeId2)

    if (node1 && !node1.connections.includes(nodeId2)) {
      node1.connections.push(nodeId2)
      node1.updatedAt = new Date()
    }

    if (node2 && bidirectional && !node2.connections.includes(nodeId1)) {
      node2.connections.push(nodeId1)
      node2.updatedAt = new Date()
    }

    this.saveToStorage()
  }

  findRelatedNodes(nodeId: string, maxDepth = 2): KnowledgeGraphNode[] {
    const visited = new Set<string>()
    const related: KnowledgeGraphNode[] = []

    const traverse = (currentId: string, depth: number) => {
      if (depth > maxDepth || visited.has(currentId)) return

      visited.add(currentId)
      const connections = this.connections.get(currentId)

      if (connections) {
        for (const connectedId of connections) {
          const node = this.nodes.get(connectedId)
          if (node && !visited.has(connectedId)) {
            related.push(node)
            traverse(connectedId, depth + 1)
          }
        }
      }
    }

    traverse(nodeId, 0)
    return related
  }

  semanticSearch(query: string, limit = 10): VectorSearchResult[] {
    // Simplified semantic search - in production, this would use proper vector similarity
    const queryLower = query.toLowerCase()
    const results: VectorSearchResult[] = []

    for (const node of this.nodes.values()) {
      const titleMatch = node.title.toLowerCase().includes(queryLower)
      const contentMatch = node.content.toLowerCase().includes(queryLower)

      if (titleMatch || contentMatch) {
        const similarity = this.calculateSimilarity(query, node)
        const relevanceScore = this.calculateRelevance(node)

        results.push({
          node,
          similarity,
          relevanceScore,
          context: this.extractContext(node, query),
        })
      }
    }

    return results.sort((a, b) => b.similarity + b.relevanceScore - (a.similarity + a.relevanceScore)).slice(0, limit)
  }

  private generateEmbeddings(node: KnowledgeGraphNode) {
    // Simplified embedding generation - in production, this would use a proper embedding model
    const text = `${node.title} ${node.content}`
    const embedding = this.simpleTextToVector(text)
    this.embeddings.set(node.id, embedding)
    node.embeddings = embedding
  }

  private simpleTextToVector(text: string): number[] {
    // Very simplified text to vector conversion
    const words = text.toLowerCase().split(/\s+/)
    const vector = new Array(100).fill(0)

    words.forEach((word, index) => {
      const hash = this.simpleHash(word)
      vector[hash % 100] += 1
    })

    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return magnitude > 0 ? vector.map((val) => val / magnitude) : vector
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private calculateSimilarity(query: string, node: KnowledgeGraphNode): number {
    const queryWords = query.toLowerCase().split(/\s+/)
    const nodeText = `${node.title} ${node.content}`.toLowerCase()

    let matches = 0
    queryWords.forEach((word) => {
      if (nodeText.includes(word)) matches++
    })

    return matches / queryWords.length
  }

  private calculateRelevance(node: KnowledgeGraphNode): number {
    const now = new Date()
    const daysSinceUpdate = (now.getTime() - node.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    const recencyScore = Math.max(0, 1 - daysSinceUpdate / 30) // Decay over 30 days
    const connectionScore = Math.min(1, node.connections.length / 10) // More connections = more relevant

    return (recencyScore + connectionScore) / 2
  }

  private extractContext(node: KnowledgeGraphNode, query: string): string {
    const content = node.content
    const queryWords = query.toLowerCase().split(/\s+/)

    for (const word of queryWords) {
      const index = content.toLowerCase().indexOf(word)
      if (index !== -1) {
        const start = Math.max(0, index - 50)
        const end = Math.min(content.length, index + 100)
        return content.substring(start, end)
      }
    }

    return content.substring(0, 150)
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(`knowledge-graph-${this.userId}`)
      if (stored) {
        const data = JSON.parse(stored)

        // Restore nodes
        if (data.nodes) {
          for (const [id, nodeData] of Object.entries(data.nodes)) {
            const node = nodeData as any
            node.createdAt = new Date(node.createdAt)
            node.updatedAt = new Date(node.updatedAt)
            this.nodes.set(id, node)
          }
        }

        // Restore connections
        if (data.connections) {
          for (const [id, connectionArray] of Object.entries(data.connections)) {
            this.connections.set(id, new Set(connectionArray as string[]))
          }
        }

        // Restore embeddings
        if (data.embeddings) {
          for (const [id, embedding] of Object.entries(data.embeddings)) {
            this.embeddings.set(id, embedding as number[])
          }
        }
      }
    } catch (error) {
      console.error("Failed to load knowledge graph from storage:", error)
    }
  }

  private saveToStorage() {
    try {
      const data = {
        nodes: Object.fromEntries(this.nodes),
        connections: Object.fromEntries(
          Array.from(this.connections.entries()).map(([id, set]) => [id, Array.from(set)]),
        ),
        embeddings: Object.fromEntries(this.embeddings),
      }

      localStorage.setItem(`knowledge-graph-${this.userId}`, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save knowledge graph to storage:", error)
    }
  }

  getStats() {
    return {
      totalNodes: this.nodes.size,
      totalConnections: Array.from(this.connections.values()).reduce((sum, set) => sum + set.size, 0),
      nodeTypes: this.getNodeTypeDistribution(),
      averageConnections: this.getAverageConnections(),
    }
  }

  private getNodeTypeDistribution() {
    const distribution: Record<string, number> = {}

    for (const node of this.nodes.values()) {
      distribution[node.type] = (distribution[node.type] || 0) + 1
    }

    return distribution
  }

  private getAverageConnections(): number {
    if (this.nodes.size === 0) return 0

    const totalConnections = Array.from(this.connections.values()).reduce((sum, set) => sum + set.size, 0)

    return totalConnections / this.nodes.size
  }
}
