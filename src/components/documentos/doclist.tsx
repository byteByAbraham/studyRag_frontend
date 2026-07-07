"use client"

import { useState, useEffect } from "react"
import {
  Search,
  LayoutGrid,
  List,
  Download,
  Trash2,
  Eye,
  FileText,
  FileX,
} from "lucide-react"
import { DocCard, type Document } from "./doccard"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────
// Configuración de rutas del backend (ajústalas cuando las tengas)
const API_BASE = "/api" // o tu base URL

const ENDPOINTS = {
  documents: `${API_BASE}/documents`,        // GET → lista de documentos
  // delete: (id: string) => `${API_BASE}/documents/${id}`, // DELETE
  // preview/download si tu backend las soporta
} as const

// ─────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list"

export function DocList() {
  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState("Todas")
  const [fileType, setFileType] = useState("Todos")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch(ENDPOINTS.documents, {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw new Error("Error al cargar documentos")

      const data: Document[] = await res.json()
      setDocs(data)
    } catch (err) {
      console.error(err)
      setError("No se pudieron cargar los documentos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const refreshDocuments = () => {
    fetchDocuments()
  }

  // TODO: Conectar con tu componente de upload
  // Ejemplo: <Upload onSuccess={refreshDocuments} />

  const handleDelete = async (id: string) => {
   
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  const handlePreview = (_id: string) => {
    console.log("Preview documento:", _id)
  }

  const handleDownload = (_id: string) => {
    console.log("Descargar documento:", _id)
  }

  const filtered = docs.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.subject.toLowerCase().includes(search.toLowerCase())
    const matchesSubject = subject === "Todas" || d.subject === subject
    const matchesType = fileType === "Todos" || d.type === fileType
    return matchesSearch && matchesSubject && matchesType
  })

  const FILE_TYPES = ["Todos", "PDF", "DOC", "PPT"]

  const typeRowStyle: Record<string, string> = {
    PDF: "text-red-500 bg-red-50",
    DOC: "text-blue-500 bg-blue-50",
    PPT: "text-orange-500 bg-orange-50",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e8eaed] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-bold text-[#2F3A55]">Todos los archivos</h2>
              <p className="text-xs text-[#5C6B8A] mt-0.5">
                {loading ? "Cargando..." : `${filtered.length} documento${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C6B8A]" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm rounded-xl border border-[#e8eaed] bg-[#f4f5f7] text-[#2F3A55] placeholder:text-[#5C6B8A]/50 focus:outline-none focus:border-[#5C6B8A] w-44 transition-colors"
                />
              </div>

              <div className="flex items-center bg-[#f4f5f7] rounded-xl p-1 gap-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                    viewMode === "grid" ? "bg-white shadow-sm text-[#2F3A55]" : "text-[#5C6B8A] hover:text-[#2F3A55]"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                    viewMode === "list" ? "bg-white shadow-sm text-[#2F3A55]" : "text-[#5C6B8A] hover:text-[#2F3A55]"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={refreshDocuments}
                className="px-3 py-2 text-sm text-[#5C6B8A] hover:text-[#2F3A55] hover:bg-[#f4f5f7] rounded-xl transition-colors"
              >
                ↻ Refrescar
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {FILE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setFileType(t)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                    fileType === t
                      ? "bg-[#B0BA92] text-[#2F3A55] shadow-sm"
                      : "bg-[#f4f5f7] text-[#5C6B8A] hover:bg-[#e8eaed]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-[#e8eaed] border-t-[#5C6B8A] rounded-full animate-spin" />
              <p className="text-sm text-[#5C6B8A]">Cargando documentos...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <FileX className="w-10 h-10 text-red-400" />
              <p className="text-sm font-semibold text-[#2F3A55]">{error}</p>
              <button
                onClick={refreshDocuments}
                className="mt-4 px-4 py-2 bg-[#2F3A55] text-white rounded-xl text-sm hover:bg-[#1f2a44]"
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#f4f5f7] flex items-center justify-center">
                <FileX className="w-6 h-6 text-[#5C6B8A]" />
              </div>
              <p className="text-sm font-semibold text-[#2F3A55]">Sin resultados</p>
              <p className="text-xs text-[#5C6B8A]">Prueba con otros filtros o sube un nuevo archivo.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4 px-3 pb-2 border-b border-[#e8eaed]">
                <span className="col-span-5 text-[10px] font-bold text-[#5C6B8A] uppercase tracking-wider">Nombre</span>
                <span className="col-span-2 text-[10px] font-bold text-[#5C6B8A] uppercase tracking-wider hidden md:block">Materia</span>
                <span className="col-span-2 text-[10px] font-bold text-[#5C6B8A] uppercase tracking-wider hidden sm:block">Tamaño</span>
                <span className="col-span-2 text-[10px] font-bold text-[#5C6B8A] uppercase tracking-wider hidden lg:block">Modificado</span>
                <span className="col-span-1" />
              </div>

              {filtered.map((doc) => (
                <FileRow
                  key={doc.id}
                  doc={doc}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function RecentCard({ doc, onPreview, onDownload }: {
  doc: Document
  onPreview?: (id: string) => void
  onDownload?: (id: string) => void
}) {
  const typeRowStyle: Record<string, string> = {
    PDF: "text-red-500 bg-red-50",
    DOC: "text-blue-500 bg-blue-50",
    PPT: "text-orange-500 bg-orange-50",
  }
  const typeClass = typeRowStyle[doc.type] ?? "text-gray-500 bg-gray-50"

  return (
    <div className="bg-white rounded-2xl border border-[#e8eaed] hover:border-[#5C6B8A]/30 hover:shadow-md shadow-sm transition-all duration-200 overflow-hidden group">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0", typeClass)}>
          {doc.type}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#2F3A55] truncate">{doc.name}</p>
          <p className="text-xs text-[#5C6B8A] truncate">{doc.subject}</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3 pt-2 border-t border-[#f4f5f7]">
        <span className="text-[11px] text-[#5C6B8A]">{doc.updatedAt} · {doc.size}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onPreview?.(doc.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#f4f5f7]">
            <Eye className="w-3.5 h-3.5 text-[#5C6B8A]" />
          </button>
          <button onClick={() => onDownload?.(doc.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#f4f5f7]">
            <Download className="w-3.5 h-3.5 text-[#5C6B8A]" />
          </button>
        </div>
      </div>
    </div>
  )
}

function FileRow({ doc, onDelete, onPreview, onDownload }: {
  doc: Document
  onDelete?: (id: string) => void
  onPreview?: (id: string) => void
  onDownload?: (id: string) => void
}) {
  const typeRowStyle: Record<string, string> = {
    PDF: "text-red-500 bg-red-50",
    DOC: "text-blue-500 bg-blue-50",
    PPT: "text-orange-500 bg-orange-50",
  }
  const typeClass = typeRowStyle[doc.type] ?? "text-gray-500 bg-gray-50"

  return (
    <div className="grid grid-cols-12 gap-4 items-center px-3 py-3 rounded-xl hover:bg-[#f4f5f7]/70 transition-colors group border-b border-[#f4f5f7] last:border-0">
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", typeClass)}>
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#2F3A55] truncate">{doc.name}</p>
          {doc.pages && <p className="text-[10px] text-[#5C6B8A]">{doc.pages} páginas</p>}
        </div>
      </div>

      <div className="col-span-2 hidden md:block">
        <span className="text-xs text-[#5C6B8A] font-medium">{doc.subject}</span>
      </div>

      <div className="col-span-2 hidden sm:block">
        <span className="text-xs text-[#5C6B8A]">{doc.size}</span>
      </div>

      <div className="col-span-2 hidden lg:block">
        <span className="text-xs text-[#5C6B8A]">{doc.updatedAt}</span>
      </div>

      <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onPreview?.(doc.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white">
          <Eye className="w-3.5 h-3.5 text-[#5C6B8A]" />
        </button>
        <button onClick={() => onDownload?.(doc.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white">
          <Download className="w-3.5 h-3.5 text-[#5C6B8A]" />
        </button>
        <button onClick={() => onDelete?.(doc.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </div>
  )
}