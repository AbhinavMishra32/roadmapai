import { Search, Briefcase, X } from 'lucide-react'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function AICareerExplorer() {
  const [exploring, setExploring] = useState(false)
  const [userPrompt, setCareer] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const careerInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true);

  const handleExplore = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) setLoading(true);
    if (userPrompt.trim()) {
        setExploring(true);
        setAiResponse('');

        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/api/ai/chat?message=${encodeURIComponent(userPrompt)}`,
            { withCredentials: true }
        );

        eventSource.onmessage = function(event) {
          setLoading(false);
            try {
                const data = JSON.parse(event.data);
                if (data.text) {
                    setAiResponse((prev) => prev + data.text);
                }
            } catch (error) {
                console.error("Error processing streamed data:", error);
            }
        };

        eventSource.onerror = () => {
            console.log('SSE connection closed due to error');
            eventSource.close();
            setExploring(false);
        };

        eventSource.addEventListener('end', () => {
            console.log('SSE connection ended');
            eventSource.close();
        });
    }
}, [userPrompt]);

useEffect(() => {
  console.log("AI response: ", aiResponse);
}, [aiResponse]);

  const handleClear = useCallback(() => {
    setCareer('')
    setExploring(false)
    setAiResponse('')
    careerInputRef.current?.focus()
  }, [])

  const logoLetters = 'CareerAI'.split('')

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="mb-12 relative"
      >
        <h1 className="text-8xl font-bold tracking-tighter">
          {logoLetters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className={`inline-block ${
              'CAI'.includes(letter) ? 'text-yellow-500' : 'text-gray-200'
              }`}
              style={{ WebkitTextStroke: '1px black' }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -top-8 -right-8"
        >
          <Briefcase className="w-12 h-12 text-yellow-500" />
        </motion.div>
      </motion.div>
      
      <motion.div
        className={`w-full max-w-3xl transition-all duration-700 ease-in-out ${
          exploring ? 'h-[60vh]' : 'h-16'
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <form onSubmit={handleExplore} className="h-full flex flex-col">
          <motion.div 
            className="flex items-center p-4 rounded-full border border-yellow-300 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-5 h-5 text-yellow-500 mr-3" />
            <input
              ref={careerInputRef}
              type="text"
              value={userPrompt}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="Enter your dream career (e.g., Software Engineer)"
              className="flex-grow text-lg bg-transparent outline-none text-gray-800"
              aria-label="Enter your dream career"
            />
            <AnimatePresence>
              {userPrompt && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={handleClear}
                  className="mr-3 text-gray-400 hover:text-gray-600"
                  aria-label="Clear input"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.button>
          </motion.div>
          
          <AnimatePresence>
            {exploring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="flex-grow mt-6 p-6 bg-white rounded-3xl overflow-auto shadow-lg"
              >
                <motion.h2 
                  className="text-2xl font-bold mb-4 text-yellow-500 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                    style={{WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}
                  >
                    <span className={`flex items-center ${loading ? 'animate-pulse' : ''}`}>
                      {loading ? (
                      <div className="mr-2 w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      ) : null}
                      {!loading && (
                    <Briefcase className={`mr-2`} style={{strokeWidth: 3}} />
                      )}
                      Career Insights: {userPrompt}
                    </span>
                </motion.h2>
                <motion.p 
                  className="text-gray-700 whitespace-pre-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                        <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              style={{
                color: '#333',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                borderBottom: '2px solid #f7dc6f', // Yellow underline
                paddingBottom: '5px',
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              style={{
                color: '#333',
                fontSize: '2rem',
                fontWeight: 'bold',
                borderLeft: '5px solid #f7dc6f', // Yellow highlight
                paddingLeft: '10px',
              }}
              {...props}
            />
          ),
          em: ({ node, ...props }) => (
            <em style={{ color: '#f7dc6f', fontStyle: 'italic' }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              style={{
                listStyleType: 'disc',
                paddingLeft: '20px',
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{
                marginBottom: '5px',
                color: '#333',
              }}
              {...props}
            />
          ),
        }}
      >
        {aiResponse}
      </ReactMarkdown>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-700 mb-2">Not sure what career to explore?</p>
        <motion.button 
          className="px-6 py-3 text-sm text-yellow-600 border border-yellow-500 rounded-full hover:bg-yellow-100 transition-colors duration-300 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Suggest a Career
        </motion.button>
      </motion.div>
    </div>
  )
}