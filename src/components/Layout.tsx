import { Outlet, useLocation, matchPath, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, Settings } from 'lucide-react'
import { useOrganization } from '@/context/OrganizationContext'

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
  const [courses, setCourses] = useState<any[]>([])
  const { user, signOut } = useAuth()
  const { organization } = useOrganization()
  const [isAdmin, setIsAdmin] = useState(false)

  // Determine active course from URL
  const match = matchPath('/course/:courseId/*', location.pathname)
  const activeCourseId = match?.params.courseId

  useEffect(() => {
    async function loadData() {
      if (!user) return
      const { data } = await supabase
        .from('courses')
        .select('id, title')
        .order('created_at')
      if (data) setCourses(data)

      // Check admin role for settings button
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'admin') setIsAdmin(true)
    }
    loadData()
  }, [user])

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
  }, [activeCourseId, courses])

  const handleLogout = async () => {
    await signOut()
  }

  const bgColor = organization?.platform_bg_color || '#1a5c48'

  return (
    <div
      className="flex flex-col min-h-screen text-white font-sans selection:bg-brand-yellow selection:text-black overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      {/* Fixed Header */}
      <header
        className="h-[64px] border-b border-brand-sea flex items-center fixed top-0 w-full z-50 bg-inherit/95 backdrop-blur-sm"
        style={{ backgroundColor: bgColor }} // Ensure header matches
      >
        {/* Branding Section */}
        <Link
          to="/"
          className="w-[256px] h-full flex items-center justify-between px-6 border-r border-brand-sea shrink-0 hover:bg-white/5 transition-colors"
        >
          <div className="flex flex-col">
            <span
              className="font-grotesk font-bold text-xl tracking-tight leading-none"
              style={{ color: organization?.header_title_color || undefined }}
            >
              {organization?.header_title || 'BETSMARTER'}
            </span>
            <span
              className="text-[10px] text-brand-slate tracking-widest uppercase"
              style={{
                color: organization?.header_subtitle_color || undefined,
              }}
            >
              {organization?.header_subtitle || 'Course Dashboard'}
            </span>
          </div>
        </Link>

        {/* Dial/Timeline Section */}
        <div className="flex-1 h-full flex items-center justify-start relative overflow-hidden">
          {/* Fade Gradients for Dial Effect - using inline styles to match dynamic bg */}
          <div
            className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${bgColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${bgColor}, transparent)`,
            }}
          />

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

        {/* System Status / Logout */}
        <div className="hidden xl:flex w-[256px] h-full items-center justify-end px-6 border-l border-brand-sea shrink-0 gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 text-brand-slate hover:text-white transition-colors"
              title="Admin Dashboard"
            >
              <Settings className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-brand-slate hover:text-white transition-colors"
          >
            <span className="font-mono text-xs uppercase">Logout</span>
            <LogOut className="w-4 h-4" />
          </button>
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
              <p>{organization?.header_title || 'BETSMARTER'} ACADEMY</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
