import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import NotFound from './NotFound'

/* 
  CourseDetails Page:
  - Fetches the first lesson ID of the course and redirects.
*/

export default function CourseDetails() {
  const { courseId } = useParams()
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchFirstLesson() {
      if (!courseId) {
        setError(true)
        setLoading(false)
        return
      }

      // Fetch first module
      const { data: modules, error: modError } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
        .limit(1)

      if (modError || !modules || modules.length === 0) {
        setError(true)
        setLoading(false)
        return
      }

      const firstModuleId = modules[0].id

      // Fetch first lesson
      const { data: lessons, error: lessError } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', firstModuleId)
        .order('order_index', { ascending: true })
        .limit(1)

      if (lessError || !lessons || lessons.length === 0) {
        setError(true)
        setLoading(false)
        return
      }

      setFirstLessonId(lessons[0].id)
      setLoading(false)
    }

    fetchFirstLesson()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !firstLessonId) {
    return <NotFound />
  }

  return <Navigate to={`/course/${courseId}/lesson/${firstLessonId}`} replace />
}
