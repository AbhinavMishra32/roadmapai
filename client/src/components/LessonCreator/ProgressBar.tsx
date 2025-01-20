import { motion } from 'framer-motion'

export default function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
      <motion.div
        className="h-full bg-yellow-400"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  )
}

