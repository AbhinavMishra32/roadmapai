import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

type courseMarksProps = {
  categoryTitle: string,
  A: number,
  fullMark: number
}

type SkillsRadarChartProps = {
  courseMarks: courseMarksProps[]
}

export default function SkillsRadarChart({ courseMarks }: SkillsRadarChartProps) {
  const data = courseMarks;
  console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full card-hover-effect">
        <CardHeader>
          <CardTitle>Skills Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="categoryTitle" />
                <PolarRadiusAxis />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#FBBF24"
                  fill="#FBBF24"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

