import React, { useEffect, useState } from 'react'
import { MindMapNode } from '../../types'
import { Briefcase, Book, Code, Server, Cloud, Users, School, Building2, LineChart, Stethoscope, Mic, Gavel, Paintbrush, Calculator, Wrench, Camera, GlassWater, DollarSign, Globe, Plane, Package2, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { api } from '@/services/axios'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  selectedNode: MindMapNode | null
}

const icons = {
  briefcase: Briefcase,
  book: Book,
  code: Code,
  server: Server,
  cloud: Cloud,
  users: Users,
  school: School,
  building: Building2,
  chart: LineChart,
  Briefcase: Briefcase,
  Stethoscope: Stethoscope,
  Code: Code,
  Gavel: Gavel,
  Mic: Mic,
  Paintbrush: Paintbrush,
  Calculator: Calculator,
  Book: Book,
  Tool: Wrench,
  Camera: Camera,
  Cutlery: GlassWater,
  Wrench: Wrench,
  Flask: GlassWater,
  Music: Mic,
  Globe: Globe,
  DollarSign: DollarSign,
  Airplane: Plane,
  Tree: Building2,
  Package: Package2,
  Heart: Heart,
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables')
}

const filterCounsellors = async (description: string) => {
  try {
    const response = await api.get('/api/counsellor/all');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        counsellors: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              bio: { type: SchemaType.STRING },
              chats: { type: SchemaType.NUMBER },
              createdAt: { type: SchemaType.STRING },
              email: { type: SchemaType.STRING },
              experience: { type: SchemaType.NUMBER },
              id: { type: SchemaType.STRING },
              isChattingWithStudent: { type: SchemaType.BOOLEAN },
              isVerified: { type: SchemaType.BOOLEAN },
              location: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              onboarded: { type: SchemaType.BOOLEAN },
              password: { type: SchemaType.STRING },
              rating: { type: SchemaType.NUMBER },
              specialities: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              updatedAt: { type: SchemaType.STRING },
              username: { type: SchemaType.STRING },
            },
            required: ["bio", "chats", "createdAt", "email", "experience", "id", "isChattingWithStudent", "isVerified", "location", "name", "onboarded", "password", "rating", "specialities", "updatedAt", "username"],
          },
        },
      },
      required: ["counsellors"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (!Array.isArray(response.data.counsellors)) {
      console.log('Response:', response.data.counsellors);
      throw new Error('Expected response.data to be an array');
    }

    const counsellors = response.data.counsellors.map((counsellor: {
      bio: string,
      chats: number,
      createdAt: string,
      email: string,
      experience: number,
      id: string,
      isChattingWithStudent: boolean,
      isVerified: boolean,
      location: string,
      name: string,
      onboarded: boolean,
      password: string,
      rating: number,
      specialities: string[],
      updatedAt: string,
      username: string,
    }) => ({
      bio: counsellor.bio,
      chats: counsellor.chats,
      createdAt: counsellor.createdAt,
      email: counsellor.email,
      experience: counsellor.experience,
      id: counsellor.id,
      isChattingWithStudent: counsellor.isChattingWithStudent,
      isVerified: counsellor.isVerified,
      location: counsellor.location,
      name: counsellor.name,
      onboarded: counsellor.onboarded,
      password: counsellor.password,
      rating: counsellor.rating,
      specialities: counsellor.specialities,
      updatedAt: counsellor.updatedAt,
      username: counsellor.username,
    }));

    const chats = counsellors.reduce((acc, counsellor) => {
      acc[counsellor.id] = counsellor.chats;
      return acc;
    }, {} as Record<string, number>);

    const promptText = `Give me 2-3 counsellors who are exactly eligible to the description provided by looking at their specialities, only give those counsellors whose specialities match exactly with the description, Counsellors: ${JSON.stringify(counsellors)}`;
    console.log('AI Prompt:', promptText);
    const result = await model.generateContent(promptText);
    const data = JSON.parse(result.response.text());
    console.log("AI Response:", data);

    return data.counsellors.map((counsellor: any) => ({
      ...counsellor,
      chats: chats[counsellor.id],
    }));
  } catch (error) {
    console.error('Error fetching counsellors:', error);
  }
};

const Sidebar: React.FC<SidebarProps> = ({ selectedNode }) => {
  // const [counsellors, setCounsellors] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchCounsellors = async () => {
  //     setLoading(true);
  //     try {
  //       setCounsellors(await filterCounsellors(selectedNode?.data.description || ''));
  //     } catch (error) {
  //       console.error('Error fetching counsellors:', error)
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (selectedNode) {
  //     fetchCounsellors();
  //   }
  // }, [selectedNode]);

  // useEffect(() => {
  //   console.log('Counsellors: ', counsellors);
  // }, [counsellors]);

  if (!selectedNode) return null
  const IconComponent = selectedNode.data.icon ? icons[selectedNode.data.icon as keyof typeof icons] : Briefcase
  return (
    <motion.div 
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: selectedNode ? 0 : "100%", opacity: selectedNode ? 1 : 0 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }}
      className="fixed right-0 top-[80px] w-72 rounded-3xl m-2 backdrop-blur-md bg-white/40 dark:bg-neutral-950/50 shadow-xl border-2 border-yellow-400 dark:border-indigo-400/30 overflow-y-auto max-h-[70vh] p-4"
    >
      <div className="p-2 rounded-xl transition-all duration-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-200 rounded-lg transform transition-all hover:bg-indigo-100 duration-500">
              <IconComponent className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{selectedNode.data.label}</h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed">
            {selectedNode.data.description}
          </p>

          {selectedNode.data.detailedDescription && (
            <div className="text-sm bg-gray-100 dark:bg-neutral-800/40 p-3 rounded-lg border border-gray-500/40">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedNode.data.detailedDescription}
              </p>
            </div>
          )}

          <div className="text-sm bg-slate-50 dark:bg-neutral-800/40 p-3 rounded-lg border border-gray-500/40">
            <span className="text-yellow-600 dark:text-indigo-300/80 font-medium">Est. Time: </span>
            <span className="text-gray-700 dark:text-gray-400">{selectedNode.data.timeEstimate}</span>
          </div>

          {selectedNode.data.nextSteps?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Next Steps</h3>
              <ul className="space-y-2">
                {selectedNode.data.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 dark:bg-indigo-400 mr-2" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Here comes the available counselors */}
        {/* {loading ? (
          <div className="flex items-center justify-center mt-4">
            <div className="w-6 h-6 border-2 border-t-2 border-yellow-400 rounded-full animate-spin" />
          </div>
        ) : (
          counsellors.length === 0 ? (
            <p className="text-gray-600 text-sm mt-4">No counsellors found</p>
          ) : (
            <div className="mt-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Available Counsellors</h3>
              {counsellors && counsellors.map((counsellor: any) => (
              <div
                key={counsellor.id}
                className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer"
                onClick={async () => {
                if (counsellor.isChattingWithStudent) {
                    console.log("Navigating to chat with counsellorId:", counsellor.chats[0].id);
                    navigate(`/counselling/chat/${counsellor.chats[0].id}`);
                    } else {
                    try {
                  console.log("Starting chat with counsellorId:", counsellor.chats[0].id);
                  const response = await api.post(`/api/chat/start`, {
                    counsellorId: counsellor.id
                  });
                  navigate(`/counselling/chat/${response.data.chatId}`);
                  console.log("handleStartChat response:", response.data);
                  } catch (error) {
                  console.error("Error while starting chat:", error);
                  }
                }
                }}
              >
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                <h4 className="text-sm font-semibold text-gray-800">{counsellor.name}</h4>
                <p className="text-xs text-gray-600">{counsellor.location}</p>
                {counsellor.isVerified && (
                  <div className="flex items-center text-xs text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Verified
                  </div>
                )}
                </div>
              </div>
              ))}
            </div>
              ))} */}
            </div>
            </motion.div>
      )}
export default Sidebar;
