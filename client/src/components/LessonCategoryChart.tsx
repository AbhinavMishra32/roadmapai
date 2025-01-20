'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { category: "Self-Discovery", completed: 5, remaining: 2 },
  { category: "Career Exploration", completed: 3, remaining: 4 },
  { category: "Skill Development", completed: 2, remaining: 6 },
  { category: "Job Search", completed: 1, remaining: 5 },
]

export default function LessonCategoryChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full card-hover-effect">
        <CardHeader>
          <CardTitle>Lesson Progress by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="category" />
              <YAxis />
              <Bar dataKey="completed" stackId="a" fill="#FBBF24" />
              <Bar dataKey="remaining" stackId="a" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

