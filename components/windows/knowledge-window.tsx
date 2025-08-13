"use client"

import { KnowledgeGraph } from "@/components/knowledge-graph"

interface KnowledgeWindowProps {
  onClose: () => void
  onMinimize: () => void
}

export function KnowledgeWindow({ onClose, onMinimize }: KnowledgeWindowProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <KnowledgeGraph className="flex-1" />
    </div>
  )
}
