"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfile } from "@/components/profile-provider"
import {
  DollarSign,
  TrendingUp,
  Target,
  CreditCard,
  Wallet,
  AlertTriangle,
  Brain,
  X,
  Plus,
  Eye,
  EyeOff,
  Bell,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  type: "income" | "expense"
  date: Date
  account: string
  recurring?: boolean
  tags: string[]
  profileId: string
}

interface Budget {
  id: string
  name: string
  category: string
  limit: number
  spent: number
  period: "weekly" | "monthly" | "yearly"
  profileId: string
  alerts: {
    threshold: number
    enabled: boolean
  }
}

interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: "savings" | "debt" | "investment" | "purchase"
  profileId: string
  priority: "high" | "medium" | "low"
}

interface FinanceManagerProps {
  onClose?: () => void
}

const EXPENSE_CATEGORIES = [
  { id: "food", name: "Alimentación", icon: "🍽️", color: "bg-orange-500" },
  { id: "transport", name: "Transporte", icon: "🚗", color: "bg-blue-500" },
  { id: "housing", name: "Vivienda", icon: "🏠", color: "bg-green-500" },
  { id: "utilities", name: "Servicios", icon: "⚡", color: "bg-yellow-500" },
  { id: "entertainment", name: "Entretenimiento", icon: "🎬", color: "bg-purple-500" },
  { id: "healthcare", name: "Salud", icon: "🏥", color: "bg-red-500" },
  { id: "education", name: "Educación", icon: "📚", color: "bg-indigo-500" },
  { id: "shopping", name: "Compras", icon: "🛒", color: "bg-pink-500" },
  { id: "savings", name: "Ahorros", icon: "💰", color: "bg-emerald-500" },
  { id: "other", name: "Otros", icon: "📦", color: "bg-gray-500" },
]

const INCOME_CATEGORIES = [
  { id: "salary", name: "Salario", icon: "💼", color: "bg-green-600" },
  { id: "freelance", name: "Freelance", icon: "💻", color: "bg-blue-600" },
  { id: "investment", name: "Inversiones", icon: "📈", color: "bg-purple-600" },
  { id: "rental", name: "Alquiler", icon: "🏠", color: "bg-orange-600" },
  { id: "business", name: "Negocio", icon: "🏢", color: "bg-indigo-600" },
  { id: "other", name: "Otros", icon: "💵", color: "bg-gray-600" },
]

export function FinanceManager({ onClose }: FinanceManagerProps) {
  const { currentProfile, hasPermission } = useProfile()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [showAmounts, setShowAmounts] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiInsights, setAiInsights] = useState<any[]>([])

  // New transaction form
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    account: "main",
  })

  // New budget form
  const [newBudget, setNewBudget] = useState({
    name: "",
    category: "",
    limit: "",
    period: "monthly" as "weekly" | "monthly" | "yearly",
  })

  useEffect(() => {
    if (!hasPermission("finance.view")) {
      return
    }
    loadFinancialData()
    generateAIInsights()
  }, [currentProfile])

  const loadFinancialData = () => {
    // Load from localStorage or API
    const savedTransactions = localStorage.getItem(`aria-transactions-${currentProfile?.id}`)
    const savedBudgets = localStorage.getItem(`aria-budgets-${currentProfile?.id}`)
    const savedGoals = localStorage.getItem(`aria-goals-${currentProfile?.id}`)

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({ ...t, date: new Date(t.date) })))
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals).map((g: any) => ({ ...g, deadline: new Date(g.deadline) })))
    }
  }

  const saveFinancialData = () => {
    if (currentProfile) {
      localStorage.setItem(`aria-transactions-${currentProfile.id}`, JSON.stringify(transactions))
      localStorage.setItem(`aria-budgets-${currentProfile.id}`, JSON.stringify(budgets))
      localStorage.setItem(`aria-goals-${currentProfile.id}`, JSON.stringify(goals))
    }
  }

  useEffect(() => {
    saveFinancialData()
  }, [transactions, budgets, goals])

  const generateAIInsights = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const insights = []

      // Spending pattern analysis
      const monthlyExpenses = transactions
        .filter((t) => t.type === "expense" && t.date.getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0)

      if (monthlyExpenses > 0) {
        insights.push({
          type: "spending",
          title: "Patrón de Gastos Detectado",
          description: `Has gastado $${monthlyExpenses.toFixed(2)} este mes. Esto es un 15% más que el mes anterior.`,
          action: "review_budget",
          priority: "medium",
          icon: TrendingUp,
        })
      }

      // Budget alerts
      budgets.forEach((budget) => {
        const spentPercentage = (budget.spent / budget.limit) * 100
        if (spentPercentage > 80) {
          insights.push({
            type: "budget_alert",
            title: `Presupuesto de ${budget.name} casi agotado`,
            description: `Has usado el ${spentPercentage.toFixed(1)}% de tu presupuesto de ${budget.category}.`,
            action: "adjust_budget",
            priority: "high",
            icon: AlertTriangle,
          })
        }
      })

      // Savings opportunities
      const foodExpenses = transactions
        .filter((t) => t.category === "food" && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

      if (foodExpenses > 500) {
        insights.push({
          type: "savings",
          title: "Oportunidad de Ahorro en Alimentación",
          description: `Podrías ahorrar hasta $${(foodExpenses * 0.2).toFixed(2)} optimizando tus gastos de alimentación.`,
          action: "optimize_food",
          priority: "low",
          icon: Target,
        })
      }

      setAiInsights(insights)
      setIsAnalyzing(false)
    }, 2000)
  }

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description || !currentProfile) return

    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category,
      type: newTransaction.type,
      date: new Date(),
      account: newTransaction.account,
      tags: [],
      profileId: currentProfile.id,
    }

    setTransactions((prev) => [transaction, ...prev])

    // Update budget if expense
    if (transaction.type === "expense" && transaction.category) {
      setBudgets((prev) =>
        prev.map((budget) =>
          budget.category === transaction.category ? { ...budget, spent: budget.spent + transaction.amount } : budget,
        ),
      )
    }

    setNewTransaction({
      amount: "",
      description: "",
      category: "",
      type: "expense",
      account: "main",
    })
  }

  const addBudget = () => {
    if (!newBudget.name || !newBudget.limit || !currentProfile) return

    const budget: Budget = {
      id: Date.now().toString(),
      name: newBudget.name,
      category: newBudget.category,
      limit: Number.parseFloat(newBudget.limit),
      spent: 0,
      period: newBudget.period,
      profileId: currentProfile.id,
      alerts: {
        threshold: 80,
        enabled: true,
      },
    }

    setBudgets((prev) => [...prev, budget])
    setNewBudget({
      name: "",
      category: "",
      limit: "",
      period: "monthly",
    })
  }

  const getTotalIncome = () => {
    return transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  }

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  const formatCurrency = (amount: number) => {
    return showAmounts ? `$${amount.toFixed(2)}` : "****"
  }

  const getCategoryIcon = (category: string, type: "income" | "expense") => {
    const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
    return categories.find((c) => c.id === category)?.icon || "💰"
  }

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gestión Financiera Inteligente</h2>
            <p className="text-green-100 text-sm">Finanzas del hogar con IA</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAmounts(!showAmounts)}
            className="text-white hover:bg-white/20"
          >
            {showAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>Analizando...</span>
            </div>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasPermission("finance.view") && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Transacciones</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Presupuestos</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Metas</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Insights IA</span>
              {aiInsights.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {aiInsights.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="dashboard" className="p-6 space-y-6">
              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Balance Total</p>
                      <p className={`text-2xl font-bold ${getBalance() >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {formatCurrency(getBalance())}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        getBalance() >= 0 ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Ingresos</p>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(getTotalIncome())}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Gastos</p>
                      <p className="text-2xl font-bold text-red-400">{formatCurrency(getTotalExpenses())}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <ArrowDownRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-semibold mb-4">Transacciones Recientes</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCategoryIcon(transaction.category, transaction.type)}</div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-gray-400 text-sm">{transaction.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-gray-400 text-sm">{transaction.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Budget Overview */}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-semibold mb-4">Estado de Presupuestos</h3>
                <div className="space-y-3">
                  {budgets.slice(0, 3).map((budget) => {
                    const percentage = (budget.spent / budget.limit) * 100
                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white">{budget.name}</span>
                          <span className="text-gray-400">
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="p-6 space-y-6">
              {/* Add Transaction Form */}
              {hasPermission("finance.edit") && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Nueva Transacción</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Tipo</label>
                      <select
                        value={newTransaction.type}
                        onChange={(e) =>
                          setNewTransaction({ ...newTransaction, type: e.target.value as "income" | "expense" })
                        }
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="expense">Gasto</option>
                        <option value="income">Ingreso</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Monto</label>
                      <Input
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        placeholder="0.00"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                      <Input
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        placeholder="Descripción"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Categoría</label>
                      <select
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Seleccionar</option>
                        {(newTransaction.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button onClick={addTransaction} className="mt-4 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Transacción
                  </Button>
                </Card>
              )}

              {/* Transactions List */}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="text-white font-semibold mb-4">Historial de Transacciones</h3>
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCategoryIcon(transaction.category, transaction.type)}</div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-gray-400 text-sm">
                            {transaction.date.toLocaleDateString()} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-gray-400 text-sm">{transaction.account}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="budgets" className="p-6 space-y-6">
              {/* Add Budget Form */}
              {hasPermission("finance.edit") && (
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Nuevo Presupuesto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                      <Input
                        value={newBudget.name}
                        onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                        placeholder="Nombre del presupuesto"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Categoría</label>
                      <select
                        value={newBudget.category}
                        onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">Seleccionar</option>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Límite</label>
                      <Input
                        type="number"
                        value={newBudget.limit}
                        onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                        placeholder="0.00"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Período</label>
                      <select
                        value={newBudget.period}
                        onChange={(e) =>
                          setNewBudget({ ...newBudget, period: e.target.value as "weekly" | "monthly" | "yearly" })
                        }
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={addBudget} className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Target className="h-4 w-4 mr-2" />
                    Crear Presupuesto
                  </Button>
                </Card>
              )}

              {/* Budgets List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100
                  const remaining = budget.limit - budget.spent

                  return (
                    <Card key={budget.id} className="p-4 bg-gray-800 border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">{budget.name}</h4>
                        <Badge
                          className={
                            percentage > 90 ? "bg-red-600" : percentage > 70 ? "bg-yellow-600" : "bg-green-600"
                          }
                        >
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Gastado:</span>
                          <span className="text-white">{formatCurrency(budget.spent)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Límite:</span>
                          <span className="text-white">{formatCurrency(budget.limit)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Restante:</span>
                          <span className={remaining >= 0 ? "text-green-400" : "text-red-400"}>
                            {formatCurrency(remaining)}
                          </span>
                        </div>

                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Período: {budget.period}</span>
                          {budget.alerts.enabled && <Bell className="h-3 w-3" />}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="p-6 space-y-6">
              <Card className="p-8 bg-gray-800 border-gray-700 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">Metas Financieras</h4>
                <p className="text-gray-400">Próximamente: Establece y sigue tus metas de ahorro e inversión.</p>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Insights Financieros con IA</h3>
                <Button
                  onClick={generateAIInsights}
                  disabled={isAnalyzing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analizando..." : "Actualizar"}
                </Button>
              </div>

              {aiInsights.length === 0 ? (
                <Card className="p-8 bg-gray-800 border-gray-700 text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-white font-semibold mb-2">Generando Insights</h4>
                  <p className="text-gray-400">La IA está analizando tus patrones financieros...</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => {
                    const IconComponent = insight.icon
                    return (
                      <Card key={index} className="p-4 bg-gray-800 border-gray-700">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              insight.priority === "high"
                                ? "bg-red-600"
                                : insight.priority === "medium"
                                  ? "bg-yellow-600"
                                  : "bg-blue-600"
                            }`}
                          >
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-white font-semibold">{insight.title}</h4>
                              <Badge
                                variant={
                                  insight.priority === "high"
                                    ? "destructive"
                                    : insight.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {insight.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Zap className="h-3 w-3 mr-1" />
                              Aplicar Sugerencia
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      )}

      {!hasPermission("finance.view") && (
        <Card className="w-full h-full bg-gray-900 border-gray-700 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Acceso Restringido</h3>
            <p className="text-gray-400">No tienes permisos para ver información financiera.</p>
          </div>
        </Card>
      )}
    </Card>
  )
}
