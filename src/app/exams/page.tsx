import { Sidebar } from "@/components/layout/sidebar"
import { ExamPlayer } from "@/components/exams/exam-player"

export default function ExamsPage() {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />
      <main className="flex-1 flex flex-col p-8 overflow-hidden" style={{ maxHeight: "100vh" }}>
        <ExamPlayer />
      </main>
    </div>
  )
}
