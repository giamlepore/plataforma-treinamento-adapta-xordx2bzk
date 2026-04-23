import { BrandingSettings } from '@/components/admin/BrandingSettings'
import { CoursesTable } from '@/components/admin/CoursesTable'
import { VisualSettings } from '@/components/admin/VisualSettings'
import { InviteMembers } from '@/components/admin/InviteMembers'
import { QuickStats } from '@/components/admin/QuickStats'
import { useOrganization } from '@/context/OrganizationContext'
import { AdminBentoCard } from '@/components/admin/AdminBentoCard'
import { LayoutDashboard, Users, Activity } from 'lucide-react'
import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentsTable } from '@/components/admin/StudentsTable'

export default function AdminDashboard() {
  const { organization } = useOrganization()

  useEffect(() => {
    // Apply admin-specific styles to body
    document.body.classList.add('admin-panel')
    return () => {
      document.body.classList.remove('admin-panel')
    }
  }, [])

  if (!organization) return null

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#111111] font-sans">
      <div className="max-w-[1600px] mx-auto p-6 md:p-10">
        <header className="mb-8 md:mb-12 flex items-end justify-between border-b border-gray-200 pb-6">
          <div>
            <h4 className="font-jetbrains text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
              Logged in as Admin
            </h4>
            <h1 className="text-3xl md:text-4xl font-inter font-light tracking-tight text-[#111111]">
              KERNEL <span className="text-gray-300 mx-2">//</span> ARCHITECTURE
            </h1>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-jetbrains text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              SYSTEM ONLINE
            </div>
            <div>v2.3.0</div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-6 mb-12">
          <TabsList className="bg-white border border-gray-200 p-1 w-full md:w-auto inline-flex justify-start overflow-x-auto overflow-y-hidden h-auto">
            <TabsTrigger value="overview" className="px-6 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="px-6 py-2">
              Courses
            </TabsTrigger>
            <TabsTrigger value="students" className="px-6 py-2">
              Students
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="focus-visible:outline-none animate-fade-in"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <BrandingSettings colSpan={2} />
              <VisualSettings colSpan={2} />
              <QuickStats colSpan={4} />
              <InviteMembers />
            </div>
          </TabsContent>

          <TabsContent
            value="courses"
            className="focus-visible:outline-none animate-fade-in"
          >
            <CoursesTable />
          </TabsContent>

          <TabsContent
            value="students"
            className="focus-visible:outline-none animate-fade-in"
          >
            <StudentsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
