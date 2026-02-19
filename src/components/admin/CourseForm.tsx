import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface CourseFormProps {
  course: any
  onUpdate: () => void
}

export function CourseForm({ course, onUpdate }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: course.title || '',
    description: course.description || '',
    instructor_name: course.instructor_name || '',
    instructor_avatar: course.instructor_avatar || '',
    duration_text: course.duration_text || '',
    image_color: course.image_color || '',
    image_query: course.image_query || '',
    label: course.label || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('courses')
      .update(formData)
      .eq('id', course.id)

    if (error) {
      toast.error('Failed to update course details')
    } else {
      toast.success('Course details updated')
      onUpdate()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instructor_name">Instructor Name</Label>
          <Input
            id="instructor_name"
            name="instructor_name"
            value={formData.instructor_name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration_text">Duration Text</Label>
          <Input
            id="duration_text"
            name="duration_text"
            value={formData.duration_text}
            onChange={handleChange}
            placeholder="e.g. 4h 30m"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image_color">Background Color Class</Label>
          <Input
            id="image_color"
            name="image_color"
            value={formData.image_color}
            onChange={handleChange}
            placeholder="e.g. bg-brand-yellow"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_query">Image Query</Label>
          <Input
            id="image_query"
            name="image_query"
            value={formData.image_query}
            onChange={handleChange}
            placeholder="e.g. finance"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          name="label"
          value={formData.label}
          onChange={handleChange}
          placeholder="e.g. Beginner"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Details'}
      </Button>
    </form>
  )
}
