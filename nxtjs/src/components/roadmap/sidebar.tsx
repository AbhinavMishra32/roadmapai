"use client";

import type React from "react";
import { useEffect, useState } from "react";
import type { MindMapNode } from "@/types";
import {
  Briefcase,
  Book,
  Code,
  Server,
  Cloud,
  Users,
  School,
  Building2,
  LineChart,
  Stethoscope,
  Mic,
  Gavel,
  Paintbrush,
  Calculator,
  Wrench,
  Camera,
  GlassWater,
  DollarSign,
  Globe,
  Plane,
  Package2,
  Heart,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/services/axios"
import { useRouter } from "next/navigation";

interface SidebarProps {
  selectedNode: MindMapNode | null
}

const icons = {
  briefcase: Briefcase,
  book: Book,
  code: Code,
  server: Server,
  cloud: Cloud,
  users: Users,
  school: School,
  building: Building2,
  chart: LineChart,
  stethoscope: Stethoscope,
  Code: Code,
  Gavel: Gavel,
  Mic: Mic,
  Paintbrush: Paintbrush,
  Calculator: Calculator,
  Book: Book,
  Tool: Wrench,
  Camera: Camera,
  Cutlery: GlassWater,
  Wrench: Wrench,
  Flask: GlassWater,
  Music: Mic,
  Globe: Globe,
  DollarSign: DollarSign,
  Airplane: Plane,
  Tree: Building2,
  Package: Package2,
  Heart: Heart,
}

const Sidebar: React.FC<SidebarProps> = ({ selectedNode }) => {
  const [loading, setLoading] = useState(true)

  let IconComponent = Briefcase;
  try {
    IconComponent = selectedNode?.data.icon ? icons[selectedNode.data.icon as keyof typeof icons] : Briefcase;
  } catch (error) {
    console.error("Error loading icon:", error);
  }

  const contentVariants = {
    initial: { opacity: 0, scale: 0.96, filter: "blur(7px) brightness(0.8)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" },
    exit: { opacity: 0, scale: 0.96, filter: "blur(7px) brightness(0.8)" },
  }

  try {
    return (
      <div
        className={`fixed right-0 top-[80px] w-72 rounded-3xl m-2 backdrop-blur-md bg-white/40 dark:bg-neutral-950/50 shadow-[0_0px_60px_14px_rgba(0,0,0,0.6)] border-2 border-yellow-400 dark:border-indigo-400/30 overflow-y-auto max-h-[70vh] p-4 transition-all duration-300 ease-in-out ${selectedNode ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={contentVariants}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="p-2 rounded-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-200 rounded-lg transform transition-all hover:bg-indigo-100 duration-500">
                    <IconComponent className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{selectedNode.data.label}</h2>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed">
                  {selectedNode.data.description}
                </p>

                {selectedNode.data.detailedDescription && (
                  <div className="text-sm bg-gray-100 dark:bg-neutral-800/40 p-3 rounded-lg border border-gray-500/40">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedNode.data.detailedDescription}
                    </p>
                  </div>
                )}

                <div className="text-sm bg-slate-50 dark:bg-neutral-800/40 p-3 rounded-lg border border-gray-500/40">
                  <span className="text-yellow-600 dark:text-indigo-300/80 font-medium">Est. Time: </span>
                  <span className="text-gray-700 dark:text-gray-400">{selectedNode.data.timeEstimate}</span>
                </div>

                {(selectedNode.data.nextSteps ?? []).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-400">Next Steps</h3>
                    <ul className="space-y-2">
                      {(selectedNode.data.nextSteps ?? []).map((step, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-500"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 dark:bg-indigo-400 mr-2" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  } catch (error) {
    console.error("Error rendering Sidebar:", error);
    return null;
  }
}

export default Sidebar

