import { Sidebar } from "@/components/layout/sidebar"
import { ChatWindow } from "@/components/chat/chat-window"

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <ChatWindow />
    </div>
  )
}
