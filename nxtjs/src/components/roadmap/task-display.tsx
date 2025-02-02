"use client";
import { Card } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"

interface TaskDisplayProps {
  selectedNode?: {
    data: {
      tasks?: string[]
    }
  }
}

const listVariants = {
    hidden: {opacity: 0, y: 20, filter: "blur(10px)"},
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            delay: i * Math.random() * 0.15,
            mass: 0.6,
        },
    }),
}

export default function TaskDisplay({ selectedNode }: TaskDisplayProps) {
  if (!selectedNode?.data.tasks?.length) return null

    return (
        <Card className="absolute z-50 bottom-0 left-0 w-auto rounded-lg bg-transparent">
            <div className="p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                    {selectedNode.data.tasks.map((task, index) => (
                        <motion.li
                            key={task}
                            className="flex items-center gap-4 text-sm text-white/90"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                            layout
                        >
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200 border-indigo-900 text-xs">
                                {index + 1}
                            </span>
                            <span>{task}</span>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </div>
        </Card>
    )
}

