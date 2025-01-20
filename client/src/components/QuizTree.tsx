import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const quizTree = {
  root: {
    question: "What's your primary area of interest?",
    options: [
      { text: "Technology", next: "tech" },
      { text: "Creative Arts", next: "arts" },
      { text: "Business", next: "business" },
      { text: "Science", next: "science" }
    ]
  },
  tech: {
    question: "Which aspect of technology interests you most?",
    options: [
      { text: "Software Development", next: "software" },
      { text: "Hardware & Networks", next: "hardware" },
      { text: "Data Science", next: "data" },
      { text: "Cybersecurity", next: "security" }
    ]
  },
  software: {
    question: "What type of software development appeals to you?",
    options: [
      { text: "Web Development", next: "web" },
      { text: "Mobile App Development", next: "mobile" },
      { text: "Game Development", next: "game" },
      { text: "AI/Machine Learning", next: "ai" }
    ]
  },
  web: {
    question: "Which area of web development do you prefer?",
    options: [
      { text: "Frontend", career: "Frontend Developer", end: true },
      { text: "Backend", career: "Backend Developer", end: true },
      { text: "Full Stack", career: "Full Stack Developer", end: true },
      { text: "DevOps", career: "DevOps Engineer", end: true }
    ]
  },
  // Add more nodes here with similar structure
};

export function QuizTree({ onComplete }) {
  const [currentNode, setCurrentNode] = useState('root');
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option.text];
    setAnswers(newAnswers);
    
    if (option.end) {
      onComplete(newAnswers, option.career);
    } else {
      setCurrentNode(option.next);
    }
  };

  const currentQuestion = quizTree[currentNode];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{currentQuestion.question}</CardTitle>
        <CardDescription>Choose the option that best describes your interest</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(option)}
            variant="outline"
            className="w-full text-left justify-start h-auto py-3 px-4"
          >
            {option.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

