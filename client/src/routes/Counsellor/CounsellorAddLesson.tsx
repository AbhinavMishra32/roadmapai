'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import LessonForm from '../../components/LessonCreator/LessonForm'
import QuizForm from '../../components/LessonCreator/QuizForm'
import SuccessModal from '../../components/LessonCreator/SuccessModal'
import ProgressBar from '../../components/LessonCreator/ProgressBar'
import { api } from '@/services/axios'
import { useParams } from 'react-router-dom'

export default function LessonCreator() {
  const {id} = useParams();
  const [step, setStep] = useState(1)
  const [lessonData, setLessonData] = useState({})
  const [quizData, setQuizData] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  interface Student {
    username: string;
    email: string;
    grade: string;
    school: string;
    stream: string;
    learningStyle: string;
    careerGoal: string;
    subjects: string[];
  }
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLessonSubmit = (data) => {
    setLessonData(data)
    setStep(2)
  }

  const handleQuizSubmit = async (data) => {
    setQuizData(data)
    const fullData = { ...lessonData, ...data, studentId: id }
    console.log('Submitting lesson:', fullData)
    try {
      await api.post('/api/lesson/create', fullData)
      console.log('Lesson submitted:', fullData)
      setShowSuccess(true)
    } catch (error) {
      console.error('Error submitting lesson:', error)
    }
  }

  useEffect(() => {
    const fetchStudent = async () => {
      if (id) {
        try {
          const { data } = await api.get(`/api/student/${id}`);
          console.log('Fetched student:', data);
          setStudent(data.student);
          setStep(1);
        } catch (error) {
          console.error('Error fetching lesson:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Name:</span> {student?.username}</p>
              <p><span className="font-medium">Email:</span> {student?.email}</p>
              <p><span className="font-medium">Grade:</span> {student?.grade}</p>
              <p><span className="font-medium">School:</span> {student?.school}</p>
            </div>
            <div>
              <p><span className="font-medium">Stream:</span> {student?.stream}</p>
              <p><span className="font-medium">Learning Style:</span> {student?.learningStyle}</p>
              <p><span className="font-medium">Career Goal:</span> {student?.careerGoal}</p>
              <p><span className="font-medium">Subjects:</span> {student?.subjects?.join(', ')}</p>
            </div>
          </div>
          <ProgressBar currentStep={step} totalSteps={2} />
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="lesson-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <LessonForm onSubmit={handleLessonSubmit} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="quiz-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <QuizForm onSubmit={handleQuizSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>
    </div>
  )
}

