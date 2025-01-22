import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  useReactFlow,
  Position,
  addEdge,
  SelectionMode
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'

import CustomNode from '../components/PathPossbilities/custom-node'
import Sidebar from '../components/PathPossbilities/sidebar'
import ControlsComponent from '../components/PathPossbilities/controls'
import LoadingAnimation from '../components/PathPossbilities/loading-animation'

import { generateMindMapData } from '@/utils/aiUtils';
import { MindMapNode, MindMapEdge } from '../types'
import LoadingAnimationPage from '@/components/PathPossbilities/LoadingAnimationPage'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 240
const nodeHeight = 160
const nodeTypes = {
  customNode: CustomNode
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  if (!nodes || !edges || nodes.length === 0 || edges.length === 0) {
    console.error('Invalid input for getLayoutedElements:', { nodes, edges });
    return { nodes: [], edges: [] };
  }

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      }
    }
  })

  return { nodes: layoutedNodes, edges }
}

const CareerPossibilities = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getNode, getEdges, setEdges: setEdgesReactFlow } = useReactFlow();

  const resetSelection = useCallback(() => {
    setSelectedNode(null)
    setEdges((eds) =>
      eds.map((ed) => ({ ...ed, style: { ...ed.style, stroke: 'rgba(155, 156, 247, 0.9)', strokeWidth: 2 } }))
    )
    setNodes((nds) =>
      nds.map((nd) => ({ ...nd, data: { ...nd.data, isExpanded: false } }))
    )
  }, [setEdges, setNodes])

  const onInit = useCallback(() => {
    console.log('Flow initialized')
  }, [])

  const highlightPath = useCallback((nodeId: string) => {
    const highlightedEdges = new Set<string>()
    const nodesToHighlight = new Set<string>([nodeId])

    const traversePath = (currentId: string) => {
      const incomingEdges = getEdges().filter((e) => e.target === currentId)
      incomingEdges.forEach((edge) => {
        if (!highlightedEdges.has(edge.id)) {
          highlightedEdges.add(edge.id)
          nodesToHighlight.add(edge.source)
          traversePath(edge.source)
        }
      })
    }

    traversePath(nodeId)

    setEdgesReactFlow((eds) =>
      eds.map((ed) => ({
        ...ed,
        type: 'smoothstep',
        style: {
          ...ed.style,
          // stroke: highlightedEdges.has(ed.id) ? 'rgb(189, 189, 189)' : 'rgb(86, 86, 86)',
          // stroke: highlightedEdges.has(ed.id) ? 'rgb(205, 209, 255)' : 'rgba(80, 74, 237, 1)',
          stroke: highlightedEdges.has(ed.id) ? 'rgb(205, 209, 255)' : 'rgba(155, 156, 247, 0.9)',
          strokeWidth: highlightedEdges.has(ed.id) ? 3 : 2,
          // strokeDasharray: highlightedEdges.has(ed.id) ? '8 13' : 'none',
        },
        animated: highlightedEdges.has(ed.id),
      }))
    )

    setNodes((nds) =>
      nds.map((nd) => ({
        ...nd,
        data: { ...nd.data, isHighlighted: nodesToHighlight.has(nd.id) },
      }))
    )
  }, [getEdges, setEdgesReactFlow, setNodes])

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node as MindMapNode)
      console.log('Node clicked:', node)
      highlightPath(node.id)
      setNodes((nds) =>
        nds.map((nd) => ({
          ...nd,
          data: { ...nd.data, isExpanded: nd.id === node.id },
        }))
      )
    },
    [highlightPath, setNodes]
  )

  const onPaneClick = useCallback(() => {
    resetSelection()
    highlightPath('root');
  }, [resetSelection])

  const generateNewMindMap = useCallback(async (currentState: string, desiredOutcome: string) => {
    setIsGenerating(true);
    setIsInitialized(true);
    try {
      const { initialNodes, initialEdges } = await generateMindMapData(currentState, desiredOutcome)
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
      )
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
    } catch (error) {
      console.error("Error generating new mind map:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [setNodes, setEdges])

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="flex flex-col w-full h-screen bg-neutral-600">
      <div className={`p-4 bg-gray-50 dark:bg-neutral-950 ${!isInitialized && "h-full"} flex items-center`}>
        <ControlsComponent onGenerateNewMindMap={generateNewMindMap} isGenerating={isGenerating} isInitialized={isInitialized} selectedNode={selectedNode} />
      </div>
      <div className="flex-grow relative">
        {isGenerating ? (
          <LoadingAnimationPage />
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={onInit}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            panOnScroll
            selectionMode={SelectionMode.Full}
            selectionOnDrag={true}
            multiSelectionKeyCode="Control"
            fitView
            minZoom={0.5}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 1.2 }}
            attributionPosition="bottom-left"
            className="bg-gray-50 dark:bg-neutral-950"
          >
            <Controls />
            {/* <MiniMap
              nodeStrokeColor={(n) => '#94a3b8'}
              nodeColor={(n) => '#ffffff'}
              className="!bottom-20 !right-1"
            /> */}
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="#94a3b8"
              style={{ opacity: 0.3 }}
            />
          </ReactFlow>
        )}
      </div>
      {selectedNode && (
        <div className="p-4 border-t border-gray-200">
          <Sidebar selectedNode={selectedNode} />
        </div>
      )}
    </div>
  )
}

export default CareerPossibilities

