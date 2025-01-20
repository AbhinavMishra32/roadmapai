'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { api } from '@/services/axios'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'

export default function SeekerOnbPage() {
  const [grade, setGrade] = useState<string>('')
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school: '',
    grade: '',
    stream: '',
    subjects: [] as string[],
    address: '',
    careerGoal: '',
    extracurriculars: [] as string[],
    learningStyle: '',
    counsellingReason: '',
  })

  const cookies = new Cookies();
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = cookies.get('userToken');
    console.log("User Token in recruiter onboarding form: ", token);
    setUserToken(token);
    // if (token == undefined) {
    //   navigate('/signin');
    // }
    console.log("After if statement");
  }, [cookies]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user');
        console.log(response.data);
        // setUser({ username: response.data.user.username, email: response.data.user.email, role: response.data.user.userType });
        if (response.data.user.onboarded) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
    if (name === 'grade') setGrade(value)
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, [name]: [...formData[name as keyof typeof formData] as string[], value] })
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof typeof formData] as string[]).filter((item) => item !== value)
      })
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(formData)
      const response = await api.post('/api/user/onboard', formData);
      console.log("Response from form submit: ", response.data);
    } catch (error) {
      console.log(error);
    }
    finally {
      cookies.set('onboarded', 'true');
      navigate('/dashboard');
    }
  }

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "English", "Hindi", "History", "Geography", "Economics", "Accountancy",
    "Business Studies", "Political Science", "Psychology", "Sociology"
  ]

  const extracurriculars = [
    "Sports", "Music", "Dance", "Art", "Debate", "Quiz", "Robotics",
    "Coding", "Photography", "Volunteering", "Student Council"
  ]

  return (
    <div className='w-full h-full flex justify-center py-20'>
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#4D96FF] to-[#6BCB77] text-white">
          <CardTitle className="text-2xl font-bold">Enter Your Details</CardTitle>
          <CardDescription className="text-gray-100">
            Help us understand you better to provide tailored counselling.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="school" className="text-sm font-medium text-gray-700">School Name</Label>
                <Input
                  id="school"
                  name="school"
                  placeholder="Enter your school name"
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-[#4D96FF] focus:ring-[#4D96FF]"
                />
              </div>

              <div>
                <Label htmlFor="grade" className="text-sm font-medium text-gray-700">Grade</Label>
                <Select onValueChange={(value) => handleSelectChange('grade', value)}>
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-[#4D96FF] focus:ring-[#4D96FF]">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {['8', '9', '10', '11', '12'].map((g) => (
                      <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(grade === '11' || grade === '12') && (
                <div>
                  <Label htmlFor="stream" className="text-sm font-medium text-gray-700">Stream</Label>
                  <Select onValueChange={(value) => handleSelectChange('stream', value)}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-[#4D96FF] focus:ring-[#4D96FF]">
                      <SelectValue placeholder="Select your stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {['PCM', 'PCB', 'Commerce', 'Arts'].map((stream) => (
                        <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700">Subjects of Interest</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center">
                      <Checkbox
                        id={subject}
                        onCheckedChange={(checked) => handleCheckboxChange('subjects', subject, checked as boolean)}
                        className="border-gray-300 text-[#6BCB77] focus:border-[#6BCB77] focus:ring-[#6BCB77]"
                      />
                      <label htmlFor={subject} className="ml-2 text-sm text-gray-700">{subject}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-[#4D96FF] focus:ring-[#4D96FF]"
                />
              </div>

              <div>
                <Label htmlFor="careerGoal" className="text-sm font-medium text-gray-700">Career Goal</Label>
                <Input
                  id="careerGoal"
                  name="careerGoal"
                  placeholder="What's your career goal?"
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-[#4D96FF] focus:ring-[#4D96FF]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Extracurricular Activities</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {extracurriculars.map((activity) => (
                    <div key={activity} className="flex items-center">
                      <Checkbox
                        id={activity}
                        onCheckedChange={(checked) => handleCheckboxChange('extracurriculars', activity, checked as boolean)}
                        className="border-gray-300 text-[#FFD93D] focus:border-[#FFD93D] focus:ring-[#FFD93D]"
                      />
                      <label htmlFor={activity} className="ml-2 text-sm text-gray-700">{activity}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Preferred Learning Style</Label>
                <RadioGroup
                  onValueChange={(value) => handleSelectChange('learningStyle', value)}
                  className="mt-2 flex flex-col space-y-1"
                >
                  {[
                    { value: "visual", label: "Visual (learn by seeing)" },
                    { value: "auditory", label: "Auditory (learn by hearing)" },
                    { value: "reading", label: "Reading/Writing" },
                    { value: "kinesthetic", label: "Kinesthetic (learn by doing)" },
                  ].map((style) => (
                    <div key={style.value} className="flex items-center">
                      <RadioGroupItem
                        value={style.value}
                        id={style.value}
                        className="border-gray-300 text-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]"
                      />
                      <Label htmlFor={style.value} className="ml-2 text-sm text-gray-700">{style.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="counsellingReason" className="text-sm font-medium text-gray-700">Reason for Seeking Counselling</Label>
                <Textarea
                  id="counsellingReason"
                  name="counsellingReason"
                  placeholder="Why are you seeking counselling?"
                  onChange={handleInputChange}
                  className="mt-1 border-gray-300 focus:border-[#4D96FF] focus:ring-[#4D96FF]"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#4D96FF] to-[#6BCB77] text-white hover:from-[#3D86EF] hover:to-[#5BBB67]">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}