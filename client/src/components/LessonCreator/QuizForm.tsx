import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from 'lucide-react'

const quizCategories = [
  { category: 'counselingacademic', categoryTitle: 'Counseling & Academic' },
  { category: 'careerexploration', categoryTitle: 'Career Exploration' },
]

export default function QuizForm({ onSubmit }) {
  const [quizData, setQuizData] = useState({
    quizCategory: '',
    quizQuestions: [
      {
        questionText: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ],
  })

  const handleQuizCategoryChange = (value) => {
    const selectedCategory = quizCategories.find(cat => cat.category === value)
    setQuizData({ 
      ...quizData, 
      quizCategory: selectedCategory.categoryTitle
    })
  }

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...quizData.quizQuestions]
    newQuestions[index].questionText = e.target.value
    setQuizData({ ...quizData, quizQuestions: newQuestions })
  }

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const newQuestions = [...quizData.quizQuestions]
    newQuestions[questionIndex].answers[answerIndex].text = e.target.value
    setQuizData({ ...quizData, quizQuestions: newQuestions })
  }

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    const newQuestions = [...quizData.quizQuestions]
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === answerIndex,
    }))
    setQuizData({ ...quizData, quizQuestions: newQuestions })
  }

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      quizQuestions: [
        ...quizData.quizQuestions,
        {
          questionText: '',
          answers: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    })
  }

  const removeQuestion = (index) => {
    const newQuestions = [...quizData.quizQuestions]
    newQuestions.splice(index, 1)
    setQuizData({ ...quizData, quizQuestions: newQuestions })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(quizData)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card>
        <CardContent className="p-6">
          <Select
            value={quizData.quizCategory}
            onValueChange={handleQuizCategoryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Quiz Category" />
            </SelectTrigger>
            <SelectContent>
              {quizCategories.map((category) => (
                <SelectItem key={category.category} value={category.category}>
                  {category.categoryTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <AnimatePresence>
        {quizData.quizQuestions.map((question, qIndex) => (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                  {qIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder={`Question ${qIndex + 1}`}
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  required
                  className="mb-4"
                />
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder={`Answer ${aIndex + 1}`}
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                      required
                      className="flex-grow"
                    />
                    <Checkbox
                      checked={answer.isCorrect}
                      onCheckedChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                      className="border-yellow-400 text-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={addQuestion}
          className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
        <Button type="submit" className="bg-yellow-400 text-white hover:bg-yellow-500 transition-colors duration-300">
          Create Lesson
        </Button>
      </div>
    </motion.form>
  )
}

