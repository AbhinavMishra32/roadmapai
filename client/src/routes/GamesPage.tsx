import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import CareerPrompt from '../components/GamesPage/CareerPrompt'
import QuizQuestion from '../components/GamesPage/QuizQuestion'
import LoadingAnimation from '../components/GamesPage/LoadingAnimation'
import ResultsAnalysis from '../components/GamesPage/ResultsAnalysis'
import GameHeader from '@/components/GamesPage/GameHeader'
import ScoreIndicator from '@/components/GamesPage/ScoreIndicator'
import { generateCareerQuestions, analyzeQuizResults } from '../utils/aiUtils'
import { CareerInfo, QuestionData } from '../types'


export default function CareerQuestArcade() {
    const [quizState, setQuizState] = useState<'prompt' | 'loading' | 'quiz' | 'analyzing' | 'results'>('prompt')
    const [interests, setInterests] = useState('')
    const [careerInfo, setCareerInfo] = useState<CareerInfo | null>(null)
    const [questions, setQuestions] = useState<QuestionData[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [results, setResults] = useState<any>(null)
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const [showScoreIndicator, setShowScoreIndicator] = useState(false)
  
    const startQuiz = async (userInterests: string) => {
      setInterests(userInterests)
      setQuizState('loading')
      console.log('Starting quest generation for interests:', userInterests)
      try {
        const { career, questions } = await generateCareerQuestions(userInterests)
        console.log('AI Response:', { career, questions })
        setCareerInfo(career)
        setQuestions(questions)
        setQuizState('quiz')
      } catch (error) {
        console.error('Error generating quest:', error)
        setQuizState('prompt')
      }
    }
  
    const handleAnswer = (answer: string, isCorrect: boolean) => {
      setAnswers([...answers, answer])
      if (isCorrect) {
        setScore(score + 100)
        setStreak(streak + 1)
        setShowScoreIndicator(true)
        setTimeout(() => setShowScoreIndicator(false), 1500)
      } else {
        setStreak(0)
      }
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setQuizState('analyzing')
      }
    }
  
    useEffect(() => {
      if (quizState === 'analyzing') {
        console.log('Analyzing quest results')
        analyzeQuizResults(careerInfo!, questions, answers ).then((analysisResults) => {
          console.log('Analysis results:', analysisResults)
          setResults(analysisResults)
          setQuizState('results')
        })
      }
    }, [quizState])
  
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col">
        <GameHeader quizState={quizState} score={score} streak={streak} />
        <main className="flex-grow flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {quizState === 'prompt' && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <CareerPrompt onStart={startQuiz} />
              </motion.div>
            )}
            {quizState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <LoadingAnimation />
              </motion.div>
            )}
            {quizState === 'quiz' && questions.length > 0 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <QuizQuestion
                  question={questions[currentQuestion]}
                  onAnswer={handleAnswer}
                  progress={(currentQuestion + 1) / questions.length}
                  questionNumber={currentQuestion + 1}
                  totalQuestions={questions.length}
                />
              </motion.div>
            )}
            {quizState === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <LoadingAnimation message="Analyzing your quest results..." />
              </motion.div>
            )}
            {quizState === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <ResultsAnalysis results={results} career={careerInfo!} score={score} totalQuestions={questions.length} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <AnimatePresence>
          {showScoreIndicator && <ScoreIndicator />}
        </AnimatePresence>
      </div>
    )
  }
  
  