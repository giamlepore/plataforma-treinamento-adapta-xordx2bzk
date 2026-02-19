import { supabase } from '@/lib/supabase/client'

export interface OrgStats {
  totalStudents: number
  totalCourses: number
  totalLessons: number
  avgRating: number
  completedLessons: number
}

export const getOrgStats = async (orgId: string): Promise<OrgStats> => {
  try {
    // 1. Total Students (profiles with role 'student' in org)
    const { count: studentsCount, error: studentsError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId)
      .eq('role', 'student')

    if (studentsError)
      console.error('Error fetching students count:', studentsError)

    // 2. Total Courses (courses in org)
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('rating')
      .eq('organization_id', orgId)

    if (coursesError) console.error('Error fetching courses:', coursesError)

    const totalCourses = courses?.length || 0

    // Calculate Average Rating
    const totalRating =
      courses?.reduce((sum, course) => sum + (course.rating || 0), 0) || 0
    const avgRating = totalCourses > 0 ? totalRating / totalCourses : 0

    // 3. Total Lessons (lessons in modules in courses in org)
    // Using nested filtering with inner joins
    const { count: lessonsCount, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, modules!inner(courses!inner(organization_id))', {
        count: 'exact',
        head: true,
      })
      .eq('modules.courses.organization_id', orgId)

    if (lessonsError)
      console.error('Error fetching lessons count:', lessonsError)

    // 4. Completed Lessons (user_progress for users in org)
    const { count: completedCount, error: completedError } = await supabase
      .from('user_progress')
      .select('id, profiles!inner(organization_id)', {
        count: 'exact',
        head: true,
      })
      .eq('is_completed', true)
      .eq('profiles.organization_id', orgId)

    if (completedError)
      console.error('Error fetching completed lessons count:', completedError)

    return {
      totalStudents: studentsCount || 0,
      totalCourses: totalCourses,
      totalLessons: lessonsCount || 0,
      avgRating: avgRating,
      completedLessons: completedCount || 0,
    }
  } catch (error) {
    console.error('Error getting org stats:', error)
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalLessons: 0,
      avgRating: 0,
      completedLessons: 0,
    }
  }
}
