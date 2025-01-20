import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BookOpen, Brain, Briefcase, ChevronRight, GraduationCap, Lightbulb, Rocket, School, Sparkles, Star, Users, Zap } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const quizzes = [
  { id: 1, title: "Academic Skills", description: "Enhance your study techniques", icon: GraduationCap, color: "#FF6B6B" },
  { id: 2, title: "Competitive Exams", description: "Prepare for standardized tests", icon: Award, color: "#FFD93D" },
  { id: 3, title: "College Trivia", description: "Test your campus knowledge", icon: School, color: "#6BCB77" },
  { id: 4, title: "Career Aptitude", description: "Discover your professional path", icon: Briefcase, color: "#4D96FF" },
  { id: 5, title: "Study Habits", description: "Optimize your learning routine", icon: BookOpen, color: "#FF6B6B" },
  { id: 6, title: "Social Skills", description: "Improve interpersonal abilities", icon: Users, color: "#FFD93D" },
  { id: 7, title: "Critical Thinking", description: "Sharpen your analytical skills", icon: Brain, color: "#6BCB77" },
  { id: 8, title: "Personal Growth", description: "Develop self-awareness", icon: Lightbulb, color: "#4D96FF" },
]

export default function LessonsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // const handleCardClick = (id: number, title: string) => {
  //   // alert(`Navigating to Quiz ${id}`)
  //   // In a real application, you would use router.push(`/quiz/${id}`) here
  // }
  return (
    <>
    <div className='w-full h-full'>
      <div className='flex flex-col  w-full h-full'>
      <div className='w-full h-28'>
        <div className='px-5 pt-5'>
        <h1 className='text-4xl font-semibold text-left'>Learn New Skills</h1>
        <h3 className='text-lg text-neutral-400 text-left'>Choose a category to get started</h3>
        </div>
      </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-3 md:px-6">
            {quizzes.map((quiz) => (
              <Link to={`/learn/${quiz.title.replace(/\s+/g, '').toLowerCase()}`}>
                <Card
                  key={quiz.id}
                  className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
                  onMouseEnter={() => setHoveredCard(quiz.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                // onClick={() => handleCardClick(quiz.id, quiz.title)}
                >
                  <div className="absolute inset-0 z-0" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold text-gray-800">{quiz.title}</CardTitle>
                      <quiz.icon
                        className="w-8 h-8 transition-all duration-300 group-hover:scale-110"
                        style={{ color: quiz.color }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                    <motion.div
                      className="h-1 bg-gray-300 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredCard === quiz.id ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                      style={{ backgroundColor: hoveredCard === quiz.id ? quiz.color : "" }}
                    />
                  </CardContent>
                </Card>
              </Link>

          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export function QuizCard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex p-4">
      <motion.div
        className="relative"
        initial={false}
        animate={isHovered ? "hover" : "rest"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="w-96 h-full bg-white overflow-hidden cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-[#4D96FF] via-[#6BCB77] to-[#FFD93D]"
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute inset-1 h-full bg-white rounded-2xl flex flex-col items-start justify-between p-6"
            variants={{
              rest: { opacity: 1 },
              hover: { opacity: 0.97 }
            }}
          >
            <div>
              <motion.div
                className="mb-4 inline-block"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.1 }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Sparkles className="w-10 h-10 text-[#4D96FF]" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Innovative Solution</h2>
              <p className="text-gray-600 mb-6">Experience the future of productivity with our cutting-edge technology.</p>
            </div>
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Button className="group" variant="outline">
                    Explore Features
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#4D96FF]"
            variants={{
              rest: { scaleX: 0 },
              hover: { scaleX: 1 }
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </Card>

        <motion.div
          className="absolute -inset-px bg-gradient-to-br from-[#4D96FF] via-[#6BCB77] to-[#FFD93D] rounded-xl opacity-0 -z-10"
          variants={{
            rest: { opacity: 0, scale: 0.95 },
            hover: { opacity: 0.7, scale: 1 }
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </div>
  )
}
