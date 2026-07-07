"use client"

import { CheckCircle2, XCircle, RotateCcw, Plus, Trophy, Target, Clock } from "lucide-react"
import type { Question } from "./exam-questions"

interface ExamResultsProps {
  documentName: string
  questions: Question[]
  answers: (number | null)[]
  elapsedSeconds: number
  onRetry: () => void
  onNew: () => void
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

function getScoreLabel(pct: number): { label: string; color: string; bg: string } {
  if (pct >= 90) return { label: "Excelente", color: "text-[#B0BA92]", bg: "bg-[#B0BA92]/15" }
  if (pct >= 70) return { label: "Muy bien", color: "text-[#5C6B8A]", bg: "bg-[#5C6B8A]/10" }
  if (pct >= 50) return { label: "Aprobado", color: "text-amber-600", bg: "bg-amber-50" }
  return { label: "Necesitas repasar", color: "text-red-500", bg: "bg-red-50" }
}

export function ExamResults({ documentName, questions, answers, elapsedSeconds, onRetry, onNew }: ExamResultsProps) {
  const correct = answers.filter((a, i) => a === questions[i]?.correctIndex).length
  const total = questions.length
  const pct = Math.round((correct / total) * 100)
  const scoreInfo = getScoreLabel(pct)

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className="relative rounded-2xl overflow-hidden p-8 mb-6 flex items-center gap-8"
        style={{ background: "linear-gradient(135deg, #2F3A55 0%, #5C6B8A 100%)" }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx="700" cy="-20" r="150" fill="#B0BA92" />
          <circle cx="50" cy="220" r="120" fill="#B0BA92" />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-[#B0BA92]/40 bg-white/10 shrink-0">
          <span className="text-4xl font-bold text-[#B0BA92]">{pct}%</span>
          <span className="text-xs text-white/60 mt-0.5">Puntaje</span>
        </div>

        <div className="relative z-10 flex-1 grid grid-cols-3 gap-4">
          {[
            { icon: Trophy, label: "Correctas", value: correct, sub: `de ${total}`, color: "text-[#B0BA92]" },
            { icon: Target, label: "Calificación", value: scoreInfo.label, sub: "", color: "text-white" },
            { icon: Clock, label: "Tiempo", value: formatTime(elapsedSeconds), sub: "total", color: "text-white/80" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-white/10 rounded-xl p-4">
              <Icon size={16} className="text-white/50 mb-2" />
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              {sub && <p className="text-xs text-white/50">{sub}</p>}
              <p className="text-xs text-white/60 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[#2F3A55] text-[#2F3A55] text-sm font-semibold hover:bg-[#2F3A55] hover:text-white transition-all"
        >
          <RotateCcw size={16} />
          Reintentar
        </button>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2F3A55] text-white text-sm font-semibold hover:bg-[#3d4e6e] transition-all shadow-md"
        >
          <Plus size={16} />
          Nuevo examen
        </button>
      </div>

      {/* Question review */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8eaed]">
          <h2 className="text-sm font-bold text-[#2F3A55]">Revisión de respuestas</h2>
          <p className="text-xs text-[#5C6B8A] mt-0.5">Documento: {documentName}</p>
        </div>
        <div className="divide-y divide-[#e8eaed]">
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const isCorrect = userAnswer === q.correctIndex
            const skipped = userAnswer === null

            return (
              <div key={q.id} className="px-6 py-5">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${
                      skipped
                        ? "bg-[#f4f5f7] text-[#5C6B8A]"
                        : isCorrect
                        ? "bg-[#B0BA92]/20"
                        : "bg-red-50"
                    }`}
                  >
                    {skipped ? (
                      <span className="text-xs font-bold text-[#5C6B8A]">{i + 1}</span>
                    ) : isCorrect ? (
                      <CheckCircle2 size={16} className="text-[#B0BA92]" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                  <p className="text-sm text-[#2F3A55] font-medium leading-snug">{q.text}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pl-10">
                  {q.options.map((opt, oi) => {
                    const isRight = oi === q.correctIndex
                    const isUser = oi === userAnswer
                    let style = "bg-[#f4f5f7] text-[#5C6B8A]"
                    if (isRight) style = "bg-[#B0BA92]/15 text-[#2F3A55] border border-[#B0BA92]"
                    if (isUser && !isRight) style = "bg-red-50 text-red-600 border border-red-200"

                    return (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${style}`}
                      >
                        <span className="shrink-0 font-bold opacity-50">
                          {["A", "B", "C", "D"][oi]}
                        </span>
                        <span className="leading-tight">{opt}</span>
                        {isRight && <CheckCircle2 size={12} className="ml-auto text-[#B0BA92] shrink-0" />}
                        {isUser && !isRight && <XCircle size={12} className="ml-auto text-red-400 shrink-0" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
