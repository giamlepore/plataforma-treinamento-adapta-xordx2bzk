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
  })

  useEffect(() => {
    if (organization) {
      setFormData({
        header_title: organization.header_title || '',
        header_subtitle: organization.header_subtitle || '',
        hero_title: organization.hero_title || '',
        hero_subtitle: organization.hero_subtitle || '',
        platform_bg_color: organization.platform_bg_color || '#1a5c48',
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
              <Label htmlFor="header_title">Header Title</Label>
              <Input
                id="header_title"
                name="header_title"
                value={formData.header_title}
                onChange={handleChange}
                placeholder="BETSMARTER"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header_subtitle">Header Subtitle</Label>
              <Input
                id="header_subtitle"
                name="header_subtitle"
                value={formData.header_subtitle}
                onChange={handleChange}
                placeholder="Course Dashboard"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              name="hero_title"
              value={formData.hero_title}
              onChange={handleChange}
              placeholder="Advance Your Betting Knowledge"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleChange}
              placeholder="Access professional-grade courses..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform_bg_color">Platform Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="platform_bg_color"
                name="platform_bg_color"
                type="color"
                value={formData.platform_bg_color}
                onChange={handleChange}
                className="w-12 h-10 p-1 cursor-pointer"
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
