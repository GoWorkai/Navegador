import type { EmbeddingModel } from "./types"

export class LocalEmbeddingModel implements EmbeddingModel {
  name = "local-transformer"
  dimensions = 384

  async generateEmbedding(text: string): Promise<number[]> {
    // Enhanced local embedding generation using TF-IDF and semantic features
    const words = this.tokenize(text.toLowerCase())
    const vector = new Array(this.dimensions).fill(0)

    // TF-IDF based embedding
    const termFreq = this.calculateTermFrequency(words)
    const docFreq = this.getDocumentFrequency()

    words.forEach((word, index) => {
      const tf = termFreq[word] || 0
      const idf = Math.log(1000 / (docFreq[word] || 1)) // Assume 1000 docs corpus
      const tfidf = tf * idf

      // Distribute TF-IDF score across vector dimensions
      const hash = this.hashString(word)
      for (let i = 0; i < 5; i++) {
        const dim = (hash + i) % this.dimensions
        vector[dim] += tfidf * (0.8 - i * 0.15) // Decreasing weights
      }
    })

    // Add semantic features
    this.addSemanticFeatures(text, vector)

    // Normalize vector
    return this.normalizeVector(vector)
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.generateEmbedding(text)))
  }

  private tokenize(text: string): string[] {
    return text
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2)
  }

  private calculateTermFrequency(words: string[]): Record<string, number> {
    const freq: Record<string, number> = {}
    const total = words.length

    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1
    })

    // Convert to relative frequency
    Object.keys(freq).forEach((word) => {
      freq[word] = freq[word] / total
    })

    return freq
  }

  private getDocumentFrequency(): Record<string, number> {
    // Simplified document frequency - in production, this would be pre-computed
    const commonWords: Record<string, number> = {
      the: 800,
      and: 700,
      for: 600,
      are: 500,
      but: 400,
      not: 350,
      you: 300,
      all: 250,
      can: 200,
      had: 150,
      her: 100,
      was: 90,
      one: 80,
      our: 70,
      out: 60,
    }
    return commonWords
  }

  private addSemanticFeatures(text: string, vector: number[]) {
    // Add semantic features based on content analysis
    const features = {
      hasQuestions: /\?/.test(text),
      hasNumbers: /\d/.test(text),
      hasUrls: /https?:\/\//.test(text),
      hasEmails: /@/.test(text),
      length: text.length,
      wordCount: text.split(/\s+/).length,
      avgWordLength: text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length,
    }

    // Encode features into specific vector dimensions
    if (features.hasQuestions) vector[0] += 0.5
    if (features.hasNumbers) vector[1] += 0.3
    if (features.hasUrls) vector[2] += 0.4
    if (features.hasEmails) vector[3] += 0.3

    // Length features
    vector[4] += Math.min(features.length / 1000, 1) // Normalize length
    vector[5] += Math.min(features.wordCount / 100, 1) // Normalize word count
    vector[6] += Math.min(features.avgWordLength / 10, 1) // Normalize avg word length
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return magnitude > 0 ? vector.map((val) => val / magnitude) : vector
  }
}

export class WebEmbeddingModel implements EmbeddingModel {
  name = "web-api"
  dimensions = 1536 // OpenAI ada-002 dimensions

  constructor(private apiKey?: string) {}

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      // Fallback to local model
      const localModel = new LocalEmbeddingModel()
      const localEmbedding = await localModel.generateEmbedding(text)
      // Pad or truncate to match expected dimensions
      return this.resizeVector(localEmbedding, this.dimensions)
    }

    try {
      // In a real implementation, this would call OpenAI or similar API
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          model: "text-embedding-ada-002",
        }),
      })

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.warn("Web embedding failed, falling back to local model:", error)
      const localModel = new LocalEmbeddingModel()
      const localEmbedding = await localModel.generateEmbedding(text)
      return this.resizeVector(localEmbedding, this.dimensions)
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((text) => this.generateEmbedding(text)))
  }

  private resizeVector(vector: number[], targetSize: number): number[] {
    if (vector.length === targetSize) return vector

    if (vector.length > targetSize) {
      // Truncate
      return vector.slice(0, targetSize)
    } else {
      // Pad with zeros
      return [...vector, ...new Array(targetSize - vector.length).fill(0)]
    }
  }
}
