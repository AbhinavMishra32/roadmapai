import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CareerPromptProps {
  onStart: (interests: string) => void
}

export default function CareerPrompt({ onStart }: CareerPromptProps) {
  const [interests, setInterests] = useState('')

  return (
    <motion.div 
      className="text-center space-y-6 bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Discover Your Path
      </motion.h2>
      <motion.p 
        className="text-lg text-gray-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        What interests you most in a career?
      </motion.p>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Input
          type="text"
          placeholder="E.g., technology, art, science..."
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="w-full max-w-md mx-auto text-sm p-2 border border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400 rounded-md"
        />
        <Button 
          onClick={() => onStart(interests)} 
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-sm"
        >
          Start Quest
        </Button>
      </motion.div>
    </motion.div>
  )
}

