import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  ChevronRight,
  PlayCircle,
  Clock,
  User,
  Star,
  BookOpen,
} from 'lucide-react'

/* 
  Index Page:
  - Hero Section (Learning Focus)
  - Course Grid (Replaces Metrics)
*/

interface CourseCardProps {
  id: string
  label: string
  title: string
  instructor?: string
  duration?: string
  imageQuery: string
  imageColor?: string
  isHighlight?: boolean
  className?: string
  delay?: number
  progress?: number
}

const CourseCard = ({
  id,
  label,
  title,
  instructor,
  duration,
  imageQuery,
  imageColor = 'green',
  isHighlight = false,
  className,
  delay = 0,
  progress = 0,
}: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Construct image URL based on specs
  const imgUrl = isHighlight
    ? `https://img.usecurling.com/p/600/600?q=${imageQuery}&color=yellow`
    : `https://img.usecurling.com/p/600/600?q=${imageQuery}&color=${imageColor}`

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
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={imgUrl}
          alt={title}
          className={cn(
            'w-full h-full object-cover transition-all duration-700 ease-out',
            isHighlight
              ? 'mix-blend-multiply opacity-80'
              : 'opacity-40 grayscale-[20%] contrast-[110%]',
            isHovered && !isHighlight && 'scale-105 grayscale-0 opacity-60',
            isHighlight && isHovered && 'scale-105 opacity-90',
          )}
        />
        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHighlight ? 'bg-brand-yellow/10' : 'bg-black/60',
            isHovered && !isHighlight && 'bg-black/40',
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
                : 'border-white/30 text-white/80',
            )}
          >
            <span>{id}</span>
            {progress > 0 && <span className="opacity-60">| {progress}%</span>}
          </div>
          {isHighlight ? (
            <PlayCircle className="w-6 h-6 text-black opacity-80 group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          )}
        </div>

        {/* Main Value */}
        <div className="mt-auto">
          <h3
            className={cn(
              'text-xs uppercase tracking-wider mb-3 font-inter flex items-center gap-2',
              isHighlight ? 'text-black/70' : 'text-brand-slate',
            )}
          >
            {label}
          </h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span
              className={cn(
                'text-3xl md:text-3xl lg:text-4xl font-grotesk font-bold tracking-tight leading-none line-clamp-3',
                isHighlight ? 'text-black' : 'text-white',
              )}
            >
              {title}
            </span>
          </div>

          <div
            className={cn(
              'flex items-center gap-4 text-xs font-mono border-t pt-3',
              isHighlight
                ? 'border-black/20 text-black/80'
                : 'border-white/20 text-brand-green',
            )}
          >
            {duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {duration}
              </span>
            )}
            {instructor && (
              <span className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {instructor}
              </span>
            )}
            {isHighlight && (
              <span className="flex items-center gap-1.5 ml-auto">
                <Star className="w-3 h-3 fill-black/20" />
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Highlight Background Color override */}
      {isHighlight && (
        <div className="absolute inset-0 bg-brand-yellow -z-10" />
      )}
    </Link>
  )
}

const Index = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-16 lg:py-20 border-b border-brand-sea animate-fade-in-up">
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-grotesk font-medium leading-[1.1] md:leading-[1.1] tracking-tight mb-8">
            Advance Your <br className="hidden md:block" />
            <span className="text-brand-slate/60">Betting Knowledge</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:items-center max-w-2xl">
            <div className="w-12 h-[1px] bg-brand-green hidden md:block" />
            <p className="text-brand-slate text-lg md:text-xl font-light leading-relaxed">
              Access professional-grade courses and validated strategies. Master
              the mathematics, psychology, and systems of profitable betting.
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full border-b border-brand-sea bg-brand-forest">
        <CourseCard
          id="COURSE_FIGMA"
          label="Product Design"
          title="Mastering Figma in 7 days unleashed"
          instructor="Albert Flores"
          duration="4h 12m"
          imageQuery="figma interface design"
          imageColor="orange"
          isHighlight={true}
          delay={50}
          className="border-r border-brand-sea"
          progress={12}
        />

        <CourseCard
          id="COURSE_01"
          label="Fundamentals"
          title="Smart Betting 101"
          instructor="A. Silva"
          duration="4h 30m"
          imageQuery="library books study"
          delay={100}
          className="border-r border-brand-sea"
          progress={100}
        />

        <CourseCard
          id="COURSE_02"
          label="Analytics"
          title="Data-Driven Decisions"
          instructor="Dr. Ray"
          duration="6h 15m"
          imageQuery="stock market chart"
          delay={200}
          className="border-r border-brand-sea"
          progress={45}
        />

        <CourseCard
          id="COURSE_03"
          label="Psychology"
          title="Mindset of a Winner"
          instructor="S. De Haan"
          duration="3h 20m"
          imageQuery="brain synapses abstract"
          imageColor="black"
          delay={300}
          className="border-r-0 border-brand-sea lg:border-r lg:border-brand-sea"
        />

        <CourseCard
          id="COURSE_04"
          label="Advanced Strategy"
          title="Arbitrage & Value"
          instructor="M. Kneebone"
          duration="8h 00m"
          imageQuery="chess strategy board"
          delay={400}
          className="border-r border-brand-sea"
        />

        <CourseCard
          id="COURSE_05"
          label="Featured Masterclass"
          title="Professional Risk Management"
          instructor="N. Mihaljevic"
          duration="12h 45m"
          imageQuery="financial safe vault"
          imageColor="yellow"
          delay={500}
          className="border-r border-brand-sea"
        />

        <CourseCard
          id="COURSE_06"
          label="Technology"
          title="Automated Systems"
          instructor="Bot Labs"
          duration="5h 30m"
          imageQuery="futuristic hud interface"
          delay={600}
          className="border-r-0 border-brand-sea"
        />
      </section>

      {/* Mobile-only Activity Teaser */}
      <div className="xl:hidden p-6 border-b border-brand-sea">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-grotesk text-lg">Continue Learning</h3>
          <ChevronRight className="w-5 h-5 text-brand-slate" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-brand-sea/20 p-4 border border-brand-sea/30 flex items-center gap-4">
            <div className="h-10 w-10 bg-brand-green/20 flex items-center justify-center rounded-full shrink-0">
              <BookOpen className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <span className="block text-xs text-brand-slate mb-1">
                Last Watched
              </span>
              <span className="text-sm font-medium text-white">
                Data-Driven Decisions: Module 3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
