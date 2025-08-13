"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckSquare, Plus, X, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: "personal" | "work" | "health" | "learning" | "other"
  dueDate?: Date
  createdAt: Date
  tags: string[]
}

interface Event {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  category: "meeting" | "personal" | "work" | "health" | "other"
  reminder?: number // minutes before
  location?: string
}

interface CalendarTasksProps {
  expanded: boolean
}

const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Revisar propuesta de proyecto",
    description: "Analizar la propuesta del cliente y preparar feedback",
    completed: false,
    priority: "high",
    category: "work",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    createdAt: new Date(Date.now() - 3600000),
    tags: ["urgente", "cliente"],
  },
  {
    id: "2",
    title: "Ejercicio matutino",
    completed: true,
    priority: "medium",
    category: "health",
    createdAt: new Date(Date.now() - 7200000),
    tags: ["rutina", "salud"],
  },
  {
    id: "3",
    title: "Estudiar React avanzado",
    description: "Completar el curso de React hooks y context",
    completed: false,
    priority: "medium",
    category: "learning",
    dueDate: new Date(Date.now() + 259200000), // 3 days
    createdAt: new Date(Date.now() - 86400000),
    tags: ["desarrollo", "curso"],
  },
]

const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Reunión de equipo",
    description: "Revisión semanal del progreso del proyecto",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    category: "meeting",
    reminder: 15,
    location: "Sala de conferencias",
  },
  {
    id: "2",
    title: "Cita médica",
    date: new Date(Date.now() + 86400000),
    startTime: "15:30",
    endTime: "16:30",
    category: "health",
    reminder: 30,
    location: "Clínica Central",
  },
]

export function CalendarTasks({ expanded }: CalendarTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS)
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskCategory, setNewTaskCategory] = useState<"personal" | "work" | "health" | "learning" | "other">(
    "personal",
  )
  const [showAddTask, setShowAddTask] = useState(false)

  const today = new Date()
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false
    return task.dueDate.toDateString() === today.toDateString()
  })

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false
    return task.dueDate < today
  })

  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.dueDate || task.completed) return false
      return task.dueDate > today
    })
    .slice(0, 3)

  const todayEvents = events.filter((event) => event.date.toDateString() === today.toDateString())

  const completedTasksCount = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
      createdAt: new Date(),
      tags: [],
    }

    setTasks((prev) => [...prev, task])
    setNewTaskTitle("")
    setShowAddTask(false)
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "work":
        return "💼"
      case "personal":
        return "🏠"
      case "health":
        return "🏥"
      case "learning":
        return "📚"
      default:
        return "📝"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
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

  if (!expanded) {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-center text-gray-800 hover:bg-white/20 dynamic-radius-sm relative"
        >
          <Calendar className="w-5 h-5" />
          {(todayTasks.length > 0 || overdueTasks.length > 0) && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              {todayTasks.length + overdueTasks.length}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Calendario & Tareas</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowAddTask(!showAddTask)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/20">
          <TabsTrigger value="today" className="text-xs">
            Hoy
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            Tareas
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs">
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-3 mt-4">
          {/* Progress Overview */}
          <Card className="bg-white/20 border-white/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800">Progreso del día</span>
              <span className="text-sm text-gray-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </Card>

          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Eventos de hoy
              </h4>
              {todayEvents.map((event) => (
                <Card key={event.id} className="bg-white/20 border-white/30 p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-800">{event.title}</span>
                      <div className="text-xs text-gray-600">
                        {event.startTime} - {event.endTime}
                        {event.location && ` • ${event.location}`}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryIcon(event.category)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Tareas vencidas ({overdueTasks.length})
              </h4>
              {overdueTasks.map((task) => (
                <Card key={task.id} className="bg-red-50/50 border-red-200 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => toggleTask(task.id)}>
                        <CheckSquare className="h-3 w-3" />
                      </Button>
                      <div>
                        <span className="text-sm text-gray-800">{task.title}</span>
                        <div className="text-xs text-red-600">Vencida: {task.dueDate && formatTime(task.dueDate)}</div>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Today's Tasks */}
          {todayTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800">Tareas de hoy</h4>
              {todayTasks.map((task) => (
                <Card key={task.id} className="bg-white/20 border-white/30 p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => toggleTask(task.id)}>
                        <CheckSquare className={`h-3 w-3 ${task.completed ? "text-green-500" : ""}`} />
                      </Button>
                      <span className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getCategoryIcon(task.category)}</span>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Upcoming Tasks Preview */}
          {upcomingTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800">Próximas tareas</h4>
              {upcomingTasks.map((task) => (
                <Card key={task.id} className="bg-white/10 border-white/20 p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-800">{task.title}</span>
                      <div className="text-xs text-gray-600">{task.dueDate && formatTime(task.dueDate)}</div>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3 mt-4">
          {/* Add Task Form */}
          {showAddTask && (
            <Card className="bg-white/20 border-white/30 p-3 space-y-3">
              <Input
                placeholder="Nueva tarea..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-white/20 border-white/30 text-gray-800 placeholder-gray-500"
              />
              <div className="flex space-x-2">
                <Select
                  value={newTaskPriority}
                  onValueChange={(value: "low" | "medium" | "high") => setNewTaskPriority(value)}
                >
                  <SelectTrigger className="bg-white/20 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newTaskCategory}
                  onValueChange={(value: "personal" | "work" | "health" | "learning" | "other") =>
                    setNewTaskCategory(value)
                  }
                >
                  <SelectTrigger className="bg-white/20 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Trabajo</SelectItem>
                    <SelectItem value="health">Salud</SelectItem>
                    <SelectItem value="learning">Aprendizaje</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addTask} size="sm" className="bg-red-500 hover:bg-red-600">
                  Agregar
                </Button>
                <Button onClick={() => setShowAddTask(false)} variant="outline" size="sm">
                  Cancelar
                </Button>
              </div>
            </Card>
          )}

          {/* Tasks List */}
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-white/20 border-white/30 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 mt-0.5"
                        onClick={() => toggleTask(task.id)}
                      >
                        <CheckSquare className={`h-3 w-3 ${task.completed ? "text-green-500" : ""}`} />
                      </Button>
                      <div className="flex-1">
                        <span
                          className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                        >
                          {task.title}
                        </span>
                        {task.description && <p className="text-xs text-gray-600 mt-1">{task.description}</p>}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(task.category)} {task.category}
                          </Badge>
                          {task.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              {formatTime(task.dueDate)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => deleteTask(task.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-3 mt-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-800">
              {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Mini Calendar */}
          <div className="grid grid-cols-7 gap-1 text-xs">
            {["D", "L", "M", "X", "J", "V", "S"].map((day) => (
              <div key={day} className="text-center text-gray-600 font-medium p-1">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
              <div key={`empty-${i}`} className="p-1" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
              const day = i + 1
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              const isToday = date.toDateString() === today.toDateString()
              const hasEvents = events.some((event) => event.date.toDateString() === date.toDateString())
              const hasTasks = tasks.some((task) => task.dueDate?.toDateString() === date.toDateString())

              return (
                <Button
                  key={day}
                  variant="ghost"
                  className={`h-8 w-8 p-0 text-xs relative ${
                    isToday ? "bg-red-500 text-white hover:bg-red-600" : "text-gray-800 hover:bg-white/20"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {day}
                  {(hasEvents || hasTasks) && (
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-blue-400 rounded-full" />
                  )}
                </Button>
              )
            })}
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h4>

              {events.filter((event) => event.date.toDateString() === selectedDate.toDateString()).length === 0 &&
                tasks.filter((task) => task.dueDate?.toDateString() === selectedDate.toDateString()).length === 0 && (
                  <p className="text-xs text-gray-500">No hay eventos o tareas para este día</p>
                )}

              {events
                .filter((event) => event.date.toDateString() === selectedDate.toDateString())
                .map((event) => (
                  <Card key={event.id} className="bg-blue-50/50 border-blue-200 p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{event.title}</span>
                        <div className="text-xs text-gray-600">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Evento
                      </Badge>
                    </div>
                  </Card>
                ))}

              {tasks
                .filter((task) => task.dueDate?.toDateString() === selectedDate.toDateString())
                .map((task) => (
                  <Card key={task.id} className="bg-yellow-50/50 border-yellow-200 p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800">{task.title}</span>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
