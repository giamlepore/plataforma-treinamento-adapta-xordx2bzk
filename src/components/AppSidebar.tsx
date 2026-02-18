import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  Wallet,
  Settings,
  HelpCircle,
  Trophy,
  History,
  GraduationCap,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: GraduationCap, label: 'My Courses', path: '/courses', active: true },
  { icon: BookOpen, label: 'Course Catalog', path: '/catalog' },
  { icon: Trophy, label: 'Certificates', path: '/certificates' },
  { icon: LineChart, label: 'Performance', path: '/performance' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: Wallet, label: 'Scholarship', path: '/wallet' },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Support', path: '/support' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex w-[256px] flex-col fixed left-0 top-[64px] bottom-0 bg-brand-forest border-r border-brand-sea z-40">
      <div className="h-12 border-b border-brand-sea flex items-center px-6 shrink-0 bg-brand-forest/50">
        <h3 className="font-grotesk font-medium text-xs text-brand-slate uppercase tracking-widest">
          Main Navigation
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.active || location.pathname === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300 group relative overflow-hidden',
                  isActive ? 'text-white' : 'text-brand-slate hover:text-white',
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-brand-sea/40 border-l-2 border-brand-yellow/80" />
                )}
                <item.icon
                  className={cn(
                    'w-4 h-4 z-10 transition-colors duration-300',
                    isActive
                      ? 'text-brand-yellow'
                      : 'text-brand-slate group-hover:text-brand-yellow',
                  )}
                />
                <span className="font-medium text-sm tracking-wide z-10">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-brand-sea bg-brand-forest">
        <div className="space-y-1 mb-6">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-brand-slate hover:bg-white/5 hover:text-white transition-all duration-200 group"
            >
              <item.icon className="w-4 h-4 text-brand-slate group-hover:text-brand-yellow" />
              <span className="font-medium text-sm tracking-wide">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="bg-brand-sea/20 rounded-lg p-4 border border-brand-sea/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-yellow/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] text-brand-slate uppercase tracking-wider">
                Current Plan
              </p>
              <span className="bg-brand-yellow text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                PRO
              </span>
            </div>
            <p className="text-sm font-bold text-white mb-2 font-grotesk">
              BetSmarter Elite
            </p>
            <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-green h-full w-[65%]" />
            </div>
            <p className="text-[10px] text-brand-slate mt-2 text-right">
              65% Completed
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
