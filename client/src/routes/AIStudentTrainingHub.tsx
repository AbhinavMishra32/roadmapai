'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  export const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  export const pulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

const careerCategories = [
  {
    title: "Career Exploration",
    description: "Discover exciting career paths tailored to your interests and skills.",
    url: "/aitraining/career-exploration",
    icon: "🧭"
  },
  {
    title: "Interview Preparation",
    description: "Master the art of interviewing with AI-powered mock interviews.",
    url: "/aitraining/interview-prep",
    icon: "🎙️"
  },
  {
    title: "Resume Building",
    description: "Create a standout resume with AI-assisted tips and templates.",
    url: "/aitraining/resume-building",
    icon: "📄"
  },
  {
    title: "Skill Development",
    description: "Enhance your skills with personalized learning paths.",
    url: "/aitraining/skill-development",
    icon: "🚀"
  },
  {
    title: "College Planning",
    description: "Get AI-powered insights for choosing the right college and major.",
    url: "/aitraining/college-planning",
    icon: "🎓"
  }
];

const CareerCounselingHub = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <motion.div 
        initial="initial"
        animate="animate"
        variants={stagger}
        className="container mx-auto px-4 py-12"
      >
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold mb-8 text-center"
        >
          AI-Powered Career Training
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-center mb-12 max-w-2xl mx-auto"
        >
          Empowering high school students to shape their future careers with cutting-edge AI technology.
        </motion.p>
        <motion.div 
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {careerCategories.map((category, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="bg-white border-2 border-yellow-400 hover:border-yellow-500 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden group">
                <CardHeader>
                  <motion.div 
                    variants={pulse}
                    className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300"
                  >
                    {category.icon}
                  </motion.div>
                  <CardTitle className="text-2xl mb-2">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600">{category.description}</CardDescription>
                </CardHeader>
                <div className="p-4 mt-auto">
                  <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold">
                    <Link to={category.url}>
                      Explore {category.title}
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CareerCounselingHub;

