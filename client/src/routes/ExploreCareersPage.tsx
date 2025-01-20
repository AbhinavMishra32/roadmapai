import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, ChevronRight, Briefcase, Code, Stethoscope, PiggyBank, GraduationCap, Palette, TrendingUp, Award, Building, Zap, Coffee, Search, Filter, MapPin, Clock, Users, BarChart, Star, Rocket, BookOpen, LineChart, Bookmark, ExternalLink, Lightbulb, Target, Layers, ArrowRight, IndianRupee } from 'lucide-react'
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { api } from '@/services/axios'
import { useNavigate } from 'react-router-dom';
import PageLoading from '@/components/PageLoading';

const careerCategories = [
  { name: 'Technology', icon: Code, color: 'bg-blue-50 text-blue-600' },
  { name: 'Healthcare', icon: Stethoscope, color: 'bg-green-50 text-green-600' },
  { name: 'Finance', icon: PiggyBank, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Education', icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
  { name: 'Design', icon: Palette, color: 'bg-pink-50 text-pink-600' },
  { name: 'Arts & Entertainment', icon: Coffee, color: 'bg-red-50 text-red-600' },
  { name: 'Law', icon: MapPin, color: 'bg-blue-50 text-blue-600' },
  { name: 'Science & Research', icon: Rocket, color: 'bg-green-50 text-green-600' },
]

type CareerType = {
  id: number;
  onetCode: string;
  categoryName: string;
  title: string;
  field: string;
  potential: string;
  trend: string;
  salary: string;
  skills: string[];
  education: string;
  icon: React.ComponentType;
  growth: number;
  satisfaction: number;
  description?: string;
  progression?: string;
  resources?: string[];
}

type CareerCategoryType = {
  category: string;
  careers: CareerType[];
}

const Section = ({ children, title }) => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 flex items-center">
        <span className="mr-2">{title}</span>
      </h2>
      {children}
    </section>
  )
}


const CareerCard = ({ career, onClick }) => {
  let Icon = LucideIcons[career.icon];
  if (!Icon) {
    console.error(`Icon "${career.icon}" not found in LucideIcons.`);
    switch (career.categoryName) {
      case 'Technology':
        Icon = LucideIcons.Code;
        break;
      case 'Healthcare':
        Icon = LucideIcons.Stethoscope;
        break;
      case 'Finance':
        Icon = LucideIcons.PiggyBank;
        break;
      case 'Education':
        Icon = LucideIcons.GraduationCap;
        break;
      case 'Design':
        Icon = LucideIcons.Palette;
        break;
      default:
        Icon = LucideIcons.Coffee;
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{duration: 0.2}}
    >
      <Card
        className="overflow-hidden cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:to-yellow-50 hover:ring-4 hover:ring-yellow-300 transition-all duration-300 border-none shadow-lg"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{career.title}</h3>
            <Icon className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-gray-600 mb-4">{career.field}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-gradient-to-t from-orange-200/30 to-white text-gray-700 border border-gray-200">
              {career.trend}
            </Badge>
            <Badge variant="outline" className="text-gray-600 bg-gradient-to-t from-orange-200/30 to-white">
              <Star className="w-3 h-3 mr-1" />
              {career.potential} Potential
            </Badge>
            <Badge variant="outline" className="text-gray-600 bg-gradient-to-t from-orange-200/30 to-white">
              <IndianRupee className="w-3 h-3 mr-1" />
              {career.salary}
            </Badge>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              {career.education.split(' ')[0]}
            </span>
            <span className="flex items-center">
              <Rocket className="w-4 h-4 mr-1" />
              {career.skills.length} key skills
            </span>
          </div>
          {/* <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Growth Rate</span>
              <span className="text-sm font-medium">{career.growth}%</span>
            </div>
            <Progress value={career.growth} className="h-2" />
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeatureCard = ({ title, description, icon: Icon }) => (
  <Card className="bg-gradient-to-br from-white to-gray-50 border-none shadow-md">
    <CardHeader>
      <Icon className="w-8 h-8 mb-2 text-primary" />
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
)

const InsightCard = ({ title, value, icon: Icon, trend }) => (
  <Card>
    <CardContent className="flex items-center p-6">
      <Icon className="w-8 h-8 mr-4 text-primary" />
      <div>
        <CardDescription>{title}</CardDescription>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {trend && (
          <div className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)

export default function ExploreCareersPage() {
  const [selectedCareer, setSelectedCareer] = useState<CareerType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [savedCareers, setSavedCareers] = useState([])
  const [fetchingCareers, setFetchingCareers] = useState(true);
  const [careers, setCareers] = useState<CareerCategoryType[]>([]);

  const navigate = useNavigate();

  const filteredCareers = careers.flatMap(category =>
    category.careers.filter(career =>
      (selectedCategory === 'All' || career.categoryName === selectedCategory) &&
      (career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  )

  const toggleSaveCareer = (career) => {
    setSavedCareers(prev => {
      const newSavedCareers = prev.some(c => c.id === career.id)
        ? prev.filter(c => c.id !== career.id)
        : [...prev, career];
      
      // Save to local storage
      localStorage.setItem('savedCareers', JSON.stringify(newSavedCareers));
      
      return newSavedCareers;
    });
  }

  useEffect(() => {
    const savedCareersFromStorage = localStorage.getItem('savedCareers');
    if (savedCareersFromStorage) {
      setSavedCareers(JSON.parse(savedCareersFromStorage));
    }
  }, []);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await api.get('/api/careers');
        console.log("Response from fetchCareers(): ", response.data);
        setCareers(response.data.careers);
      } catch (error) {
        console.log("Error in fetchCareers(): ", error);
      } finally {
        setFetchingCareers(false);
      }
    }

    fetchCareers();
  }, []);

  if (fetchingCareers) {
    return <PageLoading />
    // return (
    //   <div className="flex items-center justify-center h-screen">
    //     <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    //   </div>
    // )
  }

  return (
    <div className=" mx-auto pt-8 lg:px-8 md:px-10 px-4 w-full">
      {/* <h1 className="text-6xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
        Career Explorer
      </h1>

      <p className="text-xl text-center text-gray-600 mb-12">
        Discover your ideal career path and unlock your professional potential
      </p> */}

      {/* <Section title="Explore Your Future">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            title="Personalized Insights"
            description="Get tailored career recommendations based on your skills and interests."
            icon={Lightbulb}
          />
          <FeatureCard
            title="Industry Trends"
            description="Stay informed about the latest developments and opportunities in various fields."
            icon={TrendingUp}
          />
          <FeatureCard
            title="Skill Development"
            description="Identify key skills to acquire for your dream career and find resources to learn them."
            icon={Target}
          />
        </div>
      </Section> */}

      <div className="mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Explore career paths..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {careerCategories.map(category => (
              <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-300 text-black">
          <Filter className="w-4 h-4 mr-2" />
          Refine Search
        </Button>
      </div>

      {/* <Section title="Career Market Insights">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <InsightCard
            title="Average Salary Growth"
            value="5.2%"
            icon={TrendingUp}
            trend="+0.8% from last year"
          />
          <InsightCard
            title="Most In-Demand Skill"
            value="Data Analysis"
            icon={BarChart} trend={undefined} />
          <InsightCard
            title="Fastest Growing Field"
            value="Artificial Intelligence"
            icon={Zap}
            trend="+22% growth rate"
          />
          <InsightCard
            title="Remote Job Opportunities"
            value="37%"
            icon={Briefcase}
            trend="+5% from last year"
          />
        </div>
      </Section> */}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          {!fetchingCareers && careerCategories.map((category) => (
            <Section key={category.name} title={`${category.name} Career Paths`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {careers
                  .find(c => c.category === category.name)
                  ?.careers
                  .filter(career => {
                    const match = career.title.toLowerCase().includes(searchTerm.toLowerCase());
                    return match;
                  })
                  .map((career) => {
                    console.log("Career to be displayed in CareerCard: ", career);
                    return (
                      <CareerCard key={career.id} career={career} onClick={() => setSelectedCareer(career)} />
                    );
                  })}
              </div>
            </Section>
          ))}
        </div>

        {/* <div className="lg:col-span-1"> */}
          {/* <Card className="sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">Career Insights</h3>
              <Tabs defaultValue="trends">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="stats">Your Progress</TabsTrigger>
                </TabsList>
                <TabsContent value="trends">
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">AI & Machine Learning</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Growing Rapidly</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Remote Work</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">New Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Cybersecurity</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">Critical Demand</Badge>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="stats">
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Careers Explored</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Skills Matched</span>
                      <span className="font-bold">8/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Readiness Score</span>
                      <span className="font-bold text-green-600">85%</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card> */}

          {/* <Card className="mt-8">
            <CardHeader>
              <CardTitle>Saved Career Paths</CardTitle>
            </CardHeader>
            <CardContent>
              {savedCareers.length === 0 ? (
                <p className="text-gray-500">No careers saved yet. Explore and save careers you're interested in!</p>
              ) : (
                <ul className="space-y-2">
                  {savedCareers.map(career => (
                    <li key={career.id} className="flex justify-between items-center">
                      <span>{career.title}</span>
                      <Button variant="ghost" size="sm" onClick={() => toggleSaveCareer(career)}>
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card> */}

          {/* <Card className="mt-8">
            <CardHeader>
              <CardTitle>Career Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Guide: How to Choose the Right Career
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    Skills Assessment Tool
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Career Mentorship Program
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card> */}
        {/* </div> */}
      </div>

      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedCareer(null)}
          >
            <ScrollArea className=" h-full rounded-xl">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl max-h-[99%] max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 z-10  transition-all duration-200"
                    onClick={() => setSelectedCareer(null)}
                  >
                    <X size={2} />
                  </Button>
                  {/* <div className="aspect-video bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <Play className="h-16 w-16 text-gray-400" />
                  </div> */}
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedCareer.title}</h2>
                      <p className="text-xl text-gray-600 flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        {selectedCareer.field}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {selectedCareer.trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{selectedCareer.potential} Potential</span>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{selectedCareer.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{selectedCareer.education}</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
                      <span>{selectedCareer.growth}% Growth</span>
                    </div>
                  </div>
                  <ScrollArea className="h-full rounded-lg border p-6 bg-gray-50">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Award className="w-6 h-6 mr-2 text-blue-500" />
                      Career Path Overview
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {/* A career as a {selectedCareer.title} in the field of {selectedCareer.field} offers exciting opportunities to work with cutting-edge technologies and make a significant impact. This role is crucial in developing innovative solutions and driving progress in the industry. With a projected growth rate of {selectedCareer.growth}% and high job satisfaction, this career path offers both stability and fulfillment. */}
                      {selectedCareer.description}
                    </p>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Rocket className="w-6 h-6 mr-2 text-green-500" />
                      Key Skills for Success
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                      {selectedCareer.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                    <h3 className="text-xl font-semibold mt-6 mb-4 flex items-center">
                      <LineChart className="w-6 h-6 mr-2 text-purple-500" />
                      Career Progression
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {/* As you advance in your career as a {selectedCareer.title}, you can expect to take on more complex projects, lead teams, and potentially move into senior or executive roles. Continuous learning and staying updated with industry trends will be crucial for long-term success. */}
                      {selectedCareer.progression}
                    </p>
                    <h3 className="text-xl font-semibold mt-6 mb-4 flex items-center">
                      <BookOpen className="w-6 h-6 mr-2 text-yellow-500" />
                      Recommended Resources
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      {selectedCareer.resources?.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                      {/* <li>Online courses from platforms like Coursera or edX</li>
                      <li>Professional certifications in {selectedCareer.field}</li>
                      <li>Industry conferences and networking events</li>
                      <li>Relevant books and publications</li> */}
                    </ul>
                  </ScrollArea>
                  <div className="mt-6 flex gap-4">
                    <Button className="flex-1" onClick={() => toggleSaveCareer(selectedCareer)}>
                      {savedCareers.some((c: { id: number }) => c.id === selectedCareer.id) ? 'Remove from Saved' : 'Save Career Path'}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => navigate(`/explore/${selectedCareer.onetCode}`)} >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore Learning Paths
                    </Button>
                  </div>
                </div>
              </motion.div>
            </ScrollArea>
          </motion.div>
        )
        }
      </AnimatePresence >
    </div >
  )
}

