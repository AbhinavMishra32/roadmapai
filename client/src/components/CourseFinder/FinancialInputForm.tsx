import { useState } from 'react'
import { motion } from 'framer-motion'

interface FinancialData {
  annualIncome: string
  savings: string
  monthlyBudget: string
  creditScore: string
  existingDebt: string
}

interface FinancialInputFormProps {
  onSubmit: (financialData: FinancialData, careerGoals: string) => void
}

export default function FinancialInputForm({ onSubmit }: FinancialInputFormProps) {
  const [financialData, setFinancialData] = useState<FinancialData>({
    annualIncome: '',
    savings: '',
    monthlyBudget: '',
    creditScore: '',
    existingDebt: '',
  })
  const [careerGoals, setCareerGoals] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(financialData, careerGoals)
  }

  const handleFinancialDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinancialData({ ...financialData, [e.target.name]: e.target.value })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Your Financial Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1">
            Annual Income
          </label>
          <input
            type="text"
            id="annualIncome"
            name="annualIncome"
            value={financialData.annualIncome}
            onChange={handleFinancialDataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. $50,000"
            required
          />
        </div>
        <div>
          <label htmlFor="savings" className="block text-sm font-medium text-gray-700 mb-1">
            Savings
          </label>
          <input
            type="text"
            id="savings"
            name="savings"
            value={financialData.savings}
            onChange={handleFinancialDataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. $10,000"
            required
          />
        </div>
        <div>
          <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Budget for Education
          </label>
          <input
            type="text"
            id="monthlyBudget"
            name="monthlyBudget"
            value={financialData.monthlyBudget}
            onChange={handleFinancialDataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. $500"
            required
          />
        </div>
        <div>
          <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700 mb-1">
            Credit Score
          </label>
          <input
            type="text"
            id="creditScore"
            name="creditScore"
            value={financialData.creditScore}
            onChange={handleFinancialDataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 700"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="existingDebt" className="block text-sm font-medium text-gray-700 mb-1">
            Existing Debt
          </label>
          <input
            type="text"
            id="existingDebt"
            name="existingDebt"
            value={financialData.existingDebt}
            onChange={handleFinancialDataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. $20,000 student loans, $5,000 credit card debt"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 mb-1">
          Career Goals
        </label>
        <textarea
          id="careerGoals"
          value={careerGoals}
          onChange={(e) => setCareerGoals(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="Describe your career goals and aspirations"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        Get Course Recommendations
      </button>
    </motion.form>
  )
}

