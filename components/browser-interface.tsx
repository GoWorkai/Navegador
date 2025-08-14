"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, RotateCcw, Home, Plus, X, Star, Menu, Settings } from "lucide-react"

interface Tab {
  id: string
  title: string
  url: string
  isActive: boolean
}

export default function BrowserInterface() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "1", title: "Nueva pestaña", url: "about:blank", isActive: true }])
  const [currentUrl, setCurrentUrl] = useState("")
  const [showBookmarks, setShowBookmarks] = useState(false)

  const activeTab = tabs.find((tab) => tab.isActive)

  const createNewTab = () => {
    const newTabId = Date.now().toString()
    const newTab: Tab = {
      id: newTabId,
      title: "Nueva pestaña",
      url: "about:blank",
      isActive: true,
    }

    setTabs((prevTabs) => prevTabs.map((tab) => ({ ...tab, isActive: false })).concat(newTab))
    setCurrentUrl("")
  }

  const closeTab = (tabId: string) => {
    setTabs((prevTabs) => {
      const filteredTabs = prevTabs.filter((tab) => tab.id !== tabId)

      // Ensure at least one tab remains
      if (filteredTabs.length === 0) {
        return [
          {
            id: Date.now().toString(),
            title: "Nueva pestaña",
            url: "about:blank",
            isActive: true,
          },
        ]
      }

      // If we closed the active tab, activate the last tab
      const closedTabWasActive = prevTabs.find((tab) => tab.id === tabId)?.isActive
      if (closedTabWasActive) {
        const lastTab = filteredTabs[filteredTabs.length - 1]
        return filteredTabs.map((tab) => (tab.id === lastTab.id ? { ...tab, isActive: true } : tab))
      }

      return filteredTabs
    })
  }

  const switchToTab = (tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      })),
    )

    // Update current URL to match the active tab
    const selectedTab = tabs.find((tab) => tab.id === tabId)
    if (selectedTab) {
      setCurrentUrl(selectedTab.url === "about:blank" ? "" : selectedTab.url)
    }
  }

  const updateActiveTabUrl = (newUrl: string) => {
    if (activeTab) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.isActive
            ? {
                ...tab,
                url: newUrl || "about:blank",
                title: newUrl ? getPageTitle(newUrl) : "Nueva pestaña",
              }
            : tab,
        ),
      )
    }
  }

  const getPageTitle = (url: string): string => {
    if (!url || url === "about:blank") return "Nueva pestaña"
    try {
      const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname
      return domain.replace("www.", "")
    } catch {
      return url.slice(0, 20) + (url.length > 20 ? "..." : "")
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUrl.trim()) {
      updateActiveTabUrl(currentUrl.trim())
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Browser Header */}
      <header className="flex flex-col border-b border-border bg-card">
        {/* Top Bar with Navigation Controls */}
        <div className="flex items-center gap-2 p-2">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Home className="h-4 w-4" />
            </Button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 mx-4">
            <form onSubmit={handleUrlSubmit} className="relative">
              <Input
                type="text"
                placeholder="Buscar en Google o escribir URL"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full bg-input border-border focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0">
                <Star className="h-3 w-3" />
              </Button>
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowBookmarks(!showBookmarks)}>
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center bg-muted/30">
          <div className="flex items-center flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`
                  flex items-center gap-2 px-4 py-2 min-w-[200px] max-w-[250px] 
                  border-r border-border cursor-pointer group relative
                  ${tab.isActive ? "bg-background border-b-2 border-b-accent" : "bg-muted/50 hover:bg-muted"}
                `}
                onClick={() => switchToTab(tab.id)}
              >
                <div className="flex-1 truncate">
                  <span className="text-sm font-medium truncate">{tab.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 mx-2 hover:bg-accent hover:text-accent-foreground"
            onClick={createNewTab}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Bookmarks Bar */}
        {showBookmarks && (
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 border-t border-border">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap">
                Google
              </Button>
              <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap">
                YouTube
              </Button>
              <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap">
                GitHub
              </Button>
              <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap">
                Stack Overflow
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex">
        {/* Content Display Area */}
        <div className="flex-1 bg-background">
          <Card className="h-full m-4 flex items-center justify-center border-dashed border-2 border-muted-foreground/20">
            <div className="text-center space-y-4">
              <div className="text-6xl font-heading font-bold text-muted-foreground/40">Navegador Web</div>
              <p className="text-muted-foreground max-w-md">
                {activeTab?.url && activeTab.url !== "about:blank"
                  ? `Navegando: ${activeTab.title}`
                  : "Interfaz de navegador web moderna desarrollada con Next.js. Escribe una URL en la barra de direcciones para comenzar."}
              </p>
              <div className="text-sm text-muted-foreground/60">
                Pestaña activa: {activeTab?.id} | Total de pestañas: {tabs.length}
              </div>
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button variant="outline" size="sm" onClick={createNewTab}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Pestaña
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Marcadores
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
