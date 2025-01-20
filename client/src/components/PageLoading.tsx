import { motion } from 'framer-motion'
import { LucideDotSquare } from 'lucide-react'
import React from 'react'

const PageLoading = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                }}
            >
                <LucideDotSquare className="h-16 w-16 text-yellow-400" />
            </motion.div>
        </div>
    )
}

export default PageLoading