import { motion } from 'framer-motion'

export default function ScoreIndicator() {
  return (
    <motion.div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div 
        className="bg-yellow-400 text-white font-bold text-xl p-3 rounded-full shadow-lg"
        animate={{ 
          boxShadow: ["0px 0px 0px 0px rgba(250, 204, 21, 0.4)", "0px 0px 0px 20px rgba(250, 204, 21, 0)"],
        }}
        transition={{ duration: 1, repeat: 1 }}
      >
        +100
      </motion.div>
    </motion.div>
  )
}

