import React, { useState } from 'react'
import { TagInput } from '../components/TagInput'
import { api } from '@/services/axios'
import { useNavigate } from 'react-router-dom'

export function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    specialities: [] as string[],
    location: '',
    experience: '',
    bio: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

const navigate = useNavigate()

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
        setStep(step + 1)
    } else {
        try {
            const response = await api.post('/api/counsellor/onboarding', {
                    data: formData
            })
            console.log('Onboarding submission response:', response.data)
        } catch (error) {
            console.error('Onboarding submission error:', error)
            alert('Failed to complete onboarding. Please try again.')
        }
        finally {
            navigate('/counselchat')
        }
    }
}

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="specialities" className="block text-sm font-medium text-gray-700">Specialities</label>
                <TagInput 
                  tags={formData.specialities} 
                  setTags={(tags: string[]) => setFormData({...formData, specialities: tags})}
                />
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[100px]"
                />
              </div>
              {/* <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Set Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div> */}
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-yellow-400 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-center">Welcome to MentorMap</h1>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i}
                  </div>
                  {i < 3 && <div className={`h-1 w-full ${i < step ? 'bg-yellow-400' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="text-center text-sm font-medium text-gray-600">
              Step {step} of 3
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {step < 3 ? 'Next' : 'Complete'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage