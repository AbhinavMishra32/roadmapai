import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'

const ChatWithCounsellors: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiNmZmQ3MDAiIG9wYWNpdHk9IjAuMyI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-40"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Chat with <span className="text-yellow-500">AI Counsellor</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Get instant career advice from our AI-powered career counsellor. Start chatting now!
            </p>
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 px-6 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Chatting
            </motion.button>
          </motion.div>
          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">AI Counsellor</h3>
                  <p className="text-gray-500">Online Now</p>
                </div>
              </div>
              <div className="space-y-4 mb-4">
                <motion.div
                  className="bg-gray-100 p-3 rounded-lg"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <p className="text-gray-800">How can I help you with your career today?</p>
                </motion.div>
                <motion.div
                  className="bg-yellow-100 p-3 rounded-lg ml-auto max-w-[80%]"
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <p className="text-gray-800">I'm interested in switching to a tech career. Where should I start?</p>
                </motion.div>
              </div>
              <div className="flex items-center bg-gray-100 rounded-full p-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow bg-transparent outline-none px-3"
                />
                <button className="bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-600 transition duration-300">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ChatWithCounsellors
