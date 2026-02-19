import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { CourseForm } from '@/components/admin/CourseForm'
import { CurriculumManager } from '@/components/admin/CurriculumManager'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  }, [courseId])

  if (loading) return <div>Loading...</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          to="/admin"
          className="text-white/60 hover:text-white flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">
          Edit Course: {course.title}
        </h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseForm course={course} onUpdate={fetchCourse} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <CurriculumManager courseId={course.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
