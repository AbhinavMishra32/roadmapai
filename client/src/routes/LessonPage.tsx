'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { BookOpen, ChevronRight, CheckCircle, ArrowRight, Lock } from 'lucide-react'

interface LessonContent {
  id: number
  lessonId: number
  p1: string
  p2: string
  p3: string
  p4: string
  sbh1: string
  sbh2: string
  sbh3: string
  sbh4: string
}

interface Lesson {
  category: string
  categoryTitle: string
  content: LessonContent[]
  description: string
  id: number
  no: number
  title: string
  quizes: Quiz[]
}

interface Quiz {
    id: number;
    categoryId: number;
    lessonId: number;
}

interface LessonResponse {
  lesson: Lesson
  message: string
  success: boolean
  isCompleted: boolean
}

const LessonPage = () => {
    const { id, category } = useParams();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [quizId, setQuizId] = useState<number>();
    const [progress, setProgress] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [lessonCompleted, setLessonCompleted] = useState(false)
    const [isHoveredOnFinishLessonButton, setIsHoveredOnFinishLessonButton] = useState<boolean>()
    const scrollRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate();
    let lastScrollY = window.scrollY;
    const [scrollDown, setScrollDown] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await api.get<LessonResponse>(`/api/lesson/${category}/${id}`);
                console.log("Lesson: ", response.data);
                setLesson(response.data.lesson);
                setLessonCompleted(response.data.isCompleted);
                console.log('Quiz Id: ', response.data.lesson.quizes[0].id);
                setQuizId(response.data.lesson.quizes[0].id);
            } catch (error) {
                console.log("Error in fetchLesson(): ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLesson();
    }, [id, category]);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer)
                    return 100
                }
                const diff = Math.random() * 10
                return Math.min(oldProgress + diff, 100)
            })
        }, 500)

        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        if (quizId !== undefined) {
            const fetchQuiz = async () => {
                try {
                    const response = await api.get(`/api/quiz/${quizId}`);
                    console.log("Quiz: ", response.data);
                    setQuizCompleted(response.data.isCompleted);
                } catch (error) {
                    console.log("Error in fetchQuiz(): ", error);
                }
            }

            fetchQuiz();
        }
    }, [quizId]);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setScrollDown(true);
        }
        else {
            setScrollDown(false);
        }

        lastScrollY = window.scrollY;
    }

    useEffect(()=> {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);


    const handleFinishLesson = async () => {
        if (quizCompleted && !lessonCompleted) {
            try {
            const response = await api.post(`/api/lesson/${category}/${id}/submit`);
            console.log("Lesson submission response: ", response.data);
            setLessonCompleted(response.data.isCompleted);
            } catch (error) {
                console.log("Error in handleFinishLesson(): ", error);
            }
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
                <div className="text-center">
                    <BookOpen className="mx-auto h-16 w-16 text-blue-500 animate-pulse" />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-900">Loading your lesson</h2>
                    <Progress value={progress} className="mt-4 w-60" />
                </div>
            </div>
        )
    }

    if (!lesson) return null

    const { content, title, description, categoryTitle, quizes } = lesson
    const lessonContent = content[0]

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <Card className="w-full min-h-screen rounded-none border-none">
            <div className={`border-b-2 backdrop-blur-lg sticky top-12 w-full z-10 transition-all duration-500 ease-in-out ${
                scrollDown 
                ? 'py-2 bg-white/80' 
                : 'p-4 md:p-5 bg-gray-200/30'
            }`}>
                <div className={`flex items-center gap-2 text-sm font-medium text-gray-600 transition-all duration-500 ${
                scrollDown ? 'opacity-0 h-0' : 'opacity-100'
                }`}>
                <BookOpen className="h-5 w-5" />
                {categoryTitle}
                </div>
                <h1 className={`font-semibold transition-all duration-500 ${
                scrollDown 
                ? 'ml-4 text-xl md:text-2xl' 
                : 'text-3xl md:text-4xl'
                }`}>{title}</h1>
                <p className={`text-gray-500 transition-all duration-500 ${
                scrollDown 
                ? 'ml-4 text-sm mt-0.5 line-clamp-1' 
                : 'text-lg mt-2'
                }`}>{description}</p>
            </div>
            <CardContent className="px-6 md:px-10 pt-6 pb-20">
                        <div className="space-y-8">
                            {[1, 2, 3, 4].map((num) => (
                                <section key={num} className="group bg-white w-[100%] border rounded-2xl shadow-lg p-4 overflow-hidden">
                                    <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                            {num}
                                        </span>
                                        {lessonContent[`sbh${num}` as keyof LessonContent]}
                                    </h2>
                                    <p className="leading-relaxed text-gray-700">
                                        {lessonContent[`p${num}` as keyof LessonContent]}
                                    </p>
                                </section>
                            ))}
                            <section className="group bg-white w-[100%] border rounded-2xl shadow-lg p-4 overflow-hidden">
                                <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                        <CheckCircle className="h-5 w-5" />
                                    </span>
                                    Quiz
                                </h2>
                                <p className="leading-relaxed text-gray-700 mb-4">
                                    Complete the quiz to finish this lesson.
                                </p>
                                <Button 
                                    // onClick={handleCompleteQuiz}
                                    disabled={quizCompleted}
                                    className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    {quizCompleted ? (
                                        <span
                                            className="flex items-center"
                                        >Quiz Completed! <CheckCircle className="ml-2 h-5 w-5" />
                                        </span>
                                    ) : (
                                                <span className="flex items-center" onClick={()=> navigate(`/quiz/${quizes[0].id}`)}>
                                                    Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
                                                </span>
                                    )}
                                </Button>
                            </section>
                        </div>
                </CardContent>
                <div className="fixed bottom-0 backdrop-blur-xl right-0 p-0 m-4 shadow-2xl rounded-xl">
                    {lessonCompleted ? (
                        <Button 
                            onClick={handleFinishLesson}
                            onMouseEnter={() => setIsHoveredOnFinishLessonButton(true)}
                            onMouseLeave={() => setIsHoveredOnFinishLessonButton(false)}
                            className="w-[220px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 backdrop-blur-sm py-3 text-lg font-semibold rounded-lg shadow-md"
                        >
                            {isHoveredOnFinishLessonButton ? (
                                <Link to={`/learn/${category}`}>
                                    <span className="flex items-center justify-center">
                                        Go Back
                                        {!isHoveredOnFinishLessonButton && <CheckCircle className="ml-2 h-5 w-5" />}
                                    </span>
                                </Link>
                            ) : (
                            <span className="flex items-center justify-center">
                                Lesson Completed
                                {!isHoveredOnFinishLessonButton && <CheckCircle className="ml-2 h-5 w-5" />}
                            </span>
                            )}
                        </Button>
                    ) : (
                            <Button 
                                disabled={!quizCompleted}
                                onClick={() => handleFinishLesson()}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 backdrop-blur-sm disabled:cursor-not-allowed py-3 text-lg font-semibold rounded-lg shadow-md"
                            >
                                <span className="flex items-center justify-center">
                                    Finish Lesson {quizCompleted ? <ArrowRight className='ml-2 h-5 w-5' /> : <Lock className="ml-2 h-5 w-5" />}
                                </span>
                            </Button>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default LessonPage