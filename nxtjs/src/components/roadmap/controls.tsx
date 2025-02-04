import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Target, Compass, ArrowRight, Sparkles, BrainCircuit } from 'lucide-react'
import { Background, BackgroundVariant } from 'reactflow'

interface ControlsProps {
  onGenerateNewMindMap: (situation: string, goal: string, customPrompt?: string | null) => void
  isGenerating: boolean
  isInitialized: boolean
  selectedNode: any
}

const Controls: React.FC<ControlsProps> = ({ onGenerateNewMindMap, isGenerating, isInitialized, selectedNode }) => {
  const [situation, setSituation] = useState('');
  const [goal, setGoal] = useState('');
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerateNewMindMap(situation, goal, customPrompt)
  }

  if (isInitialized && isGenerating) {
    return null
  }

  if (!isInitialized) {
    return (
      <>
        <Card className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-none border-none bg-gray-50 dark:bg-neutral-950">
          <CardHeader className="p-6 text-center">
            <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              Create Your AI Roadmap
            </CardTitle>
          </CardHeader>
          {/* <div className='w-[80vh] mx-auto'> */}
          <CardContent className="p-6 bg-gray-50 dark:bg-neutral-950">
            <p className="text-slate-600 dark:text-gray-300 mb-4">
              Our AI-powered mind map creator helps you explore connections, discover new paths, and illuminate your thinking process.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Compass className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
                <Input
                  placeholder="Where are you now? (e.g., 'Starting a new project')"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="pl-10 py-3 rounded-lg text-sm dark:bg-neutral-900 text-gray-600 placeholder-gray-400 dark:placeholder-gray-500 border-2 border-gray-300 dark:border-neutral-800"
                />
              </div>
              <div className="relative">
                <Target className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
                <Input
                  placeholder="Where do you want to go? (e.g., 'Launch successfully')"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="pl-10 py-3 rounded-lg text-sm dark:bg-neutral-900 text-gray-600 placeholder-gray-400 dark:placeholder-gray-500 border-2 border-gray-300 dark:border-neutral-800"
                />
              </div>
              <div className='relative'>
                <textarea
                  placeholder='Custom Prompt'
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className='w-full h-20 p-2 rounded-lg text-sm bg-gray-50 dark:bg-neutral-900 text-gray-600 placeholder-gray-400 dark:placeholder-gray-500 border-2 border-gray-300 focus:ring-red-400 dark:border-neutral-800'
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-500 text-white font-semibold text-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isGenerating}
                onMouseEnter={() => set}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Crafting Your Mind Galaxy...
                  </>
                ) : (
                  <>
                    Create your Roadmap
                    <Sparkles className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          {/* </div> */}

        </Card>
        {/* <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          style={{ opacity: 0.3, zIndex: -1}}
        />  */}
      </>
    )
  }
  return (
    <Card className={`fixed bottom-4 right-4 w-[350px] rounded-2xl shadow-lg z-50 bg-white/70 dark:bg-indigo-900/10 backdrop-blur-md border-2 border-amber-200 dark:border-1 dark:border-gray-400/40 transition-all duration-300 ease-in-out ${selectedNode ? 'translate-y-[calc(100%+1rem)]' : 'translate-y-0'}`}>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          Want to explore more ideas?
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Compass className="absolute left-3 top-2.5 h-5 w-5 text-amber-500 dark:text-indigo-400" />
            <Input
              placeholder="Current cosmic coordinates"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="pl-10 py-2.5 bg-inherit dark:border-2 border-amber-200 dark:border-gray-400/40 rounded-2xl text-amber-900 dark:text-gray-400 placeholder-amber-400"
            />
          </div>
          <div className="relative">
            <Target className="absolute left-3 top-2.5 h-5 w-5 text-amber-500 dark:text-indigo-400" />
            <Input
              placeholder="Your stellar destination"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="pl-10 py-2.5 bg-inherit dark:border-2 border-amber-200 dark:border-gray-400/40 rounded-2xl text-amber-900 dark:text-gray-400 placeholder-amber-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-400 to-indigo-400 hover:from-indigo-500 hover:to-indigo-500 text-white font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Your Roadmap
              </>
            ) : (
              <>
                Create A New Roadmap
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Controls;