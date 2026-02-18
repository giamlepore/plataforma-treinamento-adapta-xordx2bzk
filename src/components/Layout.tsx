import { Outlet, useLocation, matchPath, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { courses } from '@/data/mockData'
import { useEffect, useRef } from 'react'

/* 
  Layout Component:
  - Fixed Header (64px) with Course Dial
  - Main Content Area (Full width)
  - Footer (Medium screens+)
*/

export default function Layout() {
  const location = useLocation()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  // Determine active course from URL
  const match = matchPath('/course/:courseId/*', location.pathname)
  const activeCourseId = match?.params.courseId

  // Auto-scroll to active course on mount/change
  useEffect(() => {
    if (activeCourseId && itemRefs.current.has(activeCourseId)) {
      const activeElement = itemRefs.current.get(activeCourseId)
      activeElement?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [activeCourseId])

  return (
    <div className="flex flex-col min-h-screen bg-brand-forest text-white font-sans selection:bg-brand-yellow selection:text-black overflow-hidden">
      {/* Fixed Header */}
      <header className="h-[64px] border-b border-brand-sea flex items-center fixed top-0 w-full z-50 bg-brand-forest/95 backdrop-blur-sm">
        {/* Branding Section */}
        <Link
          to="/"
          className="w-[256px] h-full flex items-center justify-between px-6 border-r border-brand-sea shrink-0 hover:bg-white/5 transition-colors"
        >
          <div className="flex flex-col">
            <span className="font-grotesk font-bold text-xl tracking-tight leading-none">
              BETSMARTER
            </span>
            <span className="text-[10px] text-brand-slate tracking-widest uppercase">
              Course Dashboard
            </span>
          </div>
        </Link>

        {/* Dial/Timeline Section */}
        <div className="flex-1 h-full flex items-center justify-start relative overflow-hidden">
          {/* Fade Gradients for Dial Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-brand-forest to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-brand-forest to-transparent z-10 pointer-events-none" />

          {/* Scrollable Course List */}
          <div
            ref={scrollContainerRef}
            className="flex items-end h-full w-full overflow-x-auto no-scrollbar pb-4 px-12 md:px-24 snap-x snap-mandatory"
          >
            <div className="flex space-x-8 md:space-x-12">
              {courses.map((course) => {
                const isActive = course.id === activeCourseId
                return (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    ref={(el) => {
                      if (el) itemRefs.current.set(course.id, el)
                      else itemRefs.current.delete(course.id)
                    }}
                    className={cn(
                      'flex flex-col items-center gap-2 group cursor-pointer snap-center select-none min-w-max',
                      'transition-all duration-300 ease-out',
                      isActive
                        ? 'opacity-100 scale-105'
                        : 'opacity-40 hover:opacity-70',
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono text-xs uppercase tracking-wide transition-colors duration-300 whitespace-nowrap',
                        isActive
                          ? 'text-white font-bold'
                          : 'text-brand-sea group-hover:text-brand-slate',
                      )}
                    >
                      {course.title.length > 30
                        ? `${course.title.substring(0, 30)}...`
                        : course.title}
                    </span>
                    <div
                      className={cn(
                        'w-[1px] transition-all duration-300',
                        isActive
                          ? 'bg-white h-3 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                          : 'bg-brand-sea h-2 group-hover:bg-brand-slate group-hover:h-2.5',
                      )}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="hidden xl:flex w-[256px] h-full items-center justify-end px-6 border-l border-brand-sea shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse-slow shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="font-mono text-sm text-brand-green">
              ONLINE CAMPUS
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex pt-[64px] min-h-screen relative">
        {/* Main Content */}
        <main className="flex-1 flex flex-col relative w-full transition-all duration-300">
          <Outlet />

          {/* Global Footer (Visible md+) */}
          <footer className="hidden md:block absolute bottom-6 left-8 z-10 pointer-events-none mix-blend-difference">
            <div className="text-[10px] text-brand-slate leading-relaxed max-w-md">
              <p>BETSMARTER ACADEMY</p>
              <p className="mt-1 opacity-60">
                All course materials are intellectual property of BetSmarter.
                Unauthorized distribution is prohibited. Platform v2.1.0.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
