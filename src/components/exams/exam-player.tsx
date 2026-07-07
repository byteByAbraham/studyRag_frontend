"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react"
import { ExamSetup } from "./exam-setup"
import { ExamQuestion, type Question } from "./exam-questions"
import { ExamNavSidebar } from "./exam-nav"
import { ExamResults } from "./exam-results"

type Phase = "setup" | "generating" | "playing" | "results"

interface ExamConfig {
  documentId: string
  documentName: string
  questionCount: number
  difficulty: string
}

// ←←← AJUSTA ESTA URL SEGÚN TU BACKEND
const GENERATE_EXAM_URL = '/api/exams/generate'

export function ExamPlayer() {
  const [phase, setPhase] = useState<Phase>("setup")
  const [config, setConfig] = useState<ExamConfig | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [revealed, setRevealed] = useState<boolean[]>([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [score, setScore] = useState<number | null>(null)
  const [generatingError, setGeneratingError] = useState<string | null>(null)

  // Timer
  useEffect(() => {
    if (phase !== "playing") return
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [phase])

  const handleStart = useCallback(async (cfg: ExamConfig) => {
    setConfig(cfg)
    setPhase("generating")
    setElapsedSeconds(0)
    setScore(null)
    setGeneratingError(null)

    try {
      const response = await fetch(GENERATE_EXAM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: cfg.documentId,
          questionCount: cfg.questionCount,
          difficulty: cfg.difficulty,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar el examen')
      }

      setQuestions(data.questions || data)
      setAnswers(new Array(data.questions?.length || data.length).fill(null))
      setRevealed(new Array(data.questions?.length || data.length).fill(false))
      setCurrentIndex(0)
      setPhase("playing")

    } catch (err: any) {
      console.error(err)
      setGeneratingError(err.message || 'No se pudo generar el examen')
      // Volver a setup después de error
      setTimeout(() => {
        setPhase("setup")
      }, 3000)
    }
  }, [])

  const handleSelect = useCallback((optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })

    setTimeout(() => {
      setRevealed((prev) => {
        const next = [...prev]
        next[currentIndex] = true
        return next
      })
    }, 300)
  }, [currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }, [currentIndex])

  const handleSubmit = useCallback(() => {
    const correct = answers.filter((a, i) => a === questions[i]?.correctIndex).length
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setPhase("results")
  }, [answers, questions])

  const handleRetry = useCallback(() => {
    if (!config) return
    handleStart(config)
  }, [config, handleStart])

  const handleNew = useCallback(() => {
    setPhase("setup")
    setConfig(null)
    setQuestions([])
    setAnswers([])
    setRevealed([])
    setCurrentIndex(0)
    setElapsedSeconds(0)
    setScore(null)
    setGeneratingError(null)
  }, [])

  // ---- SETUP ----
  if (phase === "setup") {
    return <ExamSetup onStart={handleStart} />
  }

  // ---- GENERATING ----
  if (phase === "generating") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#2F3A55] flex items-center justify-center">
          <Loader2 size={28} className="text-[#B0BA92] animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#2F3A55] text-lg">Generando examen con RAG...</p>
          <p className="text-[#5C6B8A] text-sm mt-1">
            Analizando el documento y creando {config?.questionCount} preguntas
          </p>
        </div>

        {generatingError && (
          <p className="text-red-500 text-sm mt-4 max-w-md text-center">{generatingError}</p>
        )}

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#B0BA92]"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }`}</style>
      </div>
    )
  }

  // ---- RESULTS ----
  if (phase === "results" && config) {
    return (
      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <ExamResults
            documentName={config.documentName}
            questions={questions}
            answers={answers}
            elapsedSeconds={elapsedSeconds}
            onRetry={handleRetry}
            onNew={handleNew}
          />
        </div>
        <ExamNavSidebar
          documentName={config.documentName}
          difficulty={config.difficulty}
          currentQuestion={currentIndex}
          totalQuestions={questions.length}
          statuses={questions.map((q, i) => ({
            answered: answers[i] !== null,
            correct: answers[i] !== null ? answers[i] === q.correctIndex : null,
          }))}
          elapsedSeconds={elapsedSeconds}
          score={score}
          onNavigate={setCurrentIndex}
        />
      </div>
    )
  }

  // ---- PLAYING ----
  if (phase === "playing" && config && questions.length > 0) {
    const isLast = currentIndex === questions.length - 1
    const allAnswered = answers.every((a) => a !== null)

    return (
      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h1 className="text-xl font-bold text-[#2F3A55]">Examen en curso</h1>
              <p className="text-sm text-[#5C6B8A] truncate max-w-xs">{config.documentName}</p>
            </div>
            {allAnswered && (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F3A55] text-white text-sm font-semibold hover:bg-[#3d4e6e] transition-all shadow-md"
              >
                <Send size={15} />
                Entregar examen
              </button>
            )}
          </div>

          <div className="mb-6 shrink-0">
            <div className="flex items-center justify-between text-xs text-[#5C6B8A] mb-1.5">
              <span>{answers.filter((a) => a !== null).length} respondidas</span>
              <span>{Math.round((answers.filter((a) => a !== null).length / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f4f5f7] overflow-hidden">
              <div
                className="h-2 rounded-full bg-[#2F3A55] transition-all duration-500"
                style={{ width: `${(answers.filter((a) => a !== null).length / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <ExamQuestion
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedIndex={answers[currentIndex]}
            isRevealed={revealed[currentIndex]}
            onSelect={handleSelect}
          />

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#e8eaed] shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#e8eaed] text-[#5C6B8A] text-sm font-medium hover:border-[#5C6B8A] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2F3A55] text-white text-sm font-semibold hover:bg-[#3d4e6e] transition-all shadow-md"
              >
                <Send size={15} />
                Entregar
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B0BA92] text-[#2F3A55] text-sm font-semibold hover:bg-[#c5ce9e] transition-all shadow-sm"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        <ExamNavSidebar
          documentName={config.documentName}
          difficulty={config.difficulty}
          currentQuestion={currentIndex}
          totalQuestions={questions.length}
          statuses={questions.map((q, i) => ({
            answered: answers[i] !== null,
            correct: revealed[i] ? answers[i] === q.correctIndex : null,
          }))}
          elapsedSeconds={elapsedSeconds}
          score={score}
          onNavigate={setCurrentIndex}
        />
      </div>
    )
  }

  return null
}