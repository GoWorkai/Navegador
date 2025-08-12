"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, Mic, X, Settings, Sparkles, Brain } from "lucide-react"

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
        "¡Hola! Soy tu asistente IA personal. Puedo ayudarte con navegación web, búsquedas, gestión de tareas, finanzas del hogar y mucho más. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response (aquí se integrará con Gemini)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("buscar") || input.includes("google")) {
      return `Puedo ayudarte a buscar información. ¿Qué te gustaría buscar? También puedo abrir el navegador web para ti.`
    }

    if (input.includes("tarea") || input.includes("recordatorio")) {
      return `Perfecto, puedo ayudarte con la gestión de tareas. ¿Qué tarea te gustaría agregar o qué recordatorio necesitas?`
    }

    if (input.includes("finanzas") || input.includes("dinero") || input.includes("gasto")) {
      return `Te puedo ayudar con la gestión de finanzas del hogar. ¿Quieres revisar gastos, crear un presupuesto o registrar una transacción?`
    }

    if (input.includes("música") || input.includes("canción")) {
      return `¡Genial! Puedo ayudarte con entretenimiento y música. ¿Qué tipo de música te gusta o qué canción buscas?`
    }

    return `Entiendo tu consulta sobre "${userInput}". Como tu asistente IA personal, puedo ayudarte con navegación web, búsquedas, tareas, finanzas, entretenimiento y más. ¿Podrías ser más específico sobre lo que necesitas?`
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
            <p className="text-sm text-white/80">Powered by Gemini</p>
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
                <p className="text-sm">{message.content}</p>
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
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Pregúntame cualquier cosa..."
              className="pr-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Sparkles className="h-3 w-3 mr-1" />
            Potenciado por Google Gemini
          </div>
        </div>
      </div>
    </Card>
  )
}
