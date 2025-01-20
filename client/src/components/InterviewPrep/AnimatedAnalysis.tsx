import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, BarChart, MessageSquare, Activity, Mic, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AnimatedAnalysisProps {
  analysis: any;
  isAnalyzing: boolean;
  onNextQuestion: () => void;
}

const AnimatedAnalysis: React.FC<AnimatedAnalysisProps> = ({ analysis, isAnalyzing, onNextQuestion }) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 border-t-4 border-yellow-500 rounded-full"
        />
        Analysing your response...
      </div>
    );
  }

  if (!analysis?.response) {
    return (
      // <Card className="p-6 text-center">
      //   <CardHeader>
      //     <CardTitle className="flex items-center justify-center gap-2">
      //       <AlertTriangle className="w-6 h-6 text-yellow-500" />
      //       <span>Analysis Unavailable</span>
      //     </CardTitle>
      //   </CardHeader>
      //   <CardContent>
      //     <p>Sorry, the analysis data is not available at the moment.</p>
      //   </CardContent>
      //   <CardFooter>
      //     <Button onClick={onNextQuestion} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
      //       Next Question <ChevronRightIcon className="ml-2 h-4 w-4" />
      //     </Button>
      //   </CardFooter>
      // </Card>
      <></>
    );
  }

  const overallScore = analysis.response.overallAnalysis?.overallScore || 'N/A';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const AnalysisItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
      <span className="font-medium text-sm text-gray-600">{label}</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-4 max-w-4xl mx-auto"
    >
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-l from-yellow-200 to-amber-400 to-80%">
            <CardTitle className="flex items-center justify-between text-2xl">
              Overall Analysis
              <motion.span 
                className="text-4xl font-bold bg-black/20 px-4 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {overallScore}
              </motion.span>
            </CardTitle>
            <CardDescription className="text-black/80 mt-2">
              {analysis.summary || 'No summary available'}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { 
            title: "Content Analysis", 
            icon: BarChart, 
            data: analysis.response.contentAnalysis,
            height: "h-[280px]"
          },
          { 
            title: "Delivery Analysis", 
            icon: MessageSquare, 
            data: analysis.response.deliveryAnalysis,
            height: "h-[280px]"
          },
          { 
            title: "Emotional and Behavioral Cues", 
            icon: Activity, 
            data: analysis.response.emotionalAndBehavioralCues,
            height: "h-[280px]"
          },
          { 
            title: "Filler Words Usage", 
            icon: Mic, 
            data: analysis.response.fillerWordsUsage,
            height: "h-[280px]"
          }
        ].map((section, index) => (
          <motion.div key={section.title} variants={cardVariants}>
            <Card className={`${section.height}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <section.icon className="w-5 h-5 text-yellow-500" />
                  <span className='capitalize'>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ScrollArea className="h-[180px] pr-4">
                  {section.data ? (
                    section.title === "Filler Words Usage" ? (
                      <div className="space-y-4">
                        <AnalysisItem 
                          label="Frequency" 
                          value={section.data.frequency || 'N/A'} 
                        />
                        <AnalysisItem 
                          label="Examples" 
                          value={section.data.examples?.join(', ') || 'N/A'} 
                        />
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {Object.entries(section.data).map(([key, value]) => (
                          <AnalysisItem
                            key={key}
                            label={key.replace(/([A-Z])/g, ' $1').trim()}
                            value={value as string}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">No data available</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[100px]">
              <p className="text-sm text-gray-600">
                {analysis.response.overallAnalysis?.feedback || 'No feedback available'}
              </p>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-6">
            <Button onClick={onNextQuestion} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
              Next Question <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedAnalysis;

