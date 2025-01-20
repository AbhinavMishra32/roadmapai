'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Building } from 'lucide-react'
import { api } from '../services/axios'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate, useNavigationType } from 'react-router-dom'
import { Cookies } from 'react-cookie'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  experience: z.string({
    required_error: "Please select your years of experience.",
  }),
  industry: z.string({
    required_error: "Please select your primary industry.",
  }),
  hiringVolume: z.string({
    required_error: "Please select your monthly hiring volume.",
  }),
  communication: z.enum(["email", "phone", "video"], {
    required_error: "Please select your preferred communication method.",
  }),
  additionalInfo: z.string().max(500, {
    message: "Additional information must not exceed 500 characters.",
  }).optional(),
})

export default function RecruiterOnbPage() {
    const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await api.get('/api/user');
            console.log("In fetch user response data in recruiter form: ",response.data);
            if(response.data.user.onboarded){
                navigate('/dashboard');
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    fetchUser();
}, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      additionalInfo: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
        const response = await api.post('/api/user/onboard/recruiter', values);
        console.log("Response from recruiter onboarding form submission: ", response);
    } catch (error) {
        console.log("Error in recruiter onboarding form submission: ", error);
    }
    finally{
      navigate('/dashboard');
    }
  }

  return (
    <div className='w-screen flex pt-20 justify-center items-center'>
    <Card className="border-neutral-200 rounded-2xl w-[500px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">Join Our Recruiter Network</CardTitle>
        <CardDescription className="text-center text-lg">
          Connect with top talent and grow your team
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Company</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input placeholder="Acme Inc." className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Job Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input placeholder="Senior Recruiter" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Years of Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Primary Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hiringVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Monthly Hiring Volume</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hiring volume" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 hires</SelectItem>
                      <SelectItem value="6-10">6-10 hires</SelectItem>
                      <SelectItem value="11-20">11-20 hires</SelectItem>
                      <SelectItem value="20+">20+ hires</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="communication"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Preferred Communication</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="email" />
                        </FormControl>
                        <FormLabel className="font-normal">Email</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="phone" />
                        </FormControl>
                        <FormLabel className="font-normal">Phone</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="video" />
                        </FormControl>
                        <FormLabel className="font-normal">Video Call</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your recruiting needs or any specific requirements"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg font-semibold">
              Join Our Network
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
    </div>
  )
}