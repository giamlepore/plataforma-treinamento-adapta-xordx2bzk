import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { ReactNode } from 'react'

interface AdminBentoCardProps {
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
  action?: ReactNode
  colSpan?: 1 | 2 | 3 | 4
}

export function AdminBentoCard({
  title,
  subtitle,
  className,
  children,
  action,
  colSpan = 1,
}: AdminBentoCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl admin-card p-6 transition-all hover:shadow-md',
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'md:col-span-3',
        colSpan === 4 && 'md:col-span-4',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-jetbrains text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="font-inter text-lg font-medium text-[#111111] leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {action ? (
          action
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1">{children}</div>
    </div>
  )
}
