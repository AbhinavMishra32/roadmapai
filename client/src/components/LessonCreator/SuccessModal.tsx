import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SuccessModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <Card>
        <CardContent className="p-6">
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Lesson Created Successfully!</h2>
            <p className="mb-6 text-gray-600">Your new lesson has been added to the curriculum.</p>
            <Button onClick={onClose} className="w-full bg-yellow-400 text-white hover:bg-yellow-500 transition-colors duration-300">
              Close
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

