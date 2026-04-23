import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash, Plus, ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'

export function QuizManagerDialog({ lessonId, open, onOpenChange }: any) {
  const [questions, setQuestions] = useState<any[]>([])
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null)

  const fetchQuestions = async () => {
    if (!lessonId) return
    const { data } = await supabase
      .from('quiz_questions')
      .select('*, quiz_options(*)')
      .eq('lesson_id', lessonId)
      .order('order_index')

    if (data) {
      setQuestions(
        data.map((q) => ({
          ...q,
          quiz_options: q.quiz_options.sort(
            (a: any, b: any) => a.order_index - b.order_index,
          ),
        })),
      )
    }
  }

  useEffect(() => {
    if (open) {
      fetchQuestions()
      setEditingQuestion(null)
    }
  }, [open, lessonId])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return
    await supabase.from('quiz_questions').delete().eq('id', id)
    fetchQuestions()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? 'Edit Question' : 'Manage Quiz Questions'}
          </DialogTitle>
        </DialogHeader>

        {editingQuestion ? (
          <QuestionEditor
            lessonId={lessonId}
            question={editingQuestion.id ? editingQuestion : null}
            onSave={() => {
              setEditingQuestion(null)
              fetchQuestions()
            }}
            onCancel={() => setEditingQuestion(null)}
          />
        ) : (
          <div className="space-y-4 py-4">
            {questions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4 italic">
                No questions yet. Add one to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <span className="font-medium text-sm truncate flex-1 mr-4">
                      {idx + 1}. {q.question_text}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingQuestion(q)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              className="w-full bg-[#111111] hover:bg-[#333333] text-white"
              onClick={() =>
                setEditingQuestion({ question_text: '', quiz_options: [] })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function QuestionEditor({ lessonId, question, onSave, onCancel }: any) {
  const [text, setText] = useState(question?.question_text || '')
  const [options, setOptions] = useState<any[]>(
    question?.quiz_options?.length
      ? question.quiz_options
      : [
          { id: 'new-1', option_text: '', is_correct: true },
          { id: 'new-2', option_text: '', is_correct: false },
        ],
  )

  const handleSave = async () => {
    if (!text.trim()) return toast.error('Question text is required')
    if (options.length < 2)
      return toast.error('At least 2 options are required')
    if (!options.some((o) => o.is_correct))
      return toast.error('Mark one option as correct')

    let qId = question?.id
    if (!qId) {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert({ lesson_id: lessonId, question_text: text })
        .select()
        .single()
      if (error) return toast.error('Error saving question')
      qId = data.id
    } else {
      await supabase
        .from('quiz_questions')
        .update({ question_text: text })
        .eq('id', qId)
      await supabase.from('quiz_options').delete().eq('question_id', qId)
    }

    const optsToInsert = options.map((o, i) => ({
      question_id: qId,
      option_text: o.option_text,
      is_correct: o.is_correct,
      order_index: i,
    }))
    const { error: optErr } = await supabase
      .from('quiz_options')
      .insert(optsToInsert)
    if (optErr) return toast.error('Error saving options')

    toast.success('Question saved successfully')
    onSave()
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Back to questions
        </span>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-gray-500 uppercase tracking-wide">
          Question Text
        </Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter question..."
          className="bg-gray-50"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-xs text-gray-500 uppercase tracking-wide">
          Options (Select the correct one)
        </Label>
        {options.map((opt, idx) => (
          <div key={opt.id} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setOptions(
                  options.map((o, i) => ({ ...o, is_correct: i === idx })),
                )
              }
              className="text-gray-400 hover:text-green-600 transition-colors"
            >
              {opt.is_correct ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <Input
              value={opt.option_text}
              onChange={(e) => {
                const newOpts = [...options]
                newOpts[idx].option_text = e.target.value
                setOptions(newOpts)
              }}
              placeholder={`Option ${idx + 1}`}
              className="bg-gray-50"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOptions(options.filter((_, i) => i !== idx))}
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setOptions([
              ...options,
              { id: `new-${Date.now()}`, option_text: '', is_correct: false },
            ])
          }
          className="mt-2 border-dashed text-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Option
        </Button>
      </div>
      <Button
        onClick={handleSave}
        className="w-full bg-[#111111] hover:bg-[#333333] text-white"
      >
        Save Question
      </Button>
    </div>
  )
}
