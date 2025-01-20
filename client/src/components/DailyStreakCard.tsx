import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame } from 'lucide-react'

interface DailyStreakProps {
  currentStreak: number
  longestStreak: number
}

export default function DailyStreakCard({ currentStreak, longestStreak }: DailyStreakProps) {
  const streakPercentage = (currentStreak / longestStreak) * 100

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-yellow-500" />
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-4xl font-bold text-yellow-500 mb-2">{currentStreak}</div>
          <Badge variant="outline" className="mb-4">
            {currentStreak === 1 ? 'day' : 'days'}
          </Badge>
        </motion.div>
        <Progress value={streakPercentage} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Current</span>
          <span>Longest: {longestStreak} days</span>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-center text-sm text-gray-600"
        >
          {currentStreak < longestStreak
            ? `${longestStreak - currentStreak} days to beat your record!`
            : "You're on a roll! New record!"}
        </motion.div>
      </CardContent>
    </Card>
  )
}

