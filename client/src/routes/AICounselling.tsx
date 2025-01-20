'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { BackgroundAnimation } from '../components/BackgroundAnimations'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables")
}

export default function AICounsellingPage() {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: 'You are a knowledgeable career advisor with expertise in describing various professions. When a user provides a job title, your role is to explain what a typical day in that position looks like. Describe the daily activities, responsibilities, and tools used, along with the challenges they might face. Provide insights into the interpersonal aspects of the role, such as teamwork or client interactions, and how the job fits into the larger industry. Additionally, share information about work-life balance, growth opportunities, and any unique aspects that make the job interesting or challenging. Use simple, clear language to paint a vivid picture of the role, making it easy to understand and relatable. KEEP YOUR RESPONSE REALLY SHORT UNLESS STATED BY USER.' })

  const [isLoading, setIsLoading] = useState(false)
  const [chat, setChat] = useState<any>(null)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm an AI Counsellor!. How can I help with your career?", isAi: true },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    const initChat = async () => {
      const newChat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Hello! I'm an AI Counsellor!. How can I help with your career?" }],
          },
        ],
      })
      setChat(newChat)
    }
    initChat()
  }, [])

  const handleSend = async () => {
    if (input.trim() && chat) {
      setIsLoading(true)
      const userMessage = { id: messages.length + 1, text: input, isAi: false }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      try {
        const tempAiMessage = { id: messages.length + 2, text: '', isAi: true }
        setMessages(prev => [...prev, tempAiMessage])

        const result = await chat.sendMessageStream(input.trim())
        let fullResponse = ''

        for await (const chunk of result.stream) {
          const chunkText = chunk.text()
          fullResponse += chunkText
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempAiMessage.id
                ? { ...msg, text: fullResponse }
                : msg
            )
          )
        }
      } catch (error) {
        console.error('Error:', error)
        setMessages(prev => [...prev, {
          id: messages.length + 2,
          text: "Sorry, there was an error processing your request.",
          isAi: true
        }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4 overflow-hidden">
      <BackgroundAnimation />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="h-[600px] flex flex-col shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md border-yellow-300 border-2 rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-300 py-6 px-6">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
              <motion.span
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                AI Career Counsellor
              </motion.span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}
                >
                  <motion.div
                    className={`flex items-start space-x-2 max-w-[85%] ${message.isAi ? 'flex-row' : 'flex-row-reverse'}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className={`p-2 rounded-full flex-shrink-0 ${message.isAi ? 'bg-yellow-400' : 'ml-2 bg-gray-200'}`}>
                      {message.isAi ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-2xl flex-1 shadow-md ${message.isAi
                        ? 'bg-white text-gray-800 border border-yellow-200'
                        : 'bg-yellow-400 text-white'
                        }`}
                      style={{ minWidth: '0' }}
                    >
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              style={{
                                color: '#333',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #f7dc6f',
                                paddingBottom: '5px',
                                marginBottom: '10px',
                              }}
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              style={{
                                color: '#333',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                borderLeft: '3px solid #f7dc6f',
                                paddingLeft: '10px',
                                marginTop: '15px',
                                marginBottom: '10px',
                              }}
                              {...props}
                            />
                          ),
                          em: ({ node, ...props }) => (
                            <em style={{ color: '#d4ac0d', fontStyle: 'italic' }} {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              style={{
                                listStyleType: 'disc',
                                paddingLeft: '20px',
                                marginTop: '10px',
                                marginBottom: '10px',
                              }}
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              style={{
                                marginBottom: '5px',
                                color: '#333',
                              }}
                              {...props}
                            />
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-4 bg-white/80 backdrop-blur-sm border-t border-yellow-100">
            <div className="flex w-full space-x-2">
              <Input
                type="text"
                placeholder="Ask about a career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border-2 border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400 rounded-full py-2 px-4 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                className={`bg-yellow-400 hover:bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

