import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash, Edit, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
  duration: string
  is_test: boolean
  order_index: number
  video_url?: string
}

interface Module {
  id: string
  title: string
  order_index: number
  lessons: Lesson[]
}

export function CurriculumManager({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [newModuleTitle, setNewModuleTitle] = useState('')

  // Lesson Edit State
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(
    null,
  )
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  const fetchCurriculum = async () => {
    const { data: mods, error } = await supabase
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('order_index')

    if (mods && !error) {
      const sorted = mods.map((m: any) => ({
        ...m,
        lessons: m.lessons.sort(
          (a: any, b: any) => a.order_index - b.order_index,
        ),
      }))
      setModules(sorted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCurriculum()
  }, [courseId])

  const addModule = async () => {
    if (!newModuleTitle) return
    await supabase
      .from('modules')
      .insert({
        course_id: courseId,
        title: newModuleTitle,
        order_index: modules.length,
      })
    setNewModuleTitle('')
    fetchCurriculum()
  }

  const deleteModule = async (id: string) => {
    if (!confirm('Delete module?')) return
    await supabase.from('modules').delete().eq('id', id)
    fetchCurriculum()
  }

  const saveLesson = async () => {
    if (!editingLesson || !activeModuleId) return

    const payload = {
      title: editingLesson.title,
      duration: editingLesson.duration,
      is_test: editingLesson.is_test,
      video_url: editingLesson.video_url,
      module_id: activeModuleId,
    }

    if (editingLesson.id) {
      await supabase.from('lessons').update(payload).eq('id', editingLesson.id)
    } else {
      const currentLessons =
        modules.find((m) => m.id === activeModuleId)?.lessons || []
      await supabase
        .from('lessons')
        .insert({ ...payload, order_index: currentLessons.length })
    }
    setEditingLesson(null)
    setActiveModuleId(null)
    fetchCurriculum()
  }

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete lesson?')) return
    await supabase.from('lessons').delete().eq('id', id)
    fetchCurriculum()
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="New Module Title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
        />
        <Button onClick={addModule}>
          <Plus className="w-4 h-4 mr-2" /> Add Module
        </Button>
      </div>

      <Accordion type="multiple" className="w-full space-y-2">
        {modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border rounded-lg bg-gray-50 px-4"
          >
            <div className="flex items-center justify-between py-2">
              <AccordionTrigger className="hover:no-underline">
                {module.title}
              </AccordionTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteModule(module.id)}
              >
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <AccordionContent>
              <div className="space-y-2 pl-4 border-l-2 border-gray-200 ml-2 mb-4">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{lesson.title}</span>
                      <span className="text-xs text-gray-500">
                        {lesson.duration} {lesson.is_test ? '(Test)' : ''}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingLesson(lesson)
                          setActiveModuleId(module.id)
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteLesson(lesson.id)}
                      >
                        <Trash className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    setEditingLesson({})
                    setActiveModuleId(module.id)
                  }}
                >
                  <Plus className="w-3 h-3 mr-2" /> Add Lesson
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog
        open={!!editingLesson}
        onOpenChange={(open) => !open && setEditingLesson(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLesson?.id ? 'Edit Lesson' : 'Add Lesson'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editingLesson?.title || ''}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={editingLesson?.duration || ''}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                placeholder="00:00"
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={editingLesson?.video_url || ''}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    video_url: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_test"
                checked={editingLesson?.is_test || false}
                onCheckedChange={(c) =>
                  setEditingLesson((prev) => ({ ...prev, is_test: !!c }))
                }
              />
              <Label htmlFor="is_test">Is a Test/Quiz</Label>
            </div>
            <Button onClick={saveLesson} className="w-full">
              Save Lesson
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
