import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, GraduationCap, TrendingUp, Briefcase, Brain, Target, Code, School, LineChart, Database } from 'lucide-react'
import { api } from '@/services/axios'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const capitalizeFirstLetter = "first-letter:uppercase"

interface CareerData {
    code: string
    title: string
    tags: {
        bright_outlook: boolean
        green: boolean
        apprenticeship: boolean
    };
    also_called?: {
        title: string[]
    }
    what_they_do: string
    on_the_job?: {
        task: string[]
    }
    knowledge?: {
        group: Array<{
            title: { name: string }
            element: Array<{ name: string }>
        }>
    }
    skills?: {
        group: Array<{
            title: { name: string }
            element: Array<{ name: string }>
        }>
    }
    abilities?: {
        group: Array<{
            title: { name: string }
            element: Array<{ name: string }>
        }>
    }
    personality?: {
        top_interest: {
            title: string
            description: string
        }
        work_styles: {
            element: Array<{ name: string }>
        }
    }
    technology?: {
        category: Array<{
            title: { name: string }
            example: Array<{ name: string; hot_technology?: string }>
        }>
    }
    education?: {
        education_usually_needed: {
            category: string[]
        }
    }
    jobOutlook?: {
        outlook: {
            description: string
            category: string
        }
        salary: {
            annual_median: number
        }
    }
}

export default function CareerPage() {
    const { careerCode } = useParams()
    const [careerData, setCareerData] = useState<CareerData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCareerData = async () => {
            try {
                const response = await api.get('/api/careers/' + careerCode);
                const data = response.data.data
                setCareerData(data)
            } catch (err) {
                console.error('Error fetching career data:', err)
                setError('Error fetching career data. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchCareerData()
    }, [careerCode])

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return <ErrorMessage message={error} />
    }

    if (!careerData) {
        return <ErrorMessage message="No career data available." />
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">{careerData?.title}</h1>
                        </div>
                        {careerData?.tags && (
                            <div className="flex gap-2">
                                {careerData.tags.bright_outlook && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        Bright Outlook
                                    </Badge>
                                )}
                                {careerData.tags.green && (
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                        Green
                                    </Badge>
                                )}
                                {careerData.tags.apprenticeship && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        Apprenticeship
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={`text-lg text-gray-700 capitalize`}>{careerData?.what_they_do}</p>

                                {careerData?.also_called?.title && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold mb-2">Also Known As</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {careerData.also_called.title.map((title, index) => (
                                                <Badge key={index} variant="outline">
                                                    {title}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {careerData?.on_the_job?.task && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Key Responsibilities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {careerData.on_the_job.task.map((task, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm">
                                                    {index + 1}
                                                </span>
                                                <span className={`text-gray-700 capitalize`}>{task}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            {careerData?.knowledge && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Brain className="h-5 w-5" />
                                            Knowledge Areas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {careerData.knowledge.group?.map((group, index) => (
                                            <div key={index} className="mb-4 last:mb-0">
                                                <h3 className="font-semibold mb-2">{group?.title?.name}</h3>
                                                <ul className="space-y-1">
                                                    {group?.element?.map((item, itemIndex) => (
                                                        <li key={itemIndex} className={`text-gray-700 capitalize`}>
                                                            • {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {careerData?.skills && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="h-5 w-5" />
                                            Required Skills
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {careerData.skills.group?.map((group, index) => (
                                            <div key={index} className="mb-4 last:mb-0">
                                                <h3 className="font-semibold mb-2">{group?.title?.name}</h3>
                                                <ul className="space-y-1">
                                                    {group?.element?.map((item, itemIndex) => (
                                                        <li key={itemIndex} className="text-gray-700 capitalize">
                                                            • {item.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-yellow-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5" />
                                    Powered by O*NET
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    Career data provided by the O*NET (Occupational Information Network) API,
                                    a comprehensive source for occupational information.
                                </p>
                                <a
                                    href="https://www.onetonline.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block bg-white text-neutral-600 border shadow-inner px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors"
                                >
                                    Learn More
                                </a>
                            </CardContent>
                        </Card>
                        {careerData?.jobOutlook && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LineChart className="h-5 w-5" />
                                        Career Outlook
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">
                                                    Annual Median Salary
                                                </span>
                                                <span className="text-lg font-bold">
                                                    {(careerData?.jobOutlook?.salary?.annual_median * 82.5 * 0.3).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                </span>
                                            </div>
                                            <Progress value={(careerData?.jobOutlook?.salary?.annual_median * 82.5 * 0.3) / 4000000 * 100} className="h-2" indicatorColor='bg-yellow-400' />
                                        </div>
                                        <div>
                                            <Badge className="bg-green-100 text-green-800">
                                                {careerData.jobOutlook.outlook?.category}
                                            </Badge>
                                            <p className={`mt-2 text-sm text-gray-600 capitalize`}>
                                                {careerData.jobOutlook.outlook?.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {careerData?.education && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Education Required
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {careerData.education.education_usually_needed?.category?.map((edu, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <School className="h-4 w-4" />
                                                <span className={`text-gray-700 capitalize`}>{edu}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {careerData?.technology && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Code className="h-5 w-5" />
                                        Technology & Tools
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {careerData.technology.category?.map((cat, index) => (
                                        <div key={index} className="mb-4 last:mb-0">
                                            <h3 className="font-semibold mb-2">{cat?.title?.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {cat?.example?.map((tech, techIndex) => (
                                                    <Badge
                                                        key={techIndex}
                                                        variant={tech.hot_technology ? "default" : "outline"}
                                                        className={tech.hot_technology ? 'bg-yellow-300 text-black hover:bg-yellow-400/90' : 'bg-white'}
                                                    >
                                                        {tech.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {careerData?.personality && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="h-5 w-5" />
                                        Personality Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {careerData.personality.top_interest && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold mb-2">
                                                {careerData.personality.top_interest.title}
                                            </h3>
                                            <p className={`text-sm text-gray-600 capitalize`}>
                                                {careerData.personality.top_interest.description}
                                            </p>
                                        </div>
                                    )}
                                    {careerData.personality.work_styles?.element && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Work Styles</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {careerData.personality.work_styles.element.map((style, index) => (
                                                    <Badge key={index} variant="outline">
                                                        {style.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
    </div>
)

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <p>{message}</p>
        </div>
    </div>
)

