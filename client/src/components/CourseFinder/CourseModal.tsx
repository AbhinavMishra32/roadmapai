'use client'

import { motion } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { X, Clock, Building2, IndianRupee, GraduationCap, Star, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Course {
  name: string
  description: string
  cost: number
  duration: string
  provider: string
  field: string
  rating: number
  learningStyle: string
}

interface CourseModalProps {
  course: Course
  onClose: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

export default function CourseModal({ course, onClose }: CourseModalProps) {
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 sm:p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                {course.field}
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-5 w-5 fill-yellow-500" />
                <span className="font-semibold text-lg">{course.rating.toFixed(1)}</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{course.name}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium text-gray-800">{course.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Cost</p>
                  <p className="font-medium text-yellow-600">₹{course.cost.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Learning Style</p>
                  <p className="font-medium text-gray-800 capitalize">{course.learningStyle}</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Enroll Now
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  )
}

