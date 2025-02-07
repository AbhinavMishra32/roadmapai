"use server";

import { prisma } from "@/lib/db";
import { MindMapEdge, MindMapNode } from "@/types/index";
import { auth } from "@clerk/nextjs/server";
// (removed unused import)

export async function saveRoadmap({
  nodes,
  edges,
  title,
}: {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  title: string;
}) {

  console.log("----------------------------------");
  console.log("Nodes:", nodes);
  console.log("Edges:", edges);
  console.log("Title:", title);
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
      id: `${title}-${Date.now()}`,
      title,
      savedUser: {
        connect: {
        id: userId
        }
      },
      nodes: {
        create: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        nodeData: {
          create: {
          label: node.data?.label,
          description: node.data?.description,
          detailedDescription: node.data?.detailedDescription,
          icon: node.data?.icon,
          nextSteps: node.data?.nextSteps,
          tasks: node.data?.tasks,
          timeEstimate: node.data?.timeEstimate
          }
        }
        }))
      },
      edges: {
        create: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep',
        animated: edge.animated || false,
        style: {
          create: {
          stroke: edge.style?.stroke || '#000000',
          strokeWidth: edge.style?.strokeWidth || 1
          }
        }
        }))
      }
      },
      include: {
      nodes: {
        include: {
        nodeData: true
        }
      },
      edges: {
        include: {
        style: true
        }
      }
      }
    });

    return { success: true, data: roadmap };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in saveRoadmap:', error.stack);
    } else {
      console.error('Error in saveRoadmap:', error);
    }
    // throw new Error(`Failed to save roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}