import { generateMindMapData } from '../utils/aiUtils';
import { MindMapNode, MindMapEdge } from '../types';

// export async function getMindMapData(): Promise<{ initialNodes: MindMapNode[], initialEdges: MindMapEdge[] }> {
//   try {
//     const aiData = await generateMindMapData();
//     return {
//       initialNodes: aiData.aiNodes,
//       initialEdges: aiData.aiEdges
//     };
//   } catch (error) {
//     console.error("Error fetching AI data, falling back to default data:", error);
//     throw error;
//   }
// }

export const initialNodes: MindMapNode[] = [
  // {
  //   id: 'start',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Start Your Journey',
  //     icon: 'briefcase',
  //     description: 'Begin your path to a tech career by exploring various options and opportunities.',
  //     timeEstimate: 'Ongoing',
  //     nextSteps: ['Explore', 'Research', 'Plan']
  //   }
  // },
  // {
  //   id: 'education',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Formal Education',
  //     icon: 'school',
  //     description: 'Pursue a degree in Computer Science, IT, or related fields.',
  //     timeEstimate: '2-4 years',
  //     nextSteps: ['Bachelor\'s', 'Master\'s', 'Online Degree']
  //   }
  // },
  // {
  //   id: 'bootcamp',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Coding Bootcamp',
  //     icon: 'code',
  //     description: 'Intensive, short-term programs to quickly gain practical coding skills.',
  //     timeEstimate: '3-6 months',
  //     nextSteps: ['Web Dev', 'Data Science', 'UX/UI']
  //   }
  // },
  // {
  //   id: 'self-study',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Self-Study',
  //     icon: 'book',
  //     description: 'Learn at your own pace through online resources and tutorials.',
  //     timeEstimate: 'Varies',
  //     nextSteps: ['Online Courses', 'Tutorials', 'Documentation']
  //   }
  // },
  // {
  //   id: 'internship',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Internship',
  //     icon: 'building',
  //     description: 'Gain practical experience and industry connections.',
  //     timeEstimate: '3-6 months',
  //     nextSteps: ['Apply', 'Network', 'Learn']
  //   }
  // },
  // {
  //   id: 'open-source',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Open Source Contribution',
  //     icon: 'users',
  //     description: 'Contribute to open source projects to build your portfolio and skills.',
  //     timeEstimate: 'Ongoing',
  //     nextSteps: ['Find Projects', 'Contribute', 'Collaborate']
  //   }
  // },
  // {
  //   id: 'certification',
  //   type: 'customNode',
  //   data: { 
  //     label: 'Professional Certification',
  //     icon: 'chart',
  //     description: 'Obtain industry-recognized certifications to validate your skills.',
  //     timeEstimate: '1-6 months per cert',
  //     nextSteps: ['Choose Path', 'Study', 'Exam']
  //   }
  // }
]

export const initialEdges: MindMapEdge[] = [
  // { 
  //   id: 'start-education',
  //   source: 'start',
  //   target: 'education',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'start-bootcamp',
  //   source: 'start',
  //   target: 'bootcamp',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'start-self-study',
  //   source: 'start',
  //   target: 'self-study',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'education-internship',
  //   source: 'education',
  //   target: 'internship',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'bootcamp-internship',
  //   source: 'bootcamp',
  //   target: 'internship',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'self-study-open-source',
  //   source: 'self-study',
  //   target: 'open-source',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'internship-certification',
  //   source: 'internship',
  //   target: 'certification',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // },
  // { 
  //   id: 'open-source-certification',
  //   source: 'open-source',
  //   target: 'certification',
  //   type: 'smoothstep',
  //   animated: false,
  //   style: { stroke: '#EAB308', strokeWidth: 2 }
  // }
]
