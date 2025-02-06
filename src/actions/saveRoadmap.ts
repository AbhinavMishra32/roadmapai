"use server";

import { prisma } from "@/lib/db";
import { MindMapEdge, MindMapNode } from "@/types/index";
import { auth } from "@clerk/nextjs/server";

export async function saveRoadmap({
  nodes,
  edges,
  title,
}: {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  title: string;
}) {
  // Validation
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!Array.isArray(nodes) || !Array.isArray(edges) || !title) {
    throw new Error("Invalid input: nodes and edges must be arrays and title must be provided");
  }

  try {
    // Create roadmap with properly structured data
    const roadmap = await prisma.roadmap.upsert({
      where: {
        id: `${title}-${Date.now()}`
      },
      update: {},
      create: {
        title,
        savedUser: {
            connect: {
                id: userId
            }
        },
        nodes: {
          createMany: {
            data: nodes.map((node) => ({
              nodeId: node.id,
              type: node.type || 'default',
              label: node.data?.label || '',
              description: node.data?.description || '',
              detailedDescription: node.data?.detailedDescription || '',
              icon: node.data?.icon || '',
              nextSteps: node.data?.nextSteps || [],
              tasks: node.data?.tasks || [],
              timeEstimate: node.data?.timeEstimate || ''
            }))
          }
        },
        edges: {
          createMany: {
            data: edges.map((edge) => ({
              edgeId: edge.id,
              source: edge.source,
              target: edge.target,
              type: edge.type || 'smoothstep',
              animated: edge.animated || false
            }))
          }
        }
      },
      include: {
        nodes: true,
        edges: true
      }
    });

    return { success: true, data: roadmap };
  } catch (error) {
    console.error('Error in saveRoadmap:', error);
    throw new Error(`Failed to save roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}