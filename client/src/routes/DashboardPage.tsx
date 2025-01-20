import { motion } from 'framer-motion'
import CourseProgressCard from '../components/LessonProgressCard'
import CareerAICard from '../components/CareerAICard'
import RecentCareersCard from '../components/RecentCareersCard'
import SavedCareersCard from '../components/SavedCareersCard'
import SkillProgressChart from '../components/SkillProgressChart'
import AICareerFinderCard from '../components/AICareerFinderCard'
import CircularProgressChart from '../components/CircularProgressChart'
import SkillsRadarChart from '../components/SkillsRadarChart'
import AICareerSuggestions from '../components/AICareerSuggestions'
import CareerInsightsCard from '../components/CareerInsightsCard'
import { useEffect, useState } from 'react'
import { api } from '@/services/axios'
import PageLoading from '@/components/PageLoading'
import DailyStreakCard from '@/components/DailyStreakCard'


type DailyStreak = {
  currentStreak: number;
  longestStreak: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonProgress, setLessonProgress] = useState<{ completed: number, total: number }>({ completed: 0, total: 0 });
  const [courseProgress, setCourseProgress] = useState<{ title: string, completed: boolean}[]>([]);
  const [completedLessonsUnderCourse, setCompletedLessonsUnderCourse] = useState<{ categoryTitle: string, A: number, fullMark: number }[]>([]);
  const [dailyStreak, setDailyStreak] = useState<DailyStreak>({ currentStreak: 0, longestStreak: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user/extended');

        console.log("User in DashboardPage", response.data);
        setUser(response.data.user);
        setLessonProgress({ completed: response.data.lessonProgress.completedLessons, total: response.data.lessonProgress.totalLessons });
        setCourseProgress(response.data.courseProgress);
        setCompletedLessonsUnderCourse(response.data.completedLessonsUnderCourse.map((lesson: any) => ({
          ...lesson,
          A: lesson.A || 0 // Assuming a default value for 'A'
        })));
      } catch (error) {
        console.log("Error while fetching user in DashboardPage", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

    if (loading) {
        return <PageLoading />
    }
  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800">Welcome back, {user?.username}</h1>
            <p className="mt-2 text-gray-600">Here's an overview of your career journey</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CircularProgressChart progress={lessonProgress} />
            <SkillProgressChart skills={completedLessonsUnderCourse} />
              <CourseProgressCard courseProgress={courseProgress} />
            <DailyStreakCard currentStreak={dailyStreak.currentStreak} longestStreak={dailyStreak.longestStreak} />
            <div className="col-span-1 md:col-span-2">
            <SkillsRadarChart courseMarks={completedLessonsUnderCourse} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              {/* <CareerInsightsCard /> */}
            </div>
            <AICareerSuggestions />
            <SavedCareersCard />
            <RecentCareersCard />
          </div>
        </div>
      </div>
    </>
  )
}

