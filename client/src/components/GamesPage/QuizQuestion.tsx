"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { QuestionData } from '../../types'
import confetti from 'canvas-confetti'
import { CheckCircle, XCircle } from 'lucide-react'

interface QuizQuestionProps {
  question: QuestionData
  onAnswer: (answer: string, isCorrect: boolean) => void
  progress: number
  questionNumber: number
  totalQuestions: number
}

export default function RefinedQuizGame({
  question,
  onAnswer,
  progress,
  questionNumber,
  totalQuestions
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswer = (answer: string, correct: boolean) => {
    setSelectedAnswer(answer)
    setIsCorrect(correct)
    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      })
    }
    setTimeout(() => {
      onAnswer(answer, correct)
      setSelectedAnswer(null)
      setIsCorrect(null)
    }, 1000)
  }

  return (
    <div className=" w-full p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-amber-500 to-90% p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Quiz Challenge</h2>
            <span className="text-sm font-medium text-white bg-white/20 px-3 py-1 rounded-full">
              Question {questionNumber} / {totalQuestions}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <motion.h3 
            className="text-lg font-medium text-gray-800 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {question.question}
          </motion.h3>
          <div className="space-y-3">
            <AnimatePresence>
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Button
                    onClick={() => handleAnswer(option.text, option.correct)}
                    className={`h-auto text-left justify-start flex items-center p-3 rounded-md transition-all duration-200 w-full ${
                      selectedAnswer === option.text
                        ? option.correct
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                    } ${
                      selectedAnswer && selectedAnswer !== option.text ? 'opacity-50' : ''
                    }`}
                    disabled={selectedAnswer !== null}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-gray-600">{String.fromCharCode(65 + index)}</span>
                    </div>
                    <span className="text-sm">{option.text}</span>
                    {selectedAnswer === option.text && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        {option.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Select an answer to continue
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">Progress:</span>
            <Progress value={progress * 100} className="w-24 h-2" indicatorColor='bg-yellow-300' />
            <span className="text-xs font-medium text-gray-700">{Math.round(progress * 100)}%</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

