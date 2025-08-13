"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: Date
  time: string
  duration: number
  location?: string
  attendees?: string[]
  type: "meeting" | "personal" | "reminder" | "task"
  color: string
}

export function CalendarWindow() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const events: Event[] = [
    {
      id: "1",
      title: "Reunión de equipo",
      date: new Date(2024, 0, 15),
      time: "10:00",
      duration: 60,
      location: "Sala de conferencias",
      attendees: ["Ana", "Carlos", "María"],
      type: "meeting",
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Cita médica",
      date: new Date(2024, 0, 16),
      time: "15:30",
      duration: 30,
      location: "Hospital Central",
      type: "personal",
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Presentación del proyecto",
      date: new Date(2024, 0, 18),
      time: "14:00",
      duration: 90,
      type: "meeting",
      color: "bg-purple-500",
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const aiSuggestions = [
    "Programar reunión de seguimiento para mañana",
    "Recordatorio: Revisar presentación 1 hora antes",
    "Sugerir horario óptimo para nueva reunión",
    "Bloquear tiempo para trabajo concentrado",
  ]

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Calendario Inteligente</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg border">
              {["month", "week", "day"].map((viewType) => (
                <Button
                  key={viewType}
                  variant={view === viewType ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView(viewType as any)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {viewType === "month" ? "Mes" : viewType === "week" ? "Semana" : "Día"}
                </Button>
              ))}
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Evento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendario principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 border-b">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center font-medium text-gray-600 dark:text-gray-400 border-r last:border-r-0"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grilla del calendario */}
                <div className="grid grid-cols-7">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayEvents = getEventsForDate(day.date)
                    const isToday = day.date.toDateString() === new Date().toDateString()
                    const isSelected = day.date.toDateString() === selectedDate.toDateString()

                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day.date)}
                        className={`min-h-[100px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          !day.isCurrentMonth ? "bg-gray-100 dark:bg-gray-800 text-gray-400" : ""
                        } ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      >
                        <div
                          className={`text-sm font-medium mb-1 ${
                            isToday
                              ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              : ""
                          }`}
                        >
                          {day.date.getDate()}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div key={event.id} className={`text-xs p-1 rounded text-white truncate ${event.color}`}>
                              {event.time} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayEvents.length - 2} más</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Eventos del día seleccionado */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <div className={`w-3 h-3 rounded-full ${event.color}`} />
                        </div>

                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time} ({event.duration} min)
                          </div>

                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          )}

                          {event.attendees && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {event.attendees.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay eventos programados</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sugerencias de IA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Asistente IA
                </CardTitle>
                <CardDescription>Sugerencias inteligentes para tu calendario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    >
                      <div className="text-xs">{suggestion}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Evento
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Agenda Semanal
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Clock className="w-4 h-4 mr-2" />
                    Encontrar Tiempo Libre
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
