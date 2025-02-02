"use client"

import { motion } from "framer-motion"
import { BookmarkIcon, CheckSquare, RefreshCw, Save, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoadmapControlsProps {
  onShowTasks?: () => void
  onBookmarkNode?: () => void
  onBookmarkRoadmap?: () => void
  onRegenerateRoadmap?: () => void
}

export default function RoadmapControls({
  onShowTasks,
  onBookmarkNode,
  onBookmarkRoadmap,
  onRegenerateRoadmap,
}: RoadmapControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 ml-10 z-[51] flex items-center gap-2"
    >
      <div className="flex p-1.5 items-center gap-1.5 rounded-full backdrop-blur-md bg-white/10 dark:bg-neutral-950/50 border border-white/20 dark:border-white/10 shadow-lg">
        <Button
          onClick={onShowTasks}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <CheckSquare className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
          <span className="sr-only">Show Tasks</span>
        </Button>

        <Button
          onClick={onBookmarkNode}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <BookmarkIcon className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
          <span className="sr-only">Bookmark Node</span>
        </Button>

        <Button
          onClick={onBookmarkRoadmap}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <Save className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
          <span className="sr-only">Save Roadmap</span>
        </Button>

        <Button
          onClick={onRegenerateRoadmap}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
          <span className="sr-only">Regenerate Roadmap</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <Share2 className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
          <span className="sr-only">Share Roadmap</span>
        </Button>
      </div>
    </motion.div>
  )
}

