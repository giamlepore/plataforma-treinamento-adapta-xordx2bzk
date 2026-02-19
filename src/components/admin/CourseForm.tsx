import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'

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

  // Initialize active tab based on presence of thumbnail_url
  const [activeTab, setActiveTab] = useState(
    course.thumbnail_url ? 'image' : 'color',
  )
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // Sync local state when course prop updates (e.g. after save)
    setFormData({
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

    // Update active tab logic:
    // If there is a thumbnail, show Image tab.
    // If not, but there is a color, show Color tab.
    // If neither (new course), default to Color or Image?
    // Based on user story: "If thumbnail_url is present, the 'Image' tab/option must be active.
    // If thumbnail_url is null and image_color is present, the 'Color Accent' tab/option must be active."
    if (course.thumbnail_url) {
      setActiveTab('image')
    } else {
      setActiveTab('color')
    }
  }, [course])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!course.id) {
      toast.error('Course ID is missing. Cannot upload image.')
      return
    }

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const fileName = `${timestamp}.${fileExt}`
    const filePath = `${course.id}/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('course-thumbnails')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('course-thumbnails')
        .getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl

      setFormData((prev) => ({
        ...prev,
        thumbnail_url: publicUrl,
      }))

      toast.success('Thumbnail uploaded. Click Save Details to apply.')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Error uploading image')
    } finally {
      setUploading(false)
      // Reset the file input
      e.target.value = ''
    }
  }

  const handleRemoveImage = async () => {
    setFormData((prev) => ({ ...prev, thumbnail_url: '' }))
    toast.info('Image removed from preview. Click Save to persist.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = { ...formData } as any

    // Enforce mutual exclusivity based on active tab
    if (activeTab === 'color') {
      // User selected Color Accent
      payload.thumbnail_url = null
      // Ensure image_color is sent (it's in formData)
    } else {
      // User selected Image
      if (!payload.thumbnail_url) {
        toast.error('Please upload an image or select Color Accent')
        setLoading(false)
        return
      }
      payload.image_color = null
    }

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

      <div className="space-y-2 max-w-md">
        <Label className="text-xs text-gray-500 uppercase tracking-wide">
          Course Thumbnail
        </Label>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              Custom Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="color" className="pt-4">
            <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
              <div
                className="w-12 h-12 rounded-full border border-gray-200 shadow-sm shrink-0"
                style={{ backgroundColor: formData.image_color }}
              />
              <div className="space-y-1 flex-1">
                <Label
                  htmlFor="image_color"
                  className="text-xs font-medium block"
                >
                  Hex Color Code
                </Label>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <input
                      type="color"
                      name="image_color"
                      value={formData.image_color}
                      onChange={handleChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <Input
                      value={formData.image_color}
                      onChange={handleChange}
                      className="bg-white border-gray-200 font-mono pl-8"
                    />
                    <div
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: formData.image_color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="pt-4 space-y-4">
            {formData.thumbnail_url ? (
              <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" /> Remove Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors bg-white">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Upload Thumbnail
                </h4>
                <p className="text-xs text-gray-500 mb-4 max-w-[200px]">
                  SVG, PNG, JPG or WEBP (max. 2MB)
                </p>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="relative"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Select File'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={loading || uploading}
          className="bg-[#111111] hover:bg-[#333333] text-white min-w-[150px]"
        >
          {loading ? 'Saving...' : 'Save Details'}
        </Button>
      </div>
    </form>
  )
}
