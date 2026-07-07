"use client"

import { useState, useEffect } from "react"
import { FileText, ChevronDown, Zap, BookOpen, Brain, Clock, BarChart2, Loader2 } from "lucide-react"

interface Documento {
  id: string
  name: string
  subject: string
}

const QUESTION_COUNTS = [15, 20, 30, 35]

const DIFFICULTIES = [
  { id: "easy", label: "Básico", description: "Conceptos fundamentales", icon: BookOpen, color: "#B0BA92", bg: "bg-[#B0BA92]/10 border-[#B0BA92]/30", active: "bg-[#B0BA92]/20 border-[#B0BA92]", iconColor: "text-[#B0BA92]" },
  { id: "medium", label: "Intermedio", description: "Análisis y aplicación", icon: Brain, color: "#5C6B8A", bg: "bg-[#5C6B8A]/10 border-[#5C6B8A]/30", active: "bg-[#5C6B8A]/20 border-[#5C6B8A]", iconColor: "text-[#5C6B8A]" },
  { id: "hard", label: "Avanzado", description: "Razonamiento crítico", icon: Zap, color: "#2F3A55", bg: "bg-[#2F3A55]/5 border-[#2F3A55]/20", active: "bg-[#2F3A55]/10 border-[#2F3A55]", iconColor: "text-[#2F3A55]" },
]

interface ExamSetupProps {
  onStart: (config: { documentId: string; documentName: string; questionCount: number; difficulty: string }) => void
}

export function ExamSetup({ onStart }: ExamSetupProps) {
  const [documents, setDocuments] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<string>("")
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [difficulty, setDifficulty] = useState<string>("medium")
  const [docOpen, setDocOpen] = useState(false)

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("http://localhost:8000/api/documents") // Cambia la URL por la de tu back
        const data = await response.json()
        setDocuments(data)
      } catch (error) {
        console.error("Error al cargar documentos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const selectedDocObj = documents.find((d) => d.id === selectedDoc)
  const canStart = selectedDoc !== ""

  return (
    <div className="flex-1 flex items-center justify-center p-8 text-[14px]">
      <div className="w-full max-w-4xl"> {/* Tarjeta más ancha */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2F3A55] mb-4">
            <BarChart2 className="w-6 h-6 text-[#B0BA92]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2F3A55] mb-3">Configurar Examen</h1>
          <p className="text-[#5C6B8A] text-sm">
            Personaliza los detalles para generar una evaluación basada en tus materiales de estudio.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e8eaed] shadow-lg p-10 space-y-10">
          
          <div>
            <label className="block text-base font-semibold text-[#2F3A55] mb-4">
              1. Selecciona el documento fuente
            </label>
            <div className="relative">
              <button
                onClick={() => setDocOpen((v) => !v)}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl border-2 border-[#e8eaed] bg-white hover:border-[#5C6B8A] transition-all text-left"
              >
                {loading ? <Loader2 className="animate-spin text-[#5C6B8A]" /> : <FileText size={20} className="text-[#5C6B8A]" />}
                <span className={selectedDocObj ? "text-[#2F3A55] font-medium" : "text-[#5C6B8A]/60"}>
                  {loading ? "Cargando documentos..." : (selectedDocObj ? selectedDocObj.name : "Seleccionar archivo...")}
                </span>
                <ChevronDown size={20} className="ml-auto text-[#5C6B8A]" />
              </button>
              
              {docOpen && !loading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e8eaed] rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
                  {documents.map((doc) => (
                    <button key={doc.id} onClick={() => { setSelectedDoc(doc.id); setDocOpen(false) }}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#f4f5f7] border-b border-[#e8eaed]">
                      <FileText size={18} className="text-[#5C6B8A]" />
                      <div>
                        <p className="font-semibold text-[#2F3A55]">{doc.name}</p>
                        <p className="text-xs text-[#5C6B8A]">{doc.subject}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Preguntas */}
            <div>
              <label className="block text-base font-semibold text-[#2F3A55] mb-4">2. Cantidad de preguntas</label>
              <div className="flex gap-3">
                {QUESTION_COUNTS.map((n) => (
                  <button key={n} onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-4 rounded-xl border-2 font-bold ${questionCount === n ? "bg-[#2F3A55] text-white" : "border-[#e8eaed]"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-[#2F3A55] mb-4">3. Dificultad</label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((d) => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)}
                    className={`p-4 rounded-xl border-2 ${difficulty === d.id ? d.active : d.bg}`}>
                    <d.icon className={d.iconColor} />
                    <p className="font-semibold text-sm mt-2">{d.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => selectedDocObj && onStart({ documentId: selectedDoc, documentName: selectedDocObj.name, questionCount, difficulty })}
            disabled={!canStart}
            className={`w-full py-5 rounded-xl text-lg font-bold transition-all ${canStart ? "bg-[#2F3A55] text-white shadow-xl" : "bg-[#e8eaed] text-gray-400"}`}
          >
            Generar Examen
          </button>
        </div>
      </div>
    </div>
  )
}