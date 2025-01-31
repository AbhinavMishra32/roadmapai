"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, type MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Brain, ListTodo, Compass, Bookmark, MessageSquareMore } from "lucide-react"
import type { MindMapNode } from "../../types"

interface CareerDockProps {
  selectedNode: MindMapNode | null
}

const items = [
  {
    title: "Chat with AI",
    icon: <Brain className="text-indigo-300" />,
    href: "#chat",
  },
  {
    title: "Save Todo",
    icon: <ListTodo className="text-indigo-300" />,
    href: "#todo",
  },
  {
    title: "Explore",
    icon: <Compass className="text-indigo-300" />,
    href: "#explore",
  },
  {
    title: "Bookmarks",
    icon: <Bookmark className="text-indigo-300" />,
    href: "#bookmarks",
  },
  {
    title: "Discuss",
    icon: <MessageSquareMore className="text-indigo-300" />,
    href: "#discuss",
  },
]

export const CareerDock = ({ selectedNode }: CareerDockProps) => {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)

  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex h-16 items-end rounded-2xl bg-neutral-950/50 backdrop-blur-md border border-indigo-500/20 px-4 pb-3 shadow-[0_0px_60px_-10px_rgba(139,92,246,0.3)] z-50"
        >
          {items.map((item) => (
            <IconContainer mouseX={mouseX} key={item.title} {...item} selectedNode={selectedNode} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function IconContainer({
    mouseX,
    title,
    icon,
    selectedNode,
}: {
    mouseX: MotionValue
    title: string
    icon: React.ReactNode
    selectedNode: MindMapNode
}) {
    const ref = useRef<HTMLDivElement>(null)

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    // Developer can access the selectedNode data here
    console.log("Clicked action:", title, "for node:", selectedNode)
    // Example of accessing node data
    const nodeData = {
      id: selectedNode.id,
      label: selectedNode.data.label,
      description: selectedNode.data.description,
      timeEstimate: selectedNode.data.timeEstimate,
      nextSteps: selectedNode.data.nextSteps,
    }
    console.log("Node data:", nodeData)
  }

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="mx-2 aspect-square rounded-2xl bg-neutral-900/50 border border-indigo-500/20 hover:border-indigo-500/40 flex items-center justify-center relative cursor-pointer"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="px-3 py-1.5 rounded-lg bg-neutral-950/80 border border-indigo-500/20 text-indigo-200 absolute left-1/2 -translate-x-1/2 -top-10 whitespace-nowrap text-sm font-medium"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div style={{ width: widthIcon, height: heightIcon }} className="flex items-center justify-center">
        {icon}
      </motion.div>
    </motion.div>
  )
}

