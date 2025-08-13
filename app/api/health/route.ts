import { NextResponse } from "next/server"

export async function GET() {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      database: "connected", // Check actual database connection
      ai: "connected", // Check Gemini API
      storage: "connected", // Check storage services
    },
  }

  try {
    // Add actual health checks here
    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
