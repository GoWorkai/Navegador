"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Phone, Video, Settings, Search, Plus, X, Send, Smile, Paperclip } from "lucide-react"

interface MessagingService {
  id: string
  name: string
  icon: string
  color: string
  connected: boolean
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: Date
}

interface Contact {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away" | "busy"
  service: string
  lastSeen?: Date
  unreadCount: number
}

interface Message {
  id: string
  contactId: string
  content: string
  timestamp: Date
  sent: boolean
  type: "text" | "image" | "file" | "voice"
  status: "sent" | "delivered" | "read"
}

interface MessagingHubProps {
  expanded: boolean
}

const MESSAGING_SERVICES: MessagingService[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "📱",
    color: "bg-green-500",
    connected: true,
    unreadCount: 3,
    lastMessage: "Hola, ¿cómo estás?",
    lastMessageTime: new Date(Date.now() - 300000), // 5 min ago
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈️",
    color: "bg-blue-500",
    connected: true,
    unreadCount: 1,
    lastMessage: "Archivo enviado",
    lastMessageTime: new Date(Date.now() - 900000), // 15 min ago
  },
  {
    id: "discord",
    name: "Discord",
    icon: "💬",
    color: "bg-indigo-500",
    connected: true,
    unreadCount: 7,
    lastMessage: "@everyone nueva actualización",
    lastMessageTime: new Date(Date.now() - 1800000), // 30 min ago
  },
  {
    id: "messenger",
    name: "Messenger",
    icon: "💙",
    color: "bg-blue-600",
    connected: false,
    unreadCount: 0,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "bg-pink-500",
    connected: true,
    unreadCount: 2,
    lastMessage: "Te etiquetó en una historia",
    lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
  },
]

const SAMPLE_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "María García",
    avatar: "/diverse-woman-portrait.png",
    status: "online",
    service: "whatsapp",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Juan Pérez",
    avatar: "/thoughtful-man.png",
    status: "away",
    service: "telegram",
    unreadCount: 1,
  },
  {
    id: "3",
    name: "Equipo Desarrollo",
    avatar: "/diverse-professional-team.png",
    status: "online",
    service: "discord",
    unreadCount: 5,
  },
  {
    id: "4",
    name: "Ana López",
    avatar: "/woman-2.png",
    status: "offline",
    service: "instagram",
    unreadCount: 2,
    lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
  },
]

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    contactId: "1",
    content: "¡Hola! ¿Cómo va todo?",
    timestamp: new Date(Date.now() - 600000),
    sent: false,
    type: "text",
    status: "read",
  },
  {
    id: "2",
    contactId: "1",
    content: "Todo bien, trabajando en el proyecto",
    timestamp: new Date(Date.now() - 300000),
    sent: true,
    type: "text",
    status: "delivered",
  },
  {
    id: "3",
    contactId: "1",
    content: "¿Nos vemos mañana para revisar los avances?",
    timestamp: new Date(Date.now() - 60000),
    sent: false,
    type: "text",
    status: "sent",
  },
]

export function MessagingHub({ expanded }: MessagingHubProps) {
  const [services, setServices] = useState<MessagingService[]>(MESSAGING_SERVICES)
  const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS)
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [activeService, setActiveService] = useState<string>("whatsapp")
  const [activeContact, setActiveContact] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const totalUnread = services.reduce((sum, service) => sum + service.unreadCount, 0)

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeService === "all" || contact.service === activeService),
  )

  const activeContactData = contacts.find((c) => c.id === activeContact)
  const contactMessages = messages.filter((m) => m.contactId === activeContact)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return

    const message: Message = {
      id: Date.now().toString(),
      contactId: activeContact,
      content: newMessage,
      timestamp: new Date(),
      sent: true,
      type: "text",
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "away":
        return "bg-yellow-400"
      case "busy":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return "ahora"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return date.toLocaleDateString()
  }

  const connectService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((service) => (service.id === serviceId ? { ...service, connected: !service.connected } : service)),
    )
  }

  if (!expanded) {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-center text-gray-800 hover:bg-white/20 dynamic-radius-sm relative"
        >
          <MessageCircle className="w-5 h-5" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Mensajería</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeContact ? "chat" : "services"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/20">
          <TabsTrigger value="services" onClick={() => setActiveContact(null)} className="text-xs">
            Servicios
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-xs" disabled={!activeContact}>
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-3 mt-4">
          {/* Services Grid */}
          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => (
              <Button
                key={service.id}
                variant="ghost"
                className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                  service.connected ? "bg-white/20" : "bg-gray-100/20"
                } hover:bg-white/30 dynamic-radius-sm relative`}
                onClick={() => {
                  if (service.connected) {
                    setActiveService(service.id)
                  } else {
                    connectService(service.id)
                  }
                }}
              >
                <span className="text-lg">{service.icon}</span>
                <span className="text-xs font-medium text-gray-800">{service.name}</span>
                {service.unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    {service.unreadCount}
                  </Badge>
                )}
                {!service.connected && (
                  <div className="absolute inset-0 bg-gray-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">Conectar</span>
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contactos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Contacts List */}
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant="ghost"
                  className="w-full p-3 h-auto justify-start hover:bg-white/20 dynamic-radius-sm"
                  onClick={() => setActiveContact(contact.id)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 text-sm">{contact.name}</span>
                        {contact.unreadCount > 0 && (
                          <Badge className="h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">{services.find((s) => s.id === contact.service)?.icon}</span>
                        <span className="text-xs text-gray-600 capitalize">{contact.status}</span>
                        {contact.lastSeen && contact.status === "offline" && (
                          <span className="text-xs text-gray-500">• {formatTime(contact.lastSeen)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chat" className="mt-4">
          {activeContactData && (
            <div className="space-y-4">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={() => setActiveContact(null)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activeContactData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{activeContactData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${getStatusColor(activeContactData.status)}`}
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 text-sm">{activeContactData.name}</span>
                    <div className="text-xs text-gray-600 capitalize">{activeContactData.status}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-48">
                <div className="space-y-3 p-2">
                  {contactMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          message.sent ? "bg-red-500 text-white" : "bg-white/30 text-gray-800"
                        }`}
                      >
                        <div>{message.content}</div>
                        <div className={`text-xs mt-1 ${message.sent ? "text-red-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-white/20 border-white/30 text-gray-800 placeholder-gray-500 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
