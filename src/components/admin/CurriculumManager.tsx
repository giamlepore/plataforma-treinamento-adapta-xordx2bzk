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
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash, Edit, Video, Clock, CheckCircle } from 'lucide-react'

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
  const [newModuleTitle, setNewModuleTitle] = useState('')
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
  }

  useEffect(() => {
    fetchCurriculum()
  }, [courseId])

  const addModule = async () => {
    if (!newModuleTitle) return
    await supabase.from('modules').insert({
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
    <div className="space-y-8">
      <div className="flex gap-4 items-end bg-gray-50 p-6 rounded-lg border border-gray-100">
        <div className="flex-1 space-y-2">
          <Label className="text-xs text-gray-500 uppercase tracking-wide">
            New Module
          </Label>
          <Input
            placeholder="Module Title (e.g., 'Introduction to Betting')"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="bg-white"
          />
        </div>
        <Button
          onClick={addModule}
          className="bg-[#111111] hover:bg-[#333333] text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-mono font-medium text-gray-600">
                  {index + 1}
                </span>
                <span className="font-medium text-[#111111]">
                  {module.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteModule(module.id)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              {module.lessons.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm italic">
                  No lessons in this module yet.
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between group bg-white border border-gray-100 hover:border-gray-300 p-3 rounded-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 rounded text-gray-400">
                          {lesson.is_test ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-[#111111]">
                            {lesson.title}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
                            <Clock className="w-3 h-3" />{' '}
                            {lesson.duration || '00:00'}
                            {lesson.is_test && (
                              <span className="text-blue-600 font-bold">
                                • TEST
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingLesson(lesson)
                            setActiveModuleId(module.id)
                          }}
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          <Trash className="w-3.5 h-3.5 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                onClick={() => {
                  setEditingLesson({})
                  setActiveModuleId(module.id)
                }}
              >
                <Plus className="w-3 h-3 mr-2" /> Add Lesson to "{module.title}"
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!editingLesson}
        onOpenChange={(open) => !open && setEditingLesson(null)}
      >
        <DialogContent className="sm:max-w-[500px] bg-white border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-[#111111] uppercase">
              {editingLesson?.id ? 'Edit Lesson' : 'Add New Lesson'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">
                Title
              </Label>
              <Input
                value={editingLesson?.title || ''}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Lesson Title"
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wide">
                  Duration (mm:ss)
                </Label>
                <Input
                  value={editingLesson?.duration || ''}
                  onChange={(e) =>
                    setEditingLesson((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="12:00"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center gap-3 h-10 px-3 w-full bg-gray-50 border border-gray-200 rounded-md">
                  <Checkbox
                    id="is_test"
                    checked={editingLesson?.is_test || false}
                    onCheckedChange={(c) =>
                      setEditingLesson((prev) => ({ ...prev, is_test: !!c }))
                    }
                  />
                  <Label
                    htmlFor="is_test"
                    className="cursor-pointer text-sm font-medium text-gray-700"
                  >
                    Is a Test/Quiz
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">
                Video URL
              </Label>
              <Input
                value={editingLesson?.video_url || ''}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    video_url: e.target.value,
                  }))
                }
                placeholder="https://..."
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <Button
              onClick={saveLesson}
              className="w-full bg-[#111111] hover:bg-[#333333] text-white"
            >
              Save Lesson
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
