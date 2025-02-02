import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType } from '@google/generative-ai'
import { CareerInfo, QuestionData, Recommendations } from '../types'
import { initialEdges, initialNodes } from '@/data/mindmap-data'
import { useEffect } from 'react'
import { api } from '@/services/axios'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
console.log("GEMINI API KEY: ", GEMINI_API_KEY);
if (!GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY in environment variables")
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)


export async function generateMindMapData(currentState: string, desiredOutcome: string) {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      aiNodes: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            type: { type: SchemaType.STRING },
            data: {
              type: SchemaType.OBJECT,
              properties: {
                label: { type: SchemaType.STRING },
                icon: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                detailedDescription: { type: SchemaType.STRING },
                timeEstimate: { type: SchemaType.STRING },
                nextSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
              },
              required: ["label", "icon", "description", "detailedDescription", "timeEstimate", "nextSteps"]
            }
          },
          required: ["id", "type", "data"]
        }
      },
      aiEdges: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            source: { type: SchemaType.STRING },
            target: { type: SchemaType.STRING },
            type: { type: SchemaType.STRING },
            animated: { type: SchemaType.BOOLEAN },
            style: {
              type: SchemaType.OBJECT,
              properties: {
                stroke: { type: SchemaType.STRING },
                strokeWidth: { type: SchemaType.NUMBER }
              },
              required: ["stroke", "strokeWidth"]
            }
          },
          required: ["id", "source", "target", "type", "animated", "style"]
        }
      }
    },
    required: ["aiNodes", "aiEdges"]
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    safetySettings: safetySettings,
  });

  const prompt = `Generate a comprehensive and really detailed roadmap for anything that the user asks for based on the following inputs:
  Current situation / position of user: ${currentState}
  Desired Final Goal: ${desiredOutcome}

  1. A "Starting Point" node representing the current state 
  2. At least 10-15 roadmap paths.
  3. Nodes that connect to multiple other nodes
  4. Some paths that converge (e.g., different paths leading to a common advanced stage)
  5. A mix of linear progressions and branching options (have branching options at least 3 times)
  6. Keep the roadmap as detailed and up to date as possible, keep it detailed and more nodes and edges would be awesome, have alot of nodes, and have them connected in a way that makes sense.
  7. The final node representing the desired outcome
  8. Make the roadmap tell in detail about anything the user asks for.
  9. Dont have the label and id CamelCase, use natural english words with spaces (label is the card / node label that tells details about the node as tags and what thing is happening in that node (something other than whats being told in the description))
  10. In detailedDescription provide a detailed description of the node, what it is about, what it does, what it is used for, etc.

  Requirements for nodes:
  - Unique string IDs (e.g., names of nodes in natural english)
  - type: 'customNode'
  - icon from this list:   
    Briefcase, Book, Server, Cloud, Users, School, Building, Chart, Stethoscope, Code, Gavel, Mic, Paintbrush, Calculator, Tool, Camera, Cutlery, Wrench, Flask, Music, Globe, DollarSign, Airplane, Tree, Package, Heart,
  - Meaningful and specific descriptions related to the chosen category (5-6 sentences).
  - Realistic timeEstimates
  - Relevant nextSteps array

  Requirements for edges:
  - Unique string IDs (e.g. names of nodes in natural english)
  - type: 'smoothstep'
  - animated: false
  - style with stroke: '#EAB308' and strokeWidth: 2

  Ensure the mind map represents a realistic, diverse, and achievable career progression tailored to the provided inputs.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const generatedData = JSON.parse(responseText);
    console.log("Generated mind map data:", generatedData);

    return {
      initialNodes: generatedData.aiNodes,
      initialEdges: generatedData.aiEdges,
    };
  } catch (error) {
    console.error("Error generating mind map data:", error);
    throw error;
  }
}