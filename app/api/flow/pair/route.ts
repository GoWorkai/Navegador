import { type NextRequest, NextResponse } from "next/server"

interface PairingRequest {
  deviceId: string
  deviceName: string
  deviceType: "mobile" | "desktop" | "tablet"
  platform: string
  encryptionKey: string
}

// In-memory storage for demo (use database in production)
const pairedDevices: Map<string, PairingRequest> = new Map()

export async function POST(request: NextRequest) {
  try {
    const pairingData: PairingRequest = await request.json()

    if (!pairingData.deviceId || !pairingData.deviceName || !pairingData.encryptionKey) {
      return NextResponse.json(
        {
          error: "Datos de emparejamiento incompletos",
        },
        { status: 400 },
      )
    }

    const pairingToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    pairedDevices.set(pairingData.deviceId, {
      ...pairingData,
      encryptionKey: pairingData.encryptionKey, // In production, hash this
    })

    return NextResponse.json({
      success: true,
      pairingToken,
      deviceId: pairingData.deviceId,
      message: "Dispositivo emparejado exitosamente",
    })
  } catch (error) {
    console.error("Error in device pairing:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("deviceId")

    if (deviceId) {
      const device = pairedDevices.get(deviceId)
      if (device) {
        const { encryptionKey, ...deviceInfo } = device
        return NextResponse.json({ device: deviceInfo })
      } else {
        return NextResponse.json({ error: "Dispositivo no encontrado" }, { status: 404 })
      }
    }

    const devices = Array.from(pairedDevices.values()).map(({ encryptionKey, ...device }) => device)

    return NextResponse.json({
      devices,
      total: devices.length,
    })
  } catch (error) {
    console.error("Error fetching paired devices:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
