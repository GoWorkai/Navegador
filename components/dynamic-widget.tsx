"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CloudSun, TrendingUp, Music, CheckSquare, X, Maximize2, Minimize2 } from "lucide-react"

interface WidgetProps {
  id: string
  type: "clock" | "weather" | "tasks" | "music" | "calendar" | "stats"
  title: string
  onClose?: (id: string) => void
  onToggleSize?: (id: string) => void
  isExpanded?: boolean
}

export function DynamicWidget({ id, type, title, onClose, onToggleSize, isExpanded = false }: WidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (type === "clock") {
      const interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [type])

  const renderWidgetContent = () => {
    switch (type) {
      case "clock":
        return (
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {currentTime.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>
        )

      case "weather":
        return (
          <div className="text-center">
            <CloudSun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold">22°C</div>
            <div className="text-sm text-gray-500">Soleado</div>
            {isExpanded && (
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Humedad:</span>
                  <span>65%</span>
                </div>
                <div className="flex justify-between">
                  <span>Viento:</span>
                  <span>12 km/h</span>
                </div>
              </div>
            )}
          </div>
        )

      case "tasks":
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tareas Pendientes</span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">3</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckSquare className="h-4 w-4 text-gray-400" />
                <span>Revisar correos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckSquare className="h-4 w-4 text-gray-400" />
                <span>Llamar al banco</span>
              </div>
              {isExpanded && (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckSquare className="h-4 w-4 text-gray-400" />
                  <span>Comprar víveres</span>
                </div>
              )}
            </div>
          </div>
        )

      case "music":
        return (
          <div className="text-center">
            <Music className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Reproduciendo</div>
            <div className="text-xs text-gray-500">Música Relajante</div>
            {isExpanded && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1:23</span>
                  <span>3:45</span>
                </div>
              </div>
            )}
          </div>
        )

      case "calendar":
        return (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Próximos Eventos</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Reunión equipo</span>
                <span className="text-gray-500">14:00</span>
              </div>
              {isExpanded && (
                <>
                  <div className="flex justify-between">
                    <span>Cita médica</span>
                    <span className="text-gray-500">16:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cena familiar</span>
                    <span className="text-gray-500">19:00</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      case "stats":
        return (
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Productividad</div>
            <div className="text-xl font-bold text-green-600">87%</div>
            {isExpanded && (
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Tareas completadas:</span>
                  <span>12/15</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo activo:</span>
                  <span>6.5h</span>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return <div>Widget no encontrado</div>
    }
  }

  return (
    <Card
      className={`bg-white border shadow-sm transition-all duration-300 ${isExpanded ? "col-span-2 row-span-2" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <div className="flex items-center space-x-1">
            {onToggleSize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleSize(id)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClose(id)}
                className="h-6 w-6 p-0 hover:bg-gray-100 text-gray-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {renderWidgetContent()}
      </div>
    </Card>
  )
}
