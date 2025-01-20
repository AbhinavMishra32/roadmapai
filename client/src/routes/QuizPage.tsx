'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronRight, Timer, AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { api } from '@/services/axios'
import QuizComplete from '@/components/QuizComplete'

interface Answer {
  id: number;
  text: string;
  questionId: number;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  text: string;
  answers: Answer[];
  correctAnswerId: number | null;
  quizId: number;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  no: number;
  category: string;
  categoryTitle: string;
  lessonCompleted: boolean;
  quizCompleted: boolean;
}

interface Quiz {
  id: number;
  categoryId: number;
  lessonId: number;
  questions: QuizQuestion[];
  lesson: Lesson;
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(15 * 60)
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/api/quiz/${id}`)
        console.log("Quiz response: ", response.data)
        setQuiz(response.data.quiz)
        setIsQuizComplete(response.data.isCompleted)
        if (response.data.quiz.score !== null && response.data.quiz.score !== undefined) {
          setQuizScore(response.data.quiz.score)
        }
      } catch (error) {
        console.log("Error in fetchQuiz(): ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsQuizComplete(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const progress = quiz ? (currentQuestion / quiz.questions.length) * 100 : 0

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleFinishQuiz = async () => {
    try {
      const finalScore = calculateScore();
      setQuizScore(finalScore);
      console.log("Final score: ", finalScore)
      const response = await api.post(`/api/quiz/${quiz?.id}/submit`, {
        score: finalScore
      })
      console.log("Quiz submission response: ", response.data)
    } catch (error) {
      console.log("Error in handleFinishQuiz(): ", error)
    } finally {
      setIsQuizComplete(true)
    }
  }

  const handleNextQuestion = async () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      const currentScore = calculateScore();
      setQuizScore(currentScore);
      setCurrentQuestion(prev => prev + 1);
    } else {
      await handleFinishQuiz();
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      const selectedAnswerId = selectedAnswers[index]
      const correctAnswer = question.answers.find(answer => answer.isCorrect)
      if (correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctAnswers++
        console.log("Correct answers: ", correctAnswers)
      }
    })
    return correctAnswers
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary animate-pulse">Loading Quiz...</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">Quiz not found</div>
      </div>
    )
  }

  if (isQuizComplete) {
    const scorePercentage = quizScore !== null
      ? (quizScore / quiz!.questions.length) * 100
      : (calculateScore() / quiz!.questions.length) * 100
    return (
      <QuizComplete score={scorePercentage} quizId={quiz.id} lessonId={quiz.lesson.id} lessonCategory={quiz.lesson.category} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{quiz.lesson.title}</h1>
              <p className="text-muted-foreground">{quiz.lesson.description}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-semibold">
              <Timer className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentQuestion + 1} of {quiz.questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {currentQuestion + 1}
                  </span>
                  <h2 className="text-xl font-semibold leading-tight">
                    {quiz.questions[currentQuestion].text}
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswers[currentQuestion]?.toString()}
                  onValueChange={(value) => {
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [currentQuestion]: parseInt(value)
                    })
                  }}
                  className="space-y-3"
                >
                  {quiz.questions[currentQuestion].answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className={`relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors hover:bg-muted ${
                        selectedAnswers[currentQuestion] === answer.id
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent'
                      }`}
                    >
                      <RadioGroupItem
                        value={answer.id.toString()}
                        id={`option-${answer.id}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`option-${answer.id}`}
                        className="flex grow cursor-pointer items-center gap-4"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {answer.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Select an answer to continue
                </div>
                <Button
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  onClick={handleNextQuestion}
                  className="gap-2"
                >
                  {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}