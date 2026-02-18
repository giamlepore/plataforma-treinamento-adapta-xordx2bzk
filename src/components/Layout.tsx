import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

/* 
  Layout Component:
  - Fixed Header (64px)
  - Main Content Area (Full width)
  - Right Sidebar (Activity - XL breakpoint)
  - Footer (Medium screens+)
*/

const recentActivityData = [
  { name: 'L. Cruz', amount: 'Started', time: '2m ago' },
  { name: 'D. Engström', amount: 'Completed', time: '5m ago', highlight: true },
  { name: 'I. Gers', amount: 'Joined', time: '12m ago' },
  { name: 'Y. Gorlovotsky', amount: 'Started', time: '15m ago' },
  { name: 'E. Grazzi', amount: 'Completed', time: '18m ago' },
  { name: 'S. De Haan', amount: 'Started', time: '22m ago' },
  { name: 'F. Harb', amount: 'Joined', time: '25m ago' },
  {
    name: 'C. Hoffelner',
    amount: 'Completed',
    time: '28m ago',
    highlight: true,
  },
  { name: 'M. Kneebone', amount: 'Started', time: '32m ago' },
  { name: 'I. Marengo', amount: 'Joined', time: '35m ago' },
  { name: 'N. Mihaljevic', amount: 'Cert.', time: '38m ago', highlight: true },
  { name: 'P. Milicki', amount: 'Started', time: '41m ago' },
  { name: 'P. Moraes', amount: 'Joined', time: '45m ago' },
  { name: 'A. Silva', amount: 'Started', time: '48m ago' },
  { name: 'R. Kowalski', amount: 'Completed', time: '52m ago' },
]

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-forest text-white font-sans selection:bg-brand-yellow selection:text-black overflow-hidden">
      {/* Fixed Header */}
      <header className="h-[64px] border-b border-brand-sea flex items-center fixed top-0 w-full z-50 bg-brand-forest/95 backdrop-blur-sm">
        {/* Branding Section */}
        <div className="w-[256px] h-full flex items-center justify-between px-6 border-r border-brand-sea shrink-0">
          <div className="flex flex-col">
            <span className="font-grotesk font-bold text-xl tracking-tight leading-none">
              BETSMARTER
            </span>
            <span className="text-[10px] text-brand-slate tracking-widest uppercase">
              Course Dashboard
            </span>
          </div>
        </div>

        {/* Ticker/Timeline Section */}
        <div className="flex-1 h-full flex items-center justify-center relative overflow-hidden px-4">
          <div className="flex space-x-8 md:space-x-16 overflow-x-auto no-scrollbar items-end h-full pb-4">
            {[
              'MOD-01',
              'MOD-02',
              'MOD-03',
              'QUIZ-1',
              'LIVE SEMINAR',
              'MOD-05',
              'MOD-06',
              'EXAM',
              'CERT',
            ].map((marker, i) => {
              const isActive = marker === 'LIVE SEMINAR'
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 group cursor-default"
                >
                  <span
                    className={cn(
                      'font-mono text-xs transition-colors duration-300',
                      isActive
                        ? 'text-white font-bold'
                        : 'text-brand-sea group-hover:text-brand-slate',
                    )}
                  >
                    {marker}
                  </span>
                  <div
                    className={cn(
                      'w-[1px] h-2 transition-colors duration-300',
                      isActive
                        ? 'bg-white h-3'
                        : 'bg-brand-sea group-hover:bg-brand-slate',
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="hidden xl:flex w-[256px] h-full items-center justify-end px-6 border-l border-brand-sea shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse-slow" />
            <span className="font-mono text-sm text-brand-green">
              ONLINE CAMPUS
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex pt-[64px] min-h-screen relative">
        {/* Main Content */}
        <main
          className={cn(
            'flex-1 flex flex-col relative w-full transition-all duration-300',
            'xl:pr-[256px]', // Keep right padding for right sidebar
          )}
        >
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

        {/* Right Sidebar (Desktop XL only) */}
        <aside className="hidden xl:flex w-[256px] flex-col fixed right-0 top-[64px] bottom-0 bg-brand-forest z-40 border-l border-brand-sea">
          {/* Sidebar Header */}
          <div className="h-12 border-b border-brand-sea flex items-center px-4 shrink-0 bg-brand-forest/50">
            <h3 className="font-grotesk font-medium text-sm text-brand-slate uppercase tracking-wider">
              Student Activity
            </h3>
          </div>

          {/* Scrollable Feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            {recentActivityData.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center justify-between px-4 py-3 border-b border-brand-sea/30 transition-all duration-200 hover:bg-white/5 cursor-default group',
                  item.highlight && 'bg-brand-sea/50 hover:bg-brand-sea/70',
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      item.highlight
                        ? 'text-white'
                        : 'text-brand-slate group-hover:text-white',
                    )}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] text-brand-sea font-mono">
                    {item.time}
                  </span>
                </div>
                <span
                  className={cn(
                    'font-mono text-xs font-bold uppercase',
                    item.highlight ? 'text-brand-yellow' : 'text-brand-green',
                  )}
                >
                  {item.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Supervisors Footer */}
          <div className="h-auto border-t border-brand-sea bg-brand-forest p-4 shrink-0">
            <p className="text-[10px] text-brand-sea uppercase mb-2">Mentors</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-slate rounded-full opacity-50" />
                <span className="text-xs text-brand-slate">Karel Martens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-slate rounded-full opacity-50" />
                <span className="text-xs text-brand-slate">Armand Mevis</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
