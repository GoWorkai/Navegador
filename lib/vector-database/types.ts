export interface VectorEmbedding {
  id: string
  vector: number[]
  metadata: Record<string, any>
  content: string
  contentType: "text" | "image" | "audio" | "document"
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface VectorSearchQuery {
  vector?: number[]
  text?: string
  filters?: Record<string, any>
  limit?: number
  threshold?: number
  includeMetadata?: boolean
}

export interface VectorSearchResult {
  id: string
  score: number
  metadata: Record<string, any>
  content: string
  contentType: string
  embedding?: VectorEmbedding
}

export interface VectorDatabaseProvider {
  name: string
  initialize(): Promise<void>
  addEmbedding(embedding: VectorEmbedding): Promise<string>
  addEmbeddings(embeddings: VectorEmbedding[]): Promise<string[]>
  search(query: VectorSearchQuery): Promise<VectorSearchResult[]>
  deleteEmbedding(id: string): Promise<boolean>
  updateEmbedding(id: string, embedding: Partial<VectorEmbedding>): Promise<boolean>
  getStats(): Promise<{
    totalEmbeddings: number
    dimensions: number
    memoryUsage: number
  }>
}

export interface EmbeddingModel {
  name: string
  dimensions: number
  generateEmbedding(text: string): Promise<number[]>
  generateEmbeddings(texts: string[]): Promise<number[][]>
}

export interface SemanticCluster {
  id: string
  centroid: number[]
  members: string[]
  label: string
  description: string
  confidence: number
  createdAt: Date
}
