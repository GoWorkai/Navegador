import type { VectorDatabaseProvider, VectorEmbedding, VectorSearchQuery, VectorSearchResult } from "../types"

export class LocalVectorProvider implements VectorDatabaseProvider {
  name = "local-storage"
  private embeddings: Map<string, VectorEmbedding> = new Map()
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Load from localStorage
    try {
      const stored = localStorage.getItem("aria-vector-embeddings")
      if (stored) {
        const data = JSON.parse(stored)
        Object.entries(data).forEach(([id, embedding]: [string, any]) => {
          this.embeddings.set(id, {
            ...embedding,
            createdAt: new Date(embedding.createdAt),
            updatedAt: new Date(embedding.updatedAt),
          })
        })
      }
    } catch (error) {
      console.error("Failed to load vector embeddings:", error)
    }

    this.initialized = true
  }

  async addEmbedding(embedding: VectorEmbedding): Promise<string> {
    this.embeddings.set(embedding.id, embedding)
    await this.persist()
    return embedding.id
  }

  async addEmbeddings(embeddings: VectorEmbedding[]): Promise<string[]> {
    const ids: string[] = []
    for (const embedding of embeddings) {
      this.embeddings.set(embedding.id, embedding)
      ids.push(embedding.id)
    }
    await this.persist()
    return ids
  }

  async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    if (!query.vector && !query.text) {
      throw new Error("Either vector or text must be provided for search")
    }

    const results: VectorSearchResult[] = []
    const threshold = query.threshold || 0.5
    const limit = query.limit || 10

    for (const [id, embedding] of this.embeddings.entries()) {
      // Apply filters
      if (query.filters) {
        const matchesFilters = Object.entries(query.filters).every(([key, value]) => {
          return embedding.metadata[key] === value
        })
        if (!matchesFilters) continue
      }

      // Calculate similarity
      let score = 0
      if (query.vector) {
        score = this.cosineSimilarity(query.vector, embedding.vector)
      } else if (query.text) {
        // Simple text similarity as fallback
        score = this.textSimilarity(query.text, embedding.content)
      }

      if (score >= threshold) {
        results.push({
          id,
          score,
          metadata: embedding.metadata,
          content: embedding.content,
          contentType: embedding.contentType,
          embedding: query.includeMetadata ? embedding : undefined,
        })
      }
    }

    // Sort by score and limit results
    return results.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  async deleteEmbedding(id: string): Promise<boolean> {
    const deleted = this.embeddings.delete(id)
    if (deleted) {
      await this.persist()
    }
    return deleted
  }

  async updateEmbedding(id: string, updates: Partial<VectorEmbedding>): Promise<boolean> {
    const existing = this.embeddings.get(id)
    if (!existing) return false

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    }

    this.embeddings.set(id, updated)
    await this.persist()
    return true
  }

  async getStats() {
    const embeddings = Array.from(this.embeddings.values())
    const dimensions = embeddings.length > 0 ? embeddings[0].vector.length : 0

    return {
      totalEmbeddings: embeddings.length,
      dimensions,
      memoryUsage: this.estimateMemoryUsage(),
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
    return magnitude > 0 ? dotProduct / magnitude : 0
  }

  private textSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/))
    const words2 = new Set(text2.toLowerCase().split(/\s+/))

    const intersection = new Set([...words1].filter((word) => words2.has(word)))
    const union = new Set([...words1, ...words2])

    return union.size > 0 ? intersection.size / union.size : 0
  }

  private async persist(): Promise<void> {
    try {
      const data = Object.fromEntries(this.embeddings)
      localStorage.setItem("aria-vector-embeddings", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to persist vector embeddings:", error)
    }
  }

  private estimateMemoryUsage(): number {
    let size = 0
    for (const embedding of this.embeddings.values()) {
      size += embedding.vector.length * 8 // 8 bytes per float64
      size += JSON.stringify(embedding.metadata).length
      size += embedding.content.length * 2 // 2 bytes per char
    }
    return size
  }
}
