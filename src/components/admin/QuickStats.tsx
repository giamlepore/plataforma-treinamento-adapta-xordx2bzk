import { useEffect, useState } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { getOrgStats, OrgStats } from '@/services/stats'
import { AdminBentoCard } from '@/components/admin/AdminBentoCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Users,
  BookOpen,
  FileText,
  Star,
  CheckCircle,
  Activity,
  UserCheck,
  Server,
  Zap,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickStatsProps {
  colSpan?: 1 | 2 | 3 | 4
}

export function QuickStats({ colSpan = 4 }: QuickStatsProps) {
  const { organization } = useOrganization()
  const [stats, setStats] = useState<OrgStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (organization) {
      setLoading(true)
      getOrgStats(organization.id).then((data) => {
        setStats(data)
        setLoading(false)
      })
    }
  }, [organization])

  return (
    <AdminBentoCard
      title="QUICK STATS"
      subtitle="Performance Overview"
      colSpan={colSpan}
      className="min-h-[300px]"
    >
      <Tabs defaultValue="dashboard" className="w-full mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-[#F7F7F7] p-1 rounded-lg mx-auto md:mx-0">
          <TabsTrigger
            value="dashboard"
            className="text-[10px] uppercase tracking-wider font-jetbrains data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm text-gray-500 rounded-md py-1.5 transition-all"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="platform"
            className="text-[10px] uppercase tracking-wider font-jetbrains data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm text-gray-500 rounded-md py-1.5 transition-all"
          >
            Platform
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="text-[10px] uppercase tracking-wider font-jetbrains data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm text-gray-500 rounded-md py-1.5 transition-all"
          >
            Students
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="dashboard"
          className="space-y-6 animate-fade-in focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Students"
              value={loading ? '-' : stats?.totalStudents.toString() || '0'}
              icon={<Users className="w-4 h-4" />}
              delay={0}
            />
            <StatsCard
              title="Total Courses"
              value={loading ? '-' : stats?.totalCourses.toString() || '0'}
              icon={<BookOpen className="w-4 h-4" />}
              delay={50}
            />
            <StatsCard
              title="Content Volume"
              value={loading ? '-' : stats?.totalLessons.toString() || '0'}
              subtitle="Lessons"
              icon={<FileText className="w-4 h-4" />}
              delay={100}
            />
            <StatsCard
              title="Avg. Rating"
              value={loading ? '-' : stats?.avgRating.toFixed(1) || '0.0'}
              icon={<Star className="w-4 h-4" />}
              delay={150}
            />
            <StatsCard
              title="Student Progress"
              value={loading ? '-' : stats?.completedLessons.toString() || '0'}
              subtitle="Completed"
              icon={<CheckCircle className="w-4 h-4" />}
              delay={200}
            />
          </div>

          <div className="p-5 rounded-xl border border-gray-100 bg-[#FAFAFA] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#111111]" />
              <h4 className="font-jetbrains text-[10px] uppercase tracking-[0.15em] text-gray-500">
                Engagement Overview
              </h4>
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Your organization has{' '}
              <strong className="font-medium text-[#111111]">
                {stats?.totalStudents || 0} active students
              </strong>{' '}
              enrolled across {stats?.totalCourses || 0} courses. Students have
              completed a total of {stats?.completedLessons || 0} lessons, with
              an average course rating of {stats?.avgRating.toFixed(1) || '0.0'}
              /5.0.
            </p>
          </div>
        </TabsContent>

        <TabsContent
          value="platform"
          className="space-y-4 animate-fade-in focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100">
                  <Server className="w-5 h-5 text-[#111111]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-[#111111] block mb-0.5">
                    System Status
                  </span>
                  <span className="text-[10px] text-gray-500 font-jetbrains uppercase tracking-wide">
                    Availability
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-mono text-green-700 font-medium">
                  ONLINE
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100">
                  <Zap className="w-5 h-5 text-[#111111]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-[#111111] block mb-0.5">
                    API Health
                  </span>
                  <span className="text-[10px] text-gray-500 font-jetbrains uppercase tracking-wide">
                    Response Time
                  </span>
                </div>
              </div>
              <span className="text-lg font-light font-inter text-[#111111]">
                24ms
              </span>
            </div>

            <div className="col-span-1 md:col-span-2 p-5 bg-[#FAFAFA] rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-[#111111]" />
                <h4 className="font-jetbrains text-[10px] uppercase tracking-[0.15em] text-gray-500">
                  Resource Usage
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Database Load</span>
                  <span className="text-[#111111] font-mono">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#111111] h-1.5 rounded-full w-[12%]"></div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="students"
          className="space-y-4 animate-fade-in focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100">
                  <Users className="w-5 h-5 text-[#111111]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-[#111111] block mb-0.5">
                    Total Students
                  </span>
                  <span className="text-[10px] text-gray-500 font-jetbrains uppercase tracking-wide">
                    Active Profiles
                  </span>
                </div>
              </div>
              <span className="text-2xl font-light font-inter text-[#111111]">
                {stats?.totalStudents || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100">
                  <UserCheck className="w-5 h-5 text-[#111111]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-[#111111] block mb-0.5">
                    Recently Active
                  </span>
                  <span className="text-[10px] text-gray-500 font-jetbrains uppercase tracking-wide">
                    Last 24h
                  </span>
                </div>
              </div>
              <span className="text-2xl font-light font-inter text-gray-300">
                --
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-gray-100 bg-[#FAFAFA]">
            <div className="flex flex-col gap-2 text-center py-4">
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.15em] text-gray-400">
                Student Growth
              </p>
              <div className="text-3xl font-light text-[#111111]">+0%</div>
              <p className="text-xs text-gray-500">
                Increase in the last 30 days
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminBentoCard>
  )
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
  delay = 0,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className={cn(
        'flex flex-col p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 group relative overflow-hidden',
        'animate-fade-in-up',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <span className="font-jetbrains text-[9px] uppercase tracking-[0.15em] text-gray-400 group-hover:text-gray-600 transition-colors">
          {title}
        </span>
        <div className="text-gray-300 group-hover:text-[#111111] transition-colors duration-300 bg-gray-50 p-1.5 rounded-md group-hover:bg-gray-100">
          {icon}
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <div className="text-2xl font-light tracking-tight text-[#111111] font-inter">
          {value}
        </div>
        {subtitle && (
          <p className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
