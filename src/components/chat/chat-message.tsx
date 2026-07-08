"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  AlertCircle
} from "lucide-react"

import { cn } from "@/lib/utils"

export type MessageRole = "user" | "assistant"

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  sourceChunks?: string[]
  isStreaming?: boolean
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)
  const [showSources, setShowSources] = useState(false)

  const isUser = message.role === "user"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      "flex gap-3 group",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>

      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold mt-0.5",
        isUser
          ? "bg-[#2F3A55] text-white"
          : "bg-[#B0BA92]/30 text-[#2F3A55]"
      )}>
        {isUser ? "U" : <BookOpen className="w-4 h-4" />}
      </div>

      <div className={cn(
        "flex flex-col gap-1.5 max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>

        <span className="text-[11px] font-medium text-[#5C6B8A]/70 px-1">
          {isUser ? "Usuario" : "Asistente"}
        </span>

        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-[#2F3A55] text-white rounded-tr-sm"
            : "bg-white border border-[#e8eaed] text-[#2F3A55] rounded-tl-sm shadow-sm"
        )}>
          {message.isStreaming ? (
            <span>
              {message.content}
              <span className="inline-flex gap-0.5 ml-1">
                <span className="w-1 h-1 rounded-full bg-[#B0BA92] animate-bounce" />
                <span className="w-1 h-1 rounded-full bg-[#B0BA92] animate-bounce" />
                <span className="w-1 h-1 rounded-full bg-[#B0BA92] animate-bounce" />
              </span>
            </span>
          ) : (
            message.content
          )}
        </div>

        {!isUser && message.sourceChunks && message.sourceChunks.length > 0 && (
          <div className="w-full">

            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 text-[11px] text-[#5C6B8A]"
            >
              <AlertCircle className="w-3 h-3" />
              {showSources ? "Ocultar fuentes" : "Ver fuentes"}
            </button>

            {showSources && (
              <div className="mt-1.5 space-y-1.5">
                {message.sourceChunks.map((chunk, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-lg bg-[#B0BA92]/10 border border-[#B0BA92]/30 text-xs text-[#2F3A55]/80"
                  >
                    <span className="font-semibold mr-1">
                      [{index + 1}]
                    </span>
                    {chunk}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {!isUser && !message.isStreaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-[11px]"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}

              {copied ? "Copiado" : "Copiar"}
            </button>

            <button
              onClick={() => setFeedback("up")}
              className={cn(
                "p-1",
                feedback === "up"
                  ? "text-[#B0BA92]"
                  : "text-[#5C6B8A]"
              )}
            >
              <ThumbsUp className="w-3 h-3" />
            </button>

            <button
              onClick={() => setFeedback("down")}
              className={cn(
                "p-1",
                feedback === "down"
                  ? "text-red-400"
                  : "text-[#5C6B8A]"
              )}
            >
              <ThumbsDown className="w-3 h-3" />
            </button>

          </div>
        )}

        <span className="text-[10px] text-[#5C6B8A]/40">
          {message.timestamp.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>

      </div>

    </div>
  )
}