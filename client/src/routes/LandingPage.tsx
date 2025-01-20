import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useAnimate, stagger } from 'framer-motion'
import { Button } from "@/components/ui/button"
import landingHeroImage from '../assets/landing_hero.png';
import { Link, useNavigate } from 'react-router-dom'
import { BarChart, BookOpen, Check, CircleDot, Video, Map, Search, MessageSquare } from 'lucide-react';
import AIRoadmap from '../assets/video1.mp4';
import ChatWithCounsellors from '@/components/LandingPage/ChatWithCounsellors';
import AIRoadmaps from '@/components/LandingPage/AIRoadmaps';
import ExploreCareersPaths from '@/components/LandingPage/ExploreCareersPaths';
import InterviewAnalysis from '@/components/LandingPage/InterviewAnalysis';
// import "./assets/fonts/Rubik_Scribble/RubikScribble-Regular.ttf";


export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  });

  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate([
      [".stagger-fade-in", { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: stagger(0.1) }],
      [".hero-title", { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] }, { duration: 0.5, at: "<" }],
      [".hero-subtitle", { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] }, { duration: 0.5, at: "-0.25" }],
    ])
  }, [animate])

  return (
    <div ref={scope} className="relative">
      <header className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 rounded-full transition-all duration-500 ${scrollY > 0 ? 'bg-white/90 mt-6 backdrop-blur-xl w-[90%] md:w-[70%] ring-4 ring-amber-300' : 'bg-transparent mt-3 w-[95%] md:w-[75%]'}`}>
      <nav className="container mx-auto px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
        <motion.div 
        className="text-xl md:text-2xl font-bold flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        >
        {/* <Image src="/logo.svg" alt="MentorMap" width={32} height={32} /> */}
        {/* <img src="/logo.svg" alt="MentorMap" width={32} height={32} /> */}
        {/* <img src="https://via.placeholder.com/500" alt="MentorMap" width={32} height={32} /> */}
        MentorMap
        </motion.div>
        <motion.ul 
        className="hidden sm:flex space-x-4 md:space-x-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        >
        <li><Link to="#" className="hover:text-primary transition-colors">About</Link></li>
        <li><Link to="#" className="hover:text-primary transition-colors">Explore</Link></li>
        <li><Link to="#" className="hover:text-primary transition-colors">Find Your Career</Link></li>
        <li><Link to="#" className="hover:text-primary transition-colors">AI Roadmap</Link></li>
        <li><Link to="#" className="hover:text-primary transition-colors">AI Interview Prep</Link></li>
        </motion.ul>
        <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        >
        <Button onClick = {() =>navigate('/signin')}variant="default" className={`bg-yellow-400 rounded-full text-black hover:bg-yellow-500/90 ${scrollY > 0 ? '' : 'shadow-xl'} transition-all duration-1000`}>Dashboard</Button>
        </motion.div>
      </nav>
      </header>

      <main>
      <section ref={targetRef} className="relative pt-24 bg-gradient-to-t from-[#FFF5E1] from-20% via-[#fbecc7] overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <span className="text-sm font-medium bg-black/5 px-4 py-2 rounded-full">
                Career Guidance Platform
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-black" style={{fontFamily: "PangolinRegular"}}>
                Navigate Your Future with Confidence
              </h1>
                <p className="text-black/60 text-lg max-w-xl">
                Guidance For Growth, Support For Success
                </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to='/signin'>
                <button className="bg-[#FFD84D] text-black px-6 py-3 rounded-full font-medium flex items-center gap-2">
                  Start Your Counseling Journey
                </button>
                </Link>
                <button className="bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2">
                  Create AI Roadmap
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl shadow-lg">
                  <div className="p-2 bg-[#FFD84D] rounded-lg">
                    <BookOpen className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-medium">Career Explorer</p>
                    <p className="text-sm text-black/60">Powered by O*NET</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl shadow-lg">
                  <div className="p-2 bg-[#FFD84D] rounded-lg">
                    <Video className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-medium">Interview Analyzer</p>
                    <p className="text-sm text-black/60">AI Performance Insights</p>
                  </div>
                </div>
              </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-8">
                    <div className="space-y-8">
                      <TimelineItem
                        icon={<span className="w-6 h-6 rounded-full bg-[#FFD84D] flex items-center justify-center text-black">1</span>}
                        title="Personal Counseling"
                        description="Connect directly with experienced career counselors for tailored advice."
                      />
                      <TimelineItem
                        icon={<Check className="w-5 h-5 text-black" />}
                        title="AI Roadmaps"
                        description="Generate personalized career paths from your current position to your goals."
                      />
                      <TimelineItem
                        icon={<CircleDot className="w-5 h-5 text-black" />}
                        title="Career Database"
                        description="Explore diverse careers using comprehensive data from O*NET Online."
                      />
                    </div>
                    <div className="space-y-8">
                      <TimelineItem
                        icon={<span className="w-6 h-6 rounded-full bg-[#FFD84D] flex items-center justify-center text-black">f</span>}
                        title="Interview Practice"
                        description="Hone your skills with AI-powered interview simulations and feedback."
                      />
                      <TimelineItem
                        icon={<span className="w-6 h-6 rounded-full border-2 border-black/20 flex items-center justify-center text-black">?</span>}
                        title="Performance Analysis"
                        description="Receive detailed insights on your interview performance through AI analysis."
                      />
                      <TimelineItem
                        icon={<span className="w-6 h-6 rounded-full border-2 border-black/20 flex items-center justify-center text-black">8</span>}
                        title="Resource Library"
                        description="Access a wealth of career resources, guides, and educational materials."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: [0, -20, 0],
        transition: {
          y: {
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          },
          opacity: { duration: 0.6 }
        }
      }}
      className="relative"
    >
      <div className="relative">
        <motion.div 
          className="absolute right-20 -top-32 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-yellow-500 to-yellow-200 shadow-xl"
          animate={{
            scale: [1, 1.05, 1],
            transition: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }
          }}
        />
        <img
          src={landingHeroImage}
          alt="Student"
          className="relative z-10 h-auto -top-40 w-[800px] mx-auto"
        />
      </div>
    </motion.div>
  )
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 w-full">
            <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0 200L1440 200L1440 80C1440 80 1082.5 200 720 200C357.5 200 0 80 0 80L0 200Z" fill="white" />
            </svg>
          </div>
        </section>

        <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Empowering Career Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "AI Counselor Chat", 
              description: "Chat directly with our AI-powered counselors for personalized career guidance and support.",
              icon: <MessageSquare className="w-6 h-6 text-yellow-500" />
            },
            { 
              title: "AI Career Roadmaps", 
              description: "Generate personalized career paths from your current position to your desired goals using AI technology.",
              icon: <Map className="w-6 h-6 text-yellow-500" />
            },
            { 
              title: "Career Explorer", 
              description: "Explore various careers through our comprehensive database powered by the O*NET Online dataset.",
              icon: <Search className="w-6 h-6 text-yellow-500" />
            },
            { 
              title: "Interview Analysis", 
              description: "Receive detailed AI-powered analysis and feedback on your interview performance to improve your skills.",
              icon: <Video className="w-6 h-6 text-yellow-500" />
            },
            { 
              title: "Job Market Insights", 
              description: "Stay updated with real-time job market trends and analytics to make informed career decisions.",
              icon: <BarChart className="w-6 h-6 text-yellow-500" />
            },
            { 
              title: "Skill Development", 
              description: "Access curated resources and materials to enhance your skills and knowledge in your chosen career path.",
              icon: <BookOpen className="w-6 h-6 text-yellow-500" />
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="stagger-fade-in bg-gray-50 p-8 rounded-3xl"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-[#FFD84D] rounded-full mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    

    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left column: Heading and subheading */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              
              <span className="block text-yellow-500">AI Powered Roadmaps</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Create custom career roadmaps from your current position to your desired goal using advanced AI technology.
            </p>
            <button className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105">
              Learn More
            </button>
          </div>

              <div className="lg:w-1/2">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-500 text-lg">
                      <video
                        src={AIRoadmap}
                        autoPlay
                        loop
                        muted
                        style={{ width: "100%", height: "auto" }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <MentorMapFeatures />
      </main>
    </div>
  )
}

function TimelineItem({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative pl-8 before:absolute before:left-[11px] before:top-8 before:h-full before:w-[2px] before:bg-[#C4A052]/30 last:before:hidden">
      <div className="absolute left-0 top-1">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-black/80">{title}</h3>
        <p className="text-black/50">{description}</p>
      </div>
    </div>
  )
}
const MentorMapFeatures: React.FC = () => {
  return (
    <div className="bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <ChatWithCounsellors />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <AIRoadmaps />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <ExploreCareersPaths />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* <InterviewAnalysis /> */}
      </motion.div>
      <footer className="bg-gray-200 text-black py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold">MentorMap</h3>
          <p className="text-gray-600">Navigate Your Future with Confidence</p>
        </div>
        <div className="flex space-x-4">
          <Link to="#" className="text-gray-600 hover:text-white transition-colors">About</Link>
          <Link to="#" className="text-gray-600 hover:text-white transition-colors">Explore</Link>
          <Link to="#" className="text-gray-600 hover:text-white transition-colors">Careers</Link>
          <Link to="#" className="text-gray-600 hover:text-white transition-colors">Contact</Link>
        </div>
          </div> 
          <div className="mt-8 text-center text-gray-200">
        &copy; {new Date().getFullYear()} MentorMap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}