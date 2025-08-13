"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, PieChart, CreditCard, Wallet, Target, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfile } from "@/components/profile-provider"

export function FinanceWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  if (!hasPermission("finance.view")) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2">Acceso Restringido</h3>
          <p className="text-gray-600 dark:text-gray-400">No tienes permisos para ver información financiera.</p>
        </div>
      </div>
    )
  }

  const financialData = {
    balance: 15420.5,
    income: 4200.0,
    expenses: 2850.75,
    savings: 1349.25,
    budgetUsed: 68,
    categories: [
      { name: "Alimentación", amount: 850, budget: 1000, color: "bg-blue-500" },
      { name: "Transporte", amount: 320, budget: 400, color: "bg-green-500" },
      { name: "Entretenimiento", amount: 180, budget: 300, color: "bg-purple-500" },
      { name: "Servicios", amount: 650, budget: 700, color: "bg-orange-500" },
      { name: "Salud", amount: 120, budget: 200, color: "bg-red-500" },
    ],
  }

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestión Financiera Familiar</h1>
            <p className="text-gray-600 dark:text-gray-400">Panel de control con IA para {currentProfile?.name}</p>
          </div>
          <div className="flex space-x-2">
            {["week", "month", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === "week" ? "Semana" : period === "month" ? "Mes" : "Año"}
              </Button>
            ))}
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialData.balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.5% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${financialData.income.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${financialData.expenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ahorros</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${financialData.savings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Meta: $2,000</p>
            </CardContent>
          </Card>
        </div>

        {/* Presupuesto por categorías */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Presupuesto por Categorías</CardTitle>
              <CardDescription>Uso del presupuesto mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.categories.map((category) => {
                  const percentage = (category.amount / category.budget) * 100
                  return (
                    <div key={category.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-gray-600">
                          ${category.amount} / ${category.budget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% usado</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights de IA Financiera</CardTitle>
              <CardDescription>Recomendaciones personalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Buen progreso en ahorros</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Estás 15% por encima de tu meta mensual de ahorro.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Atención en entretenimiento</h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">
                        Has gastado 60% del presupuesto en entretenimiento.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <PieChart className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Optimización sugerida</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Considera reasignar $100 de entretenimiento a ahorros.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        {hasPermission("finance.edit") && (
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Agregar Gasto
                </Button>
                <Button variant="outline" size="sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Registrar Ingreso
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Ajustar Presupuesto
                </Button>
                <Button variant="outline" size="sm">
                  <PieChart className="w-4 h-4 mr-2" />
                  Ver Reportes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
