'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentCareers = [
  { id: 1, name: "Software Developer" },
  { id: 2, name: "Data Scientist" },
  { id: 3, name: "UX Designer" },
  { id: 4, name: "Product Manager" },
]

export default function RecentCareersCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full card-hover-effect">
        <CardHeader>
          <CardTitle>Recently Visited Careers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentCareers.map((career, index) => (
              <motion.li
                key={career.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-sm text-gray-600 hover:text-yellow-600 cursor-pointer"
              >
                {career.name}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

