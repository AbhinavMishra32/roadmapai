'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark } from 'lucide-react'
import { useEffect, useState } from 'react'

const savedCareers = localStorage.getItem('savedCareers') || [];

console.log("savedCareers", savedCareers)

interface Career {
  id: number
  title: string
  trend: string
}

export default function SavedCareersCard() {
  const [savedCareers, setSavedCareers] = useState<Career[]>([])

  useEffect(() => {
    const storedCareers = localStorage.getItem('savedCareers')
    if (storedCareers) {
      setSavedCareers(JSON.parse(storedCareers))
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="h-full card-hover-effect">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bookmark className="w-5 h-5 mr-2" />
            Saved Careers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {savedCareers.map((career, index) => (
              <motion.li
                key={career.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium">{career.title}</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {career.trend}
                </Badge>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

