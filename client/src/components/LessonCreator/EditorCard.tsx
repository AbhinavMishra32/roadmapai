import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export default function EditorCard({ index, title, content, onTitleChange, onContentChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <Input
            placeholder="Section Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-lg font-semibold mb-4 border-b-2 border-yellow-400 focus:border-yellow-500 transition-colors duration-300"
          />
          <Textarea
            placeholder="Enter your content here..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full min-h-[150px] resize-none border-none focus:ring-2 focus:ring-yellow-400 transition-shadow duration-300"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

