import { useState, useEffect } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { toast } from 'sonner'

export function BrandingForm() {
  const { organization, refreshOrganization } = useOrganization()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    header_title: '',
    header_subtitle: '',
    hero_title: '',
    hero_subtitle: '',
    platform_bg_color: '',
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
        platform_bg_color: organization.platform_bg_color || '#1a5c48',
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
      toast.success('Branding updated successfully')
      await refreshOrganization()
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Branding</CardTitle>
        <CardDescription>
          Customize how your platform looks and feels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Header Title & Color</Label>
              <div className="flex gap-2">
                <Input
                  name="header_title"
                  value={formData.header_title}
                  onChange={handleChange}
                  placeholder="BETSMARTER"
                  className="flex-1"
                />
                <Input
                  type="color"
                  name="header_title_color"
                  value={formData.header_title_color || '#ffffff'}
                  onChange={handleChange}
                  className="w-12 h-10 p-1 cursor-pointer shrink-0"
                  title="Header Title Color"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Header Subtitle & Color</Label>
              <div className="flex gap-2">
                <Input
                  name="header_subtitle"
                  value={formData.header_subtitle}
                  onChange={handleChange}
                  placeholder="Course Dashboard"
                  className="flex-1"
                />
                <Input
                  type="color"
                  name="header_subtitle_color"
                  value={formData.header_subtitle_color || '#94a3b8'}
                  onChange={handleChange}
                  className="w-12 h-10 p-1 cursor-pointer shrink-0"
                  title="Header Subtitle Color"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hero Title & Color</Label>
            <div className="flex gap-2">
              <Input
                name="hero_title"
                value={formData.hero_title}
                onChange={handleChange}
                placeholder="Advance Your Betting Knowledge"
                className="flex-1"
              />
              <Input
                type="color"
                name="hero_title_color"
                value={formData.hero_title_color || '#ffffff'}
                onChange={handleChange}
                className="w-12 h-10 p-1 cursor-pointer shrink-0"
                title="Hero Title Color"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hero Subtitle & Color</Label>
            <div className="flex gap-2 items-start">
              <Textarea
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleChange}
                placeholder="Access professional-grade courses..."
                className="flex-1"
              />
              <Input
                type="color"
                name="hero_subtitle_color"
                value={formData.hero_subtitle_color || '#cbd5e1'}
                onChange={handleChange}
                className="w-12 h-10 p-1 cursor-pointer shrink-0"
                title="Hero Subtitle Color"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform_bg_color">Platform Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="platform_bg_color"
                name="platform_bg_color"
                type="color"
                value={formData.platform_bg_color || '#1a5c48'}
                onChange={handleChange}
                className="w-12 h-10 p-1 cursor-pointer shrink-0"
              />
              <Input
                name="platform_bg_color"
                value={formData.platform_bg_color}
                onChange={handleChange}
                placeholder="#1a5c48"
                className="flex-1"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
