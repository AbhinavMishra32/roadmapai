import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InterestsPrompt from '../components/InterestsPrompts'
import QuizQuestion from '../components/QuizQuestion'
import ResultsPage from '../components/ResultsPage'
import { DynamicRetrievalMode, GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { Button } from '../components/ui/button'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables")
}

const NUM_QUESTIONS = 10

export default function CareerQuiz() {
  const [quizState, setQuizState] = useState<'prompt' | 'quiz' | 'analyzing' | 'results'>('prompt')
  const [interests, setInterests] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentQuestionData, setCurrentQuestionData] = useState<{ question: string, options: string[] } | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [careerInfo, setCareerInfo] = useState(null)
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)

  const generateQuestion = async (previousAnswer?: string) => {
    setIsGeneratingQuestion(true)
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        question: { type: SchemaType.STRING },
        options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
      required: ["question", "options"],
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    })

    const prompt = previousAnswer
      ? `Based on the previous answer "${previousAnswer}" and considering the initial interests "${interests}", generate the next question with 4 multiple-choice options to further explore the user's career preferences. Dont ask simple questions, ask deep questions that is relatable to a high school student, dont questions which have single worded answers, limit answers to 10 words around. Dont ask conflicting career paths, if user picks a career path, dont ask questions that are not related to the career path. Dont make answers be questions of any sort, they are answers. Start with fundamental questions then move onto specific career paths!, Dont ask questions that ask for career that the user likes, ask questions around that question. Ask specific question related to the response only, not too much jargon. Dont ask corporate questions!! this is a unique ai feature which asks really unique questions`
      : `Based on the following interests: ${interests}, generate the first question with 4 multiple-choice options to determine a suitable career path. Dont ask simple questions, ask deep questions that is relatable to a high school student, dont questions which have single worded answers, limit answers to 10 words around. Dont ask conflicting career paths, if user picks a career path, dont ask questions that are not related to the career path. Dont make answers be questions of any sort, they are answers. Start with fundamental questions then move onto specific career paths!, Dont ask questions that ask for career that the user likes, ask questions around that question. Ask specific question related to the response only, not too much jargon.`

    try {
      const result = await model.generateContent(prompt)
      console.log("AI Response:", result.response.text())
      const generatedQuestion = JSON.parse(result.response.text())
      setCurrentQuestionData(generatedQuestion)
      setIsGeneratingQuestion(false)
    } catch (error) {
      console.error("Error generating question:", error)
      setIsGeneratingQuestion(false)
    }
  }

  const handleAnswer = async (answer: string) => {
    setAnswers([...answers, answer])
    if (currentQuestion < NUM_QUESTIONS - 1) {
      setCurrentQuestion(currentQuestion + 1)
      await generateQuestion(answer)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    setQuizState('analyzing')

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        careers: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              career: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              keySkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              salaryRange: { type: SchemaType.STRING },
              jobOutlook: { type: SchemaType.STRING },
              workLifeBalanceRating: { type: SchemaType.NUMBER },
              educationRequirements: { type: SchemaType.STRING },
              topCompanies: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              personalizedAdvice: { type: SchemaType.STRING },
              strengthsMatch: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              areasForImprovement: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              careerGrowthPath: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              metrics: {
                type: SchemaType.OBJECT,
                properties: {
                  salaryTrend: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } },
                  jobDemand: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } },
                  skillsImportance: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        skill: { type: SchemaType.STRING },
                        importance: { type: SchemaType.NUMBER }
                      }
                    }
                  }
                }
              }
            },
            required: [
              "career", "description", "keySkills", "salaryRange", "jobOutlook", "workLifeBalanceRating",
              "educationRequirements", "topCompanies", "personalizedAdvice",
              "strengthsMatch", "areasForImprovement", "careerGrowthPath", "metrics"
            ]
          }
        },
        overallAnalysis: { type: SchemaType.STRING }
      },
      required: ["careers", "overallAnalysis"]
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
      // tools: [
      //   {
      //     googleSearchRetrieval: {
      //       dynamicRetrievalConfig: {
      //         mode: DynamicRetrievalMode.MODE_DYNAMIC,
      //         dynamicThreshold: 0.7,
      //       }
      //     }
      //   }
      // ]
    })

    const prompt = `
      Based on the following interests: ${interests}
      And the following quiz answers: ${answers.join(', ')},
      provide detailed and personalized information about 3 suitable careers.
      Include personalized advice, strengths that match each career, areas for improvement provide instructions that tell the exact path to reach the career,
      and potential career growth paths. The salary ranges should be specific to India.
      Also provide metrics for salary trends over the past 5 years, job demand projections for the next 5 years,
      and importance ratings for key skills (on a scale of 1-10).
      Give realistic trends and projections based on the current job market. (not just increasing graphs / trends!), take into account trends reduction of salary and demand increase due to covid-19 from 2020-2022.
      Finally, provide an overall analysis of the user's potential career paths.
    `

    // try {
    //   const result = await model.generateContent(prompt)
    //   if (result.response.candidates && result.response.candidates[0].groundingMetadata) {
    //     // const aiResponse = JSON.parse(result.response.candidates[0].groundingMetadata)
    //     // setCareerInfo(aiResponse)
    //     console.log("Career Info set:", careerInfo)
    //     setQuizState('results');
    //   } else {
    //     throw new Error("Invalid response structure")
    //   }
    //   // setCareerInfo(aiResponse)
    //   console.log("Career Info set:", careerInfo)
    //   setTimeout(() => setQuizState('results'), 5000)
    // } catch (error) {
    //   console.error("Error generating career information:", error)
    // }

    try {
      const result = await model.generateContent(prompt)
      const aiResponse = JSON.parse(result.response.text())
      setCareerInfo(aiResponse)
      console.log("Career Info set:", careerInfo)
      setQuizState('results')
    } catch (error) {
      console.error("Error generating career information:", error)
      // Removed: setQuizState('results') // Move to results even if there's an error
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <AnimatePresence mode="wait">
        {quizState === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <InterestsPrompt
              interests={interests}
              setInterests={setInterests}
              onSubmit={async () => {
                setQuizState('quiz')
                await generateQuestion()
              }}
            />
          </motion.div>
        )}
        {quizState === 'quiz' && currentQuestionData && (
          <motion.div
            key={`quiz-${currentQuestion}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <QuizQuestion
              question={currentQuestionData.question}
              options={currentQuestionData.options}
              onAnswer={handleAnswer}
              currentQuestion={currentQuestion + 1}
              totalQuestions={NUM_QUESTIONS}
              isGeneratingQuestion={isGeneratingQuestion}
            />
          </motion.div>
        )}
        {quizState === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Analyzing Your Responses</h2>
            <p className="text-lg mb-8">Our AI is crafting your personalized career insights...</p>
            <motion.div
              className="w-16 h-16 border-t-4 border-yellow-500 border-solid rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
        {quizState === 'results' && careerInfo && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsPage careerInfo={careerInfo} />
            <Button
              onClick={() => {
                setQuizState('prompt')
                setInterests('')
                setCurrentQuestion(0)
                setCurrentQuestionData(null)
                setAnswers([])
                setCareerInfo(null)
              }}
              className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Start Over
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}