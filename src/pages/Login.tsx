import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Command, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const orgSlug = searchParams.get('org')
  const [inviteOrg, setInviteOrg] = useState<{
    id: string
    name: string
  } | null>(null)
  const [isFetchingOrg, setIsFetchingOrg] = useState(!!orgSlug)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    async function fetchOrg() {
      if (!orgSlug) return
      setIsFetchingOrg(true)
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', orgSlug)
        .single()

      if (!error && data) {
        setInviteOrg(data)
      } else {
        toast.error('Invalid or expired invitation link.')
      }
      setIsFetchingOrg(false)
    }
    fetchOrg()
  }, [orgSlug])

  // Apply admin/light theme styles to body for this page only
  useEffect(() => {
    // We add specific classes to override any global dark theme defaults on the body
    document.body.classList.add('bg-[#F7F7F7]')
    document.body.classList.add('text-[#111111]')
    return () => {
      document.body.classList.remove('bg-[#F7F7F7]')
      document.body.classList.remove('text-[#111111]')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signIn(email, password)
    setIsLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back // Access Granted')
      navigate('/')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signUp(
      email,
      password,
      fullName,
      orgName,
      inviteOrg?.id,
    )
    setIsLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(
        inviteOrg
          ? `Joined ${inviteOrg.name} // You can now log in`
          : 'Account created // You can now log in',
      )
    }
  }

  const defaultTab =
    location.pathname === '/signup' || orgSlug ? 'register' : 'login'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F7] p-4 font-sans text-[#111111] selection:bg-black selection:text-white">
      <div className="w-full max-w-[420px] animate-fade-in-up">
        {/* Header Branding */}
        <div className="mb-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#111111]">
            <Command className="w-5 h-5" />
            <span className="font-jetbrains font-medium text-sm tracking-widest uppercase">
              AUTH
            </span>
          </div>
          <h1 className="font-sans text-4xl font-light tracking-tight text-[#111111]">
            PLATAFORMA DE TREINAMENTOS
          </h1>
          <p className="font-jetbrains text-[10px] text-[#666666] uppercase tracking-wider">
            Secure Entry Point v2.3.0
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E5E5E5] p-2 rounded-2xl shadow-sm">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F7F7F7] p-1 rounded-xl h-auto">
              <TabsTrigger
                value="login"
                className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm text-[#666666] font-jetbrains text-[10px] uppercase tracking-wider transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:shadow-sm text-[#666666] font-jetbrains text-[10px] uppercase tracking-wider transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="px-6 pb-6 pt-2">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]"
                    >
                      Identity // Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@kernel.system"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#F7F7F7] border-transparent focus-visible:ring-0 focus-visible:border-[#111111] text-[#111111] h-10 placeholder:text-[#666666]/50 rounded-md transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]"
                    >
                      Security // Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#F7F7F7] border-transparent focus-visible:ring-0 focus-visible:border-[#111111] text-[#111111] h-10 rounded-md transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-[#111111] text-white hover:bg-[#111111]/90 h-10 text-[11px] uppercase tracking-wider font-jetbrains shadow-none"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Authenticate'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="px-6 pb-6 pt-2">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-name"
                      className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]"
                    >
                      Profile // Full Name
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-[#F7F7F7] border-transparent focus-visible:ring-0 focus-visible:border-[#111111] text-[#111111] h-10 placeholder:text-[#666666]/50 rounded-md transition-colors"
                    />
                  </div>

                  {isFetchingOrg ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="w-4 h-4 animate-spin text-[#666666]" />
                    </div>
                  ) : inviteOrg ? (
                    <div className="space-y-2 p-3 bg-[#111111]/5 rounded-md border border-[#111111]/10">
                      <p className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]">
                        Joining Workspace
                      </p>
                      <p className="font-sans font-medium text-[#111111]">
                        {inviteOrg.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-org"
                        className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]"
                      >
                        Workspace // Organization Name
                      </Label>
                      <Input
                        id="reg-org"
                        type="text"
                        placeholder="Acme Corp"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                        className="bg-[#F7F7F7] border-transparent focus-visible:ring-0 focus-visible:border-[#111111] text-[#111111] h-10 placeholder:text-[#666666]/50 rounded-md transition-colors"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-email"
                      className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]"
                    >
                      Identity // Email
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="user@kernel.system"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#F7F7F7] border-transparent focus-visible:ring-0 focus-visible:border-[#111111] text-[#111111] h-10 placeholder:text-[#666666]/50 rounded-md transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-password"
                      className="font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#666666]"
                    >
                      Security // Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#F7F7F7] border-transparent focus-visible:ring-0 focus-visible:border-[#111111] text-[#111111] h-10 rounded-md transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isFetchingOrg}
                  className="w-full rounded-full bg-[#111111] text-white hover:bg-[#111111]/90 h-10 text-[11px] uppercase tracking-wider font-jetbrains shadow-none"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Initialize Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center space-y-2">
          <p className="font-jetbrains text-[9px] text-[#666666] uppercase tracking-widest">
            Restricted Area // Authorized Personnel Only
          </p>
          <div className="flex justify-center gap-4 opacity-50">
            <div className="h-[1px] w-8 bg-[#111111]/20" />
            <div className="h-[1px] w-8 bg-[#111111]/20" />
            <div className="h-[1px] w-8 bg-[#111111]/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
