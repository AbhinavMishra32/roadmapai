interface NodeData {
    description: string;
    detailedDescription: string;
    icon: string;
    label: string;
    nextSteps: string[];
    tasks: string[];
    timeEstimate: string;
}

export interface MindMapNode {
    id: string;
    type: string;
    data: NodeData;
}

export interface MindMapEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    animated: boolean;
    style: {
        stroke: string;
        strokeWidth: number;
    };
}