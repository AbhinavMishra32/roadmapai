"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, MessageSquare, Calendar, Settings } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/axios"
import PageLoading from "@/components/PageLoading"
import { setDefaultResultOrder } from "dns"

interface Student {
  id: string
  name: string
  username: string
  lastMessage: string
  time: string
  unread: number
  avatar: string
  status: "online" | "offline" | "away"
  school: string
  stream: "PCM" | "PCB" | "Commerce" | "Humanities"
  grade: number
  chats: { id: string }[]
}

// const students: Student[] = [
//   {
//     id: "1",
//     name: "Alex Thompson",
//     lastMessage: "Thank you for the guidance! I really appreciate your help with my course selection.",
//     time: "2m ago",
//     unread: 1,
//     avatar: "/placeholder.svg",
//     status: "online",
//     school: "Delhi Public School",
//     stream: "PCM",
//     grade: 11
//   },
//   {
//     id: "2",
//     name: "Sarah Parker",
//     lastMessage: "When can we schedule our next session? I'd like to discuss my progress in Advanced Mathematics.",
//     time: "1h ago",
//     unread: 0,
//     avatar: "/placeholder.svg",
//     status: "away",
//     school: "Kendriya Vidyalaya",
//     stream: "PCB",
//     grade: 12
//   },
//   {
//     id: "3",
//     name: "Michael Chen",
//     lastMessage: "I've completed the assessment you sent. Can you review it when you have a moment?",
//     time: "3h ago",
//     unread: 2,
//     avatar: "/placeholder.svg",
//     status: "offline",
//     school: "Ryan International School",
//     stream: "Commerce",
//     grade: 11
//   },
//   {
//     id: "4",
//     name: "Emily Rodriguez",
//     lastMessage: "The study group session was really helpful. Thanks for organizing it!",
//     time: "1d ago",
//     unread: 0,
//     avatar: "/placeholder.svg",
//     status: "online",
//     school: "Amity International School",
//     stream: "Humanities",
//     grade: 12
//   },
//   {
//     id: "5",
//     name: "David Kim",
//     lastMessage: "I'm having trouble with the latest assignment. Can we discuss it soon?",
//     time: "2d ago",
//     unread: 3,
//     avatar: "/placeholder.svg",
//     status: "offline",
//     school: "Modern School",
//     stream: "PCM",
//     grade: 11
//   }
// ]

export default function CounsellorMessagesPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const handleStudentClick = (studentChatId: string) => {
    setSelectedId(studentChatId)
    setTimeout(() => {
      navigate(`/counselchat/${studentChatId}`)
    }, 300)
  }

  useEffect(() => {
    const fetchChattingStudents = async () => {
      try {
        const response = await api.get('/api/student/chatavailable');
        console.log("response in fetchChattingStudents: ", response.data);
        setStudents(response.data.studentsChatting);
      } catch (error) {
        console.log("Error in counsellor router GET / : ", error)
      } finally {
        setLoading(false);
      }
    }

    fetchChattingStudents();
  }, []);

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="h-full bg-white flex">
      <div className="flex-1 sticky top-[50px] flex flex-col w-full">
        <header className="border-b p-4">
          <div className="max-w-2xl mx-auto px-4 md:px-0">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Messages
            </motion.h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input className="pl-10 w-full" placeholder="Search conversations..." />
              </div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </header>
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStudentClick(student.chats[0].id)}
                className={`flex items-start gap-2 md:gap-4 p-3 md:p-4 rounded-xl mb-3 cursor-pointer transition-all
                  ${selectedId === student.id ? 'bg-yellow-50 shadow-md' : 'hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>
                      {(student.name || student.username).split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white
                    ${student.status === 'online' ? 'bg-green-500' :
                      student.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm md:text-base font-semibold truncate">{student.name || student.username}</h2>
                    <span className="text-xs md:text-sm text-gray-500 ml-2">{student.time}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 truncate mb-1">{student.lastMessage}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="secondary" className="text-xs">
                      {student.school}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {student.stream}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Class {student.grade}
                    </Badge>
                  </div>
                </div>
                {student.unread > 0 && (
                  <div className="bg-yellow-400 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                    {student.unread}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}