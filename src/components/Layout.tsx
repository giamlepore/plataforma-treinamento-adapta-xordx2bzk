import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

/* 
  Layout Component:
  - Fixed Header (64px)
  - Main Content Area (Full width)
  - Footer (Medium screens+)
*/

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
            // Sidebar padding removed for full width layout
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
      </div>
    </div>
  )
}
