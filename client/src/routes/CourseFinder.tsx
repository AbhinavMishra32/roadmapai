'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, TrendingUp, Shield, Code, LineChart, Binary } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { generateRecommendations } from '@/utils/aiUtils'
import { CourseDetailsModal } from '@/components/CourseFinder/CourseDetailsModal'
import { LoadingAnimation } from '@/components/CourseFinder/LoadingAnimation-2'
import { Course } from '@/types'

export default function Home() {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [careerPath, setCareerPath] = useState('')
  const [financialCondition, setFinancialCondition] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await generateRecommendations(careerPath, financialCondition)
      setRecommendations(result)
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'database architect':
        return <Database className="w-6 h-6 text-yellow-500" />
      case 'data scientist':
        return <TrendingUp className="w-6 h-6 text-yellow-500" />
      case 'information security engineer':
        return <Shield className="w-6 h-6 text-yellow-500" />
      case 'software developer':
        return <Code className="w-6 h-6 text-yellow-500" />
      case 'blockchain engineer':
        return <Binary className="w-6 h-6 text-yellow-500" />
      default:
        return <LineChart className="w-6 h-6 text-yellow-500" />
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Professional Course Finder</h1>
        
        {!recommendations ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Career Path
          </label>
          <Input
            value={careerPath}
            onChange={(e) => setCareerPath(e.target.value)}
            placeholder="Describe your desired career path"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            required
          />
              </div>
              <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Financial Condition
          </label>
          <Input
            value={financialCondition}
            onChange={(e) => setFinancialCondition(e.target.value)}
            placeholder="Describe your financial situation"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            required
          />
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md shadow-sm transition duration-300 ease-in-out transform hover:scale-105">
          Find Courses
              </Button>
            </div>
          </motion.form>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 mb-6"
            >
              <h2 className="text-xl font-semibold mb-2">Analysis</h2>
              <p className="text-gray-600">{recommendations.analysis}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.courses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                    {getIcon(course.name)}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{course.provider}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                      {course.financialFit}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      Very High Potential
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        ₹{course.cost.toLocaleString("en-IN")}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-1">🎓</span>
                      Bachelor's
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">🎯</span>
                      {course.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />

        {loading && <LoadingAnimation />}
      </div>
    </main>
  )
}

