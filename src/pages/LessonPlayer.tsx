import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Play,
  Share2,
  Star,
  Lock,
  Flag,
  PlayCircle,
  FileText,
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
  if (!course) return <NotFound />

  // Find current lesson and module
  let currentLesson = null
  let currentModule = null

  // Flatten lessons to find current
  const allLessons: {
    lesson: any
    module: any
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
  if (currentIndex !== -1) {
    currentLesson = allLessons[currentIndex].lesson
    currentModule = allLessons[currentIndex].module
  } else if (lessonId) {
    return <NotFound />
  }

  // Calculate stats
  const completedLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.isCompleted).length,
    0,
  )
  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  )

  const activeLessonId = currentLesson?.id || allLessons[0]?.lesson.id
  const activeModuleId = currentModule?.id || course.modules[0]?.id

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#2B2B2B] flex flex-col font-sans">
      {/* Course Hero Section */}
      <div className="w-full px-6 py-8 md:px-12 md:py-10 bg-[#2B2B2B] text-white">
        <div className="max-w-[1400px] mx-auto">
          {/* User/Instructor Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={
                course.instructorAvatar ||
                'https://img.usecurling.com/ppl/thumbnail?gender=male'
              }
              alt={course.instructor}
              className="w-8 h-8 rounded-full border border-white/10"
            />
            <span className="text-sm font-medium text-white/90">
              {course.instructor}
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
                  {course.duration}
                </div>
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {course.modules.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0,
                  )}{' '}
                  lessons
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
              <Button className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white font-medium px-8 h-12 text-base rounded-lg">
                Enroll Course
              </Button>
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
          {/* Sidebar */}
          <div className="w-full lg:w-[400px] border-r border-gray-100 flex flex-col bg-white shrink-0">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-[#FFEFEF] rounded-lg flex items-center justify-center shrink-0">
                  <div className="w-5 h-5 text-[#FF6B6B] font-bold text-xs flex items-center justify-center border border-[#FF6B6B] rounded">
                    {'</>'}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                  {course.title}
                </h3>
              </div>
              <p className="text-xs text-[#FF6B6B] font-medium flex items-center gap-2">
                <span className="w-2 h-2">✨</span>
                {completedLessons}/{totalLessons} completed
              </p>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto">
              <Accordion
                type="multiple"
                defaultValue={[activeModuleId]}
                className="w-full"
              >
                {course.modules.map((module) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline group">
                      <span
                        className={cn(
                          'font-medium text-sm text-left',
                          activeModuleId === module.id
                            ? 'text-[#FF6B6B]'
                            : 'text-gray-700',
                        )}
                      >
                        {module.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-0">
                      <div className="flex flex-col">
                        {module.lessons.map((lesson) => {
                          const isActive = lesson.id === activeLessonId
                          return (
                            <Link
                              key={lesson.id}
                              to={`/course/${course.id}/lesson/${lesson.id}`}
                              className={cn(
                                'flex items-start gap-3 px-6 py-4 transition-colors relative',
                                isActive ? 'bg-[#FFF5F5]' : 'hover:bg-gray-50',
                              )}
                            >
                              {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B6B]" />
                              )}

                              <div className="mt-0.5 shrink-0">
                                {lesson.isTest ? (
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    <Flag className="w-4 h-4 text-[#FF6B6B]" />
                                  </div>
                                ) : (
                                  <div
                                    className={cn(
                                      'w-5 h-5 rounded-full border flex items-center justify-center',
                                      isActive
                                        ? 'border-[#FF6B6B]'
                                        : 'border-gray-300',
                                    )}
                                  >
                                    <Play
                                      className={cn(
                                        'w-2 h-2 fill-current',
                                        isActive
                                          ? 'text-[#FF6B6B]'
                                          : 'text-gray-300',
                                      )}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                {lesson.isTest && (
                                  <span className="inline-block px-1.5 py-0.5 rounded bg-[#FF6B6B] text-white text-[9px] font-bold uppercase tracking-wider mb-1">
                                    Test
                                  </span>
                                )}
                                <h4
                                  className={cn(
                                    'text-sm font-medium mb-1 truncate',
                                    isActive
                                      ? 'text-gray-900'
                                      : 'text-gray-600',
                                  )}
                                >
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>

                              <div className="mt-0.5 shrink-0">
                                {lesson.isLocked ? (
                                  <Lock className="w-4 h-4 text-gray-300" />
                                ) : (
                                  <div className="w-4 h-4" />
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

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
                      {course.instructor}
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
                      {currentModule?.title.split(':')[0] || 'Module'}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage className="text-gray-900">
                    {currentLesson?.title || 'Overview'}
                  </BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
              {/* Video Player Placeholder */}
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative group shadow-lg mb-8">
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
                  <>
                    <img
                      src={`https://img.usecurling.com/p/1200/675?q=${course.imageQuery}&color=${course.imageColor || 'orange'}`}
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 md:w-20 md:h-20 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                      </button>
                    </div>
                  </>
                )}

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                  <div className="h-full w-[35%] bg-[#FF6B6B]" />
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start h-auto p-0 rounded-none mb-6">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 mr-8 text-gray-500 data-[state=active]:text-gray-900 font-semibold text-sm"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-gray-500 data-[state=active]:text-gray-900 font-semibold text-sm"
                  >
                    Rating and review
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0">
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <p className="mb-4">{course.description}</p>
                    <p>
                      This immersive course is designed for aspiring developers,
                      creative minds, and tech enthusiasts ready to unlock the
                      full potential of the front-end landscape. You will learn
                      to navigate the Figma interface, create scalable
                      components, and build a complete design system from
                      scratch.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-0">
                  <div className="text-gray-500 text-sm">
                    Reviews section content would appear here.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
