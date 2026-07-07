"use client"

import { CheckCircle2, XCircle, Circle, FileText, Clock, BarChart2 } from "lucide-react"

interface QuestionStatus {
  answered: boolean
  correct: boolean | null // null = not yet revealed
}

interface ExamNavSidebarProps {
  documentName: string
  difficulty: string
  currentQuestion: number
  totalQuestions: number
  statuses: QuestionStatus[]
  elapsedSeconds: number
  score: number | null // null while in progress
  onNavigate: (index: number) => void
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: "Básico", color: "text-[#B0BA92]" },
  medium: { label: "Intermedio", color: "text-[#5C6B8A]" },
  hard: { label: "Avanzado", color: "text-[#2F3A55]" },
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export function ExamNavSidebar({
  documentName,
  difficulty,
  currentQuestion,
  totalQuestions,
  statuses,
  elapsedSeconds,
  score,
  onNavigate,
}: ExamNavSidebarProps) {
  const answeredCount = statuses.filter((s) => s.answered).length
  const diffInfo = DIFFICULTY_LABELS[difficulty] ?? { label: difficulty, color: "text-[#5C6B8A]" }

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-4">
      {/* Score panel — visible once exam is submitted */}
      {score !== null && (
        <div className="bg-[#2F3A55] rounded-2xl p-5 text-center text-white">
          <BarChart2 size={24} className="text-[#B0BA92] mx-auto mb-2" />
          <p className="text-4xl font-bold text-[#B0BA92]">{score}%</p>
          <p className="text-xs text-white/60 mt-1">
            {statuses.filter((s) => s.correct).length} de {totalQuestions} correctas
          </p>
        </div>
      )}

      {/* Document info */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2F3A55]/8 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-[#5C6B8A]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#5C6B8A] mb-0.5">Documento fuente</p>
            <p className="text-xs font-semibold text-[#2F3A55] truncate leading-tight">
              {documentName}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e8eaed]">
          <div className="flex items-center gap-1.5 text-xs text-[#5C6B8A]">
            <Clock size={12} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
          <span className={`text-xs font-semibold ${diffInfo.color}`}>{diffInfo.label}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#2F3A55]">Progreso</span>
          <span className="text-xs font-bold text-[#5C6B8A]">{answeredCount}/{totalQuestions}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#f4f5f7] overflow-hidden">
          <div
            className="h-2 rounded-full bg-[#B0BA92] transition-all duration-500"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question navigator */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] p-4 flex-1">
        <p className="text-xs font-semibold text-[#2F3A55] mb-3">Preguntas</p>
        <div className="grid grid-cols-4 gap-2">
          {statuses.map((status, index) => {
            const isCurrent = index === currentQuestion
            let bg = "bg-[#f4f5f7] text-[#5C6B8A]"
            let Icon = Circle

            if (status.answered && status.correct === true) {
              bg = "bg-[#B0BA92]/20 text-[#2F3A55] border border-[#B0BA92]"
              Icon = CheckCircle2
            } else if (status.answered && status.correct === false) {
              bg = "bg-red-50 text-red-500 border border-red-200"
              Icon = XCircle
            } else if (status.answered) {
              bg = "bg-[#5C6B8A]/10 text-[#5C6B8A] border border-[#5C6B8A]/30"
            }

            if (isCurrent) {
              bg += " ring-2 ring-[#2F3A55] ring-offset-1"
            }

            return (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${bg}`}
                aria-label={`Pregunta ${index + 1}`}
              >
                {status.answered && status.correct !== null ? (
                  <Icon size={14} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-[#e8eaed] space-y-1.5">
          {[
            { color: "bg-[#B0BA92]/20 border border-[#B0BA92]", label: "Correcta" },
            { color: "bg-red-50 border border-red-200", label: "Incorrecta" },
            { color: "bg-[#5C6B8A]/10 border border-[#5C6B8A]/30", label: "Respondida" },
            { color: "bg-[#f4f5f7]", label: "Sin responder" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-sm ${item.color}`} />
              <span className="text-[11px] text-[#5C6B8A]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
