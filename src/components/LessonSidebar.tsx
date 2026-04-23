import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Flag, Play, Lock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Lesson {
  id: string
  title: string
  duration: string
  is_test: boolean
  is_locked: boolean
  is_completed?: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface LessonSidebarProps {
  courseTitle: string
  modules: Module[]
  activeModuleId: string | null
  activeLessonId: string | null
  completedLessons: number
  totalLessons: number
  courseId: string
}

export function LessonSidebar({
  courseTitle,
  modules,
  activeModuleId,
  activeLessonId,
  completedLessons,
  totalLessons,
  courseId,
}: LessonSidebarProps) {
  const [openModules, setOpenModules] = useState<string[]>([])

  useEffect(() => {
    if (activeModuleId && !openModules.includes(activeModuleId)) {
      setOpenModules((prev) => [...prev, activeModuleId])
    }
  }, [activeModuleId])

  return (
    <div className="w-full lg:w-[400px] border-r border-gray-100 flex flex-col bg-white shrink-0 h-[600px] lg:h-auto">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 bg-[#FFEFEF] rounded-lg flex items-center justify-center shrink-0">
            <div className="w-5 h-5 text-[#FF6B6B] font-bold text-xs flex items-center justify-center border border-[#FF6B6B] rounded">
              {'</>'}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
            {courseTitle}
          </h3>
        </div>
        <p className="text-xs text-[#FF6B6B] font-medium flex items-center gap-2">
          <span className="w-2 h-2">✨</span>
          {completedLessons}/{totalLessons} completed
        </p>
      </div>

      {/* Modules List */}
      <ScrollArea className="flex-1">
        <Accordion
          type="multiple"
          value={openModules}
          onValueChange={setOpenModules}
          className="w-full"
        >
          {modules.map((module) => (
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
                        to={`/course/${courseId}/lesson/${lesson.id}`}
                        className={cn(
                          'flex items-start gap-3 px-6 py-4 transition-colors relative',
                          isActive ? 'bg-[#FFF5F5]' : 'hover:bg-gray-50',
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B6B]" />
                        )}

                        <div className="mt-0.5 shrink-0">
                          {lesson.is_test ? (
                            <div className="w-5 h-5 flex items-center justify-center">
                              <Flag className="w-4 h-4 text-[#FF6B6B]" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
                                lesson.is_completed
                                  ? 'bg-[#FF6B6B] border-[#FF6B6B]'
                                  : isActive
                                    ? 'border-[#FF6B6B]'
                                    : 'border-gray-300',
                              )}
                            >
                              {lesson.is_completed ? (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              ) : (
                                <Play
                                  className={cn(
                                    'w-2 h-2 fill-current',
                                    isActive
                                      ? 'text-[#FF6B6B]'
                                      : 'text-gray-300',
                                  )}
                                />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {lesson.is_test && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-[#FF6B6B] text-white text-[9px] font-bold uppercase tracking-wider mb-1">
                              Test
                            </span>
                          )}
                          <h4
                            className={cn(
                              'text-sm font-medium mb-1 truncate',
                              isActive ? 'text-gray-900' : 'text-gray-600',
                            )}
                          >
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <span>{lesson.duration}</span>
                          </div>
                        </div>

                        <div className="mt-0.5 shrink-0">
                          {lesson.is_locked ? (
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
      </ScrollArea>
    </div>
  )
}
