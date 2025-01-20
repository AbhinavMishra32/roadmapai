import { motion } from 'framer-motion'

interface GameHeaderProps {
  quizState: 'prompt' | 'loading' | 'quiz' | 'analyzing' | 'results'
  score: number
  streak: number
}

export default function GameHeader({ quizState, score, streak }: GameHeaderProps) {
  return (
    <header className="text-gray-800 mt-3 mr-3">
      <div className="container mx-auto flex justify-end items-center">
        {/* <motion.h1 
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Career Quest Arcade
        </motion.h1> */}
        {quizState === 'quiz' && (
          <div className="flex items-center space-x-4 bg-yellow-300 py-2 px-4 rounded-full">
            <motion.div 
              className="text-xl font-semibold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Score: {score}
            </motion.div>
            <motion.div 
              className="text-xl font-semibold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Streak: {streak}
            </motion.div>
          </div>
        )}
      </div>
    </header>
  )
}

