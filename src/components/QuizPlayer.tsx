import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export function QuizPlayer({
  lessonId,
  onComplete,
}: {
  lessonId: string
  onComplete: () => void
}) {
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
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
    load()
    setAnswers({})
    setSubmitted(false)
    setScore(null)
  }, [lessonId])

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      return toast.error('Please answer all questions before submitting.')
    }

    let correctCount = 0
    questions.forEach((q) => {
      const selectedOptId = answers[q.id]
      const opt = q.quiz_options.find((o: any) => o.id === selectedOptId)
      if (opt?.is_correct) correctCount++
    })

    const calculatedScore = (correctCount / questions.length) * 10
    setScore(calculatedScore)
    setSubmitted(true)

    if (user) {
      const { error } = await supabase.from('user_progress').upsert(
        {
          profile_id: user.id,
          lesson_id: lessonId,
          is_completed: true,
          score: calculatedScore,
          last_watched_at: new Date().toISOString(),
        },
        { onConflict: 'profile_id,lesson_id' },
      )

      if (!error) {
        onComplete()
      } else {
        toast.error('Failed to save your score, but quiz completed.')
      }
    }
  }

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium">
        No questions have been added to this quiz yet.
      </div>
    )
  }

  return (
    <div className="p-8 md:p-12 max-w-3xl mx-auto w-full space-y-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold font-grotesk tracking-tight text-[#111111]">
          Quiz Assessment
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Answer the questions below to test your knowledge.
        </p>
      </div>

      {submitted && score !== null && (
        <div
          className={`p-6 rounded-xl mb-8 animate-slide-down ${score >= 6 ? 'bg-green-50 text-green-900 border border-green-200' : 'bg-red-50 text-red-900 border border-red-200'}`}
        >
          <h3 className="text-xl font-bold mb-2 font-grotesk">
            Quiz Completed!
          </h3>
          <p className="text-lg">
            Your final score:{' '}
            <strong className="font-mono text-2xl ml-2">
              {score.toFixed(1)} / 10.0
            </strong>
          </p>
          {score < 6 && (
            <p className="text-sm mt-2 opacity-80">
              You might want to review the lesson and try again.
            </p>
          )}
          {score >= 6 && (
            <p className="text-sm mt-2 opacity-80">
              Great job! You can proceed to the next lesson.
            </p>
          )}
        </div>
      )}

      <div className="space-y-8">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="bg-gray-50/50 p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="font-semibold text-lg mb-6 text-[#111111] leading-relaxed">
              <span className="text-gray-400 mr-2">{i + 1}.</span>{' '}
              {q.question_text}
            </p>
            <RadioGroup
              disabled={submitted}
              value={answers[q.id] || ''}
              onValueChange={(v) =>
                setAnswers((prev) => ({ ...prev, [q.id]: v }))
              }
              className="space-y-3"
            >
              {q.quiz_options.map((opt: any) => {
                let optClass =
                  'flex items-center space-x-3 p-4 rounded-lg border bg-white cursor-pointer transition-all hover:border-gray-300'
                if (submitted) {
                  optClass =
                    'flex items-center space-x-3 p-4 rounded-lg border bg-white' // reset hover
                  if (opt.is_correct)
                    optClass +=
                      ' border-green-500 bg-green-50/50 shadow-[0_0_0_1px_rgba(34,197,94,1)]'
                  else if (answers[q.id] === opt.id)
                    optClass +=
                      ' border-red-500 bg-red-50/50 shadow-[0_0_0_1px_rgba(239,68,68,1)]'
                } else if (answers[q.id] === opt.id) {
                  optClass += ' border-[#111111] shadow-[0_0_0_1px_#111111]'
                }
                return (
                  <div key={opt.id} className={optClass}>
                    <RadioGroupItem
                      value={opt.id}
                      id={opt.id}
                      className={
                        submitted && opt.is_correct
                          ? 'text-green-600 border-green-600'
                          : ''
                      }
                    />
                    <Label
                      htmlFor={opt.id}
                      className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-100"
                    >
                      {opt.option_text}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-base font-semibold bg-[#111111] text-white hover:bg-[#333333] shadow-md transition-all"
          >
            Submit Answers & See Score
          </Button>
        </div>
      )}
    </div>
  )
}
