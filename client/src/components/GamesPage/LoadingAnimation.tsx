import { motion } from 'framer-motion'

export default function LoadingAnimation({ message = "Generating your career quest..." }) {
  const circleVariants = {
    start: { scale: 0.8, opacity: 0.2 },
    end: { scale: 1, opacity: 1 }
  }

  const containerVariants = {
    start: { rotate: 0 },
    end: { rotate: 360, transition: { duration: 2, ease: "linear", repeat: Infinity } }
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center space-y-4 bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-16 h-16"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[...Array(4)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute w-full h-full border-2 border-yellow-400 rounded-full"
            style={{ 
              borderRightColor: 'transparent',
              transform: `rotate(${index * 45}deg)` 
            }}
            variants={circleVariants}
            initial="start"
            animate="end"
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
              delay: index * 0.2
            }}
          />
        ))}
      </motion.div>
      <motion.p 
        className="text-lg text-gray-800 font-medium text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {message}
      </motion.p>
    </motion.div>
  )
}

