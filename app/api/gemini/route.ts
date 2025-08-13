import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model = "gemini-2.0-flash-exp", max_tokens = 1000, temperature = 0.7 } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return NextResponse.json(
        {
          error: "Formato de mensajes inválido",
          fallback: true,
        },
        { status: 400 },
      )
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured")
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY no configurada",
          fallback: true,
        },
        { status: 500 },
      )
    }

    const enhancedMessages = messages.map((msg: any) => {
      if (!msg || typeof msg !== "object") {
        return { role: "user", content: String(msg || "") }
      }

      if (msg.role === "system") {
        return {
          ...msg,
          content: `Eres ARIA, un asistente IA personal integrado en un navegador web avanzado. Tu personalidad es amigable, eficiente y proactiva. 

CAPACIDADES PRINCIPALES:
• Navegación web inteligente y búsquedas optimizadas
• Gestión de tareas y productividad personal
• Administración de finanzas del hogar
• Control de entretenimiento y multimedia
• Organización de workspaces y pestañas
• Sincronización entre dispositivos
• Configuración de VPN y privacidad

CONTEXTO DEL USUARIO:
• Interfaz estilo Windows con Speed Dial personalizable
• Workspaces organizados (Personal, Trabajo, Entretenimiento)
• Perfiles familiares con roles diferenciados
• Integración con servicios de streaming y redes sociales

INSTRUCCIONES:
• Responde en español de manera concisa pero completa
• Ofrece acciones específicas cuando sea posible
• Sugiere funcionalidades del navegador relevantes
• Mantén un tono profesional pero cercano
• Si no tienes información específica, sé honesto al respecto

${msg.content || ""}`,
        }
      }
      return {
        role: msg.role || "user",
        content: msg.content || "",
      }
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "User-Agent": "ARIA-Navigator/1.0",
      },
      body: JSON.stringify({
        model,
        messages: enhancedMessages,
        max_tokens,
        temperature,
        top_p: 0.9,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })

      return NextResponse.json(
        {
          error: `Error en la API de Gemini (${response.status})`,
          fallback: true,
          details: response.statusText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid Gemini API response structure:", data)
      return NextResponse.json(
        {
          error: "Respuesta inválida de la API de Gemini",
          fallback: true,
        },
        { status: 500 },
      )
    }

    const responseData = {
      ...data,
      metadata: {
        model_used: model,
        tokens_used: data.usage?.total_tokens || 0,
        response_time: Date.now(),
        api_version: "gemini-2.0-flash-exp",
      },
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Error en API route:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Timeout en la API de Gemini",
          fallback: true,
        },
        { status: 408 },
      )
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        fallback: true,
        details: error.message,
      },
      { status: 500 },
    )
  }
}
