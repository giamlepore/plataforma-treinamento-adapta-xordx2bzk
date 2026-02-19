import { useState, useEffect } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { AdminBentoCard } from './AdminBentoCard'
import { Save } from 'lucide-react'

interface BrandingSettingsProps {
  colSpan?: 1 | 2 | 3 | 4
}

export function BrandingSettings({ colSpan = 2 }: BrandingSettingsProps) {
  const { organization, refreshOrganization } = useOrganization()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    header_title: '',
    header_subtitle: '',
    hero_title: '',
    hero_subtitle: '',
  })

  useEffect(() => {
    if (organization) {
      setFormData({
        header_title: organization.header_title || '',
        header_subtitle: organization.header_subtitle || '',
        hero_title: organization.hero_title || '',
        hero_subtitle: organization.hero_subtitle || '',
      })
    }
  }, [organization])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization) return
    setLoading(true)

    const { error } = await supabase
      .from('organizations')
      .update(formData)
      .eq('id', organization.id)

    if (error) {
      toast.error('Failed to update branding')
    } else {
      toast.success('Branding settings saved')
      await refreshOrganization()
    }
    setLoading(false)
  }

  return (
    <AdminBentoCard
      title="BRANDING CONFIG"
      subtitle="Platform Identity"
      colSpan={colSpan}
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Header Title</Label>
            <Input
              name="header_title"
              value={formData.header_title}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 text-black focus:ring-black/10"
              placeholder="BETSMARTER"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Header Subtitle</Label>
            <Input
              name="header_subtitle"
              value={formData.header_subtitle}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 text-black focus:ring-black/10"
              placeholder="Dashboard"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Hero Title</Label>
          <Input
            name="hero_title"
            value={formData.hero_title}
            onChange={handleChange}
            className="bg-gray-50 border-gray-200 text-black font-medium focus:ring-black/10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Hero Subtitle</Label>
          <Textarea
            name="hero_subtitle"
            value={formData.hero_subtitle}
            onChange={handleChange}
            className="bg-gray-50 border-gray-200 text-black min-h-[80px] resize-none focus:ring-black/10"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#111111] hover:bg-[#333333] text-white"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminBentoCard>
  )
}
