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
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

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
    if (!confirm('Are you sure you want to delete this course?')) return

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
    const { data, error } = await supabase
      .from('courses')
      .insert({
        organization_id: organization.id,
        title: 'New Course',
        description: 'Course description',
        label: 'New',
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to create course')
    } else {
      toast.success('Course created')
      fetchCourses()
    }
  }

  if (loading) return <div>Loading courses...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Courses</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-muted-foreground"
                >
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor_name || '-'}</TableCell>
                  <TableCell>{course.label || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
