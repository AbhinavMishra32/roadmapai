'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Briefcase, MapPin, DollarSign, Users, X, ChevronRight, Calendar } from 'lucide-react'

// Sample job data
const jobsData = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "Tech Innovations Inc.",
    location: "New York, NY",
    salary: "$120,000 - $150,000",
    jobType: "Full-time",
    description: "We are seeking a skilled Senior React Developer to join our innovative team...",
    requirements: "5+ years of experience with React, strong TypeScript skills, experience with Next.js...",
    benefits: "Competitive salary, health insurance, 401(k) matching, flexible work hours, remote work options...",
    isRemote: true,
    postedDate: "2023-06-01"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Designs Co.",
    location: "San Francisco, CA",
    salary: "$90,000 - $120,000",
    jobType: "Full-time",
    description: "Join our design team to create stunning user experiences for our clients...",
    requirements: "3+ years of UX/UI design experience, proficiency in Figma and Adobe Creative Suite...",
    benefits: "Health and dental insurance, unlimited PTO, professional development budget...",
    isRemote: false,
    postedDate: "2023-06-05"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AI Solutions Ltd.",
    location: "Boston, MA",
    salary: "$130,000 - $160,000",
    jobType: "Full-time",
    description: "We're looking for a talented Data Scientist to help us push the boundaries of AI...",
    requirements: "PhD in Computer Science or related field, experience with machine learning algorithms...",
    benefits: "Stock options, annual bonus, gym membership, catered lunches...",
    isRemote: true,
    postedDate: "2023-06-08"
  },
]

// Sample applicant data
const applicantsData = {
  1: [
    {
      id: 101,
      name: "Alice Johnson",
      email: "alice@example.com",
      experience: "7 years",
      skills: ["React", "TypeScript", "Node.js"],
      appliedDate: "2023-06-10"
    },
    {
      id: 102,
      name: "Bob Smith",
      email: "bob@example.com",
      experience: "5 years",
      skills: ["React", "JavaScript", "CSS"],
      appliedDate: "2023-06-12"
    },
  ],
  2: [
    {
      id: 201,
      name: "Charlie Brown",
      email: "charlie@example.com",
      experience: "4 years",
      skills: ["UI Design", "Figma", "Adobe XD"],
      appliedDate: "2023-06-15"
    },
  ],
  3: [
    {
      id: 301,
      name: "Diana Prince",
      email: "diana@example.com",
      experience: "6 years",
      skills: ["Machine Learning", "Python", "TensorFlow"],
      appliedDate: "2023-06-18"
    },
  ],
}

export default function RecruiterHomePage() {
  const [selectedJob, setSelectedJob] = useState(null)

  const handleJobClick = (job) => {
    setSelectedJob(job)
  }

  const handleCloseDetails = () => {
    setSelectedJob(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-center mb-12 text-gray-800">
        Your Posted Jobs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsData.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
        ))}
      </div>
      <AnimatePresence>
        {selectedJob && (
          <JobDetails 
            job={selectedJob} 
            applicants={applicantsData[selectedJob.id]} 
            onClose={handleCloseDetails} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function JobCard({ job, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden" onClick={onClick}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-gray-800">{job.title}</CardTitle>
          <CardDescription className="text-gray-600">{job.company}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <DollarSign size={16} />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2 border-t">
          <Badge variant={job.isRemote ? "secondary" : "outline"} className="bg-blue-100 text-blue-800 border-blue-200">
            {job.isRemote ? "Remote" : "On-site"}
          </Badge>
          <ChevronRight className="text-gray-400" />
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function JobDetails({ job, applicants, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </Button>
        </div>
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <div className="p-6 space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="text-gray-800 font-medium">{job.company}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-gray-800 font-medium">{job.location}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Salary</p>
                  <p className="text-gray-800 font-medium">{job.salary}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Job Type</p>
                  <p className="text-gray-800 font-medium">{job.jobType}</p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Description</h3>
              <p className="text-gray-600">{job.description}</p>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Requirements</h3>
              <p className="text-gray-600">{job.requirements}</p>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Benefits</h3>
              <p className="text-gray-600">{job.benefits}</p>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Applicants</h3>
              <div className="space-y-4">
                {applicants.map((applicant) => (
                  <Card key={applicant.id} className="bg-white border border-gray-200">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${applicant.name}`} />
                          <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-gray-800">{applicant.name}</CardTitle>
                          <CardDescription className="text-gray-600">{applicant.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-gray-600">
                      <p><strong className="text-gray-700">Experience:</strong> {applicant.experience}</p>
                      <p><strong className="text-gray-700">Skills:</strong> {applicant.skills.join(', ')}</p>
                      <p><strong className="text-gray-700">Applied:</strong> {new Date(applicant.appliedDate).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  )
}