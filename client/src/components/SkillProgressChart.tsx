import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Skill = {
  categoryTitle: string;
  A: number;
  fullMark: number;
  progress: number;
};

function calculateProgress(A: number, fullMark: number): number {
  return Math.round((A / fullMark) * 100);
}

export default function SkillProgressChart({ skills }: any) {

  console.log("skills: ", skills);
  const calculatedSkills = skills.map(skill => ({
    ...skill,
    progress: calculateProgress(skill.A, skill.fullMark)
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skill Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calculatedSkills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{skill.categoryTitle}</span>
                <span className="text-sm font-medium text-gray-500">{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-2" indicatorColor='bg-yellow-500' />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}