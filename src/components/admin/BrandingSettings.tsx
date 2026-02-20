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
    header_title_color: '',
    header_subtitle_color: '',
    hero_title_color: '',
    hero_subtitle_color: '',
  })

  useEffect(() => {
    if (organization) {
      setFormData({
        header_title: organization.header_title || '',
        header_subtitle: organization.header_subtitle || '',
        hero_title: organization.hero_title || '',
        hero_subtitle: organization.hero_subtitle || '',
        header_title_color: organization.header_title_color || '',
        header_subtitle_color: organization.header_subtitle_color || '',
        hero_title_color: organization.hero_title_color || '',
        hero_subtitle_color: organization.hero_subtitle_color || '',
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
            <Label className="text-xs text-gray-500">
              Header Title & Color
            </Label>
            <div className="flex gap-2">
              <Input
                name="header_title"
                value={formData.header_title}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 text-black focus:ring-black/10 flex-1"
                placeholder="BETSMARTER"
              />
              <Input
                type="color"
                name="header_title_color"
                value={formData.header_title_color || '#ffffff'}
                onChange={handleChange}
                className="w-10 h-10 p-1 cursor-pointer bg-gray-50 border-gray-200 shrink-0"
                title="Header Title Color"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">
              Header Subtitle & Color
            </Label>
            <div className="flex gap-2">
              <Input
                name="header_subtitle"
                value={formData.header_subtitle}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 text-black focus:ring-black/10 flex-1"
                placeholder="Dashboard"
              />
              <Input
                type="color"
                name="header_subtitle_color"
                value={formData.header_subtitle_color || '#94a3b8'}
                onChange={handleChange}
                className="w-10 h-10 p-1 cursor-pointer bg-gray-50 border-gray-200 shrink-0"
                title="Header Subtitle Color"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Hero Title & Color</Label>
          <div className="flex gap-2">
            <Input
              name="hero_title"
              value={formData.hero_title}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 text-black font-medium focus:ring-black/10 flex-1"
            />
            <Input
              type="color"
              name="hero_title_color"
              value={formData.hero_title_color || '#ffffff'}
              onChange={handleChange}
              className="w-10 h-10 p-1 cursor-pointer bg-gray-50 border-gray-200 shrink-0"
              title="Hero Title Color"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">Hero Subtitle & Color</Label>
          <div className="flex gap-2 items-start">
            <Textarea
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 text-black min-h-[80px] resize-none focus:ring-black/10 flex-1"
            />
            <Input
              type="color"
              name="hero_subtitle_color"
              value={formData.hero_subtitle_color || '#cbd5e1'}
              onChange={handleChange}
              className="w-10 h-10 p-1 cursor-pointer bg-gray-50 border-gray-200 shrink-0"
              title="Hero Subtitle Color"
            />
          </div>
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
