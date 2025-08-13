"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, Mic, X, Settings, Sparkles, Brain, AlertCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface AIAssistantProps {
  onClose?: () => void
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy ARIA, tu asistente IA personal integrado en este navegador avanzado. Puedo ayudarte con navegación inteligente, gestión de workspaces, tareas, finanzas del hogar, entretenimiento y mucho más. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callGeminiAPI = async (userInput: string): Promise<string> => {
    try {
      const recentMessages = messages.slice(-6).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }))

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "Contexto del navegador ARIA con funcionalidades avanzadas.",
            },
            ...recentMessages,
            {
              role: "user",
              content: userInput,
            },
          ],
          model: "gemini-2.0-flash-exp",
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.fallback) {
          setApiError("Usando respuestas locales. Verifica tu conexión.")
          return generateEnhancedLocalResponse(userInput)
        }
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setApiError(null)

      setConversationContext((prev) => [...prev.slice(-10), userInput])

      return data.choices[0].message.content
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setApiError("Error conectando con Gemini API. Usando respuesta local.")
      return generateEnhancedLocalResponse(userInput)
    }
  }

  const generateEnhancedLocalResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Navigation and web browsing
    if (input.includes("buscar") || input.includes("google") || input.includes("web") || input.includes("navegar")) {
      return `🌐 Puedo ayudarte con navegación web inteligente. Tengo acceso a:
      
• Búsqueda optimizada con múltiples motores
• Gestión de workspaces (Personal, Trabajo, Entretenimiento)
• Historial y favoritos organizados
• VPN integrada para privacidad
• Bloqueador de anuncios avanzado

¿Qué sitio web quieres visitar o qué información necesitas buscar?`
    }

    // Workspace and productivity
    if (
      input.includes("workspace") ||
      input.includes("pestaña") ||
      input.includes("organizar") ||
      input.includes("productividad")
    ) {
      return `📋 Te ayudo con la organización de workspaces y productividad:

• Crear y gestionar workspaces temáticos
• Organizar pestañas por contexto (trabajo, personal, entretenimiento)
• Sincronización entre dispositivos con Flow
• Gestión de tareas y recordatorios

¿Quieres crear un nuevo workspace o reorganizar las pestañas existentes?`
    }

    // Finance management
    if (
      input.includes("finanzas") ||
      input.includes("dinero") ||
      input.includes("gasto") ||
      input.includes("presupuesto")
    ) {
      return `💰 Perfecto para gestión financiera del hogar. Puedo ayudarte con:

• Seguimiento de gastos e ingresos
• Creación de presupuestos personalizados
• Análisis de patrones de gasto
• Recordatorios de pagos y facturas
• Integración con servicios bancarios

¿Quieres registrar un gasto, revisar tu presupuesto o analizar tus finanzas?`
    }

    // Entertainment and media
    if (
      input.includes("música") ||
      input.includes("video") ||
      input.includes("entretenimiento") ||
      input.includes("multimedia")
    ) {
      return `🎵 ¡Excelente! El centro multimedia integrado ofrece:

• Reproductor con soporte para múltiples formatos
• Integración con Spotify, YouTube Music, SoundCloud
• Radio IA personalizada según tus gustos
• Gestión de playlists inteligente
• Modo visualizador y controles avanzados

¿Quieres reproducir música específica, crear una playlist o explorar la Radio IA?`
    }

    // Profile and personalization
    if (
      input.includes("perfil") ||
      input.includes("personalizar") ||
      input.includes("configurar") ||
      input.includes("tema")
    ) {
      return `👤 Te ayudo con personalización y perfiles:

• Gestión de perfiles familiares (Principal, Pareja, Hijos)
• Personalización de temas y colores
• Configuración de IA por usuario
• Ajustes de privacidad individuales
• Sincronización de preferencias

¿Quieres cambiar de perfil, personalizar la interfaz o ajustar configuraciones?`
    }

    // Default enhanced response
    return `🤖 Como ARIA, tu asistente IA integrado, puedo ayudarte con:

🌐 **Navegación Inteligente**
• Búsquedas optimizadas y workspaces organizados
• VPN y privacidad avanzada

📋 **Productividad**
• Gestión de tareas y sincronización Flow
• Organización de pestañas por contexto

💰 **Finanzas del Hogar**
• Presupuestos y seguimiento de gastos
• Análisis financiero personalizado

🎵 **Entretenimiento**
• Centro multimedia con Radio IA
• Integración con servicios de streaming

👤 **Personalización**
• Perfiles familiares y temas dinámicos
• Configuración de privacidad

¿En qué área específica te gustaría que te ayude?`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsTyping(true)
    setApiError(null)

    try {
      const aiResponseContent = await callGeminiAPI(currentInput)

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error generating AI response:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error procesando tu solicitud. Por favor intenta de nuevo.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Card className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-2xl overflow-hidden flex flex-col">
      {/* AI Assistant Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">Asistente IA</h3>
            <p className="text-sm text-white/80">Powered by Gemini 2.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Settings className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {apiError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">{apiError}</p>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={
                    message.sender === "ai"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }
                >
                  {message.sender === "ai" ? <Bot className="h-4 w-4" /> : "U"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-2xl p-3 ${
                  message.sender === "user" ? "bg-blue-500 text-white" : "bg-white border shadow-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border shadow-sm rounded-2xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="Pregúntame cualquier cosa..."
              className="pr-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              disabled={isTyping}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Sparkles className="h-3 w-3 mr-1" />
            Potenciado por Google Gemini 2.0 Flash
          </div>
        </div>
      </div>
    </Card>
  )
}
