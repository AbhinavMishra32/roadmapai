import React from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Mic, Video, ThumbsUp, BookOpen } from 'lucide-react'

const InterviewAnalysis: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-tl from-yellow-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cGF0aCBkPSJNMzAgMzBMNjAgMEgwWiIgZmlsbD0iI2ZmZDcwMCIgb3BhY2l0eT0iMC4zIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-40"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              AI-Powered <span className="text-yellow-500">Interview Analysis</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Receive detailed feedback on your interview performance to improve your skills and boost your confidence.
            </p>
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 px-6 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Interview Analysis
            </motion.button>
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-auto">
              <div className="flex items-center mb-6">
                <BarChart2 className="text-yellow-500 mr-4" size={32} />
                <h3 className="text-2xl font-semibold">Your Interview Performance</h3>
              </div>
              <div className="space-y-6">
                {[
                  { skill: 'Communication Skills', score: 85, icon: Mic },
                  { skill: 'Technical Knowledge', score: 75, icon: BookOpen },
                  { skill: 'Body Language', score: 90, icon: Video },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
                  >
                    <div className="flex items-center mb-2">
                      <item.icon className="text-yellow-500 mr-2" size={18} />
                      <h4 className="font-semibold">{item.skill}</h4>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                      ></motion.div>
                    </div>
                    <p className="text-right text-sm text-gray-600 mt-1">{item.score}%</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-center">
                <ThumbsUp className="text-yellow-500 mr-3" size={24} />
                <p className="text-sm text-gray-700">Great job! Your overall performance is above average.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default InterviewAnalysis

