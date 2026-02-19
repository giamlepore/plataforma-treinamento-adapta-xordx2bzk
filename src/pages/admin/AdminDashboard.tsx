import { BrandingSettings } from '@/components/admin/BrandingSettings'
import { CoursesTable } from '@/components/admin/CoursesTable'
import { VisualSettings } from '@/components/admin/VisualSettings'
import { useOrganization } from '@/context/OrganizationContext'
import { LayoutDashboard, Users, Activity } from 'lucide-react'
import { AdminBentoCard } from '@/components/admin/AdminBentoCard'
import { useEffect } from 'react'

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Row 1 */}
          <BrandingSettings />

          <VisualSettings />

          <AdminBentoCard title="QUICK STATS" subtitle="Overview" colSpan={1}>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Platform</span>
                </div>
                <span className="text-xs font-mono text-green-600">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Students</span>
                </div>
                <span className="text-xs font-mono">1,248</span>
              </div>
            </div>
          </AdminBentoCard>

          {/* Row 2 */}
          <CoursesTable />
        </div>
      </div>
    </div>
  )
}
