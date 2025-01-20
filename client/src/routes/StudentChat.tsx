import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, Star, Mic, Speaker, Volume2, VolumeX } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/axios"
import { Cookies } from "react-cookie"
import PageLoading from "@/components/PageLoading"
import { useSpeechRecognition } from "react-speech-kit"

import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL as string;
if (!API_URL) {
    throw new Error('CLIENT_URL is not set in environment variables');
}

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

export default function StudentChat() {

    const { chatId } = useParams()
    const socket = io(API_URL, {
        query: {
            chatId: chatId,
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
    const [isListening, setIsListening] = useState(false);
    const [chat, setChat] = useState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [counsellor, setCounsellor] = useState<Counsellor>();
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [voice, setVoice] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {

            if (userId && chatId) {
                console.log('Connected to socket server: ', socket.id);
                socket.emit('joinChat', { chatId, userId });
                setLoading(false);
            }
        });
    }, [userId, chatId]);

    useEffect(() => {
        const cookies = new Cookies();
        const userDetails = cookies.get('userId');
        setUserId(userDetails);

        if (!userDetails) {
            console.error("User details are undefined");
        }

    }, []);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await api.get('/api/chat/' + chatId);
                console.log("Chat response : ", response.data);
                setCounsellor(response.data.chat.counsellor);
                setChat(response.data.chat);
                setMessages(response.data.chat.messages);
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

            if (voice) {
                const utterance = new SpeechSynthesisUtterance(data.content);
                window.speechSynthesis.speak(utterance);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [voice]);

    const sendMessage = () => {
        if (newMessage) {
            console.log('Sending message: ', newMessage);
            socket.emit('sendMessage', newMessage);
            setNewMessage({ content: '', senderId: userId, receiverId: counsellor?.id as string, chatId: chatId as string, createdAt: new Date().toISOString(), sender: "user" });
        }
    }
    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                chatContainerRef.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [messages]);

    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            if (counsellor) {
                setNewMessage({ content: result, senderId: userId, receiverId: counsellor.id, chatId: chatId as string, createdAt: new Date().toISOString(), sender: "user" });
            }
        }
    });

    if (loading) {
        return <PageLoading />
    }

    return (
        <div className="h-full bg-white flex flex-col">
            <motion.header
                style={{ height: headerHeight, opacity: headerOpacity }}
                className="border-b sticky top-[50px] bg-yellow-50 z-10 overflow-hidden transition-all duration-300 ease-in-out"
            >
                <div className="max-w-3xl mx-auto px-4 py-4 h-full flex items-center">
                    <motion.div style={{ scale: avatarScale }} className="mr-4 transition-all duration-3000 ease-in-out">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={counsellor?.avatar} alt={counsellor?.name} />
                            <AvatarFallback>{(counsellor?.name || counsellor?.username)?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-1 min-w-0">
                            <h1 className="font-semibold text-lg truncate">{counsellor?.name}</h1>
                            <motion.div style={{ opacity: headerOpacity }}>
                                <p className="text-sm text-gray-500 truncate">{counsellor?.location}</p>
                                <div className="flex items-center mt-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 text-sm font-medium">{counsellor?.rating}</span>
                                </div>
                            </motion.div>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 ml-2">
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </div>
                    <motion.div style={{ opacity: bioOpacity }} className="w-full">
                        <p className="text-sm mt-2 line-clamp-2 transition-opacity duration-300 ease-in-out">
                            {counsellor?.bio}
                        </p>
                        <motion.div style={{ opacity: specialitiesOpacity }} className="flex flex-wrap gap-2 mt-2 transition-opacity duration-300 ease-in-out">
                            {counsellor?.specialities.map((speciality, index) => (
                                <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    {speciality}
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
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                                    ? 'bg-yellow-400 text-white'
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
                    <Button 
                        onClick={() => {
                            if (!voice) {
                                setVoice(true);
                            } else {
                                setVoice(false);
                                window.speechSynthesis.cancel(); // Stop any ongoing speech
                            }
                        }} 
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        {voice ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                        <span className="sr-only">{voice ? 'Disable voice' : 'Enable voice'}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                        value={newMessage?.content}
                        onChange={(e) => {
                            if (counsellor) {
                                setNewMessage({ content: e.target.value, senderId: userId, receiverId: counsellor.id, chatId: chatId as string, createdAt: new Date().toISOString(), sender: "user" });
                            }
                        }}
                    />
                    <Button
                        onClick={sendMessage}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                    <Button
                        onClick={() => {
                            if (isListening) {
                                stop();
                            } else {
                                listen();
                            }
                            setIsListening(!isListening);
                        }}
                        variant="ghost"
                        size="icon"
                    >
                        <Mic className={`h-5 w-5 ${isListening ? 'text-red-500' : ''}`} />
                        <span className="sr-only">Record message</span>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

