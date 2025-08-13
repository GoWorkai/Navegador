"use client"

import type React from "react"

import { useState } from "react"
import { ProfileProvider } from "@/components/profile-provider"
import { WindowsDesktop } from "@/components/windows-desktop"

import { BrowserWindow } from "@/components/windows/browser-window"
import { FinanceWindow } from "@/components/windows/finance-window"
import { SearchWindow } from "@/components/windows/search-window"
import { SettingsWindow } from "@/components/windows/settings-window"
import { NotesWindow } from "@/components/windows/notes-window"
import { CalendarWindow } from "@/components/windows/calendar-window"
import { CalculatorWindow } from "@/components/windows/calculator-window"
import { MusicWindow } from "@/components/windows/music-window"
import { PhotosWindow } from "@/components/windows/photos-window"
import { FilesWindow } from "@/components/windows/files-window"
import { SmartHomeWindow } from "@/components/windows/smarthome-window"

interface OpenWindow {
  id: string
  appId: string
  title: string
  component: React.ComponentType<any>
  isMinimized: boolean
  zIndex: number
}

const Page = () => {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])
  const [nextZIndex, setNextZIndex] = useState(1000)

  const appComponents: Record<string, { title: string; component: React.ComponentType<any> }> = {
    browser: { title: "Navegador Web", component: BrowserWindow },
    finance: { title: "Gestión Financiera", component: FinanceWindow },
    search: { title: "Búsqueda Inteligente", component: SearchWindow },
    settings: { title: "Configuración", component: SettingsWindow },
    notes: { title: "Notas", component: NotesWindow },
    calendar: { title: "Calendario", component: CalendarWindow },
    calculator: { title: "Calculadora", component: CalculatorWindow },
    music: { title: "Música", component: MusicWindow },
    photos: { title: "Galería", component: PhotosWindow },
    documents: { title: "Archivos", component: FilesWindow },
    smarthome: { title: "Casa Inteligente", component: SmartHomeWindow },
  }

  const handleAppLaunch = (appId: string) => {
    const app = appComponents[appId]
    if (!app) return

    // Verificar si la ventana ya está abierta
    const existingWindow = openWindows.find((w) => w.appId === appId)
    if (existingWindow) {
      // Traer ventana al frente
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w)),
      )
      setNextZIndex((prev) => prev + 1)
      return
    }

    // Crear nueva ventana
    const newWindow: OpenWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: app.title,
      component: app.component,
      isMinimized: false,
      zIndex: nextZIndex,
    }

    setOpenWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const handleWindowClose = (windowId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== windowId))
  }

  const handleWindowMinimize = (windowId: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w)))
  }

  const handleWindowFocus = (windowId: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  return (
    <ProfileProvider>
      <div className="h-screen w-full overflow-hidden">
        <WindowsDesktop onAppLaunch={handleAppLaunch} />

        {openWindows.map((window) => {
          const WindowComponent = window.component
          return (
            <div
              key={window.id}
              className={`fixed inset-4 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 ${
                window.isMinimized ? "hidden" : "block"
              }`}
              style={{ zIndex: window.zIndex }}
              onClick={() => handleWindowFocus(window.id)}
            >
              {/* Barra de título de la ventana */}
              <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">{window.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleWindowMinimize(window.id)
                    }}
                    className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleWindowClose(window.id)
                    }}
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  />
                </div>
              </div>

              {/* Contenido de la ventana */}
              <div className="h-[calc(100%-60px)] overflow-auto">
                <WindowComponent />
              </div>
            </div>
          )
        })}
      </div>
    </ProfileProvider>
  )
}

export default Page
