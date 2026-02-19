import { useEffect, useState } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { getOrgStats, OrgStats } from '@/services/stats'
import { AdminBentoCard } from './AdminBentoCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Star,
  CheckCircle,
  Activity,
  UserCheck,
} from 'lucide-react'

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
      <Tabs defaultValue="dashboard" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100/50">
          <TabsTrigger value="dashboard" className="text-xs">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="platform" className="text-xs">
            Platform
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs">
            Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Students"
              value={loading ? '...' : stats?.totalStudents.toString() || '0'}
              icon={<Users className="w-4 h-4 text-blue-500" />}
            />
            <StatsCard
              title="Total Courses"
              value={loading ? '...' : stats?.totalCourses.toString() || '0'}
              icon={<BookOpen className="w-4 h-4 text-purple-500" />}
            />
            <StatsCard
              title="Content Volume"
              value={loading ? '...' : stats?.totalLessons.toString() || '0'}
              subtitle="Lessons"
              icon={<FileText className="w-4 h-4 text-indigo-500" />}
            />
            <StatsCard
              title="Avg. Rating"
              value={loading ? '...' : stats?.avgRating.toFixed(1) || 'N/A'}
              icon={<Star className="w-4 h-4 text-yellow-500" />}
            />
            <StatsCard
              title="Student Progress"
              value={
                loading ? '...' : stats?.completedLessons.toString() || '0'
              }
              subtitle="Completed"
              icon={<CheckCircle className="w-4 h-4 text-green-500" />}
            />
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-700">
                Engagement Overview
              </h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your organization has {stats?.totalStudents || 0} active students
              enrolled across {stats?.totalCourses || 0} courses. Students have
              completed a total of {stats?.completedLessons || 0} lessons, with
              an average course rating of {stats?.avgRating.toFixed(1) || '0.0'}
              /5.0.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="platform" className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <LayoutDashboard className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <span className="text-sm font-medium block">
                  Platform Status
                </span>
                <span className="text-xs text-gray-500">
                  System Availability
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono text-green-600 font-medium">
                ONLINE
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <span className="text-sm font-medium block">API Health</span>
                <span className="text-xs text-gray-500">Response Time</span>
              </div>
            </div>
            <span className="text-xs font-mono text-gray-600">24ms</span>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <span className="text-sm font-medium block">
                  Total Students
                </span>
                <span className="text-xs text-gray-500">Active Profiles</span>
              </div>
            </div>
            <span className="text-lg font-mono font-medium">
              {stats?.totalStudents || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <UserCheck className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <span className="text-sm font-medium block">
                  Recently Active
                </span>
                <span className="text-xs text-gray-500">Last 24h</span>
              </div>
            </div>
            <span className="text-lg font-mono font-medium text-gray-400">
              --
            </span>
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
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
}) {
  return (
    <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-bold text-gray-900 font-mono">
          {value}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
