import type { VectorDatabaseProvider, VectorEmbedding, VectorSearchQuery, EmbeddingModel } from "./types"
import { LocalVectorProvider } from "./providers/local-provider"
import { LocalEmbeddingModel } from "./embedding-models"
import { SemanticClusteringEngine } from "./semantic-clustering"

export class VectorDatabaseManager {
  private provider: VectorDatabaseProvider
  private embeddingModel: EmbeddingModel
  private clusteringEngine: SemanticClusteringEngine
  private initialized = false

  constructor(provider?: VectorDatabaseProvider, embeddingModel?: EmbeddingModel) {
    this.provider = provider || new LocalVectorProvider()
    this.embeddingModel = embeddingModel || new LocalEmbeddingModel()
    this.clusteringEngine = new SemanticClusteringEngine()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    await this.provider.initialize()
    this.initialized = true
  }

  async addContent(
    content: string,
    metadata: Record<string, any> = {},
    contentType: "text" | "image" | "audio" | "document" = "text",
    userId: string,
  ): Promise<string> {
    await this.ensureInitialized()

    const vector = await this.embeddingModel.generateEmbedding(content)
    const embedding: VectorEmbedding = {
      id: `emb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vector,
      metadata,
      content,
      contentType,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return await this.provider.addEmbedding(embedding)
  }

  async addMultipleContent(
    items: Array<{
      content: string
      metadata?: Record<string, any>
      contentType?: "text" | "image" | "audio" | "document"
    }>,
    userId: string,
  ): Promise<string[]> {
    await this.ensureInitialized()

    const contents = items.map((item) => item.content)
    const vectors = await this.embeddingModel.generateEmbeddings(contents)

    const embeddings: VectorEmbedding[] = items.map((item, index) => ({
      id: `emb-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      vector: vectors[index],
      metadata: item.metadata || {},
      content: item.content,
      contentType: item.contentType || "text",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    return await this.provider.addEmbeddings(embeddings)
  }

  async semanticSearch(
    query: string,
    options: {
      limit?: number
      threshold?: number
      filters?: Record<string, any>
      userId?: string
    } = {},
  ) {
    await this.ensureInitialized()

    const queryVector = await this.embeddingModel.generateEmbedding(query)

    const searchQuery: VectorSearchQuery = {
      vector: queryVector,
      text: query,
      limit: options.limit || 10,
      threshold: options.threshold || 0.5,
      filters: {
        ...options.filters,
        ...(options.userId && { userId: options.userId }),
      },
      includeMetadata: true,
    }

    const results = await this.provider.search(searchQuery)

    // Enhance results with semantic clustering information
    const enhancedResults = await Promise.all(
      results.map(async (result) => {
        const similarClusters = result.embedding
          ? await this.clusteringEngine.findSimilarClusters(result.embedding)
          : []

        return {
          ...result,
          clusters: similarClusters.slice(0, 3),
          semanticContext: await this.generateSemanticContext(result, query),
        }
      }),
    )

    return enhancedResults
  }

  async organizeUserContent(userId: string) {
    await this.ensureInitialized()

    // Get all user embeddings
    const allResults = await this.provider.search({
      filters: { userId },
      limit: 1000,
      threshold: 0,
      includeMetadata: true,
    })

    const embeddings = allResults
      .map((result) => result.embedding)
      .filter((emb): emb is VectorEmbedding => emb !== undefined)

    if (embeddings.length === 0) {
      return {
        clusters: [],
        unclustered: [],
        suggestions: [],
        stats: { totalItems: 0, clustered: 0, unclustered: 0 },
      }
    }

    const organization = await this.clusteringEngine.organizeContent(embeddings)

    return {
      ...organization,
      stats: {
        totalItems: embeddings.length,
        clustered: embeddings.length - organization.unclustered.length,
        unclustered: organization.unclustered.length,
      },
    }
  }

  async findSimilarContent(contentId: string, limit = 5) {
    await this.ensureInitialized()

    // First, get the embedding for the given content
    const results = await this.provider.search({
      filters: { id: contentId },
      limit: 1,
      threshold: 0,
      includeMetadata: true,
    })

    if (results.length === 0 || !results[0].embedding) {
      return []
    }

    const sourceEmbedding = results[0].embedding

    // Search for similar content
    const similarResults = await this.provider.search({
      vector: sourceEmbedding.vector,
      limit: limit + 1, // +1 to exclude the source itself
      threshold: 0.3,
      includeMetadata: true,
    })

    // Filter out the source content and return similar items
    return similarResults.filter((result) => result.id !== contentId).slice(0, limit)
  }

  async getContentStats(userId?: string) {
    await this.ensureInitialized()

    const providerStats = await this.provider.getStats()

    let userStats = null
    if (userId) {
      const userResults = await this.provider.search({
        filters: { userId },
        limit: 1000,
        threshold: 0,
      })

      const contentTypes: Record<string, number> = {}
      userResults.forEach((result) => {
        contentTypes[result.contentType] = (contentTypes[result.contentType] || 0) + 1
      })

      userStats = {
        totalItems: userResults.length,
        contentTypes,
        avgContentLength: userResults.reduce((sum, r) => sum + r.content.length, 0) / userResults.length || 0,
      }
    }

    return {
      provider: providerStats,
      user: userStats,
      model: {
        name: this.embeddingModel.name,
        dimensions: this.embeddingModel.dimensions,
      },
    }
  }

  async deleteContent(id: string): Promise<boolean> {
    await this.ensureInitialized()
    return await this.provider.deleteEmbedding(id)
  }

  async updateContent(
    id: string,
    updates: {
      content?: string
      metadata?: Record<string, any>
    },
  ): Promise<boolean> {
    await this.ensureInitialized()

    const updateData: Partial<VectorEmbedding> = {
      ...updates,
      updatedAt: new Date(),
    }

    // If content is updated, regenerate embedding
    if (updates.content) {
      updateData.vector = await this.embeddingModel.generateEmbedding(updates.content)
    }

    return await this.provider.updateEmbedding(id, updateData)
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  private async generateSemanticContext(result: any, query: string): Promise<string> {
    // Generate contextual information about why this result is relevant
    const contentWords = result.content.toLowerCase().split(/\s+/)
    const queryWords = query.toLowerCase().split(/\s+/)

    const matchingWords = contentWords.filter((word) =>
      queryWords.some((qWord) => word.includes(qWord) || qWord.includes(word)),
    )

    if (matchingWords.length > 0) {
      return `Coincidencias encontradas: ${matchingWords.slice(0, 3).join(", ")}`
    }

    return `Similitud semántica: ${(result.score * 100).toFixed(1)}%`
  }
}

// Global instance
export const vectorManager = new VectorDatabaseManager()
