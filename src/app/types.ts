export interface MindMapNode {
  id: string
  type: string
  data: {
    label: string
    icon?: string
    description: string
    detailedDescription: string
    timeEstimate: string
    nextSteps?: string[]
    tasks?: string[]
  }
}

export interface MindMapEdge {
  id: string
  source: string
  target: string
  type: 'smoothstep'
  animated?: boolean
  style?: {
    stroke?: string
  }
}