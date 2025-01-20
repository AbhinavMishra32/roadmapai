import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface CareerInfo {
  career: string
  description: string
  keySkills: string[]
  salaryRange: string
  jobOutlook: string
  workLifeBalanceRating: number
  educationRequirements: string
  topCompanies: string[]
  personalizedAdvice: string
  strengthsMatch: string[]
  areasForImprovement: string[]
  careerGrowthPath: string[]
  metrics: {
    salaryTrend: number[]
    jobDemand: number[]
    skillsImportance: { skill: string; importance: number }[]
  }
}

interface ResultsPageProps {
  careerInfo: {
    careers: CareerInfo[]
    overallAnalysis: string
  }
}

export default function ResultsPage({ careerInfo }: ResultsPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-8 text-center text-gray-800">Your Career Analysis</motion.h1>
      
      <Tabs defaultValue={careerInfo.careers[0].career} className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-white border-b border-gray-200 overflow-x-auto overflow-y-hidden">
          {careerInfo.careers.map((career, index) => (
            <TabsTrigger 
              key={index} 
              value={career.career}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-500 data-[state=active]:text-yellow-500 data-[state=active]:border-b-2 data-[state=active]:border-yellow-500"
            >
              {career.career}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {careerInfo.careers.map((career, index) => (
          <TabsContent key={index} value={career.career}>
            <motion.div variants={itemVariants} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">{career.career}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{career.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-700">Salary Range (India)</h3>
                      <p className="text-yellow-500 font-bold">{career.salaryRange}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-700">Job Outlook</h3>
                      <p className="text-gray-600">{career.jobOutlook}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-700">Work-Life Balance</h3>
                      <div className="flex items-center">
                        <Progress value={career.workLifeBalanceRating * 20} className="w-full mr-4" indicatorColor='bg-gradient-to-l from-yellow-500 to-yellow-400 to-60%' />
                        <span className="text-yellow-500 font-bold">{career.workLifeBalanceRating}/5</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-700">Education Requirements</h3>
                      <p className="text-gray-600">{career.educationRequirements}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Key Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {career.keySkills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Top Companies</h3>
                  <ul className="list-disc list-inside mb-4 text-gray-600">
                    {career.topCompanies.map((company, idx) => (
                      <li key={idx}>{company}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Personal Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Personalized Advice</h3>
                  <p className="mb-4 text-gray-600">{career.personalizedAdvice}</p>
                  
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Your Strengths</h3>
                  <ul className="list-disc list-inside mb-4 text-gray-600">
                    {career.strengthsMatch.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Areas for Improvement</h3>
                  <ul className="list-disc list-inside mb-4 text-gray-600">
                    {career.areasForImprovement.map((area, idx) => (
                      <li key={idx}>{area}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Career Growth Path</h3>
                  <ol className="list-decimal list-inside mb-4 text-gray-600">
                    {career.careerGrowthPath.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Career Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Salary Trend (Last 5 Years)</h3>
                    <ChartContainer
                      config={{
                        salary: {
                          label: "Salary",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={career.metrics.salaryTrend.map((salary, year) => ({ year: 2019 + year, salary }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="salary" stroke="var(--color-salary)" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Job Demand Projection (Next 5 Years)</h3>
                    <ChartContainer
                      config={{
                        demand: {
                          label: "Demand",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={career.metrics.jobDemand.map((demand, year) => ({ year: 2024 + year, demand }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Skills Importance</h3>
                    <ChartContainer
                      config={{
                        importance: {
                          label: "Importance",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={career.metrics.skillsImportance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="skill" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="importance" fill="var(--color-importance)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
      
      <motion.section variants={itemVariants} className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Overall Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{careerInfo.overallAnalysis}</p>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  )
}

