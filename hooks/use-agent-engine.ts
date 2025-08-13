"use client"

import { useState, useEffect } from "react"
import { AgentEngine } from "@/lib/agents/agent-engine"
import { FinancialAgent, SmartHomeAgent, ProductivityAgent } from "@/lib/agents/specialized-agents"
import { useProfile } from "@/components/profile-provider"

export function useAgentEngine() {
  const { currentProfile, hasPermission } = useProfile()
  const [agentEngine, setAgentEngine] = useState<AgentEngine | null>(null)
  const [specializedAgents, setSpecializedAgents] = useState<{
    financial: FinancialAgent | null
    smartHome: SmartHomeAgent | null
    productivity: ProductivityAgent | null
  }>({
    financial: null,
    smartHome: null,
    productivity: null,
  })
  const [systemInsights, setSystemInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentProfile && hasPermission("ai.autonomous")) {
      const engine = new AgentEngine(currentProfile.id)
      setAgentEngine(engine)

      // Initialize specialized agents
      setSpecializedAgents({
        financial: hasPermission("finance.view") ? new FinancialAgent(engine, currentProfile.id) : null,
        smartHome: hasPermission("system.settings") ? new SmartHomeAgent(engine, currentProfile.id) : null,
        productivity: new ProductivityAgent(engine, currentProfile.id),
      })

      // Load system insights
      engine.getSystemInsights().then(setSystemInsights)
    }
  }, [currentProfile, hasPermission])

  const createAgent = async (agentConfig: any) => {
    if (!agentEngine || !currentProfile) return null

    setIsLoading(true)
    try {
      const agentId = await agentEngine.createAgent({
        ...agentConfig,
        userId: currentProfile.id,
      })

      // Refresh insights
      const insights = await agentEngine.getSystemInsights()
      setSystemInsights(insights)

      return agentId
    } catch (error) {
      console.error("Failed to create agent:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const createWorkflow = async (workflowConfig: any) => {
    if (!agentEngine || !currentProfile) return null

    setIsLoading(true)
    try {
      const workflowId = await agentEngine.createWorkflow({
        ...workflowConfig,
        createdBy: currentProfile.id,
      })

      // Refresh insights
      const insights = await agentEngine.getSystemInsights()
      setSystemInsights(insights)

      return workflowId
    } catch (error) {
      console.error("Failed to create workflow:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const executeWorkflow = async (workflowId: string, agentId: string, context: Record<string, any> = {}) => {
    if (!agentEngine) return null

    setIsLoading(true)
    try {
      return await agentEngine.executeWorkflow(workflowId, agentId, context)
    } catch (error) {
      console.error("Failed to execute workflow:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const approveDecision = async (decisionId: string, approved: boolean) => {
    if (!agentEngine || !currentProfile) return false

    try {
      return await agentEngine.approveDecision(decisionId, approved, currentProfile.id)
    } catch (error) {
      console.error("Failed to approve decision:", error)
      return false
    }
  }

  const getAgentPerformance = async (agentId: string) => {
    if (!agentEngine) return null

    try {
      return await agentEngine.getAgentPerformance(agentId)
    } catch (error) {
      console.error("Failed to get agent performance:", error)
      return null
    }
  }

  // Specialized agent methods
  const createFinancialWorkflows = async () => {
    if (!specializedAgents.financial) return null

    try {
      const budgetWorkflow = await specializedAgents.financial.createBudgetAnalysisWorkflow()
      const investmentWorkflow = await specializedAgents.financial.createInvestmentMonitoringWorkflow()

      return { budgetWorkflow, investmentWorkflow }
    } catch (error) {
      console.error("Failed to create financial workflows:", error)
      return null
    }
  }

  const createSmartHomeWorkflows = async () => {
    if (!specializedAgents.smartHome) return null

    try {
      const energyWorkflow = await specializedAgents.smartHome.createEnergyOptimizationWorkflow()
      const securityWorkflow = await specializedAgents.smartHome.createSecurityMonitoringWorkflow()

      return { energyWorkflow, securityWorkflow }
    } catch (error) {
      console.error("Failed to create smart home workflows:", error)
      return null
    }
  }

  const createProductivityWorkflows = async () => {
    if (!specializedAgents.productivity) return null

    try {
      const taskWorkflow = await specializedAgents.productivity.createTaskOptimizationWorkflow()

      return { taskWorkflow }
    } catch (error) {
      console.error("Failed to create productivity workflows:", error)
      return null
    }
  }

  return {
    agentEngine,
    specializedAgents,
    systemInsights,
    isLoading,
    createAgent,
    createWorkflow,
    executeWorkflow,
    approveDecision,
    getAgentPerformance,
    createFinancialWorkflows,
    createSmartHomeWorkflows,
    createProductivityWorkflows,
  }
}
