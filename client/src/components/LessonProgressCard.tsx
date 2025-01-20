'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from 'lucide-react'

// const lessons = [
//   { id: 1, name: "Introduction to Career Planning", completed: true },
//   { id: 2, name: "Identifying Your Strengths", completed: true },
//   { id: 3, name: "Exploring Career Paths", completed: true },
//   { id: 4, name: "Building Your Resume", completed: false },
//   { id: 5, name: "Networking Strategies", completed: false },
//   { id: 6, name: "Interview Preparation", completed: false },
//   { id: 7, name: "Negotiation Skills", completed: false },
// ]


export default function CourseProgressCard({ courseProgress }: any) {
  const completedCourses = courseProgress.filter((lesson: { completed: boolean }) => lesson.completed).length
  const totalCourses = courseProgress.length
  const progressPercentage = (completedCourses / totalCourses) * 100

  console.log("courseProgress: ", courseProgress);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" indicatorColor='bg-yellow-500'/>
          <p className="text-sm text-gray-600 mt-2">{completedCourses} of {totalCourses} courses completed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseProgress.map((course: { id: number; name: string; completed: boolean, categoryTitle: string }, index: number) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center p-3 rounded-lg ${course.completed ? 'bg-green-50' : 'bg-gray-50'}`}
            >
              {course.completed ? (
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 mr-3 text-gray-400" />
              )}
              <span className="text-sm">{course.categoryTitle}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

