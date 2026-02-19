import { BrandingForm } from '@/components/admin/BrandingForm'
import { CoursesTable } from '@/components/admin/CoursesTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOrganization } from '@/context/OrganizationContext'

export default function AdminDashboard() {
  const { organization } = useOrganization()

  if (!organization) return null

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-white/60">
          Manage your organization settings and content.
        </p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-white/10 text-white border border-white/10">
          <TabsTrigger
            value="branding"
            className="data-[state=active]:bg-brand-green"
          >
            Branding
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-brand-green"
          >
            Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <BrandingForm />
        </TabsContent>

        <TabsContent value="courses">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <CoursesTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
