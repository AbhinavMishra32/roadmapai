import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SchemaType } from '@google/generative-ai'
import { CareerInfo, QuestionData, Recommendations } from '../types'
import { initialEdges, initialNodes } from '@/data/mindmap-data'
import { useEffect } from 'react'
import { api } from '@/services/axios'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables")
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function generateCareerQuestions(interests: string): Promise<{ career: CareerInfo, questions: QuestionData[] }> {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      career: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
        },
        required: ["name", "description"],
      },
      questions: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            question: { type: SchemaType.STRING },
            options: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  text: { type: SchemaType.STRING },
                  correct: { type: SchemaType.BOOLEAN },
                  imagePrompt: { type: SchemaType.STRING },
                },
                required: ["text", "correct", "imagePrompt"],
              },
            },
          },
          required: ["question", "options"],
        },
      },
    },
    required: ["career", "questions"],
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  })

  const prompt = `Based on the following interests: "${interests}", generate a career suggestion and a set of 10 questions that would test the user's aptitude for this career. Each question should have 4 options, with one correct answer, dont ask subjective questions which has ambiguity in the correct answer, ask questions which have a definite answer DONT ASK VISUAL QUESTIONS OR WHICH REQUIRES PICTURE TO ANSWER. Also, provide an image prompt for each option. Respond in the following JSON format:
  {
    "career": {
      "name": "Career Name",
      "description": "Brief description of the career"
    },
    "questions": [
      {
        "question": "Question text",
        "options": [
          {
            "text": "Option text",
            "correct": true/false,
            "imagePrompt": "Image prompt for this option"
          },
          ...
        ]
      },
      ...
    ]
  }`

  try {
    const result = await model.generateContent(prompt)
    const generatedData = JSON.parse(result.response.text())
    return generatedData
  } catch (error) {
    console.error("Error generating career questions:", error)
    throw error
  }
}

export async function analyzeQuizResults(career: CareerInfo, questions: QuestionData[], answers: string[]): Promise<any> {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      likelihood: { type: SchemaType.STRING },
      score: { type: SchemaType.NUMBER },
      totalQuestions: { type: SchemaType.NUMBER },
      analysis: { type: SchemaType.STRING },
      similarCareers: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    },
    required: ["likelihood", "score", "totalQuestions", "analysis", "similarCareers"],
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  })

  const prompt = `Analyze the following quiz results for the career "${career.name}":

  Questions and Answers:
  ${questions.map((q, i) => `
  Q${i + 1}: ${q.question}
  User's Answer: ${answers[i]}
  Correct Answer: ${q.options.find(o => o.correct)?.text}
  `).join('\n')}

  Provide an analysis of the user's performance and suitability for this career. Include the following in your response:
  - Likelihood of excelling in this career (e.g., "Very Likely", "Likely", "Uncertain", "Unlikely")
  - Score (number of correct answers)
  - Total number of questions
  - A brief analysis of the user's performance and suitability for the career
  - 3-5 similar careers that the user might also consider based on their performance

  Respond in the following JSON format:
  {
    "likelihood": "Likelihood assessment",
    "score": number of correct answers,
    "totalQuestions": total number of questions,
    "analysis": "Brief analysis text",
    "similarCareers": ["Career 1", "Career 2", "Career 3"]
  }`

  try {
    const result = await model.generateContent(prompt)
    const analysisResults = JSON.parse(result.response.text())
    return analysisResults
  } catch (error) {
    console.error("Error analyzing quiz results:", error)
    throw error
  }
}

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

  const prompt = `Generate a comprehensive career path mind map based on the following inputs:
  Current Professional State: ${currentState}
  Desired Career Outcome: ${desiredOutcome}

  1. A "Starting Point" node representing the current state 
  2. At least 10-15 main career paths or stages
  3. Nodes that connect to multiple other nodes
  4. Some paths that converge (e.g., different paths leading to a common advanced stage)
  5. A mix of linear progressions and branching options (have branching options at least 3 times)
  6. Keep the mind map as detailed and realistic as possible (for India), keep it detailed and more nodes and edges would be awesome, have alot of nodes, and have them connected in a way that makes sense
  7. The final node(s) representing the desired outcome
  8. Dont have the label and id CamelCase, use natural english words with spaces (label is the card / node label that tells details about the node as tags and what thing is happening in that node (something other than whats being told in the description))
  9. In detailedDescription provide a detailed description of the node, what it is about, what it does, what it is used for, etc.

  Requirements for nodes:
  - Unique string IDs (e.g., names of nodes in natural english)
  - type: 'customNode'
  - icon from this list: briefcase, book, code, server, cloud, users, school, building, chart, Briefcase, Stethoscope, Code, Gavel, Mic, Paintbrush, Calculator, Book, Tool, Camera, Cutlery, Wrench, Flask, Music, Globe, DollarSign, Airplane, Tree, Package, Heart
  - Meaningful and specific descriptions related to the chosen tech field (1-2 sentences).
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


export async function generateRecommendations(careerPath: string, financialCondition: string): Promise<Recommendations> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      courses: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            provider: { type: SchemaType.STRING },
            cost: { type: SchemaType.NUMBER },
            duration: { type: SchemaType.STRING },
            careerOutcome: { type: SchemaType.STRING },
            financialFit: { type: SchemaType.STRING },
            scholarships: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  amount: { type: SchemaType.NUMBER },
                },
              },
            },
            alternatives: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  provider: { type: SchemaType.STRING },
                  cost: { type: SchemaType.NUMBER },
                  duration: { type: SchemaType.STRING },
                },
              },
            },
          },
          required: [
            "name", "description", "provider", "cost", "duration",
            "careerOutcome", "financialFit", "scholarships", "alternatives"
          ],
        },
      },
      analysis: { type: SchemaType.STRING },
    },
    required: ["courses", "analysis"],
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  })

  const prompt = `Given the following career path and financial condition, provide professional course recommendations:
  Career Path: ${careerPath}
  Financial Condition: ${financialCondition}
  
  Provide a detailed analysis and at least 5 professional course in India (government recognized degrees / courses / etc), dont tell any online courese!, recommendations (such as B.Tech, M.Tech, MD, MBBS, etc.) based on the user's career path and financial condition. Give amount of money required for course in Indian rupees. Ensure the courses are diverse and align with different aspects of the career path. Include specific financial fit assessments for each course and provide alternatives. TELL COST FOR INDIAN COURSES, INDIAN. IN INDIAN RUPEES`

  try {
    const result = await model.generateContent(prompt)
    const generatedRecommendations = JSON.parse(result.response.text())
    return generatedRecommendations as Recommendations
  } catch (error) {
    console.error("Error generating recommendations:", error)
    throw error
  }
}
