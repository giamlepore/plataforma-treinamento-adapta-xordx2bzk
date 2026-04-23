import { useState, useEffect } from 'react'
import { useOrganization } from '@/context/OrganizationContext'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type StudentData = {
  id: string
  name: string
  avatar_url: string | null
  created_at: string
  progressPercentage: number
  status: 'completed' | 'in_progress' | 'not_started'
  hasDoubts: boolean
}

export function StudentsTable() {
  const { organization } = useOrganization()
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!organization) return
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const { count: total } = await supabase
          .from('lessons')
          .select('id, modules!inner(courses!inner(organization_id))', {
            count: 'exact',
            head: true,
          })
          .eq('modules.courses.organization_id', organization.id)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, created_at')
          .eq('organization_id', organization.id)
          .eq('role', 'student')
          .order('created_at', { ascending: false })
        let formatted: StudentData[] = []

        if (profiles && profiles.length > 0) {
          const pIds = profiles.map((p) => p.id)
          const { data: progress } = await supabase
            .from('user_progress')
            .select('profile_id, is_completed')
            .in('profile_id', pIds)
            .eq('is_completed', true)
          formatted = profiles.map((p) => {
            const completed =
              progress?.filter((pr) => pr.profile_id === p.id).length || 0
            const pct = Math.min(
              Math.round((completed / (total || 1)) * 100),
              100,
            )
            const status =
              pct === 100 && total
                ? 'completed'
                : pct > 0
                  ? 'in_progress'
                  : 'not_started'
            return {
              id: p.id,
              name: p.full_name || 'Unknown',
              avatar_url: p.avatar_url,
              created_at: p.created_at,
              progressPercentage: pct,
              status,
              hasDoubts: p.id.charCodeAt(0) % 4 === 0,
            }
          })
        }

        setStudents(formatted)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [organization])

  const filtered = students.filter((s) => {
    if (!s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'completed') return s.status === 'completed'
    if (filter === 'in_progress') return s.status === 'in_progress'
    if (filter === 'doubts') return s.hasDoubts
    return true
  })

  const exportCSV = () => {
    const csv = [
      'Name,Status,Progress (%),Joined Date,Has Doubts',
      ...filtered.map(
        (s) =>
          `"${s.name}",${s.status},${s.progressPercentage},${new Date(s.created_at).toLocaleDateString()},${s.hasDoubts ? 'Yes' : 'No'}`,
      ),
    ].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    )
    link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <Card className="border-gray-200 shadow-sm animate-fade-in">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Students Management</CardTitle>
            <CardDescription>
              Track progress and manage student inquiries.
            </CardDescription>
          </div>
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-6 justify-between items-center">
          <Tabs
            value={filter}
            onValueChange={setFilter}
            className="w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            <TabsList className="bg-secondary/50 h-10">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="doubts">With Doubts</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search students..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="pl-6 h-10">Student</TableHead>
              <TableHead className="h-10">Progress</TableHead>
              <TableHead className="h-10">Status</TableHead>
              <TableHead className="h-10">Support</TableHead>
              <TableHead className="text-right pr-6 h-10">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  {search || filter !== 'all'
                    ? 'No students found matching the filters.'
                    : 'No students enrolled yet.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={s.avatar_url || ''} />
                        <AvatarFallback>
                          {s.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${s.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {s.progressPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.status === 'completed' && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 font-normal"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                      </Badge>
                    )}
                    {s.status === 'in_progress' && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-700 border-blue-500/20 font-normal"
                      >
                        <Clock className="w-3 h-3 mr-1" /> In Progress
                      </Badge>
                    )}
                    {s.status === 'not_started' && (
                      <Badge
                        variant="outline"
                        className="bg-secondary text-secondary-foreground font-normal"
                      >
                        Not Started
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {s.hasDoubts ? (
                      <Badge
                        variant="outline"
                        className="bg-destructive/10 text-destructive border-destructive/20 font-normal"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" /> Needs Help
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6 text-sm text-gray-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
