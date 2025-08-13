"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Bug, Copy } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })

    // Log error to console and external service
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== "undefined") {
      // Simulate error reporting
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      localStorage.setItem(`error-report-${Date.now()}`, JSON.stringify(errorReport))
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  copyErrorDetails = () => {
    const errorDetails = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Algo salió mal</h1>
              <p className="text-gray-600">
                ARIA Navigator encontró un error inesperado. No te preocupes, estamos trabajando para solucionarlo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-red-500" />
                <span className="font-medium text-sm">Detalles del Error</span>
              </div>
              <div className="text-sm text-gray-700 font-mono">
                <div className="mb-2">
                  <strong>Mensaje:</strong> {this.state.error?.message}
                </div>
                {this.state.error?.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-600">Ver stack trace</summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              <Button onClick={this.handleReload}>Recargar página</Button>
              <Button onClick={this.copyErrorDetails} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copiar detalles
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Si el problema persiste, puedes reportarlo presionando F12 y enviando los logs.</p>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
