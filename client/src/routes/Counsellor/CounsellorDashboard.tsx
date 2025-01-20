import { api } from '@/services/axios'
import React, { useEffect } from 'react'
import CounselorChat from './CounsellorChat'
import CounsellorQuiz from '@/components/CounsellorQuiz'

const CounsellorDashboard = () => {
  const [isVerified, setIsVerified] = React.useState(false);
  useEffect(() => {
    const fetchCounsellorData = async () => {
      try {
        const response = await api.get('/api/counsellor/me');
        console.log(response.data);
        setIsVerified(response.data.user.isVerified);

      } catch (error) {
        console.error(error);
      }
    };

    fetchCounsellorData();
  }, []);
  return (
    <div className='min-h-screen bg-gradient-to-r from-gray-200 to-gray-100 flex items-center justify-center p-8'>
      {!isVerified ? (
        <div className='bg-white rounded-xl shadow-2xl p-8 transform transition-transform w-[600px]'>
          <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-red-600 mb-4'>
            Verification Required! 🎯
          </h1>
          <p className='text-xl text-gray-700 mb-6 animate-pulse'>
            Complete the exam to unlock your counselor privileges
          </p>
          <CounsellorQuiz />
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-2xl p-8 text-center w-[600px]'>
          <h1 className='text-4xl font-bold text-green-500 mb-4'>
            🎉 Verification Complete!
          </h1>
          <p className='text-xl text-gray-700 animate-bounce'>
            Head to messages to start helping students
          </p>
        </div>
      )}
    </div>
  );
};

export default CounsellorDashboard