import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { CourseForm } from '@/components/admin/CourseForm'
import { CurriculumManager } from '@/components/admin/CurriculumManager'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminCourseEdit() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchCourse = async () => {
    if (!courseId) return
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()
    if (data) setCourse(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCourse()
    document.body.classList.add('admin-panel')
    return () => {
      document.body.classList.remove('admin-panel')
    }
  }, [courseId])

  if (loading)
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )

  if (!course) return <div>Course not found</div>

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#111111]">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10">
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-gray-500 hover:text-black flex items-center gap-2 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-inter font-light tracking-tight">
              EDIT <span className="text-gray-300 mx-2">//</span>{' '}
              {course.title.toUpperCase()}
            </h1>
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 space-x-8">
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 font-jetbrains text-xs uppercase tracking-widest text-gray-500 data-[state=active]:text-black"
            >
              Details & Meta
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 font-jetbrains text-xs uppercase tracking-widest text-gray-500 data-[state=active]:text-black"
            >
              Curriculum Builder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <CourseForm course={course} onUpdate={fetchCourse} />
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <CurriculumManager courseId={course.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
