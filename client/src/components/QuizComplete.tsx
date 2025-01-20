"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import confetti from "canvas-confetti"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/axios"
import { useNavigate } from "react-router-dom"

const useScore = () => {
  const [score, setScore] = useState(0)
  useEffect(() => {
    setScore(Math.random() * 100)
  }, [])
  return score
}

export default function QuizComplete({score, quizId, lessonId, lessonCategory}: {score: number, quizId: number, lessonId: number, lessonCategory: string}) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true })
  const navigate = useNavigate();

  useEffect(() => {
    if (isInView && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y }
      })
    }
  }, [isInView])

  const handleTryAgain = async () => {
    try {
      const response = await api.post(`/api/quiz/${quizId}/reset`);
      console.log("Quiz reset response: ", response.data);
    } catch (error) {
      console.error("Error in handleTryAgain(): ", error)
    } finally {
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <motion.div
      ref={cardRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
      <Card className="w-[320px] border border-primary/20 shadow-xl">
        <CardContent className="p-8 space-y-6 text-center">
        <motion.h2
          className="text-2xl font-bold text-neutral-700"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Completed! 🎉
        </motion.h2>
        <motion.div
          className="text-xl text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          You scored
          <p className="text-6xl font-extrabold text-primary">
          {score.toFixed(0)}%
          </p>
        </motion.div>
        <motion.div
          className="relative h-1.5 bg-primary/10 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
        >
          <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <Button
          onClick={() => handleTryAgain()}
          className="hover:bg-neutral-600/10 font-medium border-2 px-8 py-2 rounded-full 
          transform transition-all hover:scale-105 active:scale-95"
          variant={'outline'}
          >
          Try Again
          </Button>
          <Button
          onClick={() => navigate(`/learn/${lessonCategory}/${lessonId}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-2 rounded-full 
          transform transition-all hover:scale-105 active:scale-95"
          >
          Continue
          </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}