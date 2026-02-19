import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

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
    thumbnail_url: course.thumbnail_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('course-thumbnails')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Error uploading image')
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('course-thumbnails')
      .getPublicUrl(filePath)

    setFormData((prev) => ({
      ...prev,
      thumbnail_url: publicUrlData.publicUrl,
    }))
    toast.success('Image uploaded')
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = { ...formData } as any
    const { error } = await supabase
      .from('courses')
      .update(payload)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div className="space-y-2 max-w-sm">
        <Label className="text-xs text-gray-500 uppercase tracking-wide">
          Course Appearance
        </Label>
        <Tabs
          defaultValue={formData.thumbnail_url ? 'image' : 'color'}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg h-auto">
            <TabsTrigger
              value="color"
              className="rounded-md py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Color Accent
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="rounded-md py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Thumbnail
            </TabsTrigger>
          </TabsList>
          <TabsContent value="color" className="pt-2">
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
          </TabsContent>
          <TabsContent value="image" className="pt-2 space-y-4">
            {formData.thumbnail_url ? (
              <div className="space-y-2">
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, thumbnail_url: '' }))
                  }
                  className="w-full text-xs"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="bg-gray-50 border-gray-200 text-sm file:text-xs file:font-medium file:text-gray-700 file:bg-gray-200 file:border-0 file:rounded-md file:mr-2 file:px-3 file:py-1 cursor-pointer h-auto py-2"
                />
                {uploading && (
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
