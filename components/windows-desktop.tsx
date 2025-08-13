"use client"

import { useMemo } from "react"

const desktopIcons = useMemo<DesktopIcon[]>(
  () => [
    {
      id: "browser",
      name: "Navegador Web",
      icon: Globe,
      color: "bg-blue-500",
      category: "app",
      action: () => onAppLaunch("browser"),
      position: { x: 50, y: 50 },
      size: "large",
    },
    {
      id: "ai-assistant",
      name: "Asistente IA",
      icon: Bot,
      color: "bg-purple-500",
      category: "app",
      action: () => onAppLaunch("ai"),
      position: { x: 50, y: 180 },
      size: "large",
    },
    {
      id: "finance",
      name: "Finanzas",
      icon: Calculator,
      color: "bg-green-500",
      category: "app",
      action: () => onAppLaunch("finance"),
      position: { x: 50, y: 310 },
      size: "large",
    },
    {
      id: "music",
      name: "Música",
      icon: Music,
      color: "bg-pink-500",
      category: "app",
      action: () => onAppLaunch("music"),
      position: { x: 180, y: 50 },
      size: "large",
    },
    {
      id: "documents",
      name: "Documentos",
      icon: Folder,
      color: "bg-yellow-500",
      category: "folder",
      action: () => onAppLaunch("documents"),\
