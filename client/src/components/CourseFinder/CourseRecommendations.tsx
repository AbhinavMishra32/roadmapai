'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Star, IndianRupee } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CourseModal from './CourseModal'

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

interface CourseRecommendationsProps {
  recommendations: {
    courses: Course[]
    analysis: string
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
}

export default function CourseRecommendations({ recommendations }: CourseRecommendationsProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [sortBy, setSortBy] = useState<keyof Course>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const sortedCourses = [...recommendations.courses].sort((a, b) => {
    if (sortBy === "cost" || sortBy === "rating") {
      return sortOrder === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    }
    const aValue = a[sortBy].toString().toLowerCase()
    const bValue = b[sortBy].toString().toLowerCase()
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })

  const handleSort = (key: keyof Course) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("asc")
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md border border-gray-100"
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis</h2>
          <p className="text-gray-600 leading-relaxed">{recommendations.analysis}</p>
        </div>
      </motion.div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Recommended Courses</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("name")}
            className="text-gray-600"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("cost")}
            className="text-gray-600"
          >
            Cost
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("rating")}
            className="text-gray-600"
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedCourses.map((course, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelectedCourse(course)}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-yellow-600 flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {course.cost.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-500">{course.duration}</span>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-500">{course.provider}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-gray-700 font-medium">{course.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedCourse && (
          <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}