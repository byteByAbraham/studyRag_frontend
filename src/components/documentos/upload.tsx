"use client"

import { useState, useRef, useCallback } from "react"
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  File,
} from "lucide-react"
import { cn } from "@/lib/utils"

type FileStatus = "pending" | "uploading" | "done" | "error"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: FileStatus
  progress: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileExt(name: string, mime: string) {
  if (mime === "application/pdf") return "PDF"
  if (mime.includes("word")) return "DOC"
  if (mime.includes("presentation") || mime.includes("powerpoint")) return "PPT"
  if (mime.includes("sheet") || mime.includes("excel")) return "XLS"
  if (mime.includes("image")) return "IMG"
  const parts = name.split(".")
  return (parts[parts.length - 1] ?? "FILE").toUpperCase().slice(0, 4)
}

const extConfig: Record<string, { bg: string; text: string; bar: string }> = {
  PDF: { bg: "bg-red-50", text: "text-red-500", bar: "bg-red-400" },
  DOC: { bg: "bg-blue-50", text: "text-blue-500", bar: "bg-blue-400" },
  PPT: { bg: "bg-orange-50", text: "text-orange-500", bar: "bg-orange-400" },
  XLS: { bg: "bg-emerald-50", text: "text-emerald-500", bar: "bg-emerald-400" },
  IMG: { bg: "bg-violet-50", text: "text-violet-500", bar: "bg-violet-400" },
  FILE: { bg: "bg-[#f4f5f7]", text: "text-[#5C6B8A]", bar: "bg-[#5C6B8A]" },
}

export function UploadZone() {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [preview, setPreview] = useState<UploadedFile | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // TODO: replace simulateUpload with a real fetch/POST to your backend upload endpoint
  const simulateUpload = useCallback((file: UploadedFile) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: 100, status: "done" } : f))
        )
        setPreview((p) => (p?.id === file.id ? { ...p, progress: 100, status: "done" } : p))
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: Math.round(progress), status: "uploading" } : f
          )
        )
        setPreview((p) =>
          p?.id === file.id ? { ...p, progress: Math.round(progress), status: "uploading" } : p
        )
      }
    }, 250)
  }, [])

  const addFiles = useCallback(
    (raw: FileList | null) => {
      if (!raw) return
      const newFiles: UploadedFile[] = Array.from(raw).map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type,
        status: "pending" as FileStatus,
        progress: 0,
      }))
      setFiles((prev) => [...prev, ...newFiles])
      if (!preview && newFiles.length > 0) setPreview(newFiles[0])
      newFiles.forEach((f) => simulateUpload(f))
    },
    [simulateUpload, preview]
  )

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (preview?.id === id) {
      setPreview((p) => {
        const remaining = files.filter((f) => f.id !== id)
        return remaining.length > 0 ? remaining[0] : null
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-2xl border border-[#e8eaed] shadow-sm overflow-hidden">
      <div className="lg:col-span-3 flex flex-col border-r border-[#e8eaed]">
        <div className="px-7 pt-7 pb-5">
          <p className="text-[11px] font-semibold text-[#5C6B8A] uppercase tracking-widest mb-1">
            Subir archivo
          </p>
          <h2 className="text-2xl font-bold text-[#2F3A55] leading-tight">Carga tus documentos</h2>
          <p className="text-sm text-[#5C6B8A] mt-1">
            Arrastra o selecciona · PDF, DOC, PPT, XLS, IMG · máx. 50 MB
          </p>
        </div>

        <div className="px-7 pb-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              addFiles(e.dataTransfer.files)
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 py-12 cursor-pointer transition-all duration-200",
              dragging
                ? "border-[#2F3A55] bg-[#2F3A55]/5"
                : "border-[#e8eaed] hover:border-[#5C6B8A] hover:bg-[#f4f5f7]/60"
            )}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200",
                dragging ? "bg-[#2F3A55] scale-110" : "bg-[#f4f5f7]"
              )}
            >
              <UploadCloud
                className={cn("w-8 h-8 transition-colors", dragging ? "text-white" : "text-[#5C6B8A]")}
              />
            </div>

            <div className="text-center">
              <p className={cn("text-base font-semibold transition-colors", dragging ? "text-[#2F3A55]" : "text-[#5C6B8A]")}>
                {dragging ? "Suelta para cargar" : "Arrastra y suelta aquí"}
              </p>
              <p className="text-xs text-[#5C6B8A]/60 mt-1">o usa el botón de abajo</p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              className="mt-1 px-6 py-2.5 rounded-xl bg-[#2F3A55] text-white text-sm font-semibold hover:bg-[#5C6B8A] active:scale-95 transition-all"
            >
              Buscar archivo
            </button>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="px-7 pb-7 flex-1 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-[#5C6B8A] uppercase tracking-widest mb-1">
              Cola · {files.length} archivo{files.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
              {files.map((file) => {
                const ext = getFileExt(file.name, file.type)
                const cfg = extConfig[ext] ?? extConfig.FILE
                return (
                  <div
                    key={file.id}
                    onClick={() => setPreview(file)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all",
                      preview?.id === file.id
                        ? "border-[#2F3A55] bg-[#2F3A55]/5"
                        : "border-[#e8eaed] hover:border-[#5C6B8A]/40 hover:bg-[#f4f5f7]"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0", cfg.bg, cfg.text)}>
                      {ext}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2F3A55] truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {file.status === "uploading" ? (
                          <>
                            <div className="flex-1 h-1 rounded-full bg-[#e8eaed] overflow-hidden">
                              <div
                                className={cn("h-1 rounded-full transition-all duration-300", cfg.bar)}
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#5C6B8A] shrink-0">{file.progress}%</span>
                          </>
                        ) : (
                          <span className="text-[11px] text-[#5C6B8A]">{formatBytes(file.size)}</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {file.status === "uploading" && <Loader2 className="w-4 h-4 text-[#5C6B8A] animate-spin" />}
                      {file.status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {file.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {file.status === "pending" && <File className="w-4 h-4 text-[#5C6B8A]/40" />}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                      className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-[#5C6B8A] hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 flex flex-col bg-[#f4f5f7]/60">
        <div className="px-6 pt-7 pb-4 border-b border-[#e8eaed]">
          <p className="text-[11px] font-semibold text-[#5C6B8A] uppercase tracking-widest">
            Vista previa
          </p>
        </div>

        {preview ? (
          <PreviewPanel file={preview} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e8eaed] flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#5C6B8A]/50" />
            </div>
            <p className="text-sm font-medium text-[#5C6B8A]">Sin archivo seleccionado</p>
            <p className="text-xs text-[#5C6B8A]/60">
              Sube un archivo para ver su información aquí
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function PreviewPanel({ file }: { file: UploadedFile }) {
  const ext = getFileExt(file.name, file.type)
  const cfg = extConfig[ext] ?? extConfig.FILE

  const docType = {
    PDF: { label: "Documento PDF", desc: "Portable Document Format" },
    DOC: { label: "Documento Word", desc: "Microsoft Word" },
    PPT: { label: "Presentación", desc: "Microsoft PowerPoint" },
    XLS: { label: "Hoja de cálculo", desc: "Microsoft Excel" },
    IMG: { label: "Imagen", desc: "Archivo de imagen" },
    FILE: { label: "Archivo", desc: "Formato desconocido" },
  }[ext] ?? { label: "Archivo", desc: "" }

  return (
    <div className="flex-1 flex flex-col gap-5 px-6 py-6">
      <div className={cn("rounded-2xl flex flex-col items-center justify-center gap-3 py-10", cfg.bg)}>
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", cfg.bg)}>
          <FileText className={cn("w-10 h-10", cfg.text)} />
        </div>
        <div className={cn("text-2xl font-black tracking-wider", cfg.text)}>{ext}</div>
      </div>

      <div>
        <p className="text-sm font-bold text-[#2F3A55] leading-snug line-clamp-2">{file.name}</p>
        <p className="text-xs text-[#5C6B8A] mt-1">{docType.label} · {docType.desc}</p>
      </div>

      <div className="flex flex-col gap-2">
        {[
          { label: "Tamaño", value: formatBytes(file.size) },
          { label: "Formato", value: ext },
          { label: "Estado", value: file.status === "done" ? "Subido" : file.status === "uploading" ? `${file.progress}%` : file.status === "error" ? "Error" : "Pendiente" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-[#e8eaed]/60 last:border-0">
            <span className="text-xs text-[#5C6B8A]">{label}</span>
            <span className="text-xs font-semibold text-[#2F3A55]">{value}</span>
          </div>
        ))}
      </div>

      <div className={cn(
        "flex items-center gap-2.5 rounded-xl px-4 py-3",
        file.status === "done" ? "bg-emerald-50" : file.status === "error" ? "bg-red-50" : "bg-[#e8eaed]/60"
      )}>
        {file.status === "uploading" && <Loader2 className="w-4 h-4 text-[#5C6B8A] animate-spin shrink-0" />}
        {file.status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
        {file.status === "error" && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
        {file.status === "pending" && <File className="w-4 h-4 text-[#5C6B8A]/50 shrink-0" />}
        <span className={cn(
          "text-xs font-semibold",
          file.status === "done" ? "text-emerald-600" : file.status === "error" ? "text-red-500" : "text-[#5C6B8A]"
        )}>
          {file.status === "done" && "Archivo cargado correctamente"}
          {file.status === "uploading" && `Subiendo... ${file.progress}%`}
          {file.status === "error" && "Error al cargar el archivo"}
          {file.status === "pending" && "En espera..."}
        </span>
      </div>
    </div>
  )
}
