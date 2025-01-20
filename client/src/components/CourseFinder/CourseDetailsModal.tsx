import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Course } from '@/types'

interface CourseDetailsModalProps {
  course: Course | null
  onClose: () => void
}

export function CourseDetailsModal({ course, onClose }: CourseDetailsModalProps) {
  if (!course) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700">Provider</h3>
              <p>{course.provider}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Cost</h3>
              <p>₹{course.cost.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Duration</h3>
              <p>{course.duration}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Financial Fit</h3>
              <p>{course.financialFit}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Career Outcome</h3>
            <p className="text-gray-600">{course.careerOutcome}</p>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Scholarships</h3>
            {course.scholarships.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {course.scholarships.map((scholarship, idx) => (
                  <li key={idx} className="text-gray-600">
                    {scholarship?.name}: ${scholarship?.amount?.toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No scholarships available for this course.</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Alternative Courses</h3>
            {course.alternatives.length > 0 ? (
              <div className="space-y-4">
                {course.alternatives.map((alt, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">{alt.name}</h4>
                    <p className="text-gray-600"><span className="font-medium">Provider:</span> {alt.provider}</p>
                    <p className="text-gray-600"><span className="font-medium">Cost:</span> ${alt.cost ? alt.cost.toLocaleString() : 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Duration:</span> {alt.duration}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No alternative courses available.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

