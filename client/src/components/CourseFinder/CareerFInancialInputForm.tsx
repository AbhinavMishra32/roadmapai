import { useState } from 'react'
import { motion } from 'framer-motion'

interface CareerFinancialInputFormProps {
  onSubmit: (careerPath: string, financialCondition: string) => void
}

export default function CareerFinancialInputForm({ onSubmit }: CareerFinancialInputFormProps) {
  const [careerPath, setCareerPath] = useState('')
  const [financialCondition, setFinancialCondition] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(careerPath, financialCondition)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Your Career and Financial Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="careerPath" className="block text-sm font-medium text-gray-700 mb-1">
            Desired Career Path
          </label>
          <textarea
            id="careerPath"
            value={careerPath}
            onChange={(e) => setCareerPath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Describe your desired career path and goals"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="financialCondition" className="block text-sm font-medium text-gray-700 mb-1">
            Financial Condition
          </label>
          <textarea
            id="financialCondition"
            value={financialCondition}
            onChange={(e) => setFinancialCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Describe your current financial situation and budget for education"
            required
          ></textarea>
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        Get Course Recommendations
      </button>
    </motion.form>
  )
}

