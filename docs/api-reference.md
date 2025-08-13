# API Reference - ARIA Navigator

## 📚 Introducción

Esta documentación describe las APIs internas de ARIA Navigator disponibles para extensiones y desarrollo avanzado.

## 🌐 Core APIs

### ARIA Global Object
\`\`\`typescript
interface ARIAGlobal {
  version: string
  debug: DebugAPI
  browser: BrowserAPI
  ai: AIAPI
  flow: FlowAPI
  themes: ThemesAPI
  messaging: MessagingAPI
  calendar: CalendarAPI
  vpn: VPNAPI
  adBlocker: AdBlockerAPI
  extensions: ExtensionsAPI
}
\`\`\`

### Browser API
\`\`\`typescript
interface BrowserAPI {
  // Tab Management
  tabs: {
    create(url?: string): Promise<Tab>
    close(tabId: string): Promise<void>
    update(tabId: string, properties: TabProperties): Promise<Tab>
    query(queryInfo: TabQueryInfo): Promise<Tab[]>
    onCreated: Event<Tab>
    onRemoved: Event<string>
    onUpdated: Event<{tabId: string, changeInfo: any, tab: Tab}>
  }
  
  // Workspace Management
  workspaces: {
    create(name: string): Promise<Workspace>
    delete(workspaceId: string): Promise<void>
    list(): Promise<Workspace[]>
    moveTab(tabId: string, workspaceId: string): Promise<void>
    getCurrent(): Promise<Workspace>
    switch(workspaceId: string): Promise<void>
  }
  
  // History
  history: {
    search(query: HistoryQuery): Promise<HistoryItem[]>
    deleteUrl(url: string): Promise<void>
    deleteRange(startTime: number, endTime: number): Promise<void>
    onVisited: Event<HistoryItem>
  }
  
  // Bookmarks
  bookmarks: {
    create(bookmark: BookmarkCreateInfo): Promise<Bookmark>
    remove(id: string): Promise<void>
    search(query: string): Promise<Bookmark[]>
    getTree(): Promise<BookmarkTreeNode[]>
  }
}
\`\`\`

### AI API
\`\`\`typescript
interface AIAPI {
  // Chat Interface
  chat: {
    send(message: string, context?: ChatContext): Promise<ChatResponse>
    getHistory(): Promise<ChatMessage[]>
    clearHistory(): Promise<void>
    setSystemPrompt(prompt: string): Promise<void>
  }
  
  // Content Analysis
  analyze: {
    page(url?: string): Promise<PageAnalysis>
    text(text: string): Promise<TextAnalysis>
    image(imageData: string): Promise<ImageAnalysis>
    translate(text: string, targetLang: string): Promise<Translation>
  }
  
  // Suggestions
  suggestions: {
    organizeWorkspaces(): Promise<WorkspaceSuggestion[]>
    optimizeSettings(): Promise<SettingSuggestion[]>
    contentRecommendations(): Promise<ContentRecommendation[]>
  }
}
\`\`\`

### Flow API
\`\`\`typescript
interface FlowAPI {
  // Device Management
  devices: {
    pair(qrData: string): Promise<Device>
    unpair(deviceId: string): Promise<void>
    list(): Promise<Device[]>
    getCurrent(): Promise<Device>
  }
  
  // Content Sync
  sync: {
    send(content: FlowContent, deviceId: string): Promise<void>
    receive(): Promise<FlowContent[]>
    getHistory(): Promise<FlowHistoryItem[]>
    clearHistory(): Promise<void>
  }
  
  // Events
  events: {
    onDevicePaired: Event<Device>
    onDeviceUnpaired: Event<string>
    onContentReceived: Event<FlowContent>
    onSyncError: Event<Error>
  }
}
\`\`\`

### Themes API
\`\`\`typescript
interface ThemesAPI {
  // Theme Management
  themes: {
    apply(themeId: string): Promise<void>
    create(theme: ThemeDefinition): Promise<Theme>
    delete(themeId: string): Promise<void>
    list(): Promise<Theme[]>
    getCurrent(): Promise<Theme>
    export(themeId: string): Promise<string>
    import(themeData: string): Promise<Theme>
  }
  
  // Customization
  customize: {
    setColors(colors: ColorScheme): Promise<void>
    setBackground(background: BackgroundConfig): Promise<void>
    setEffects(effects: EffectConfig): Promise<void>
    resetToDefault(): Promise<void>
  }
  
  // Events
  events: {
    onThemeChanged: Event<Theme>
    onCustomizationChanged: Event<CustomizationChange>
  }
}
\`\`\`

## 🔧 Extension APIs

### Extension Manifest
\`\`\`json
{
  "manifest_version": 3,
  "name": "Mi Extensión ARIA",
  "version": "1.0.0",
  "description": "Descripción de la extensión",
  "permissions": [
    "tabs",
    "storage",
    "activeTab"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Mi Extensión"
  }
}
\`\`\`

### Extension Runtime
\`\`\`typescript
// Background Script
aria.runtime.onInstalled.addListener(() => {
  console.log('Extensión instalada')
})

// Content Script
aria.tabs.query({active: true, currentWindow: true}, (tabs) => {
  const activeTab = tabs[0]
  // Trabajar con la pestaña activa
})

// Popup Script
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar popup
})
\`\`\`

### Storage API
\`\`\`typescript
interface StorageAPI {
  local: {
    get(keys?: string | string[]): Promise<{[key: string]: any}>
    set(items: {[key: string]: any}): Promise<void>
    remove(keys: string | string[]): Promise<void>
    clear(): Promise<void>
  }
  
  sync: {
    get(keys?: string | string[]): Promise<{[key: string]: any}>
    set(items: {[key: string]: any}): Promise<void>
    remove(keys: string | string[]): Promise<void>
    clear(): Promise<void>
  }
}
\`\`\`

## 🔒 Security APIs

### VPN API
\`\`\`typescript
interface VPNAPI {
  // Connection Management
  connection: {
    connect(serverId: string): Promise<void>
    disconnect(): Promise<void>
    getStatus(): Promise<VPNStatus>
    getServers(): Promise<VPNServer[]>
  }
  
  // Configuration
  config: {
    setKillSwitch(enabled: boolean): Promise<void>
    setAutoConnect(enabled: boolean): Promise<void>
    setProtocol(protocol: VPNProtocol): Promise<void>
    getSplitTunneling(): Promise<string[]>
    setSplitTunneling(apps: string[]): Promise<void>
  }
  
  // Events
  events: {
    onStatusChanged: Event<VPNStatus>
    onServerChanged: Event<VPNServer>
    onError: Event<VPNError>
  }
}
\`\`\`

### Ad Blocker API
\`\`\`typescript
interface AdBlockerAPI {
  // Filter Management
  filters: {
    addList(url: string): Promise<void>
    removeList(listId: string): Promise<void>
    updateLists(): Promise<void>
    getLists(): Promise<FilterList[]>
    addCustomRule(rule: string): Promise<void>
    removeCustomRule(ruleId: string): Promise<void>
  }
  
  // Whitelist/Blacklist
  exceptions: {
    addWhitelist(domain: string): Promise<void>
    removeWhitelist(domain: string): Promise<void>
    addBlacklist(domain: string): Promise<void>
    removeBlacklist(domain: string): Promise<void>
    getWhitelist(): Promise<string[]>
    getBlacklist(): Promise<string[]>
  }
  
  // Statistics
  stats: {
    getBlocked(): Promise<BlockedStats>
    resetStats(): Promise<void>
    onBlocked: Event<BlockedItem>
  }
}
\`\`\`

## 📱 PWA APIs

### Service Worker
\`\`\`typescript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('aria-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
\`\`\`

### Push Notifications
\`\`\`typescript
interface NotificationAPI {
  // Permission Management
  requestPermission(): Promise<NotificationPermission>
  getPermission(): NotificationPermission
  
  // Notification Creation
  create(title: string, options?: NotificationOptions): Promise<void>
  clear(notificationId: string): Promise<void>
  getAll(): Promise<Notification[]>
  
  // Events
  onClicked: Event<NotificationClickEvent>
  onClosed: Event<NotificationCloseEvent>
}
\`\`\`

## 🎯 Event System

### Event Listeners
\`\`\`typescript
// Agregar listener
aria.tabs.onCreated.addListener((tab) => {
  console.log('Nueva pestaña creada:', tab)
})

// Remover listener
const listener = (tab) => console.log(tab)
aria.tabs.onCreated.addListener(listener)
aria.tabs.onCreated.removeListener(listener)

// Listener único
aria.tabs.onCreated.addListener((tab) => {
  console.log('Solo se ejecuta una vez')
}, { once: true })
\`\`\`

### Custom Events
\`\`\`typescript
// Disparar evento personalizado
aria.events.emit('customEvent', { data: 'valor' })

// Escuchar evento personalizado
aria.events.on('customEvent', (data) => {
  console.log('Evento recibido:', data)
})
\`\`\`

## 🔍 Debug APIs

### Debug Console
\`\`\`typescript
interface DebugAPI {
  // Logging
  log(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, data?: any): void
  
  // Performance
  startTimer(name: string): void
  endTimer(name: string): number
  getMetrics(): PerformanceMetrics
  
  // Cache Management
  clearCache(): Promise<void>
  getCacheSize(): Promise<number>
  
  // Export/Import
  exportLogs(): Promise<string>
  exportSettings(): Promise<string>
  importSettings(data: string): Promise<void>
  
  // System Info
  getSystemInfo(): SystemInfo
  getBrowserInfo(): BrowserInfo
}
\`\`\`

## 📊 Analytics APIs

### Usage Analytics
\`\`\`typescript
interface AnalyticsAPI {
  // Event Tracking
  track(event: string, properties?: {[key: string]: any}): void
  page(name: string, properties?: {[key: string]: any}): void
  identify(userId: string, traits?: {[key: string]: any}): void
  
  // Performance Tracking
  timing(name: string, duration: number): void
  exception(error: Error, fatal?: boolean): void
  
  // Custom Metrics
  increment(metric: string, value?: number): void
  gauge(metric: string, value: number): void
  histogram(metric: string, value: number): void
}
\`\`\`

## 🔐 Security Considerations

### Permissions
\`\`\`typescript
// Verificar permisos
const hasPermission = await aria.permissions.contains({
  permissions: ['tabs', 'storage']
})

// Solicitar permisos
const granted = await aria.permissions.request({
  permissions: ['activeTab']
})

// Remover permisos
await aria.permissions.remove({
  permissions: ['activeTab']
})
\`\`\`

### Content Security Policy
\`\`\`typescript
// CSP para extensiones
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
\`\`\`

## 📝 Type Definitions

### Core Types
\`\`\`typescript
interface Tab {
  id: string
  url: string
  title: string
  active: boolean
  workspaceId: string
  favicon?: string
  loading: boolean
}

interface Workspace {
  id: string
  name: string
  color: string
  tabIds: string[]
  active: boolean
  created: Date
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  context?: ChatContext
}

interface FlowContent {
  id: string
  type: 'text' | 'url' | 'file'
  content: string
  deviceId: string
  timestamp: Date
  encrypted: boolean
}

interface Theme {
  id: string
  name: string
  colors: ColorScheme
  background: BackgroundConfig
  effects: EffectConfig
  custom: boolean
}
\`\`\`

## 🚀 Examples

### Simple Extension
\`\`\`typescript
// manifest.json
{
  "manifest_version": 3,
  "name": "Tab Counter",
  "version": "1.0.0",
  "permissions": ["tabs"],
  "action": {
    "default_popup": "popup.html"
  }
}

// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await aria.tabs.query({})
  document.getElementById('count').textContent = tabs.length
})
\`\`\`

### AI Integration
\`\`\`typescript
// Analizar página actual
const analysis = await aria.ai.analyze.page()
console.log('Resumen:', analysis.summary)

// Chat con contexto
const response = await aria.ai.chat.send('Resume esta página', {
  pageUrl: window.location.href,
  pageContent: document.body.innerText.slice(0, 1000)
})
\`\`\`

### Flow Sync
\`\`\`typescript
// Enviar texto seleccionado
const selectedText = window.getSelection().toString()
if (selectedText) {
  const devices = await aria.flow.devices.list()
  await aria.flow.sync.send({
    type: 'text',
    content: selectedText
  }, devices[0].id)
}
\`\`\`

---

Esta API está en constante evolución. Consulta la documentación más reciente en el repositorio oficial.
