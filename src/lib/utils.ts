import { MindMapEdge, MindMapNode } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "./db"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function saveRoadmap({nodes, edges, title} : {nodes: MindMapNode[], edges: MindMapEdge[], title: String}) {
  try {
    const roadmap = await prisma.roadmap.create({
      data: {
        title: title,
        user: {
          connect: {
            id: "user_id" // Replace with actual user ID or pass it as a parameter
          }
        },
        nodes: {
          create: nodes.map(node => ({
              id: node.id,
              type: node.type,
              data: node.data,
          }))
        }
      }
    })

    if (!roadmap) {
      console.error("Error saving roadmap")
      return null
    }
  } catch (error) {
    console.error("Error saving roadmap", error)
    return null
  }
}