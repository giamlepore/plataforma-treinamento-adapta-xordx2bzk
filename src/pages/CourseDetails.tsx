import { useParams, Navigate } from 'react-router-dom'
import { courses } from '@/data/mockData'
import NotFound from './NotFound'

/* 
  CourseDetails Page:
  - This now serves as a redirect to the first lesson of the course, 
  - OR it could render the LessonPlayer without a specific lesson ID selected (which LessonPlayer handles).
  - To maintain the "Single Page View" feel requested by the user story, we simply reuse the LessonPlayer structure.
*/

export default function CourseDetails() {
  const { courseId } = useParams()
  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return <NotFound />
  }

  // Find the first lesson to redirect to
  const firstLessonId = course.modules[0]?.lessons[0]?.id

  if (firstLessonId) {
    return (
      <Navigate to={`/course/${courseId}/lesson/${firstLessonId}`} replace />
    )
  }

  // Fallback if no lessons (should not happen with valid data)
  return <NotFound />
}
