import React from 'react'
import { motion } from 'framer-motion'
import { Map, ChevronRight } from 'lucide-react'

const AIRoadmaps: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-bl from-yellow-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDYwIDYwWk02MCAwTDAgNjBaIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiPjwvcGF0aD4KPC9zdmc+')] opacity-40"></div>
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
              AI-Powered <span className="text-yellow-500">Roadmaps</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Create custom career roadmaps from your current position to your desired goal using advanced AI technology.
            </p>
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 px-6 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Your Roadmap
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
              <div className="flex items-center mb-6">
                <Map className="text-yellow-500 mr-4" size={32} />
                <h3 className="text-2xl font-semibold">Your Career Roadmap</h3>
              </div>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Learn Programming Basics', desc: 'Python, JavaScript, HTML/CSS' },
                  { step: 2, title: 'Build Projects', desc: 'Create a portfolio website' },
                  { step: 3, title: 'Internship or Entry-Level Job', desc: 'Apply for tech positions' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.2 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                    {index < 2 && (
                      <ChevronRight className="text-yellow-500 ml-auto self-center" size={24} />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AIRoadmaps

