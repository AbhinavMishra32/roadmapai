import { motion } from 'framer-motion'
import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'

interface Alternative {
  name: string
  provider: string
  cost: string
}

interface AlternativeCoursesProps {
  alternatives: Alternative[]
  onClose: () => void
}

export default function AlternativeCourses({ alternatives, onClose }: AlternativeCoursesProps) {
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-20 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black opacity-30" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3 }}
          className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
              Alternative Courses
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {alternatives.map((alternative, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{alternative.name}</h4>
                <p className="text-gray-600 mb-2">Provider: {alternative.provider}</p>
                <p className="text-yellow-500 font-bold">Cost: {alternative.cost}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Dialog>
  )
}

