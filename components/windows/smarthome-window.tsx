"use client"

import type React from "react"
import { useState } from "react"
import {
  Lightbulb,
  Thermometer,
  Shield,
  Camera,
  Wifi,
  WifiOff,
  Battery,
  Power,
  Settings,
  Plus,
  Home,
  Bed,
  ChefHat,
  Bath,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface SmartDevice {
  id: string
  name: string
  type: "light" | "thermostat" | "security" | "camera" | "sensor"
  room: string
  isOnline: boolean
  isActive: boolean
  value?: number
  unit?: string
  battery?: number
  icon: React.ComponentType<any>
}

export function SmartHomeWindow() {
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [devices, setDevices] = useState<SmartDevice[]>([
    {
      id: "1",
      name: "Luz Principal",
      type: "light",
      room: "Sala",
      isOnline: true,
      isActive: true,
      value: 75,
      unit: "%",
      icon: Lightbulb,
    },
    {
      id: "2",
      name: "Termostato",
      type: "thermostat",
      room: "Sala",
      isOnline: true,
      isActive: true,
      value: 22,
      unit: "°C",
      icon: Thermometer,
    },
    {
      id: "3",
      name: "Cámara Entrada",
      type: "camera",
      room: "Entrada",
      isOnline: true,
      isActive: true,
      icon: Camera,
    },
    {
      id: "4",
      name: "Sensor Movimiento",
      type: "sensor",
      room: "Cocina",
      isOnline: true,
      isActive: false,
      battery: 85,
      icon: Shield,
    },
    {
      id: "5",
      name: "Luz Dormitorio",
      type: "light",
      room: "Dormitorio",
      isOnline: true,
      isActive: false,
      value: 0,
      unit: "%",
      icon: Lightbulb,
    },
    {
      id: "6",
      name: "Sensor Humedad",
      type: "sensor",
      room: "Baño",
      isOnline: true,
      isActive: true,
      value: 65,
      unit: "%",
      battery: 92,
      icon: Shield,
    },
  ])

  const rooms = ["all", "Sala", "Dormitorio", "Cocina", "Baño", "Entrada"]

  const getRoomIcon = (room: string) => {
    switch (room) {
      case "Sala":
        return Home
      case "Dormitorio":
        return Bed
      case "Cocina":
        return ChefHat
      case "Baño":
        return Bath
      default:
        return Home
    }
  }

  const filteredDevices = selectedRoom === "all" ? devices : devices.filter((device) => device.room === selectedRoom)

  const toggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, isActive: !device.isActive } : device)),
    )
  }

  const updateDeviceValue = (deviceId: string, newValue: number) => {
    setDevices((prev) => prev.map((device) => (device.id === deviceId ? { ...device, value: newValue } : device)))
  }

  const getDeviceStatusColor = (device: SmartDevice) => {
    if (!device.isOnline) return "text-red-500"
    if (device.isActive) return "text-green-500"
    return "text-gray-400"
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Casa Inteligente</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Dispositivo
            </Button>
          </div>
        </div>

        {/* Filtros por habitación */}
        <div className="flex space-x-2 overflow-x-auto">
          {rooms.map((room) => {
            const RoomIcon = getRoomIcon(room)
            return (
              <Button
                key={room}
                variant={selectedRoom === room ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRoom(room)}
                className="flex-shrink-0"
              >
                <RoomIcon className="w-4 h-4 mr-2" />
                {room === "all" ? "Todas" : room}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Resumen */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dispositivos Activos</p>
                <p className="text-2xl font-bold text-green-500">{devices.filter((d) => d.isActive).length}</p>
              </div>
              <Power className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En Línea</p>
                <p className="text-2xl font-bold text-blue-500">{devices.filter((d) => d.isOnline).length}</p>
              </div>
              <Wifi className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Temperatura</p>
                <p className="text-2xl font-bold">{devices.find((d) => d.type === "thermostat")?.value || 0}°C</p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Seguridad</p>
                <p className="text-2xl font-bold text-green-500">Activa</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de dispositivos */}
      <div className="p-4 space-y-4 overflow-auto">
        {filteredDevices.map((device) => {
          const DeviceIcon = device.icon
          return (
            <Card key={device.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${device.isActive ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}
                    >
                      <DeviceIcon className={`w-5 h-5 ${getDeviceStatusColor(device)}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{device.room}</Badge>
                        <div className="flex items-center space-x-1">
                          {device.isOnline ? (
                            <Wifi className="w-3 h-3 text-green-500" />
                          ) : (
                            <WifiOff className="w-3 h-3 text-red-500" />
                          )}
                          <span className="text-xs text-gray-500">{device.isOnline ? "En línea" : "Desconectado"}</span>
                        </div>
                        {device.battery && (
                          <div className="flex items-center space-x-1">
                            <Battery className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{device.battery}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={device.isActive}
                    onCheckedChange={() => toggleDevice(device.id)}
                    disabled={!device.isOnline}
                  />
                </div>
              </CardHeader>

              {device.isActive && device.value !== undefined && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {device.type === "light"
                          ? "Intensidad"
                          : device.type === "thermostat"
                            ? "Temperatura"
                            : "Valor"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {device.value}
                        {device.unit}
                      </span>
                    </div>

                    <Slider
                      value={[device.value]}
                      onValueChange={(value) => updateDeviceValue(device.id, value[0])}
                      max={device.type === "thermostat" ? 30 : 100}
                      min={device.type === "thermostat" ? 10 : 0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
