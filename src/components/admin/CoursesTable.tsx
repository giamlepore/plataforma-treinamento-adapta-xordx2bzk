import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useOrganization } from '@/context/OrganizationContext'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminBentoCard } from './AdminBentoCard'
import { cn } from '@/lib/utils'

export function CoursesTable() {
  const { organization } = useOrganization()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourses = async () => {
    if (!organization) return
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('organization_id', organization.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCourses(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [organization])

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this course? This action cannot be undone.',
      )
    )
      return

    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete course')
    } else {
      toast.success('Course deleted')
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const handleCreate = async () => {
    if (!organization) return

    const newCourse = {
      organization_id: organization.id,
      title: 'Untitled Course',
      description: 'Add a description...',
      label: 'New',
      instructor_name: 'Instructor',
      duration_text: '0h 0m',
      image_color: '#1a5c48',
    }

    const { data, error } = await supabase
      .from('courses')
      .insert(newCourse)
      .select()
      .single()

    if (error) {
      toast.error('Failed to create course')
    } else {
      toast.success('Course created')
      fetchCourses()
    }
  }

  return (
    <AdminBentoCard
      title="CONTENT MANAGEMENT"
      subtitle="Active Courses"
      colSpan={4}
      action={
        <Button
          onClick={handleCreate}
          className="bg-[#111111] hover:bg-[#333333] text-white text-xs px-4 h-8"
        >
          <Plus className="w-3 h-3 mr-2" />
          New Course
        </Button>
      }
    >
      <div className="mt-6 rounded-lg border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="w-[300px] text-xs font-semibold uppercase text-gray-500">
                Title
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-gray-500">
                Instructor
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-gray-500">
                Label
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-gray-500 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" />
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500"
                >
                  No courses found. Create your first course.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow
                  key={course.id}
                  className="border-gray-100 hover:bg-gray-50/50 group"
                >
                  <TableCell className="font-medium text-[#111111]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-mono"
                        style={{ backgroundColor: course.image_color }}
                      >
                        {course.title.charAt(0)}
                      </div>
                      {course.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {course.instructor_name || '-'}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-gray-100 text-gray-600 uppercase">
                      {course.label || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/courses/${course.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white hover:border border-gray-200"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-600" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminBentoCard>
  )
}
