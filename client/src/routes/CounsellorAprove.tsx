'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/axios'
import { CounsellorCard } from '../components/CounsellorCard'
import { Button } from "@/components/ui/button"
import { UserCheck, Loader2, AlertCircle } from 'lucide-react'
import PageLoading from '@/components/PageLoading'

interface Counsellor {
  id: string
  name: string
  email: string
  bio: string
  experience: string
  location: string
  rating: number
  specialities: string[]
  isChattingWithStudent: boolean
  onboarded: boolean
}

export default function CounsellorApprove() {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/approve')
        setCounsellors(response.data.counsellors)
        console.log(response.data)
      } catch (error) {
        console.error("Error in fetchCounsellors: ", error)
        setError("Failed to fetch counsellors. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchCounsellors()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/api/counsellor/${id}/approve`)
      setCounsellors(prevCounsellors => 
        prevCounsellors.filter(counsellor => counsellor.id !== id)
      )
    } catch (error) {
      console.error("Error in handleApprove: ", error)
      setError("Failed to approve counsellor. Please try again.")
    }
  }

  if (loading) {
    return (
      <PageLoading />
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-200 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-100">
      <header className="bg-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Counsellor Approval</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-yellow-300 rounded-lg h-full p-4 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
            {counsellors.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Counsellors to Approve</h2>
                <p className="text-gray-600">You're all caught up! Check back later for new applications.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {counsellors.map(counsellor => (
                  <CounsellorCard 
                    key={counsellor.id} 
                    counsellor={counsellor} 
                    onApprove={() => handleApprove(counsellor.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

