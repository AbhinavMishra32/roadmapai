import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card'
import EditorCard from './EditorCard'

const categories = [
  { title: "Academic Skills", category: "academicskills" },
  { title: "Competitive Exams", category: "competitiveexams" },
  { title: "College Trivia", category: "collegetrivia" },
  { title: "Career Aptitude", category: "careeraptitude" },
  { title: "Study Habits", category: "studyhabits" },
  { title: "Social Skills", category: "socialskills" },
  { title: "Critical Thinking", category: "criticalthinking" },
  { title: "Personal Growth", category: "personalgrowth" }
]

export default function LessonForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    category: '',
    categoryTitle: '',
    title: '',
    description: '',
    no: '',
    sections: [
      { title: '', content: '' },
      { title: '', content: '' },
      { title: '', content: '' },
      { title: '', content: '' },
    ],
  })

  const handleChange = (e) => {
    if (e.target.name === 'category') {
      const selectedCategory = categories.find(cat => cat.title === e.target.value)
      setFormData({ 
        ...formData, 
        category: selectedCategory.category, 
        categoryTitle: selectedCategory.title 
      })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections]
    newSections[index][field] = value
    setFormData({ ...formData, sections: newSections })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      sbh1: formData.sections[0].title,
      p1: formData.sections[0].content,
      sbh2: formData.sections[1].title,
      p2: formData.sections[1].content,
      sbh3: formData.sections[2].title,
      p3: formData.sections[2].content,
      sbh4: formData.sections[3].title,
      p4: formData.sections[3].content,
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Lesson Details</h2>
          <div className="space-y-4">
            <Select 
              name="category" 
              value={formData.categoryTitle} 
              onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.category} value={category.title}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="title"
              placeholder="Lesson Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="text-xl font-semibold"
            />
            <Textarea
              name="description"
              placeholder="Lesson Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="min-h-[100px]"
            />
            <Input
              name="no"
              type="number"
              placeholder="Lesson Number"
              value={formData.no}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lesson Content</h2>
        {formData.sections.map((section, index) => (
          <EditorCard
            key={index}
            index={index}
            title={section.title}
            content={section.content}
            onTitleChange={(value) => handleSectionChange(index, 'title', value)}
            onContentChange={(value) => handleSectionChange(index, 'content', value)}
          />
        ))}
      </div>

      <Button type="submit" className="w-full bg-yellow-400 text-white hover:bg-yellow-500 transition-colors duration-300 text-lg py-3">
        Next: Create Quiz
      </Button>
    </motion.form>
  )
}

