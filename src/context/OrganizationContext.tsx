import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface Organization {
  id: string
  name: string
  slug: string
  header_title?: string
  header_subtitle?: string
  hero_title?: string
  hero_subtitle?: string
  platform_bg_color?: string
  logo_url?: string
  header_title_color?: string
  header_subtitle_color?: string
  hero_title_color?: string
  hero_subtitle_color?: string
}

interface OrganizationContextType {
  organization: Organization | null
  loading: boolean
  refreshOrganization: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
)

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    )
  }
  return context
}

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrganization = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // First get profile to find org id
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (profile?.organization_id) {
        const { data: org } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single()

        if (org) setOrganization(org)
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganization()
  }, [user])

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        loading,
        refreshOrganization: fetchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}
