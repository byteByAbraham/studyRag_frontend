import { Sidebar } from "@/components/layout/sidebar"
import { UploadZone } from "@/components/documentos/upload"
import { DocList } from "@/components/documentos/doclist"
import { Bell, Search } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#e8eaed] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-[11px] font-semibold text-[#5C6B8A] uppercase tracking-widest">
              Plataforma de estudio
            </p>
            <h1 className="text-xl font-bold text-[#2F3A55] tracking-tight">Documentos</h1>
          </div>

          <div className="flex items-center gap-3">
            
          

          

          
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 px-8 py-8 flex flex-col gap-8">
          {/* Upload zone — full width, split-panel */}
          <UploadZone />

          <DocList />
        </div>
      </main>
    </div>
  )
}
