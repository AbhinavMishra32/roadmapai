'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, MessageSquare, Search, Star, Bot, Circle, LucideDotSquare } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/services/axios'
import PageLoading from '@/components/PageLoading'

const allTags = [
  'JEE Prep',
  'NEET Preparation',
  'Career Help',
  'Academic Help',
  'Mental Health',
  'Stress Management',
  'Personal Development',
  'Interview Preparation',
  'Resume Building',
  'Study Techniques',
  'Physics Expert',
  'Doubt Solving',
]

interface Counsellor {
  id: string;
  username: string;
  name: string;
  avatar: string;
  location: string;
  specialities: string[];
  bio: string;
  rating: number;
  availableSlots: number;
  isChattingWithStudent: boolean;
  chats: Chat[];
}

interface Chat {
  counsellorId: string;
  studentId: string;
  id: string;
}

const CounsellorCard = ({ counsellor, handleStartChat }: { counsellor: Counsellor, handleStartChat: (counsellorId: string) => void }) => {
  const navigate = useNavigate();

  return (

    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white hover:border-yellow-400">
        <CardHeader className="relative pb-0">
          <div className="absolute top-0 right-0 p-4">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {counsellor.availableSlots} slots
            </Badge>
          </div>
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Avatar className="h-24 w-24 mb-4 ring-4 ring-yellow-200 transition-all duration-300 group-hover:ring-yellow-400">
              <AvatarImage src={counsellor.avatar} alt={counsellor.name} />
              <AvatarFallback>{(counsellor.name ? counsellor.name.split(' ') : [counsellor.username]).map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl mb-1 text-gray-800">{counsellor.name}</CardTitle>
            <CardDescription className="flex items-center justify-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
              {counsellor.location}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="text-center">
          <motion.div
            className="flex flex-wrap justify-center gap-2 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {(counsellor.specialities || ['New Counsellor']).map((specialty: string) => (
              <Badge key={specialty} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {specialty}
              </Badge>
            ))}
          </motion.div>
          <p className="text-sm text-gray-600 mb-4">{counsellor.bio}</p>
          <div className="flex items-center justify-center text-sm text-yellow-600 font-medium">
            <Star className="w-4 h-4 mr-1 fill-yellow-400 stroke-yellow-400" />
            <span>{counsellor.rating}</span>
          </div>
        </CardContent>
        <div className="p-4">
          <Button
            onClick={() => {
              if (counsellor.isChattingWithStudent) {
                navigate(`/counselling/chat/${counsellor.chats[0].id}`);
              } else {
                handleStartChat(counsellor.id);
              }
            }}
            className={`w-full ${counsellor.isChattingWithStudent ? "border-2 bg-white" : "bg-yellow-300"} hover:bg-yellow-200 text-black transition-all duration-300 transform hover:scale-105`}
          >
            {counsellor.isChattingWithStudent ? "Go To Chat" : "Start Chat"}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
};

export default function StudentCounselling() {
  const [selectedTags, setSelectedTags] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleStartChat = async (counsellorId: string) => {
    try {
      console.log("Starting chat with counsellorId:", counsellorId);
      const response = await api.post(`/api/chat/start`, {
        counsellorId
      });
      navigate(`/counselling/chat/${response.data.chatId}`);
      console.log("handleStartChat response:", response.data);
    } catch (error) {
      console.error("Error while starting chat:", error);
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredCounsellors = counsellors.filter(counsellor =>
    (selectedTags.length === 0 || selectedTags.some(tag => counsellor.specialities.includes(tag))) &&
    (searchTerm === '' || counsellor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counsellor.specialities.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())))
  )
  // const filteredCounsellors = counsellors;

  const sortedCounsellors = [...filteredCounsellors].sort((a, b) => {
    if (activeTab === 'topRated') {
      return b.rating - a.rating
    } else if (activeTab === 'mostAvailable') {
      return b.availableSlots - a.availableSlots
    }
    return 0
  })

  // const sortedCounsellors = counsellors;

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const response = await api.get('/api/counsellor');
        console.log("API Response:", response.data); // Log the full API response
        if (response.data.counsellors && Array.isArray(response.data.counsellors)) {
          console.log("Counsellors fetched:", response.data.counsellors);
          setCounsellors(response.data.counsellors);
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      } catch (error) {
        console.error("Error while fetching counsellors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  useEffect(() => {
    console.log("counsellors in useEffect():", counsellors);
  }, [counsellors]);

  if (loading) {
    return (
      <PageLoading />
    )
  }

  return (
    <div className="mx-4 px-4 py-8">
      <h1 className="text-4xl font-semibold mb-2">
        Find Your Perfect Counsellor
      </h1>
      <p className="text-xl text-muted-foreground mb-6">
        Connect with expert counsellors tailored to your needs and goals.
      </p>

      <div className="mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search counsellors or specialties..."
            className="w-full pl-10 pr-4 py-2 border border-yellow-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "secondary" : "outline"}
              className={`cursor-pointer py-1 px-2 text-sm transition-all duration-300 ${selectedTags.includes(tag)
                ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                : "hover:bg-yellow-100 hover:text-yellow-700"
                }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 bg-yellow-50 rounded-lg overflow-hidden">
          <TabsTrigger value="all" className=" data-[state=active]:bg-yellow-300 data-[state=active]:text-black transition-all duration-300">
            All Counsellors
          </TabsTrigger>
          <TabsTrigger value="topRated" className="data-[state=active]:bg-yellow-300 data-[state=active]:text-black transition-all duration-300">
            Top Rated
          </TabsTrigger>
          <TabsTrigger value="mostAvailable" className="data-[state=active]:bg-yellow-300 data-[state=active]:text-black transition-all duration-300">
            Most Available
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence>
        {sortedCounsellors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedCounsellors.map(counsellor => (
              <CounsellorCard key={counsellor.id} counsellor={counsellor} handleStartChat={handleStartChat} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
              }}
            >
              <MessageSquare className="mx-auto h-16 w-16 text-yellow-500" />
            </motion.div>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">No counsellors found</h2>
            <p className="mt-2 text-gray-600">
              Try adjusting your search criteria or removing some tags.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

