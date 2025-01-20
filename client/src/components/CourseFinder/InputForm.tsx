import { useState } from 'react'
import { motion } from 'framer-motion'

interface InputFormProps {
  onSubmit: (financialSituation: string, careerGoals: string) => void
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [financialSituation, setFinancialSituation] = useState('')
  const [careerGoals, setCareerGoals] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(financialSituation, careerGoals)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-lg p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <label htmlFor="financialSituation" className="block text-gray-700 text-sm font-bold mb-2">
          Financial Situation
        </label>
        <textarea
          id="financialSituation"
          value={financialSituation}
          onChange={(e) => setFinancialSituation(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
          rows={4}
          placeholder="Describe your current financial situation..."
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="careerGoals" className="block text-gray-700 text-sm font-bold mb-2">
          Career Goals
        </label>
        <textarea
          id="careerGoals"
          value={careerGoals}
          onChange={(e) => setCareerGoals(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
          rows={4}
          placeholder="Describe your career goals and aspirations..."
          required
        />
      </div>
      <motion.button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Recommendations
      </motion.button>
    </motion.form>
  )
}

