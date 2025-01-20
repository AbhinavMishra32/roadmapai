import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'

interface QuizQuestionProps {
  question: string
  options: string[]
  onAnswer: (answer: string) => void
  currentQuestion: number
  totalQuestions: number
  isGeneratingQuestion: boolean
}

export default function QuizQuestion({
  question,
  options,
  onAnswer,
  currentQuestion,
  totalQuestions,
  isGeneratingQuestion
}: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Question {currentQuestion} of {totalQuestions}</h2>
      {isGeneratingQuestion ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-8"
        >
          <p className="text-lg mb-4">Crafting your next personalized question...</p>
          <motion.div
            className="w-12 h-12 border-t-4 border-yellow-500 border-solid rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      ) : (
        <>
          <p className="text-lg mb-6">{question}</p>
          <div className="space-y-4">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  onClick={() => onAnswer(option)}
                  className="w-full text-left justify-start bg-white hover:bg-yellow-100 text-gray-800 border border-gray-300"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

