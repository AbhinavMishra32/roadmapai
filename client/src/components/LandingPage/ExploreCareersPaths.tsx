import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, BookOpen, DollarSign } from 'lucide-react'

const ExploreCareersPaths: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-tr from-yellow-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iI2ZmZDcwMCIgb3BhY2l0eT0iMC4zIj48L2NpcmNsZT4KPC9zdmc+')] opacity-40"></div>
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
              Explore <span className="text-yellow-500">Career Paths</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Dive into various career options using data from the O*NET Online dataset to make informed decisions about your future.
            </p>
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 px-6 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Exploring
            </motion.button>
          </motion.div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            {[
              { title: 'Software Developer', icon: Briefcase, desc: 'Build and maintain software applications' },
              { title: 'Data Scientist', icon: TrendingUp, desc: 'Analyze and interpret complex data' },
              { title: 'UX Designer', icon: BookOpen, desc: 'Create intuitive user experiences' },
              { title: 'Product Manager', icon: DollarSign, desc: 'Guide product development and strategy' }
            ].map((career, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <career.icon className="text-yellow-500 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">{career.title}</h3>
                <p className="text-gray-600">{career.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExploreCareersPaths

