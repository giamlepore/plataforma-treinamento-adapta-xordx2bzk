import { useState, useEffect } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { AdminBentoCard } from './AdminBentoCard'
import { Palette } from 'lucide-react'

interface VisualSettingsProps {
  colSpan?: 1 | 2 | 3 | 4
}

export function VisualSettings({ colSpan = 1 }: VisualSettingsProps) {
  const { organization, refreshOrganization } = useOrganization()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    logo_url: '',
    platform_bg_color: '#1a5c48',
  })

  useEffect(() => {
    if (organization) {
      setFormData({
        logo_url: organization.logo_url || '',
        platform_bg_color: organization.platform_bg_color || '#1a5c48',
      })
    }
  }, [organization])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error('Failed to update visuals')
    } else {
      toast.success('Visual settings saved')
      await refreshOrganization()
    }
    setLoading(false)
  }

  return (
    <AdminBentoCard
      title="VISUAL CONFIG"
      subtitle="Style & Assets"
      colSpan={colSpan}
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Logo URL</Label>
          <Input
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            className="bg-gray-50 border-gray-200 text-black text-xs"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Platform Background</Label>
          <div className="flex gap-3">
            <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:scale-105 transition-transform">
              <input
                type="color"
                name="platform_bg_color"
                value={formData.platform_bg_color}
                onChange={handleChange}
                className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer border-none"
              />
            </div>
            <Input
              name="platform_bg_color"
              value={formData.platform_bg_color}
              onChange={handleChange}
              className="flex-1 bg-gray-50 border-gray-200 text-black font-mono"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            className="w-full border-gray-200 text-gray-900 bg-white hover:bg-gray-50 hover:text-black"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Palette className="w-4 h-4 mr-2" />
                Update Theme
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminBentoCard>
  )
}
