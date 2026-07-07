"use client"

import { Download, Trash2, Eye, MoreVertical, FileText, Users } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export interface Document {
  id: string
  name: string
  subject: string
  type: "PDF" | "DOC" | "PPT"
  size: string
  pages?: number
  updatedAt: string
  sharedWith?: number
  color: string
}

// Soft pastel folder backgrounds — drive-style, not card strip
const folderPalette: Record<
  string,
  { bg: string; icon: string; badge: string; badgeText: string }
> = {
  navy: {
    bg: "bg-[#E8EBF0]",
    icon: "text-[#2F3A55]",
    badge: "bg-[#2F3A55]",
    badgeText: "text-white",
  },
  slate: {
    bg: "bg-[#EBEEF3]",
    icon: "text-[#5C6B8A]",
    badge: "bg-[#5C6B8A]",
    badgeText: "text-white",
  },
  sage: {
    bg: "bg-[#EEF0E9]",
    icon: "text-[#7A8A60]",
    badge: "bg-[#B0BA92]",
    badgeText: "text-[#2F3A55]",
  },
  sage2: {
    bg: "bg-[#F2F3EE]",
    icon: "text-[#8A9070]",
    badge: "bg-[#D6DCCA]",
    badgeText: "text-[#2F3A55]",
  },
}

const typeLabel: Record<"PDF" | "DOC" | "PPT", string> = {
  PDF: "PDF",
  DOC: "DOC",
  PPT: "PPT",
}

interface DocCardProps {
  doc: Document

  // TODO: Conectar con el backend
  onDelete?: (id: string) => void
  onPreview?: (id: string) => void
  onDownload?: (id: string) => void
}

export function DocCard({
  doc,
  onDelete,
  onPreview,
  onDownload,
}: DocCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const palette = folderPalette[doc.color] ?? folderPalette.navy

  return (
    <div className="group relative bg-white rounded-2xl border border-[#e8eaed] hover:border-[#5C6B8A]/30 hover:shadow-lg shadow-sm transition-all duration-200 flex flex-col overflow-visible">
      {/* Folder thumbnail */}
      <div
        className={cn(
          "relative rounded-t-2xl px-6 pt-6 pb-5 flex items-center justify-center",
          palette.bg
        )}
      >
        <div className="relative">
          <FileText
            className={cn(
              "w-14 h-14 transition-transform duration-200 group-hover:scale-105",
              palette.icon
            )}
          />

          <span
            className={cn(
              "absolute -bottom-1 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-md",
              palette.badge,
              palette.badgeText
            )}
          >
            {typeLabel[doc.type]}
          </span>
        </div>

        {/* Menú */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white border border-[#e8eaed] transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-3.5 h-3.5 text-[#5C6B8A]" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-xl border border-[#e8eaed] shadow-xl py-1.5 overflow-hidden">
                <button
                  onClick={() => {
                    onPreview?.(doc.id)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-[#2F3A55] hover:bg-[#f4f5f7] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#5C6B8A]" />
                  Vista previa
                </button>

                <button
                  onClick={() => {
                    onDownload?.(doc.id)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-[#2F3A55] hover:bg-[#f4f5f7] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#5C6B8A]" />
                  Descargar
                </button>

                <div className="h-px bg-[#e8eaed] mx-3 my-1" />

                <button
                  onClick={() => {
                    onDelete?.(doc.id)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Compartidos */}
        {doc.sharedWith !== undefined && doc.sharedWith > 0 && (
          <div className="absolute bottom-3 left-4 flex -space-x-2">
            {Array.from({ length: Math.min(doc.sharedWith, 3) }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-white bg-[#5C6B8A] text-[8px] font-bold text-white flex items-center justify-center"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="px-4 pt-4 pb-3 flex-1 flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-[#2F3A55] line-clamp-2 leading-snug">
          {doc.name}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#B0BA92] font-medium">
            {doc.subject}
          </span>

          {doc.pages && (
            <span className="text-[10px] text-[#5C6B8A]">
              {doc.pages} págs.
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-[#5C6B8A]">
          {doc.sharedWith !== undefined && doc.sharedWith > 0 && (
            <>
              <Users className="w-3 h-3" />
              <span>{doc.sharedWith}</span>
              <span className="mx-1.5 text-[#e8eaed]">·</span>
            </>
          )}

          <span>{doc.size}</span>
        </div>

        <span className="text-[10px] text-[#5C6B8A]/60">
          {doc.updatedAt}
        </span>
      </div>

      {/* Acciones rápidas */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-150 z-10 px-4 pb-2">
        <div className="flex rounded-xl overflow-hidden border border-[#e8eaed] shadow-md bg-white">
          <button
            onClick={() => onPreview?.(doc.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-[#5C6B8A] hover:bg-[#f4f5f7] hover:text-[#2F3A55] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver
          </button>

          <div className="w-px bg-[#e8eaed]" />

          <button
            onClick={() => onDownload?.(doc.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-[#5C6B8A] hover:bg-[#f4f5f7] hover:text-[#2F3A55] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </button>
        </div>
      </div>
    </div>
  )
}