import React, { useState, KeyboardEvent } from 'react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
}

export function TagInput({ tags, setTags }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault()
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()])
      }
      setInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="bg-yellow-100 text-yellow-800">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-yellow-950">
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type and press Enter to add specialities"
        className="mt-2"
      />
    </div>
  )
}

