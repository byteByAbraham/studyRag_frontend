"use client"

import { useState } from "react"
import { FileText, ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Document {
  id: string
  name: string
  size: string
  pages: number
  uploadedAt: string
}

export interface ChatSession {
  id: string
  title: string
  documentName: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

interface ChatContextPanelProps {
  documents: Document[]
  selectedDocId: string | null
  onSelectDoc: (id: string) => void
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
  activeSessionId: string | null
}

export function ChatContextPanel({
  documents,
  selectedDocId,
  onSelectDoc,
  onNewChat,
}: ChatContextPanelProps) {

  const [docOpen, setDocOpen] = useState(true)

  const selectedDoc = documents.find(
    (doc) => doc.id === selectedDocId
  )

  return (
    <aside className="w-72 shrink-0 flex flex-col h-full border-l border-[#e8eaed] bg-[#fafbfc]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#e8eaed]">

        <h3 className="text-sm font-semibold text-[#2F3A55]">
          Contexto del chat
        </h3>

        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2F3A55] text-white text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Nuevo
        </button>

      </div>

      <div className="flex-1 overflow-y-auto">

        <div className="border-b border-[#e8eaed]">

          <button
            onClick={() => setDocOpen(!docOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold text-[#5C6B8A] uppercase"
          >

            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Documento activo
            </span>

            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform",
                !docOpen && "-rotate-90"
              )}
            />

          </button>

          {docOpen && (

            <div className="px-3 pb-3 space-y-1.5">

              {documents.map((doc) => (

                <button
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={cn(
                    "w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all border",
                    selectedDocId === doc.id
                      ? "bg-[#2F3A55] border-[#2F3A55] text-white"
                      : "bg-white border-[#e8eaed] hover:border-[#B0BA92] text-[#2F3A55]"
                  )}
                >

                  <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-[#B0BA92]/15">
                    <FileText className="w-4 h-4 text-[#5C6B8A]" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-medium leading-snug line-clamp-2">
                      {doc.name}
                    </p>

                    <p className="text-[10px] mt-0.5 text-[#5C6B8A]/70">
                      {doc.pages} páginas · {doc.size} · {doc.uploadedAt}
                    </p>

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>

      </div>

      {selectedDoc && (

        <div className="px-4 py-3 border-t border-[#e8eaed] bg-white">

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-[#B0BA92]" />

            <p className="text-[11px] text-[#5C6B8A] line-clamp-1">
              {selectedDoc.name}
            </p>

          </div>

        </div>

      )}

    </aside>
  )
}