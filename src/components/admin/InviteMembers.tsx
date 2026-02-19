import { useState } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { AdminBentoCard } from './AdminBentoCard'
import { Copy, CheckCircle2 } from 'lucide-react'

export function InviteMembers() {
  const { organization } = useOrganization()
  const [copied, setCopied] = useState(false)

  if (!organization) return null

  const inviteLink = `${window.location.origin}/signup?org=${organization.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    toast.success('Invitation link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AdminBentoCard
      title="INVITE STUDENTS"
      subtitle="Share Access Link"
      colSpan={4}
    >
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-gray-500 flex-1">
          Share this unique link to invite students directly to your
          organization. They will bypass the organization creation step and join
          as students.
        </p>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            readOnly
            value={inviteLink}
            className="bg-gray-50 border-gray-200 text-black font-mono text-xs w-full md:w-[320px] focus-visible:ring-0"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            onClick={handleCopy}
            className="bg-[#111111] hover:bg-[#333333] text-white shrink-0 h-10"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </div>
      </div>
    </AdminBentoCard>
  )
}
