"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Clock, ArrowRight } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  estimatedTime: string
  nextSteps?: string[]
}

export function GlassmorphicModal({ isOpen, onClose, title, description, estimatedTime, nextSteps = [] }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-y-0 right-0 w-[480px] z-50"
        >
          {/* Glassmorphic Background */}
          <div className="absolute inset-0 backdrop-blur-2xl bg-black/20" />

          {/* Glow Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="absolute inset-[1px] rounded-l-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02]" />

          {/* Content Container */}
          <div className="relative h-full p-8 overflow-auto">
            {/* Header Icon */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100/10 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-8">{description}</p>

            {/* Estimated Time */}
            <div className="flex items-center gap-2 mb-8 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Est. Time: {estimatedTime}</span>
            </div>

            {/* Next Steps Section */}
            {nextSteps.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Next Steps</h3>
                <div className="space-y-3">
                  {nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <span className="text-gray-300 flex-1">{step}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

