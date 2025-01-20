import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/axios"
import { Cookies } from "react-cookie"
import PageLoading from "@/components/PageLoading"

import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL as string;
if (!API_URL) {
    throw new Error('CLIENT_URL is not set in environment variables');
}


interface Student {
    id: string;
    username: string;
    email: string;
    school: string;
    grade: string;
    stream: string;
    subjects: string[];
    address: string;
    careerGoal: string;
    extracurriculars: string[];
    learningStyle: string;
    counsellingReason: string;
}

interface Message {
    id?: string;
    senderId: string;
    receiverId: string;
    content: string;
    chatId: string;
    sender: "user" | "counsellor";
    createdAt: string;
}

export default function CounselorChat() {
    const { chatId } = useParams()
    const navigate = useNavigate();
    const socket = io(API_URL, {
        query: {
            chatId,
        }
    });

    const [newMessage, setNewMessage] = useState<Message>();
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()

    const headerHeight = useTransform(scrollY, [0, 200], [200, 80])
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 1])
    const avatarScale = useTransform(scrollY, [0, 200], [1, 0.8])
    const bioOpacity = useTransform(scrollY, [0, 50], [1, 0])
    const specialitiesOpacity = useTransform(scrollY, [0, 100], [1, 0])
    const [chat, setChat] = useState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [student, setStudent] = useState<Student>();
    const [counsellorId, setCounsellorId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.on('connect', () => {
            if (counsellorId && chatId) {
                console.log('Connected to socket server: ', socket.id);
                socket.emit('joinChat', { chatId, userId: counsellorId });
                setLoading(false);
            }
        });
    }, [counsellorId, chatId]);

    useEffect(() => {
        const cookies = new Cookies();
        const counsellorDetails = cookies.get('userId');
        setCounsellorId(counsellorDetails);

        if (!counsellorDetails) {
            console.error("Counsellor details are undefined");
        }
    }, []);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await api.get('/api/chat/' + chatId);
                console.log("Chat response : ", response.data);
                setStudent(response.data.chat.student);
                setChat(response.data.chat);
                setMessages(response.data.chat.messages);
                console.log('Chat: ', chat);
            } catch (error) {
                console.log("Error in fetchChat : ", error)
            }
            finally {
                setLoading(false);
            }
        }

        fetchChat();
    }, [chatId]);

    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            console.log('Message received: ', data);
            setMessages(prevMessages => [...prevMessages, data]);
        })

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = () => {
        if (newMessage) {
            console.log('Sending message: ', newMessage);
            socket.emit('sendMessage', newMessage);
            console.log('Message sent: ', newMessage);
            setMessages(prevMessages => [...prevMessages, { ...newMessage, id: String(prevMessages.length + 1) }]);
            setNewMessage({ content: '', senderId: counsellorId, receiverId: student?.id as string, chatId: chatId as string, createdAt: new Date().toISOString(), sender: "counsellor" });
        }
    }

    const handleAddLesson = () => {
        navigate(`/addlesson/${student?.id}`);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages])

    if (loading) {
        return <PageLoading />
    }

    return (
        <div className="h-full bg-white flex flex-col">
            <motion.header
                style={{ height: headerHeight, opacity: headerOpacity }}
                className="border-b sticky top-[50px] bg-blue-50 z-10 overflow-hidden transition-all duration-300 ease-in-out"
            >
                <div className="max-w-3xl mx-auto px-4 py-4 h-full flex items-center">
                    <motion.div style={{ scale: avatarScale }} className="mr-4 transition-all duration-3000 ease-in-out">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${student?.username}`} alt={student?.username} />
                            <AvatarFallback>{student?.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0">
                            <h1 className="font-semibold text-lg truncate">{student?.username}</h1>
                            <motion.div style={{ opacity: headerOpacity }}>
                                <p className="text-sm text-gray-500 truncate">{student?.school}</p>
                                <p className="text-sm text-gray-500 truncate">Grade: {student?.grade}, Stream: {student?.stream}</p>
                            </motion.div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleAddLesson} className="mr-2">
                            Add Lesson
                        </Button>
                        <Button variant="ghost" size="icon" className="shrink-0 ml-2">
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </div>
                    <motion.div style={{ opacity: bioOpacity }} className="w-full">
                        <p className="text-sm mt-2 line-clamp-2 transition-opacity duration-300 ease-in-out">
                            Career Goal: {student?.careerGoal}
                        </p>
                        <motion.div style={{ opacity: specialitiesOpacity }} className="flex flex-wrap gap-2 mt-2 transition-opacity duration-300 ease-in-out">
                            {student?.subjects.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                    {subject}
                                </Badge>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.header>

            <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
                <div className="max-w-3xl mx-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`flex ${message.sender === 'counsellor' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.sender === 'counsellor'
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100'
                                    }`}
                            >
                                <p className="mb-1">{message.content}</p>
                                <p className="text-xs opacity-70">{new Date(message.createdAt).toLocaleString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t p-4 sticky bottom-0 bg-white z-10"
            >
                <div className="max-w-3xl mx-auto flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                        value={newMessage?.content}
                        onChange={(e) => {
                            if (student) {
                                setNewMessage({ content: e.target.value, senderId: counsellorId, receiverId: student.id, chatId: chatId as string, createdAt: new Date().toISOString(), sender: "counsellor" });
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button variant="ghost" size="icon">
                        <Smile className="h-5 w-5" />
                        <span className="sr-only">Insert emoji</span>
                    </Button>
                    <Button
                        onClick={sendMessage}
                        className="bg-blue-400 hover:bg-blue-500 text-white">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

