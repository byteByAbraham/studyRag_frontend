"use client"

import { useRef, useState } from "react"
import { Send, Paperclip, Mic, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const QUICK_PROMPTS = [
  "Resume este documento",
  "¿Cuáles son los conceptos clave?",
  "Explica con un ejemplo",
  "¿Qué dice sobre...?",
]

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export function ChatInput({ onSend, disabled, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || isLoading) return
    onSend(trimmed)
    setValue("")
    setShowQuickPrompts(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-resize
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = Math.min(el.scrollHeight, 140) + "px"
    }
  }

  const insertQuickPrompt = (prompt: string) => {
    setValue(prompt)
    setShowQuickPrompts(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Quick prompts dropdown */}
      {showQuickPrompts && (
        <div className="mb-2 p-1.5 bg-white border border-[#e8eaed] rounded-xl shadow-sm">
          <p className="text-[10px] font-semibold text-[#5C6B8A] uppercase tracking-wider px-2 py-1">
            Sugerencias rápidas
          </p>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => insertQuickPrompt(prompt)}
              className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#2F3A55] hover:bg-[#f4f5f7] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div
        className={cn(
          "flex flex-col bg-white border border-[#e8eaed] rounded-2xl shadow-sm transition-colors focus-within:border-[#5C6B8A]",
          disabled && "opacity-50"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={
            disabled
              ? "Selecciona un documento para comenzar..."
              : "Pregunta algo sobre tu documento..."
          }
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-[#2F3A55] placeholder:text-[#5C6B8A]/50 outline-none leading-relaxed"
        />

        {/* Toolbar row */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowQuickPrompts(!showQuickPrompts)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                showQuickPrompts
                  ? "bg-[#B0BA92]/20 text-[#2F3A55]"
                  : "text-[#5C6B8A] hover:bg-[#f4f5f7]"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sugerencias
            </button>
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#5C6B8A]/50 cursor-not-allowed"
            >
              <Paperclip className="w-3.5 h-3.5" />
              Adjuntar
            </button>
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#5C6B8A]/50 cursor-not-allowed"
            >
              <Mic className="w-3.5 h-3.5" />
              Voz
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#5C6B8A]/50">
              {value.length} / 2000
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim() || disabled || isLoading}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                value.trim() && !disabled && !isLoading
                  ? "bg-[#2F3A55] text-white hover:bg-[#3d4d6b] shadow-sm"
                  : "bg-[#f4f5f7] text-[#5C6B8A]/40 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-1.5 text-center text-[10px] text-[#5C6B8A]/50">
        Las respuestas se generan exclusivamente con base en los documentos cargados.
      </p>
    </div>
  )
}
