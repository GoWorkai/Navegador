"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  CreditCard,
  Wallet,
  Target,
  AlertTriangle,
  Brain,
  BarChart3,
  Plus,
  Download,
  Upload,
  Bell,
  Shield,
  Zap,
  Calculator,
  Home,
  Car,
  ShoppingCart,
  Gamepad2,
  Heart,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useProfile } from "@/components/profile-provider"

interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  category: string
  type: "income" | "expense"
  account: string
  isRecurring: boolean
  tags: string[]
}

interface Budget {
  category: string
  allocated: number
  spent: number
  remaining: number
  icon: any
  color: string
  trend: number
}

interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  priority: "high" | "medium" | "low"
  category: string
}

interface AIInsight {
  id: string
  type: "warning" | "opportunity" | "achievement" | "prediction"
  title: string
  description: string
  impact: number
  actionable: boolean
  category: string
}

export function FinanceWindow() {
  const { currentProfile, hasPermission } = useProfile()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [activeTab, setActiveTab] = useState("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Sample data - in production this would come from APIs/databases
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      date: new Date(),
      description: "Supermercado Central",
      amount: -85.5,
      category: "Alimentación",
      type: "expense",
      account: "Cuenta Corriente",
      isRecurring: false,
      tags: ["comida", "necesario"],
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000),
      description: "Salario Mensual",
      amount: 4200.0,
      category: "Salario",
      type: "income",
      account: "Cuenta Corriente",
      isRecurring: true,
      tags: ["trabajo", "principal"],
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000),
      description: "Netflix Suscripción",
      amount: -15.99,
      category: "Entretenimiento",
      type: "expense",
      account: "Tarjeta de Crédito",
      isRecurring: true,
      tags: ["streaming", "mensual"],
    },
  ])

  const [budgets] = useState<Budget[]>([
    {
      category: "Alimentación",
      allocated: 1000,
      spent: 850,
      remaining: 150,
      icon: ShoppingCart,
      color: "bg-blue-500",
      trend: 5,
    },
    { category: "Transporte", allocated: 400, spent: 320, remaining: 80, icon: Car, color: "bg-green-500", trend: -8 },
    {
      category: "Entretenimiento",
      allocated: 300,
      spent: 180,
      remaining: 120,
      icon: Gamepad2,
      color: "bg-purple-500",
      trend: 12,
    },
    { category: "Servicios", allocated: 700, spent: 650, remaining: 50, icon: Home, color: "bg-orange-500", trend: 2 },
    { category: "Salud", allocated: 200, spent: 120, remaining: 80, icon: Heart, color: "bg-red-500", trend: -15 },
    {
      category: "Educación",
      allocated: 150,
      spent: 90,
      remaining: 60,
      icon: BookOpen,
      color: "bg-indigo-500",
      trend: 0,
    },
  ])

  const [financialGoals] = useState<FinancialGoal[]>([
    {
      id: "1",
      name: "Fondo de Emergencia",
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: new Date(2025, 11, 31),
      priority: "high",
      category: "Ahorro",
    },
    {
      id: "2",
      name: "Vacaciones Familiares",
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: new Date(2025, 6, 15),
      priority: "medium",
      category: "Ocio",
    },
    {
      id: "3",
      name: "Nuevo Automóvil",
      targetAmount: 25000,
      currentAmount: 8500,
      deadline: new Date(2026, 3, 1),
      priority: "low",
      category: "Transporte",
    },
  ])

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "opportunity",
      title: "Optimización de Gastos Detectada",
      description: "Puedes ahorrar $180/mes cancelando suscripciones no utilizadas y optimizando servicios.",
      impact: 180,
      actionable: true,
      category: "Ahorro",
    },
    {
      id: "2",
      type: "warning",
      title: "Patrón de Gasto Inusual",
      description: "Tus gastos en entretenimiento han aumentado 35% este mes comparado con el promedio.",
      impact: -105,
      actionable: true,
      category: "Presupuesto",
    },
    {
      id: "3",
      type: "prediction",
      title: "Proyección de Ahorros",
      description: "Manteniendo el ritmo actual, alcanzarás tu meta de fondo de emergencia en 8 meses.",
      impact: 450,
      actionable: false,
      category: "Metas",
    },
    {
      id: "4",
      type: "achievement",
      title: "Meta de Transporte Cumplida",
      description: "¡Felicidades! Has reducido tus gastos de transporte un 15% este mes.",
      impact: 60,
      actionable: false,
      category: "Logro",
    },
  ])

  const financialData = {
    balance: 15420.5,
    income: 4200.0,
    expenses: 2850.75,
    savings: 1349.25,
    investments: 8750.0,
    netWorth: 24170.5,
    monthlyGrowth: 2.5,
    savingsRate: 32.1,
    debtToIncome: 0.15,
  }

  useEffect(() => {
    if (hasPermission("finance.view")) {
      generateAIInsights()
    }
  }, [selectedPeriod])

  const generateAIInsights = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle
      case "opportunity":
        return TrendingUp
      case "achievement":
        return Target
      case "prediction":
        return Brain
      default:
        return Bell
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "opportunity":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20"
      case "achievement":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
      case "prediction":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Centro Financiero Familiar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <Brain className="w-4 h-4 mr-2" />
              Gestión inteligente para {currentProfile?.name}
              {isAnalyzing && <span className="ml-2 text-blue-500">• Analizando con IA...</span>}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {["week", "month", "quarter", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period ? "bg-gradient-to-r from-green-500 to-blue-500" : ""}
              >
                {period === "week" ? "Semana" : period === "month" ? "Mes" : period === "quarter" ? "Trimestre" : "Año"}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Presupuestos</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Transacciones</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Metas</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>IA Insights</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Planificación</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Patrimonio Neto</CardTitle>
                  <Wallet className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialData.netWorth.toLocaleString()}</div>
                  <p className="text-xs opacity-90">+{financialData.monthlyGrowth}% este mes</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Tasa de Ahorro</CardTitle>
                  <TrendingUp className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{financialData.savingsRate}%</div>
                  <p className="text-xs opacity-90">Meta: 30%</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Inversiones</CardTitle>
                  <BarChart3 className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${financialData.investments.toLocaleString()}</div>
                  <p className="text-xs opacity-90">+8.2% YTD</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Ratio Deuda/Ingreso</CardTitle>
                  <Shield className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(financialData.debtToIncome * 100).toFixed(1)}%</div>
                  <p className="text-xs opacity-90">Excelente (&lt;20%)</p>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Flujo de Efectivo Mensual</span>
                  </CardTitle>
                  <CardDescription>Ingresos vs Gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ingresos</span>
                      <span className="text-lg font-bold text-green-600">${financialData.income.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: "100%" }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Gastos</span>
                      <span className="text-lg font-bold text-red-600">${financialData.expenses.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full"
                        style={{ width: `${(financialData.expenses / financialData.income) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Ahorro Neto</span>
                      <span className="text-lg font-bold text-blue-600">${financialData.savings.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Acciones Rápidas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {hasPermission("finance.edit") && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-xs">Agregar Gasto</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs">Registrar Ingreso</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                        >
                          <Target className="w-4 h-4" />
                          <span className="text-xs">Nueva Meta</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                        >
                          <PieChart className="w-4 h-4" />
                          <span className="text-xs">Ajustar Presupuesto</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-xs">Importar Datos</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-3 flex flex-col items-center space-y-1 bg-transparent"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-xs">Exportar Reporte</span>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.allocated) * 100
                const IconComponent = budget.icon
                const isOverBudget = percentage > 100

                return (
                  <Card
                    key={budget.category}
                    className={`${isOverBudget ? "border-red-200 bg-red-50 dark:bg-red-900/10" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 ${budget.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <CardTitle className="text-sm">{budget.category}</CardTitle>
                        </div>
                        <Badge variant={isOverBudget ? "destructive" : percentage > 80 ? "secondary" : "outline"}>
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Gastado: ${budget.spent}</span>
                          <span>Presupuesto: ${budget.allocated}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${isOverBudget ? "bg-red-500" : budget.color}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                            {isOverBudget
                              ? `Exceso: $${(budget.spent - budget.allocated).toFixed(2)}`
                              : `Restante: $${budget.remaining}`}
                          </span>
                          <span className={`flex items-center ${budget.trend > 0 ? "text-red-500" : "text-green-500"}`}>
                            {budget.trend > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(budget.trend)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transacciones Recientes</CardTitle>
                  <div className="flex space-x-2">
                    <Input placeholder="Buscar transacciones..." className="w-64" />
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{transaction.account}</span>
                            {transaction.isRecurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurrente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{transaction.date.toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {financialGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                const remaining = goal.targetAmount - goal.currentAmount
                const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <Card key={goal.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{goal.name}</CardTitle>
                        <Badge
                          variant={
                            goal.priority === "high"
                              ? "destructive"
                              : goal.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {goal.priority === "high" ? "Alta" : goal.priority === "medium" ? "Media" : "Baja"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progreso: ${goal.currentAmount.toLocaleString()}</span>
                          <span>Meta: ${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Faltan: ${remaining.toLocaleString()}</span>
                          <span className={`${daysLeft < 30 ? "text-red-500" : "text-gray-500"}`}>
                            {daysLeft} días restantes
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{progress.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">Completado</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {aiInsights.map((insight) => {
                const IconComponent = getInsightIcon(insight.type)

                return (
                  <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <IconComponent className="w-5 h-5 mt-0.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <div className="flex items-center space-x-2">
                              {insight.impact !== 0 && (
                                <Badge variant={insight.impact > 0 ? "default" : "destructive"}>
                                  {insight.impact > 0 ? "+" : ""}${insight.impact}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {insight.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
                          {insight.actionable && (
                            <Button size="sm" variant="outline">
                              Tomar Acción
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5" />
                    <span>Calculadora de Jubilación</span>
                  </CardTitle>
                  <CardDescription>Planifica tu futuro financiero</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Edad actual</label>
                      <Input type="number" placeholder="35" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Edad de jubilación deseada</label>
                      <Input type="number" placeholder="65" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ingresos anuales actuales</label>
                      <Input type="number" placeholder="50000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ahorros actuales</label>
                      <Input type="number" placeholder="25000" />
                    </div>
                    <Button className="w-full">Calcular Plan de Jubilación</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="w-5 h-5" />
                    <span>Planificador de Hipoteca</span>
                  </CardTitle>
                  <CardDescription>Calcula tu capacidad de compra</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Precio de la vivienda</label>
                      <Input type="number" placeholder="300000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Enganche (%)</label>
                      <Input type="number" placeholder="20" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tasa de interés (%)</label>
                      <Input type="number" placeholder="3.5" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Plazo (años)</label>
                      <Input type="number" placeholder="30" />
                    </div>
                    <Button className="w-full">Calcular Pago Mensual</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
