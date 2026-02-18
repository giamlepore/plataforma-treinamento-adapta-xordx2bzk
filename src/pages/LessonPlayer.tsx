import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  MessageSquare,
  FileText,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { courses } from '@/data/mockData'
import NotFound from './NotFound'
import { useState } from 'react'

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)

  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return <NotFound />
  }

  // Find current lesson and module
  let currentLesson = null
  let currentModule = null
  let nextLessonUrl = null
  let prevLessonUrl = null

  // Flatten lessons to find indices
  const allLessons: {
    lesson: typeof currentLesson
    module: typeof currentModule
    url: string
  }[] = []

  course.modules.forEach((mod) => {
    mod.lessons.forEach((less) => {
      allLessons.push({
        lesson: less,
        module: mod,
        url: `/course/${course.id}/lesson/${less.id}`,
      })
    })
  })

  const currentIndex = allLessons.findIndex((l) => l.lesson?.id === lessonId)

  if (currentIndex === -1) {
    return <NotFound />
  }

  const currentItem = allLessons[currentIndex]
  currentLesson = currentItem.lesson
  currentModule = currentItem.module

  if (currentIndex > 0) {
    prevLessonUrl = allLessons[currentIndex - 1].url
  }
  if (currentIndex < allLessons.length - 1) {
    nextLessonUrl = allLessons[currentIndex + 1].url
  }

  if (!currentLesson || !currentModule) return <NotFound />

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-brand-forest flex flex-col">
      {/* Top Navigation */}
      <div className="px-6 py-4 border-b border-brand-sea/30 bg-brand-forest z-20 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink asChild>
                <Link to="/" className="text-brand-slate hover:text-white">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline-flex text-brand-slate/50" />
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink asChild>
                <Link
                  to={`/course/${course.id}`}
                  className="text-brand-slate hover:text-white"
                >
                  {course.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline-flex text-brand-slate/50" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium truncate max-w-[200px] md:max-w-none">
                {currentLesson.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="outline"
          size="sm"
          className="border-brand-sea text-brand-slate hover:text-white hover:bg-brand-sea/50 hidden md:flex"
          onClick={() => navigate(`/course/${course.id}`)}
        >
          Back to Course
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Content (Player) */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Video Player Container */}
            <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-brand-sea/30 relative group">
              <AspectRatio ratio={16 / 9}>
                {isPlaying ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src={`https://img.usecurling.com/p/1200/675?q=abstract+geometric+shapes&color=${course.imageColor || 'green'}&dpr=2`}
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 group-hover:shadow-brand-yellow/50"
                      >
                        <Play className="w-8 h-8 text-black fill-black ml-1" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-sm font-mono text-brand-yellow mb-1">
                        Module: {currentModule.title}
                      </p>
                      <h2 className="text-2xl font-bold text-white">
                        {currentLesson.title}
                      </h2>
                    </div>
                  </div>
                )}
              </AspectRatio>
            </div>

            {/* Lesson Controls & Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="default"
                  disabled={!prevLessonUrl}
                  onClick={() => prevLessonUrl && navigate(prevLessonUrl)}
                  className="border-brand-sea text-brand-slate hover:text-white hover:bg-brand-sea/50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  disabled={!nextLessonUrl}
                  onClick={() => nextLessonUrl && navigate(nextLessonUrl)}
                  className="border-brand-sea text-brand-slate hover:text-white hover:bg-brand-sea/50"
                >
                  Next Lesson
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="bg-brand-green text-brand-forest hover:bg-brand-green/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </div>

            <Separator className="bg-brand-sea/30" />

            {/* Lesson Details Tabs (Simplified) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Description
                  </h3>
                  <p className="text-brand-slate leading-relaxed">
                    In this lesson, we will explore the core concepts behind{' '}
                    <span className="text-white">{currentLesson.title}</span>.
                    Understanding this is crucial for your development in the{' '}
                    {course.title} curriculum. We'll break down the key
                    components and provide real-world examples to illustrate how
                    these principles apply in practice.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Key Takeaways
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-brand-slate">
                    <li>Understanding the fundamental mechanics</li>
                    <li>Identifying common pitfalls and how to avoid them</li>
                    <li>Practical application strategies for immediate use</li>
                    <li>Analyzing case studies from professional scenarios</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-brand-sea/10 border border-brand-sea/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-yellow" />
                    Resources
                  </h4>
                  <div className="space-y-2">
                    <a
                      href="#"
                      className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-sm text-brand-slate group-hover:text-white">
                        Lesson_Slides.pdf
                      </span>
                      <Download className="w-3 h-3 text-brand-slate group-hover:text-brand-yellow" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-sm text-brand-slate group-hover:text-white">
                        Worksheet_01.docx
                      </span>
                      <Download className="w-3 h-3 text-brand-slate group-hover:text-brand-yellow" />
                    </a>
                  </div>
                </div>

                <div className="bg-brand-sea/10 border border-brand-sea/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-green" />
                    Discussion
                  </h4>
                  <p className="text-xs text-brand-slate mb-4">
                    Have questions about this lesson? Join the discussion with
                    mentors and peers.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-brand-sea text-brand-slate hover:text-white hover:bg-brand-sea/50"
                  >
                    View Discussion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
