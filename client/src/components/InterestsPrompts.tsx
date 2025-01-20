'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface InterestsPromptProps {
  interests: string
  setInterests: (interests: string) => void
  onSubmit: () => void
}

export default function InterestsPrompt({ interests, setInterests, onSubmit }: InterestsPromptProps) {
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="w-full max-w-3xl"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-5xl font-bold text-center mb-2 text-yellow-500" style={{textShadow: '0 6px 10px rgba(0, 0, 0, 0.1)'}}
        >
            Find your dream career
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-2xl font-bold text-center mb-8 text-gray-500"
        >
            Tell us about your interests
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <motion.div
              className="relative mb-6"
            >
              <Textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="I enjoy solving puzzles, working with technology, and helping others. I'm fascinated by science and love to learn new things..."
                className="w-full h-40 p-6 text-lg border-2 border-yellow-200 rounded-2xl focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-300 ease-in-out resize-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={interests ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-3 -right-3"
              >
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </motion.div>
            </motion.div>
            <Button
              onClick={onSubmit}
              disabled={!interests.trim()}
              className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 shadow-lg"
            >
              Explore Your Future <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-center mt-8 text-gray-600 text-lg"
        >
          Unlock your potential and find a career that truly resonates with you.
        </motion.p>
        <div className="flex justify-center">
          <Button
          onClick={() => navigate('/careerunsure')}
            className="mt-4 w-[80%] h-16 text-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg"
          >
            Unsure about your career choice?
          </Button>
        </div>
      </motion.div>
      <BackgroundElements />
    </div>
  )
}


function BackgroundElements() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </>
  )
}

