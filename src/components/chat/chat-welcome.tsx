"use client"

import { BookOpen, HelpCircle, FileSearch, Lightbulb, ChevronRight } from "lucide-react"

const SUGGESTED_QUESTIONS = [
  {
    icon: BookOpen,
    label: "Resume el tema principal",
    prompt: "Resume el tema principal del documento cargado.",
  },
  {
    icon: HelpCircle,
    label: "Explica un concepto clave",
    prompt: "Explica el concepto más importante del documento con ejemplos.",
  },
  {
    icon: FileSearch,
    label: "Lista los puntos clave",
    prompt: "Lista los puntos clave y conclusiones del documento.",
  },
  {
    icon: Lightbulb,
    label: "Genera preguntas de estudio",
    prompt: "Genera 5 preguntas de estudio basadas en el contenido del documento.",
  },
]

interface ChatWelcomeProps {
  documentName?: string
  onPrompt: (text: string) => void
}

export function ChatWelcome({ documentName, onPrompt }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      {/* Icon badge */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2F3A55] mb-6 shadow-lg">
        <BookOpen className="w-8 h-8 text-[#B0BA92]" />
      </div>

      <h2 className="text-2xl font-bold text-[#2F3A55] mb-2">
        Asistente académico RAG
      </h2>
      <p className="text-sm text-[#5C6B8A] max-w-md leading-relaxed mb-2">
        Haz preguntas sobre tus documentos cargados y recibirás respuestas fundamentadas
        exclusivamente en tu material de estudio.
      </p>

      {documentName ? (
        <div className="flex items-center gap-2 mt-2 mb-8 px-3 py-1.5 bg-[#B0BA92]/20 rounded-full border border-[#B0BA92]/40">
          <span className="w-2 h-2 rounded-full bg-[#B0BA92]" />
          <span className="text-xs font-medium text-[#2F3A55]">{documentName}</span>
        </div>
      ) : (
        <p className="mt-2 mb-8 text-xs text-[#5C6B8A]/70">
          Selecciona un documento en el panel derecho para comenzar.
        </p>
      )}

      {/* Suggested prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTED_QUESTIONS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => onPrompt(item.prompt)}
              disabled={!documentName}
              className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e8eaed] hover:border-[#B0BA92] hover:shadow-sm text-left transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f4f5f7] group-hover:bg-[#B0BA92]/20 transition-colors shrink-0">
                <Icon className="w-4 h-4 text-[#5C6B8A] group-hover:text-[#2F3A55]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2F3A55] leading-snug">{item.label}</p>
                <p className="text-xs text-[#5C6B8A] mt-0.5 line-clamp-2 leading-relaxed">{item.prompt}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5C6B8A]/40 group-hover:text-[#B0BA92] shrink-0 mt-0.5 transition-colors" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
