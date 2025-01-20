import { useEffect, useState } from 'react'
import { api } from '../services/axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Briefcase, Search, UserPlus, Check } from 'lucide-react'
import { useDbUser } from '@/contexts/UserContext';
import { Cookies } from 'react-cookie';

type UserRole = 'recruiter' | 'jobSeeker' | 'counsellor' | null

const OnboardingPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const onSubmit = async () => {
    try {
      if (selectedRole == 'jobSeeker') {
        navigate('/onboarding/jobseeker');
      }
      else if (selectedRole == 'recruiter') {
        navigate('/onboarding/recruiter');
      }
      else if (selectedRole == 'counsellor') {
        navigate('/onboarding/counsellor');
      }
    } catch (error) {
      console.log("Error in onSubmit(): ", error);
    }
  }

  const cookies = new Cookies();
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = cookies.get('userToken');
    console.log("User Token in recruiter onboarding form: ", token);
    setUserToken(token);
    if (token == undefined) {
      navigate('/signin');
    }
    console.log("After if statement");
  }, [cookies]);

  // useEffect(() => {
  //     const fetchToken = async () => {
  //         const token = await getToken();
  //         setToken(token);
  //         console.log("Token in useEffect of getToken: ", token);
  //     };
  //     fetchToken();
  // }, []);

  // useEffect(() => {
  //     if (isLoaded && !userId) {
  //         navigate('/signin');
  //     }
  // }, [isLoaded, userId, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user');
        console.log(response.data);
        if (response.data.user.onboarded) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUser();
  }, []);

  const RoleSelection = () => (
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold mb-2">Welcome to Mentor Map</CardTitle>
        <CardDescription className="text-xl">Choose your role to get started on your career journey</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup value={selectedRole || ''} onValueChange={(value) => handleRoleSelect(value as UserRole)} className="grid gap-6 pt-2">
          {[
            {
              value: 'recruiter',
              label: "I'm a Recruiter",
              description: "Find top talent and build amazing teams",
              icon: <Briefcase className="w-10 h-10" />,
              benefits: ['Access to a vast pool of qualified candidates', 'Advanced search and filtering tools', 'Automated candidate matching']
            },
            {
              value: 'jobSeeker',
              label: "I'm a Job Seeker",
              description: "Discover exciting career opportunities",
              icon: <Search className="w-10 h-10" />,
              benefits: ['Personalized job recommendations', 'Resume builder and optimization tools', 'Interview preparation resources']
            },
            {
              value: 'counsellor',
              label: "I'm a Career Counsellor",
              description: "Guide others in their professional journey",
              icon: <UserPlus className="w-10 h-10" />,
              benefits: ['Connect with clients seeking career advice', 'Access to career assessment tools', 'Professional development resources']
            }
          ].map((role) => (
            <div key={role.value} className="relative">
              <RadioGroupItem value={role.value} id={role.value} className="peer sr-only" />
              <Label
                htmlFor={role.value}
                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 cursor-pointer transition-all duration-300 ease-in-out"
              >
                <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 ease-in-out [&:has([data-state=checked])]:opacity-100">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col items-center mb-4">
                  <div className={`${selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-300 ease-in-out`}>
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mt-2">{role.label}</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">{role.description}</p>
                </div>
                <ul className="text-sm space-y-1 text-left">
                  {role.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-primary">•</span> {benefit}
                    </li>
                  ))}
                </ul>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onSubmit} disabled={!selectedRole} size="lg" className="w-full max-w-xs">
          Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='border-neutral-200 rounded-2xl w-[500px] h-[80vh]'>
        <RoleSelection />
      </div>
    </div>
  )
}

export default OnboardingPage