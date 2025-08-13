export class HardwareDetector {
  private static instance: HardwareDetector
  private hardwareInfo: HardwareAcceleration | null = null

  static getInstance(): HardwareDetector {
    if (!HardwareDetector.instance) {
      HardwareDetector.instance = new HardwareDetector()
    }
    return HardwareDetector.instance
  }

  async detectHardware(): Promise<HardwareAcceleration> {
    if (this.hardwareInfo) {
      return this.hardwareInfo
    }

    const gpu = await this.detectGPU()
    const npu = await this.detectNPU()
    const webgl = this.detectWebGL()

    this.hardwareInfo = {
      gpu,
      npu,
      webgl,
    }

    return this.hardwareInfo
  }

  private async detectGPU() {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")

      if (!gl) {
        return {
          available: false,
          vendor: "unknown",
          model: "unknown",
          memory: 0,
        }
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "unknown"
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown"

      // Estimate GPU memory (this is approximate)
      const memoryInfo = gl.getExtension("WEBGL_debug_renderer_info")
      let memory = 0

      if (memoryInfo) {
        // Try to get memory info from various extensions
        const ext = gl.getExtension("WEBGL_debug_renderer_info")
        if (ext) {
          memory = 1024 // Default estimate in MB
        }
      }

      return {
        available: true,
        vendor: vendor as string,
        model: renderer as string,
        memory,
      }
    } catch (error) {
      return {
        available: false,
        vendor: "unknown",
        model: "unknown",
        memory: 0,
      }
    }
  }

  private async detectNPU() {
    try {
      // Check for WebNN API (Neural Network API)
      if ("ml" in navigator) {
        return {
          available: true,
          vendor: "WebNN",
          model: "Neural Processing Unit",
          performance: 100, // Arbitrary performance score
        }
      }

      // Check for other AI acceleration APIs
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        return {
          available: true,
          vendor: "Browser",
          model: "Speech Processing Unit",
          performance: 50,
        }
      }

      return {
        available: false,
        vendor: "unknown",
        model: "unknown",
        performance: 0,
      }
    } catch (error) {
      return {
        available: false,
        vendor: "unknown",
        model: "unknown",
        performance: 0,
      }
    }
  }

  private detectWebGL() {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")

      if (!gl) {
        return {
          version: "none",
          extensions: [],
        }
      }

      const version = gl.getParameter(gl.VERSION)
      const extensions = gl.getSupportedExtensions() || []

      return {
        version,
        extensions,
      }
    } catch (error) {
      return {
        version: "none",
        extensions: [],
      }
    }
  }

  isGPUAccelerationAvailable(): boolean {
    return this.hardwareInfo?.gpu.available || false
  }

  isNPUAvailable(): boolean {
    return this.hardwareInfo?.npu.available || false
  }

  getOptimalProcessingUnit(): "cpu" | "gpu" | "npu" {
    if (this.isNPUAvailable()) return "npu"
    if (this.isGPUAccelerationAvailable()) return "gpu"
    return "cpu"
  }
}

export const hardwareDetector = HardwareDetector.getInstance()
