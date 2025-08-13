"use client"

import { useCallback, useMemo, useState } from "react"
import WebBrowser from "./WebBrowser"
import AIAssistant from "./AIAssistant"
import MediaPlayer from "./MediaPlayer"
import ThemeCustomizer from "./ThemeCustomizer"
import FinanceManager from "./FinanceManager"
import KnowledgeGraph from "./KnowledgeGraph"

const Page = () => {
  const [activeWindow, setActiveWindow] = useState("browser")
  const [showWindowsDesktop, setShowWindowsDesktop] = useState(true)
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const [selectedSearchEngine, setSelectedSearchEngine] = useState("google")

  const handleCloseWindow = useCallback(() => {
    setShowWindowsDesktop(true)
  }, [])

  const handleAppLaunch = useCallback((appName: string) => {
    switch (appName.toLowerCase()) {
      case "navegador web":
      case "browser":
        setActiveWindow("browser")
        break
      case "asistente ia":
      case "ai":
        setActiveWindow("ai")
        break
      case "música":
      case "music":
        setActiveWindow("music")
        break
      case "finanzas":
      case "finance":
        setActiveWindow("finance")
        break
      case "temas":
      case "themes":
        setActiveWindow("themes")
        break
      // Added knowledge graph app launch case
      case "conocimiento":
      case "knowledge":
        setActiveWindow("knowledge")
        break
      default:
        setActiveWindow("browser")
    }
    setShowWindowsDesktop(false)
  }, [])

  const windowTitle = useMemo(() => {
    switch (activeWindow) {
      case "browser":
        return "Navegador Web"
      case "ai":
        return "Asistente IA"
      case "music":
        return "Reproductor Multimedia"
      case "themes":
        return "Personalización de Temas"
      case "finance":
        return "Gestión Financiera"
      // Added knowledge graph window title
      case "knowledge":
        return "Grafos de Conocimiento"
      default:
        return ""
    }
  }, [activeWindow])

  return (
    <div>
      {showWindowsDesktop && <div>{/* Desktop window components here */}</div>}
      {!showWindowsDesktop && (
        <div>
          <h1>{windowTitle}</h1>
          {activeWindow === "browser" && (
            <WebBrowser
              onClose={handleCloseWindow}
              searchQuery={currentSearchQuery}
              searchEngine={selectedSearchEngine}
            />
          )}
          {activeWindow === "ai" && <AIAssistant />}
          {activeWindow === "music" && <MediaPlayer onClose={handleCloseWindow} />}
          {activeWindow === "themes" && <ThemeCustomizer onClose={handleCloseWindow} />}
          {activeWindow === "finance" && <FinanceManager onClose={handleCloseWindow} />}
          {/* Added knowledge graph component */}
          {activeWindow === "knowledge" && <KnowledgeGraph onClose={handleCloseWindow} />}
        </div>
      )}
    </div>
  )
}

export default Page
