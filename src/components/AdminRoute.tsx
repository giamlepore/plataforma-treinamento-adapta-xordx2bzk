import { useAuth } from '@/hooks/use-auth'
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export const AdminRoute = () => {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setIsAdmin(false)
      setChecking(false)
      return
    }

    const checkRole = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!error && data && data.role === 'admin') {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
      setChecking(false)
    }

    checkRole()
  }, [user, authLoading])

  if (authLoading || checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
