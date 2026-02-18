import { useParams, Link } from 'react-router-dom'
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
import { Button } from '@/components/ui/button'
import {
  Clock,
  User,
  PlayCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { courses } from '@/data/mockData'
import NotFound from './NotFound'

export default function CourseDetails() {
  const { courseId } = useParams()
  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return <NotFound />
  }

  // Determine header image
  const imgUrl = course.imageColor
    ? `https://img.usecurling.com/p/1200/400?q=${course.imageQuery}&color=${course.imageColor}`
    : `https://img.usecurling.com/p/1200/400?q=${course.imageQuery}&color=green`

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-brand-forest">
      {/* Breadcrumb Header */}
      <div className="px-6 py-4 border-b border-brand-sea/30 bg-brand-forest/95 backdrop-blur-sm sticky top-[64px] z-20">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-brand-slate hover:text-white">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-brand-slate/50" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/courses"
                  className="text-brand-slate hover:text-white"
                >
                  Courses
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-brand-slate/50" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">
                {course.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img
            src={imgUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-30 grayscale-[20%] group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-forest via-brand-forest/80 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-12 md:pb-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-brand-green mb-4">
            <span className="border border-brand-green/30 bg-brand-green/10 px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono rounded">
              {course.id}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-grotesk font-bold text-white mb-6 tracking-tight leading-[1.1]">
            {course.title}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:items-center text-brand-slate text-sm font-mono">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {course.instructor}
            </span>
            <span className="hidden md:inline w-1 h-1 bg-brand-slate/50 rounded-full" />
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {course.duration}
            </span>
            <span className="hidden md:inline w-1 h-1 bg-brand-slate/50 rounded-full" />
            <span className="text-brand-yellow">
              {course.modules.length} Modules
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-grotesk font-medium text-white mb-4">
                About this Course
              </h2>
              <p className="text-brand-slate leading-relaxed text-lg font-light">
                {course.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-grotesk font-medium text-white mb-6">
                Course Content
              </h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {course.modules.map((module, index) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="border border-brand-sea/50 bg-brand-sea/10 rounded-lg px-4 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline hover:text-brand-yellow group py-4">
                      <div className="flex items-center gap-4 text-left">
                        <span className="text-brand-slate/50 font-mono text-sm">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-lg font-medium group-hover:text-brand-yellow transition-colors">
                          {module.title}
                        </span>
                        <span className="text-xs text-brand-slate font-normal ml-auto mr-4">
                          {module.lessons.length} Lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                      <div className="flex flex-col gap-2">
                        {module.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            to={`/course/${course.id}/lesson/${lesson.id}`}
                            className="flex items-center gap-4 p-3 rounded-md hover:bg-white/5 transition-colors group/lesson border border-transparent hover:border-brand-sea/30"
                          >
                            <div className="w-8 flex justify-center">
                              {lesson.isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-brand-green" />
                              ) : lesson.isLocked ? (
                                <Lock className="w-4 h-4 text-brand-slate/30" />
                              ) : (
                                <PlayCircle className="w-5 h-5 text-brand-slate group-hover/lesson:text-brand-yellow transition-colors" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={cn(
                                  'text-sm font-medium transition-colors',
                                  lesson.isCompleted
                                    ? 'text-brand-slate line-through decoration-brand-green/50'
                                    : 'text-white group-hover/lesson:text-brand-yellow',
                                )}
                              >
                                {lesson.title}
                              </span>
                              <span className="text-[10px] text-brand-slate/60 font-mono">
                                {lesson.duration}
                              </span>
                            </div>
                            {!lesson.isLocked && !lesson.isCompleted && (
                              <div className="ml-auto opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs border border-brand-sea hover:bg-brand-sea hover:text-white"
                                >
                                  Start
                                </Button>
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="border border-brand-sea bg-brand-forest p-6 rounded-lg sticky top-[140px]">
              <h3 className="text-sm font-grotesk font-medium text-brand-slate uppercase tracking-wider mb-4">
                Course Progress
              </h3>
              <div className="mb-2 flex justify-between items-end">
                <span className="text-3xl font-bold text-white font-grotesk">
                  0%
                </span>
                <span className="text-xs text-brand-slate mb-1">
                  0/
                  {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}{' '}
                  Lessons
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-brand-green h-full w-[0%] transition-all duration-1000"
                  style={{ width: '0%' }}
                />
              </div>

              <Button className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90 font-medium">
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
