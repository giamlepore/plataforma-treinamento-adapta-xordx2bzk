import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ArrowUpRight, PlayCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useOrganization } from '@/context/OrganizationContext'

interface CourseCardProps {
  id: string
  label: string
  title: string
  instructor?: string
  duration?: string
  bgColor: string
  thumbnailUrl?: string | null
  isHighlight?: boolean
  className?: string
  delay?: number
  progress?: number
}

const CourseCard = ({
  id,
  label,
  title,
  bgColor,
  thumbnailUrl,
  isHighlight = false,
  className,
  delay = 0,
  progress = 0,
}: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      to={`/course/${id}`}
      className={cn(
        'relative group overflow-hidden border-b border-brand-sea min-h-[320px] md:min-h-[400px] p-6 flex flex-col justify-between transition-all duration-500 animate-fade-in-up',
        'md:border-r last:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(2n)]:border-r',
        'hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:ring-inset',
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Color or Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={cn(
            'w-full h-full transition-transform duration-700 ease-out bg-cover bg-center',
            isHovered && 'scale-105',
            !thumbnailUrl && !bgColor.startsWith('#') && bgColor,
          )}
          style={{
            backgroundColor:
              !thumbnailUrl && bgColor.startsWith('#') ? bgColor : undefined,
            backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
          }}
        />
        {/* Subtle Overlay for depth */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHighlight ? 'bg-white/10' : 'bg-black/20',
            isHovered && 'opacity-50',
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div
            className={cn(
              'border px-2 py-1 text-[10px] uppercase tracking-widest font-mono font-medium flex items-center gap-2',
              isHighlight
                ? 'border-black text-black'
                : 'border-white/30 text-white/90 bg-black/20 backdrop-blur-sm',
            )}
          >
            <span>ID: {id.slice(0, 4)}</span>
            {progress > 0 && <span className="opacity-60">| {progress}%</span>}
          </div>
          {isHighlight ? (
            <PlayCircle className="w-6 h-6 text-black opacity-80 group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          )}
        </div>

        {/* Main Value */}
        <div className="mt-auto">
          <h3
            className={cn(
              'text-xs uppercase tracking-wider mb-3 font-inter flex items-center gap-2 drop-shadow-sm',
              isHighlight ? 'text-black/70' : 'text-white/90',
            )}
          >
            {label}
          </h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span
              className={cn(
                'text-3xl md:text-3xl lg:text-4xl font-grotesk font-bold tracking-tight leading-none line-clamp-3 drop-shadow-md',
                isHighlight ? 'text-black' : 'text-white',
              )}
            >
              {title}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const Index = () => {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { organization } = useOrganization()

  useEffect(() => {
    async function fetchCourses() {
      if (!user) return

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error && data) {
        setCourses(data)
      }
      setLoading(false)
    }

    fetchCourses()
  }, [user])

  if (loading) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-16 lg:py-20 border-b border-brand-sea animate-fade-in-up">
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-grotesk font-medium leading-[1.1] md:leading-[1.1] tracking-tight mb-8">
            {organization?.hero_title || 'Advance Your Betting Knowledge'}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:items-center max-w-2xl">
            <div className="w-12 h-[1px] bg-brand-green hidden md:block" />
            <p className="text-brand-slate text-lg md:text-xl font-light leading-relaxed">
              {organization?.hero_subtitle ||
                'Access professional-grade courses and validated strategies. Master the mathematics, psychology, and systems of profitable betting.'}
            </p>
          </div>
        </div>

        {/* Decorative Grid Lines Background */}
        <div
          className="absolute inset-0 pointer-events-none -z-10 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1a5c48 1px, transparent 1px), linear-gradient(to bottom, #1a5c48 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </section>

      {/* Course Grid */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full border-b border-brand-sea"
        style={{
          backgroundColor: organization?.platform_bg_color || undefined,
        }}
      >
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            id={course.id}
            label={course.label || 'Course'}
            title={course.title}
            instructor={course.instructor_name}
            duration={course.duration_text}
            bgColor={course.image_color || 'bg-brand-sea'}
            thumbnailUrl={course.thumbnail_url}
            isHighlight={index === 0}
            delay={(index + 1) * 50}
            className={cn(
              'border-r border-brand-sea',
              (index + 1) % 3 === 0 ? 'lg:border-r-0' : '',
            )}
            progress={0}
          />
        ))}
      </section>
    </div>
  )
}

export default Index
