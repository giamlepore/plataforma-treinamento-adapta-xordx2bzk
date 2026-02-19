import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Clock, Share2, Star, FileText, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LessonSidebar } from '@/components/LessonSidebar'
import { LessonVideoPlayer } from '@/components/LessonVideoPlayer'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Define DB types locally or import if available
interface Course {
  id: string
  title: string
  description: string
  instructor_name: string
  instructor_avatar: string
  duration_text: string
  image_query: string
  image_color: string
  label: string
  rating: number
  reviews: number
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  duration: string
  is_test: boolean
  is_locked: boolean
  order_index: number
  is_completed?: boolean
}

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams()
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchData() {
      if (!courseId || !user) return
      setLoading(true)

      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError) {
        toast.error('Failed to load course')
        setLoading(false)
        return
      }

      setCourse(courseData)

      // Fetch modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(
          `
          id,
          title,
          lessons (
            id, title, duration, is_test, is_locked, order_index
          )
        `,
        )
        .eq('course_id', courseId)
        .order('order_index')

      if (modulesError) {
        toast.error('Failed to load modules')
        setLoading(false)
        return
      }

      // Sort lessons
      const processedModules = modulesData.map((m: any) => ({
        ...m,
        lessons: m.lessons.sort(
          (a: any, b: any) => a.order_index - b.order_index,
        ),
      }))

      setModules(processedModules)

      // Fetch progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, is_completed')
        .eq('profile_id', user.id)

      const pMap: Record<string, boolean> = {}
      progressData?.forEach((p) => {
        pMap[p.lesson_id] = p.is_completed
      })
      setProgressMap(pMap)

      setLoading(false)
    }

    fetchData()
  }, [courseId, user])

  useEffect(() => {
    if (lessonId && modules.length > 0) {
      // Find active module and lesson
      for (const mod of modules) {
        const lesson = mod.lessons.find((l) => l.id === lessonId)
        if (lesson) {
          setActiveLesson(lesson)
          setActiveModuleId(mod.id)
          break
        }
      }
    } else if (modules.length > 0 && modules[0].lessons.length > 0) {
      // Default to first
      setActiveModuleId(modules[0].id)
      setActiveLesson(modules[0].lessons[0])
    }
  }, [lessonId, modules])

  const handleToggleComplete = async () => {
    if (!activeLesson || !user) return

    const newStatus = !progressMap[activeLesson.id]

    // Update local state immediately
    setProgressMap((prev) => ({ ...prev, [activeLesson.id]: newStatus }))

    const { error } = await supabase.from('user_progress').upsert(
      {
        profile_id: user.id,
        lesson_id: activeLesson.id,
        is_completed: newStatus,
        last_watched_at: new Date().toISOString(),
      },
      {
        onConflict: 'profile_id,lesson_id',
      },
    )

    if (error) {
      toast.error('Failed to save progress')
      // Revert local state
      setProgressMap((prev) => ({ ...prev, [activeLesson.id]: !newStatus }))
    } else {
      if (newStatus) {
        toast.success('Lesson marked as completed')
      }
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#2B2B2B]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!course) return <div>Course not found</div>

  // Enhance modules with progress for sidebar
  const modulesWithProgress = modules.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({
      ...l,
      is_completed: progressMap[l.id],
    })),
  }))

  const completedCount = Object.values(progressMap).filter(Boolean).length
  const totalCount = modules.reduce((acc, m) => acc + m.lessons.length, 0)

  const currentModuleTitle = modules.find((m) => m.id === activeModuleId)?.title

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#2B2B2B] flex flex-col font-sans">
      {/* Course Hero Section */}
      <div className="w-full px-6 py-8 md:px-12 md:py-10 bg-[#2B2B2B] text-white">
        <div className="max-w-[1400px] mx-auto">
          {/* User/Instructor Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={
                course.instructor_avatar ||
                'https://img.usecurling.com/ppl/thumbnail?gender=male'
              }
              alt={course.instructor_name}
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <span className="text-sm font-medium text-white/90">
              {course.instructor_name}
            </span>
          </div>

          {/* Title and Metadata */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-grotesk font-bold tracking-tight mb-4 text-white">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {course.duration_text}
                </div>
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {totalCount} lessons
                </div>
                {course.rating && (
                  <>
                    <div className="w-1 h-1 bg-white/30 rounded-full" />
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-white">
                        {course.rating} ({course.reviews} reviews)
                      </span>
                    </div>
                  </>
                )}
              </div>

              {course.label && (
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 rounded bg-white/10 text-xs font-medium text-white/80 border border-white/10">
                    {course.label}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {activeLesson && (
                <Button
                  onClick={handleToggleComplete}
                  className={
                    progressMap[activeLesson.id]
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white'
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {progressMap[activeLesson.id] ? 'Completed' : 'Mark Complete'}
                </Button>
              )}
              <Button
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 h-12 px-6 rounded-lg gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - White Card */}
      <div className="flex-1 px-6 pb-12 md:px-12">
        <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col lg:flex-row">
          <LessonSidebar
            courseTitle={course.title}
            modules={modulesWithProgress}
            activeModuleId={activeModuleId}
            activeLessonId={lessonId || null}
            completedLessons={completedCount}
            totalLessons={totalCount}
            courseId={course.id}
          />

          {/* Player Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Breadcrumb Header */}
            <div className="px-8 py-6 border-b border-gray-100 hidden md:block">
              <div className="mb-2">
                <span className="text-sm font-bold text-gray-900 block">
                  Introduction
                </span>
              </div>
              <Breadcrumb>
                <BreadcrumbList className="text-xs text-gray-500 font-medium">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="hover:text-[#FF6B6B]">
                      {course.instructor_name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="hover:text-[#FF6B6B]">
                      Course
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="hover:text-[#FF6B6B]">
                      {currentModuleTitle?.split(':')[0] || 'Module'}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage className="text-gray-900">
                    {activeLesson?.title || 'Overview'}
                  </BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <LessonVideoPlayer
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              imageQuery={course.image_query}
              imageColor={course.image_color}
              courseDescription={course.description}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
