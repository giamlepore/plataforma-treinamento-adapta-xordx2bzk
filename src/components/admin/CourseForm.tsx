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
    image_color: course.image_color || '#1a5c48',
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-xs text-gray-500 uppercase tracking-wide"
        >
          Course Title
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="bg-gray-50 border-gray-200 text-lg font-medium p-4 h-auto"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-xs text-gray-500 uppercase tracking-wide"
        >
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-50 border-gray-200 min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="instructor_name"
            className="text-xs text-gray-500 uppercase tracking-wide"
          >
            Instructor Name
          </Label>
          <Input
            id="instructor_name"
            name="instructor_name"
            value={formData.instructor_name}
            onChange={handleChange}
            className="bg-gray-50 border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="instructor_avatar"
            className="text-xs text-gray-500 uppercase tracking-wide"
          >
            Instructor Avatar URL
          </Label>
          <Input
            id="instructor_avatar"
            name="instructor_avatar"
            value={formData.instructor_avatar}
            onChange={handleChange}
            className="bg-gray-50 border-gray-200"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="duration_text"
            className="text-xs text-gray-500 uppercase tracking-wide"
          >
            Duration
          </Label>
          <Input
            id="duration_text"
            name="duration_text"
            value={formData.duration_text}
            onChange={handleChange}
            placeholder="e.g. 4h 30m"
            className="bg-gray-50 border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="label"
            className="text-xs text-gray-500 uppercase tracking-wide"
          >
            Label / Tag
          </Label>
          <Input
            id="label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g. Beginner"
            className="bg-gray-50 border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="image_color"
            className="text-xs text-gray-500 uppercase tracking-wide"
          >
            Card Accent Color
          </Label>
          <div className="flex gap-2">
            <div className="relative w-10 h-10 rounded border border-gray-200 overflow-hidden shadow-sm shrink-0">
              <input
                type="color"
                name="image_color"
                value={formData.image_color}
                onChange={handleChange}
                className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer border-none"
              />
            </div>
            <Input
              id="image_color"
              name="image_color"
              value={formData.image_color}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#111111] hover:bg-[#333333] text-white min-w-[150px]"
        >
          {loading ? 'Saving...' : 'Save Details'}
        </Button>
      </div>
    </form>
  )
}
