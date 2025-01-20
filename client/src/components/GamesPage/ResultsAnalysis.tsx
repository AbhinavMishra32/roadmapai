import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CareerInfo } from '../../types'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface ResultsAnalysisProps {
  results: any
  career: CareerInfo
  score: number
  totalQuestions: number
}

export default function ResultsAnalysis({ results, career, score, totalQuestions }: ResultsAnalysisProps) {
  useEffect(() => {
    if (score>=totalQuestions*100/2) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
  }, [])

  return (
    <motion.div 
      className="space-y-6 text-center bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-yellow-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Quest Complete!
      </motion.h2>
      <motion.div 
        className="bg-yellow-50 p-4 rounded-md shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Your Career Path: {career.name}</h3>
        <p className="text-sm mb-4 text-gray-600">{career.description}</p>
        <p className="text-lg font-semibold mb-1 text-yellow-600">Success Likelihood: {results.likelihood}</p>
        <p className="text-lg mb-2">Final Score: {score}/{totalQuestions * 100}</p>
        <motion.div 
          className="w-full bg-yellow-200 rounded-full h-4 mb-4"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div 
            className="bg-yellow-400 h-4 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${(score / (totalQuestions * 100)) * 100}%` }}
            transition={{ delay: 1, duration: 0.8 }}
          ></motion.div>
        </motion.div>
      </motion.div>
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-2">Quest Analysis</h3>
        <p className="text-sm text-gray-600">{results.analysis}</p>
      </motion.div>
      {results.similarCareers && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-2">Side Quests</h3>
          <ul className="list-none space-y-1">
            {results.similarCareers.map((career: string, index: number) => (
              <motion.li 
                key={index}
                className="text-sm text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                {career}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-sm"
        >
          Start a New Quest
        </Button>
      </motion.div>
    </motion.div>
  )
}


