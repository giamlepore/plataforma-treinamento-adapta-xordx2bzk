import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  ChevronRight,
  Activity,
  Users,
  TrendingUp,
  Wallet,
  Banknote,
  Timer,
} from 'lucide-react'

/* 
  Index Page:
  - Hero Section
  - Performance Metrics Grid (Responsive)
*/

interface MetricCardProps {
  id: string
  label: string
  value: string
  subValue?: string
  imageQuery: string
  imageColor?: string
  isHighlight?: boolean
  className?: string
  delay?: number
}

const MetricCard = ({
  id,
  label,
  value,
  subValue,
  imageQuery,
  imageColor = 'green',
  isHighlight = false,
  className,
  delay = 0,
}: MetricCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Construct image URL based on specs
  const imgUrl = isHighlight
    ? `https://img.usecurling.com/p/600/600?q=${imageQuery}&color=yellow`
    : `https://img.usecurling.com/p/600/600?q=${imageQuery}&color=${imageColor}`

  return (
    <div
      className={cn(
        'relative group overflow-hidden border-b border-brand-sea min-h-[320px] md:min-h-[400px] p-6 flex flex-col justify-between transition-all duration-500 animate-fade-in-up',
        // Grid borders logic handled by parent grid layout or specific classes
        'md:border-r last:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(2n)]:border-r', // Complex border logic approximation
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
          alt={label}
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
              'border px-2 py-1 text-[10px] uppercase tracking-widest font-mono font-medium',
              isHighlight
                ? 'border-black text-black'
                : 'border-white/30 text-white/80',
            )}
          >
            {id}
          </div>
          {isHighlight ? (
            <div className="w-2 h-2 bg-black rounded-full" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          )}
        </div>

        {/* Main Value */}
        <div className="mt-auto">
          <h3
            className={cn(
              'text-xs uppercase tracking-wider mb-2 font-inter',
              isHighlight ? 'text-black/70' : 'text-brand-slate',
            )}
          >
            {label}
          </h3>
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                'text-5xl md:text-6xl lg:text-7xl font-grotesk font-bold tracking-tighter leading-none',
                isHighlight ? 'text-black' : 'text-white',
              )}
            >
              {value}
            </span>
          </div>
          {subValue && (
            <p
              className={cn(
                'mt-3 text-sm font-medium flex items-center gap-2',
                isHighlight ? 'text-black/80' : 'text-brand-green',
              )}
            >
              {subValue}
            </p>
          )}
        </div>
      </div>

      {/* Highlight Background Color override */}
      {isHighlight && (
        <div className="absolute inset-0 bg-brand-yellow -z-10" />
      )}
    </div>
  )
}

const Index = () => {
  return (
    <div className="w-full h-full">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-20 lg:py-24 border-b border-brand-sea animate-fade-in-up">
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-grotesk font-medium leading-[1.1] md:leading-[1.1] tracking-tight mb-8">
            Resultados Reales y <br className="hidden md:block" />
            <span className="text-brand-slate/60">
              Rendimiento de la Plataforma
            </span>
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:items-center max-w-2xl">
            <div className="w-12 h-[1px] bg-brand-green hidden md:block" />
            <p className="text-brand-slate text-lg md:text-xl font-light leading-relaxed">
              Exclusive performance metrics and validated returns for BetSmarter
              tier-one members. Historical data verified on-chain.
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

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full border-b border-brand-sea bg-brand-forest">
        <MetricCard
          id="METRIC_01"
          label="Active Members"
          value="450"
          imageQuery="concert crowd"
          delay={100}
          className="border-r border-brand-sea"
          subValue="Verified Participants"
        />

        <MetricCard
          id="METRIC_02"
          label="Avg. Monthly Benefit"
          value="2,500€"
          imageQuery="euro bills"
          delay={200}
          className="border-r border-brand-sea"
          subValue="+12% vs last month"
        />

        <MetricCard
          id="METRIC_03"
          label="Velocity (Until Benefit)"
          value="1 Day"
          imageQuery="sprinters running"
          imageColor="black"
          delay={300}
          className="border-r-0 border-brand-sea"
          subValue="Record Speed"
        />

        <MetricCard
          id="METRIC_04"
          label="Avg. Monthly ROI"
          value="100%"
          imageQuery="staircase upwards"
          delay={400}
          className="border-r border-brand-sea"
          subValue="Consistent Growth"
        />

        <MetricCard
          id="METRIC_05"
          label="Total Generated Benefit"
          value="8.95M€"
          imageQuery="abstract architecture grid"
          imageColor="yellow"
          isHighlight={true}
          delay={500}
          className="border-r border-brand-sea"
          subValue="Cumulative All-Time"
        />

        <MetricCard
          id="METRIC_06"
          label="Rec. Initial Bankroll"
          value="1,500€"
          imageQuery="neoclassical bank building"
          delay={600}
          className="border-r-0 border-brand-sea"
          subValue="Optimal Entry Point"
        />
      </section>

      {/* Mobile-only Activity Teaser (Optional, not strictly in spec but good for UX if sidebar hidden) */}
      <div className="xl:hidden p-6 border-b border-brand-sea">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-grotesk text-lg">Latest Validated Returns</h3>
          <ChevronRight className="w-5 h-5 text-brand-slate" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-sea/20 p-3 border border-brand-sea/30">
            <span className="block text-xs text-brand-slate mb-1">
              N. Mihaljevic
            </span>
            <span className="text-xl font-mono text-brand-yellow">+5,500€</span>
          </div>
          <div className="bg-brand-sea/20 p-3 border border-brand-sea/30">
            <span className="block text-xs text-brand-slate mb-1">
              C. Hoffelner
            </span>
            <span className="text-xl font-mono text-brand-green">+3,100€</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
