'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import VideoRecorder from '../components/InterviewPrep/VideoRecorder';
import FinalAnalysis from '../components/InterviewPrep/FinalAnalysis';
import AnimatedAnalysis from '../components/InterviewPrep/AnimatedAnalysis';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { api } from '@/services/axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables")
}

const InterviewPrep = () => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, { aiAnalysis: unknown }>>({});
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [finalAnalysis, setFinalAnalysis] = useState(null);
    const [showFinalAnalysis, setShowFinalAnalysis] = useState(false);
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
    const [studentInterests, setStudentInterests] = useState<string>('');
    const [showInterestInput, setShowInterestInput] = useState(true);
    const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);

    const generateQuestions = async () => {
        setIsGeneratingQuestion(true)
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

        const schema = {
            type: SchemaType.OBJECT,
            properties: {
                questions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ["questions"],
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        })

        // const prompt = `Generate 5 interview questions for a student counselling website which has an AI interview prep / analysis feature. The questions should check the student's personality, skills, and knowledge about their interests: ${studentInterests}. Start by asking simpler questions related to their name and their life (like normal interviewers (ask whatever you wanna as an interviewer)).Then ask questions that would be asked specifically in that interview / career that the user has chosen, ask only relevant questions related to the interest (but not too deep), dont ask general corporate questions. Infer the potential career paths based on these interests and ask questions as if it were a job interview. The AI should be able to analyze the student's responses and provide feedback.`

        const prompt = `Generate 3 questions that tests that test student's knowledge about their interests: ${studentInterests}. And it also tests their personality and skills. The AI should provide exact feedback on the student's responses. Dont ask too long question, use easy words. (school students), dont tell feedback`

        try {
            const result = await model.generateContent(prompt)
            const generatedQuestions = JSON.parse(result.response.text())
            setQuestions(generatedQuestions.questions)
            setIsGeneratingQuestion(false)
            setShowInterestInput(false)
        } catch (error) {
            console.error("Error generating questions:", error)
            setIsGeneratingQuestion(false)
        }
    }

    const handleVideoUpload = async (blob: Blob) => {
        setIsAnalyzing(true);
        setCurrentAnalysis(null);
        const formData = new FormData();
        formData.append('video', blob, 'recording.mp4');
        formData.append('question', questions[currentQuestionIndex]);
    
        try {
            const response = await api.post('/api/ai/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const aiResponse = response.data.response;
            setResponses(prev => ({
                ...prev,
                [questions[currentQuestionIndex]]: { aiAnalysis: aiResponse }
            }));
            console.log('All responses: ', responses);
            setCurrentAnalysis(aiResponse);
            console.log('Current analysis:', aiResponse);
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnalysis(null);
        } else {
            finishInterview();
        }
    };

    const finishInterview = async () => {
        try {
            const analysisResponse = await api.post('/api/ai/video/finalize', { questionResponses: responses });
            console.log('Final analysis:', analysisResponse.data);
            setFinalAnalysis(analysisResponse.data);
            setShowFinalAnalysis(true);
        } catch (error) {
            console.error('Error getting final analysis:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                    AI Personality Developer
                </h1>

                <AnimatePresence mode="wait">
                    {showInterestInput ? (
                        <motion.div
                            key="interest-input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b border-gray-200">
                                    <CardTitle className="text-2xl font-semibold">What are your interests?</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Input
                                        type="text"
                                        placeholder="E.g., Computer Science, Art, Biology"
                                        value={studentInterests}
                                        onChange={(e) => setStudentInterests(e.target.value)}
                                        className="mb-4"
                                    />
                                    <Button 
                                        onClick={generateQuestions}
                                        disabled={isGeneratingQuestion || !studentInterests}
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-all duration: 300 ease-in-out"
                                    >
                                        {isGeneratingQuestion ? 'Generating Questions...' : 'Start Interview'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : !showFinalAnalysis ? (
                        <motion.div
                            key="interview-questions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b border-gray-200">
                                    <CardTitle className="text-2xl font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={currentQuestionIndex}
                                            className="text-xl mb-6 font-medium text-gray-700"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {questions[currentQuestionIndex]}
                                        </motion.p>
                                    </AnimatePresence>
                                    {!currentAnalysis && (
                                        <VideoRecorder
                                            isRecording={isRecording}
                                            setIsRecording={setIsRecording}
                                            onVideoReady={handleVideoUpload}
                                        />
                                    )}
                                    <AnimatedAnalysis 
                                        analysis={currentAnalysis}
                                        isAnalyzing={isAnalyzing}
                                        onNextQuestion={handleNextQuestion}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Progress
                                        value={((currentQuestionIndex + 1) / questions.length) * 100}
                                        className="w-full h-2 bg-gray-200"
                                    />
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="final-analysis"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <FinalAnalysis analysis={finalAnalysis.analysis} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InterviewPrep;