import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Book, MessageCircle, CheckCircle } from 'lucide-react'

interface CounsellorCardProps {
  counsellor: {
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
  onApprove: () => void
}

export function CounsellorCard({ counsellor, onApprove }: CounsellorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl"
      style={{
        borderRadius: '20px',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="bg-yellow-400 text-white p-6">
        <CardTitle className="text-2xl font-bold">{counsellor.name}</CardTitle>
        <p className="text-sm opacity-80">{counsellor.email}</p>
      </CardHeader>
      <CardContent className="flex-grow p-6 bg-white">
        <p className="mb-4 text-gray-600 italic">&quot;{counsellor.bio}&quot;</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Book className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-sm text-gray-600">{counsellor.experience} years exp.</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-sm text-gray-600">{counsellor.location}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-sm text-gray-600">{counsellor.rating.toFixed(1)} rating</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {counsellor.isChattingWithStudent ? 'In chat' : 'Available'}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Specialities:</h4>
          <div className="flex flex-wrap gap-2">
            {counsellor.specialities.map(speciality => (
              <Badge key={speciality} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                {speciality}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <CheckCircle className={`w-5 h-5 mr-2 ${counsellor.onboarded ? 'text-green-500' : 'text-gray-300'}`} />
          <span className={`text-sm ${counsellor.onboarded ? 'text-green-600' : 'text-gray-500'}`}>
            {counsellor.onboarded ? 'Onboarded' : 'Not onboarded'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-6">
        <Button 
          onClick={onApprove} 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
        >
          Approve Counsellor
        </Button>
      </CardFooter>
    </Card>
  )
}

