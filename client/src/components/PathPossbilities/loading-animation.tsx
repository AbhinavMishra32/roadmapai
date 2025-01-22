"use client"

import React from "react"
import { motion } from "framer-motion"

const LoadingAnimation: React.FC = () => {
  const nodes = [
    { x: 0, y: 80, connections: [1, 2] },
    { x: 160, y: 20, connections: [5] },
    { x: 140, y: 160, connections: [3, 4] },
    { x: 320, y: 100, connections: [5, 6] },
    { x: 300, y: 200, connections: [6] },
    { x: 480, y: 40, connections: [] },
    { x: 460, y: 140, connections: [7] },
    { x: 600, y: 120, connections: [] },
  ]

  return (
    <div className="w-[680px] h-[260px] relative">
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((node, index) => (
          <React.Fragment key={`connections-${index}`}>
            {node.connections.map((targetIndex, connectionIndex) => {
              const start = { x: node.x + 40, y: node.y + 25 }
              const end = { x: nodes[targetIndex].x + 40, y: nodes[targetIndex].y + 25 }
              const midX = (start.x + end.x) / 2

              // Create step path with horizontal segments and vertical connections
              const path = `M ${start.x} ${start.y}
                           H ${midX}
                           V ${end.y}
                           H ${end.x}`

              return (
                <g key={`${index}-${connectionIndex}`}>
                  <motion.path
                    d={path}
                    stroke="rgba(155, 156, 247, 0.6)"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="square"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.75,
                      delay: index * 0.15 + 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                      ease: "linear",
                    }}
                  />
                  <motion.path
                    d={path}
                    stroke="rgba(59, 130, 246, 0.6)"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="square"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.75,
                      delay: index * 0.15 + 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                      ease: "linear",
                    }}
                  />
                </g>
              )
            })}
          </React.Fragment>
        ))}
      </svg>

      {nodes.map((node, index) => (
        <motion.div key={`node-${index}`} className="absolute" style={{ left: node.x, top: node.y, zIndex: 10 }}>
          <motion.div
            className="w-[80px] h-[50px] bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-lg relative overflow-hidden"
            style={{
              boxShadow: "0 0 70px 2px rgba(59, 130, 246, 0.1), 0 0 30px 4px rgba(59, 130, 246, 0.05)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.15,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-blue-500/5"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1,
                delay: index * 0.15,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            />

            {/* Pulsing border */}
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-blue-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                delay: index * 0.15,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            />

            {/* Inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

export default LoadingAnimation

