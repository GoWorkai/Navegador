import type { VectorEmbedding, SemanticCluster } from "./types"

export class SemanticClusteringEngine {
  private clusters: Map<string, SemanticCluster> = new Map()

  async clusterEmbeddings(embeddings: VectorEmbedding[], numClusters = 5): Promise<SemanticCluster[]> {
    if (embeddings.length === 0) return []

    // Simple K-means clustering implementation
    const clusters = await this.kMeansClustering(embeddings, numClusters)

    // Generate labels for clusters
    for (const cluster of clusters) {
      cluster.label = await this.generateClusterLabel(cluster, embeddings)
      cluster.description = await this.generateClusterDescription(cluster, embeddings)
    }

    // Store clusters
    clusters.forEach((cluster) => {
      this.clusters.set(cluster.id, cluster)
    })

    return clusters
  }

  async findSimilarClusters(embedding: VectorEmbedding): Promise<SemanticCluster[]> {
    const similarities: Array<{ cluster: SemanticCluster; similarity: number }> = []

    for (const cluster of this.clusters.values()) {
      const similarity = this.cosineSimilarity(embedding.vector, cluster.centroid)
      similarities.push({ cluster, similarity })
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((item) => item.cluster)
  }

  async organizeContent(embeddings: VectorEmbedding[]): Promise<{
    clusters: SemanticCluster[]
    unclustered: VectorEmbedding[]
    suggestions: Array<{
      type: "merge" | "split" | "relabel"
      description: string
      confidence: number
    }>
  }> {
    const clusters = await this.clusterEmbeddings(embeddings)
    const unclustered: VectorEmbedding[] = []
    const suggestions: Array<{
      type: "merge" | "split" | "relabel"
      description: string
      confidence: number
    }> = []

    // Find embeddings that don't fit well in any cluster
    for (const embedding of embeddings) {
      const bestCluster = await this.findBestCluster(embedding)
      if (!bestCluster || bestCluster.similarity < 0.6) {
        unclustered.push(embedding)
      }
    }

    // Generate organization suggestions
    suggestions.push(...(await this.generateOrganizationSuggestions(clusters)))

    return { clusters, unclustered, suggestions }
  }

  private async kMeansClustering(embeddings: VectorEmbedding[], k: number): Promise<SemanticCluster[]> {
    if (embeddings.length < k) {
      // If we have fewer embeddings than desired clusters, create one cluster per embedding
      return embeddings.map((embedding, index) => ({
        id: `cluster-${index}`,
        centroid: [...embedding.vector],
        members: [embedding.id],
        label: `Cluster ${index + 1}`,
        description: "",
        confidence: 1.0,
        createdAt: new Date(),
      }))
    }

    // Initialize centroids randomly
    const centroids: number[][] = []
    const dimensions = embeddings[0].vector.length

    for (let i = 0; i < k; i++) {
      const centroid = new Array(dimensions).fill(0).map(() => Math.random() * 2 - 1)
      centroids.push(this.normalizeVector(centroid))
    }

    let assignments = new Array(embeddings.length).fill(0)
    let converged = false
    let iterations = 0
    const maxIterations = 100

    while (!converged && iterations < maxIterations) {
      const newAssignments = new Array(embeddings.length)

      // Assign each embedding to the nearest centroid
      for (let i = 0; i < embeddings.length; i++) {
        let bestCluster = 0
        let bestSimilarity = -1

        for (let j = 0; j < k; j++) {
          const similarity = this.cosineSimilarity(embeddings[i].vector, centroids[j])
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity
            bestCluster = j
          }
        }

        newAssignments[i] = bestCluster
      }

      // Check for convergence
      converged = newAssignments.every((assignment, i) => assignment === assignments[i])
      assignments = newAssignments

      // Update centroids
      for (let j = 0; j < k; j++) {
        const clusterEmbeddings = embeddings.filter((_, i) => assignments[i] === j)

        if (clusterEmbeddings.length > 0) {
          const newCentroid = new Array(dimensions).fill(0)

          for (const embedding of clusterEmbeddings) {
            for (let d = 0; d < dimensions; d++) {
              newCentroid[d] += embedding.vector[d]
            }
          }

          for (let d = 0; d < dimensions; d++) {
            newCentroid[d] /= clusterEmbeddings.length
          }

          centroids[j] = this.normalizeVector(newCentroid)
        }
      }

      iterations++
    }

    // Create cluster objects
    const clusters: SemanticCluster[] = []
    for (let j = 0; j < k; j++) {
      const members = embeddings.filter((_, i) => assignments[i] === j).map((embedding) => embedding.id)

      if (members.length > 0) {
        clusters.push({
          id: `cluster-${j}`,
          centroid: centroids[j],
          members,
          label: `Cluster ${j + 1}`,
          description: "",
          confidence: this.calculateClusterConfidence(embeddings, assignments, j),
          createdAt: new Date(),
        })
      }
    }

    return clusters
  }

  private async generateClusterLabel(cluster: SemanticCluster, embeddings: VectorEmbedding[]): Promise<string> {
    const clusterEmbeddings = embeddings.filter((e) => cluster.members.includes(e.id))

    // Extract common themes from content
    const allContent = clusterEmbeddings.map((e) => e.content).join(" ")
    const words = allContent.toLowerCase().split(/\s+/)
    const wordFreq: Record<string, number> = {}

    words.forEach((word) => {
      if (word.length > 3 && !this.isStopWord(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })

    // Get most frequent meaningful words
    const topWords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word)

    return topWords.length > 0 ? topWords.join(", ") : `Cluster ${cluster.id}`
  }

  private async generateClusterDescription(cluster: SemanticCluster, embeddings: VectorEmbedding[]): Promise<string> {
    const clusterEmbeddings = embeddings.filter((e) => cluster.members.includes(e.id))

    const contentTypes = [...new Set(clusterEmbeddings.map((e) => e.contentType))]
    const avgLength = clusterEmbeddings.reduce((sum, e) => sum + e.content.length, 0) / clusterEmbeddings.length

    return `Grupo de ${clusterEmbeddings.length} elementos (${contentTypes.join(", ")}) con longitud promedio de ${Math.round(avgLength)} caracteres`
  }

  private async findBestCluster(
    embedding: VectorEmbedding,
  ): Promise<{ cluster: SemanticCluster; similarity: number } | null> {
    let bestCluster: SemanticCluster | null = null
    let bestSimilarity = -1

    for (const cluster of this.clusters.values()) {
      const similarity = this.cosineSimilarity(embedding.vector, cluster.centroid)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestCluster = cluster
      }
    }

    return bestCluster ? { cluster: bestCluster, similarity: bestSimilarity } : null
  }

  private async generateOrganizationSuggestions(clusters: SemanticCluster[]): Promise<
    Array<{
      type: "merge" | "split" | "relabel"
      description: string
      confidence: number
    }>
  > {
    const suggestions: Array<{
      type: "merge" | "split" | "relabel"
      description: string
      confidence: number
    }> = []

    // Suggest merging similar clusters
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const similarity = this.cosineSimilarity(clusters[i].centroid, clusters[j].centroid)
        if (similarity > 0.8) {
          suggestions.push({
            type: "merge",
            description: `Considerar fusionar "${clusters[i].label}" y "${clusters[j].label}" (similitud: ${(similarity * 100).toFixed(1)}%)`,
            confidence: similarity,
          })
        }
      }
    }

    // Suggest splitting large clusters with low confidence
    clusters.forEach((cluster) => {
      if (cluster.members.length > 10 && cluster.confidence < 0.6) {
        suggestions.push({
          type: "split",
          description: `El cluster "${cluster.label}" es grande y heterogéneo, considerar dividirlo`,
          confidence: 1 - cluster.confidence,
        })
      }
    })

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
  }

  private calculateClusterConfidence(
    embeddings: VectorEmbedding[],
    assignments: number[],
    clusterIndex: number,
  ): number {
    const clusterEmbeddings = embeddings.filter((_, i) => assignments[i] === clusterIndex)

    if (clusterEmbeddings.length <= 1) return 1.0

    // Calculate average intra-cluster similarity
    let totalSimilarity = 0
    let comparisons = 0

    for (let i = 0; i < clusterEmbeddings.length; i++) {
      for (let j = i + 1; j < clusterEmbeddings.length; j++) {
        totalSimilarity += this.cosineSimilarity(clusterEmbeddings[i].vector, clusterEmbeddings[j].vector)
        comparisons++
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0
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

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return magnitude > 0 ? vector.map((val) => val / magnitude) : vector
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      "el",
      "la",
      "de",
      "que",
      "y",
      "a",
      "en",
      "un",
      "es",
      "se",
      "no",
      "te",
      "lo",
      "le",
      "da",
      "su",
      "por",
      "son",
      "con",
      "para",
      "al",
      "del",
      "los",
      "las",
      "una",
      "como",
      "pero",
      "sus",
      "me",
      "ya",
      "muy",
      "sin",
      "sobre",
      "ser",
      "tiene",
      "todo",
      "esta",
      "entre",
      "cuando",
      "esta",
      "hacer",
      "también",
      "fue",
      "era",
      "están",
      "estos",
      "este",
      "durante",
      "siempre",
      "todos",
      "su",
      "aquí",
      "donde",
      "más",
      "antes",
      "algunos",
      "qué",
      "tiempo",
      "muy",
      "sobre",
      "decir",
      "ella",
      "tanto",
      "él",
      "una",
      "sus",
      "otro",
      "como",
      "otras",
      "mucho",
      "así",
      "pueden",
      "debe",
      "sin",
      "más",
      "puede",
      "es",
      "según",
      "hasta",
      "este",
      "donde",
      "estados",
      "país",
      "cada",
      "forma",
      "tres",
      "gran",
      "en",
      "los",
      "años",
      "durante",
      "primera",
      "desde",
      "su",
      "gobierno",
      "me",
      "mayor",
      "año",
      "trabajo",
      "otros",
      "día",
      "tanto",
      "ella",
      "hasta",
      "la",
      "mientras",
      "sean",
      "caso",
      "nada",
      "hoy",
      "lugar",
      "aunque",
      "menos",
      "dijo",
      "otro",
      "parte",
      "después",
      "vida",
      "quedó",
      "gran",
      "tiempo",
      "han",
      "bajo",
      "guerra",
      "más",
      "otras",
      "había",
      "ante",
      "ellos",
      "e",
      "esto",
      "mi",
      "antes",
      "algunos",
      "qué",
      "unos",
      "ni",
      "contra",
      "otros",
      "ese",
      "eso",
      "había",
      "si",
      "le",
      "ya",
      "todo",
      "esta",
      "cuando",
      "muy",
      "sin",
      "puede",
      "están",
      "sus",
      "le",
      "pero",
      "lo",
      "todas",
      "uno",
      "les",
      "da",
      "allí",
      "fueron",
      "tienen",
      "tanto",
      "aquella",
      "sus",
      "ser",
      "es",
      "así",
      "quien",
      "para",
      "su",
      "clase",
      "ellas",
      "uno",
      "estas",
      "será",
      "muy",
      "están",
      "we",
      "porque",
      "son",
      "dos",
      "él",
      "pero",
      "fue",
      "tenía",
      "tu",
      "mucho",
      "te",
      "todos",
      "ese",
      "su",
      "cuando",
      "hasta",
      "uso",
      "desde",
      "podría",
      "todos",
      "incluso",
      "primero",
      "está",
      "muchos",
      "sus",
      "hacia",
      "otro",
      "mucho",
      "ella",
      "mismo",
      "lo",
      "mucha",
      "hacer",
      "entonces",
      "sí",
      "ver",
      "por",
      "más",
      "como",
      "él",
      "otras",
      "fue",
      "esa",
      "estos",
      "mucho",
      "antes",
      "algunos",
      "qué",
      "donde",
      "él",
      "estado",
      "estaba",
      "durante",
      "todo",
      "esto",
      "también",
      "así",
      "fue",
      "tenía",
      "su",
      "muy",
      "era",
      "hasta",
      "le",
      "son",
      "dos",
      "él",
      "pero",
      "fue",
      "tenía",
      "su",
      "muy",
      "era",
      "hasta",
      "le",
      "son",
      "dos",
      "él",
      "pero",
      "fue",
      "tenía",
      "su",
      "muy",
      "era",
      "hasta",
      "le",
    ])
    return stopWords.has(word)
  }
}
