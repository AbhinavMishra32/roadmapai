import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

interface FinalAnalysisProps {
  analysis: {
    overallReview: string;
    score: number;
    speechTonality: string;
    personalityImpression: string;
    strengths: string[];
    areasForImprovement: string[];
  };
}

const FinalAnalysis: React.FC<FinalAnalysisProps> = ({ analysis }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
        variants={fadeInUp}
      >
        Your Analysis
      </motion.h1>

      <motion.div variants={fadeInUp} className="mb-6">
        <Card>
          <CardHeader className="bg-yellow-50 border-b border-yellow-100">
            <CardTitle className="text-xl text-yellow-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Overall Review
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700">{analysis.overallReview}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Performance</h3>
            <div className="flex items-center">
              <Progress value={analysis.score} className="flex-grow mr-2" indicatorColor='bg-yellow-400' />
              <span className="text-2xl font-bold text-yellow-500">{analysis.score}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Speech Tonality</h3>
            <p className="text-xl text-yellow-500">{analysis.speechTonality}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Personality Impression</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700">{analysis.personalityImpression}</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-xl text-green-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <Badge className="mr-2 bg-green-100 text-green-800 text-xs">{index + 1}</Badge>
                    <span className="text-gray-700 text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-xl text-orange-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {analysis.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <Badge className="mr-2 bg-orange-100 text-orange-800 text-xs">{index + 1}</Badge>
                    <span className="text-gray-700 text-sm">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalAnalysis;

