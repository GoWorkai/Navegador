import { type NextRequest, NextResponse } from "next/server"

interface FlowData {
  id: string
  type: "text" | "url" | "file" | "image"
  content: string
  fileName?: string
  fileSize?: number
  fromDevice: string
  toDevice: string
  encrypted: boolean
  timestamp: string
}

// In-memory storage for demo (use database in production)
let flowStorage: FlowData[] = []

export async function POST(request: NextRequest) {
  try {
    const flowData: FlowData = await request.json()

    if (flowData.encrypted) {
      // Simulate encryption validation
      if (!flowData.content || flowData.content.length === 0) {
        return NextResponse.json({ error: "Contenido cifrado inválido" }, { status: 400 })
      }
    }

    const storedData: FlowData = {
      ...flowData,
      id: flowData.id || `flow-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    flowStorage.push(storedData)

    if (flowStorage.length > 100) {
      flowStorage = flowStorage.slice(-100)
    }

    return NextResponse.json({
      success: true,
      id: storedData.id,
      synced: true,
    })
  } catch (error) {
    console.error("Error in Flow sync:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("deviceId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    let filteredData = flowStorage
    if (deviceId) {
      filteredData = flowStorage.filter((item) => item.toDevice === deviceId || item.fromDevice === deviceId)
    }

    const recentItems = filteredData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({
      items: recentItems,
      total: filteredData.length,
    })
  } catch (error) {
    console.error("Error fetching Flow data:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
