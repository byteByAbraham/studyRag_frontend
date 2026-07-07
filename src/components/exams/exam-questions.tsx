"use client"

import { CheckCircle2, XCircle } from "lucide-react"

export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

interface ExamQuestionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedIndex: number | null
  isRevealed: boolean
  onSelect: (index: number) => void
}

const OPTION_LABELS = ["A", "B", "C", "D"]

export function ExamQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  isRevealed,
  onSelect,
}: ExamQuestionProps) {
  function getOptionStyle(index: number) {
    if (!isRevealed) {
      if (selectedIndex === index) {
        return "border-[#2F3A55] bg-[#2F3A55] text-white shadow-md scale-[1.01]"
      }
      return "border-[#e8eaed] text-[#2F3A55] hover:border-[#5C6B8A] hover:bg-[#f4f5f7]"
    }
    if (index === question.correctIndex) {
      return "border-[#B0BA92] bg-[#B0BA92]/15 text-[#2F3A55]"
    }
    if (selectedIndex === index && index !== question.correctIndex) {
      return "border-red-300 bg-red-50 text-red-700"
    }
    return "border-[#e8eaed] text-[#5C6B8A]/60"
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Decorative banner — adapted from reference image 1 */}
      <div
        className="relative h-40 rounded-2xl overflow-hidden mb-6 flex items-end justify-center"
        style={{ background: "linear-gradient(135deg, #2F3A55 0%, #5C6B8A 60%, #8a9bb5 100%)" }}
      >
        {/* Abstract landscape shapes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          viewBox="0 0 800 160"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <ellipse cx="150" cy="200" rx="200" ry="120" fill="#B0BA92" />
          <ellipse cx="450" cy="190" rx="280" ry="100" fill="#ffffff" />
          <ellipse cx="720" cy="200" rx="200" ry="110" fill="#B0BA92" />
          {/* Palm silhouettes */}
          <line x1="100" y1="160" x2="100" y2="60" stroke="#2F3A55" strokeWidth="3" />
          <ellipse cx="100" cy="58" rx="22" ry="12" fill="#2F3A55" transform="rotate(-20 100 58)" />
          <ellipse cx="100" cy="58" rx="22" ry="12" fill="#2F3A55" transform="rotate(20 100 58)" />
          <line x1="680" y1="160" x2="680" y2="55" stroke="#2F3A55" strokeWidth="3" />
          <ellipse cx="680" cy="53" rx="22" ry="12" fill="#2F3A55" transform="rotate(-20 680 53)" />
          <ellipse cx="680" cy="53" rx="22" ry="12" fill="#2F3A55" transform="rotate(20 680 53)" />
          {/* Birds */}
          <path d="M300 40 Q310 33 320 40" stroke="#ffffff" strokeWidth="2" fill="none" />
          <path d="M340 30 Q350 23 360 30" stroke="#ffffff" strokeWidth="2" fill="none" />
        </svg>

        {/* Question counter pill */}
        <div className="absolute bottom-0 translate-y-1/2 z-10">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#B0BA92] shadow-lg">
            <span className="text-sm font-bold text-[#2F3A55]">
              Pregunta {questionNumber}
            </span>
            <span className="text-sm text-[#2F3A55]/60">de {totalQuestions}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm px-8 py-7 mb-6 mt-2 text-center">
        <p className="text-[#2F3A55] text-lg font-medium leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* Options — 2×2 grid like reference 1 */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isCorrect = isRevealed && index === question.correctIndex
          const isWrong = isRevealed && selectedIndex === index && index !== question.correctIndex

          return (
            <button
              key={index}
              onClick={() => !isRevealed && onSelect(index)}
              disabled={isRevealed}
              className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-150 text-left ${getOptionStyle(index)}`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                  selectedIndex === index && !isRevealed
                    ? "bg-white/20 border-white/40 text-white"
                    : isCorrect
                    ? "bg-[#B0BA92]/40 border-[#B0BA92] text-[#2F3A55]"
                    : isWrong
                    ? "bg-red-100 border-red-300 text-red-600"
                    : "bg-[#f4f5f7] border-[#e8eaed] text-[#5C6B8A]"
                }`}
              >
                {OPTION_LABELS[index]}
              </span>
              <span className="flex-1">{option}</span>
              {isCorrect && <CheckCircle2 size={18} className="text-[#B0BA92] shrink-0" />}
              {isWrong && <XCircle size={18} className="text-red-400 shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
