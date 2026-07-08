"use client"

import { useState, useEffect } from "react"
import { Plus, Users } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCards } from "@/components/rooms/stats-cards"
import { RoomList } from "@/components/rooms/room-list"
import { CreateRoomModal } from "@/components/rooms/createroom-modal"
import { JoinPrivateModal } from "@/components/rooms/joinprivate-modal"

export type Room = {
  message: string
  id: string
  name: string
  subject: string
  description: string
  host: string
  hostInitials: string
  participants: number
  maxParticipants: number
  duration: string
  isPrivate: boolean
  isActive: boolean
  tags: string[]
  color: "navy" | "slate" | "sage"
  joinCode?: string
}

// ←←← AJUSTA ESTAS URLs SEGÚN TU BACKEND
const ROOMS_API = '/api/rooms'

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [privateJoinOpen, setPrivateJoinOpen] = useState(false)
  const [selectedPrivateRoom, setSelectedPrivateRoom] = useState<Room | null>(null)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(ROOMS_API, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error('No se pudieron cargar las salas')

      const data: Room[] = await res.json()
      setRooms(data)
    } catch (err: any) {
      console.error(err)
      setError('Error al cargar las salas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleCreateRoom = async (data: {
    name: string
    subject: string
    description: string
    isPrivate: boolean
    maxParticipants: number
  }) => {
    try {
      const res = await fetch(ROOMS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const newRoom: Room = await res.json()

      if (!res.ok) throw new Error(newRoom.message || 'Error al crear sala')

      setRooms(prev => [newRoom, ...prev])
      setModalOpen(false)

    } catch (err: any) {
      alert(err.message || 'No se pudo crear la sala')
    }
  }

  const handlePrivateJoin = async (code: string) => {
    if (!selectedPrivateRoom) return

    try {
      const res = await fetch(`/api/rooms/${selectedPrivateRoom.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Código inválido')

      console.log(` Uniéndose a sala: ${selectedPrivateRoom.name}`)
      setPrivateJoinOpen(false)
      setSelectedPrivateRoom(null)


    } catch (err: any) {
      alert(err.message || 'Código incorrecto')
    }
  }

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (!room) return

    if (room.isPrivate) {
      setSelectedPrivateRoom(room)
      setPrivateJoinOpen(true)
    } else {
      console.log(`Uniéndose a sala pública: ${room.name}`)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-[#e8eaed] sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Users size={18} className="text-[#B0BA92]" />
              <h1 className="text-xl font-bold text-[#2F3A55]">Salas de Estudio</h1>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F3A55] text-white text-sm font-semibold hover:bg-[#3d4d6e] transition-colors shadow-sm"
          >
            <Plus size={15} />
            Nueva sala
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold text-[#5C6B8A] uppercase tracking-widest mb-4">
                Resumen general
              </h2>
              <StatsCards />
            </section>

            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-[#5C6B8A] uppercase tracking-widest">
                  Salas disponibles
                </h2>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2F3A55] hover:text-[#5C6B8A] transition-colors"
                >
                  <Plus size={13} />
                  Crear sala
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-[#5C6B8A]">Cargando salas...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  {error}
                  <button 
                    onClick={fetchRooms}
                    className="mt-4 px-4 py-2 bg-[#2F3A55] text-white rounded-xl text-sm"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
              )}
            </section>
          </div>
        </div>
      </main>

      <CreateRoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(newRoom) => {
          setRooms(prev => [newRoom, ...prev])
        }}
      />

      <JoinPrivateModal
        isOpen={privateJoinOpen}
        onClose={() => {
          setPrivateJoinOpen(false)
          setSelectedPrivateRoom(null)
        }}
        room={selectedPrivateRoom}
        onSuccess={() => {
          fetchRooms()
        }}
      />
    </div>
  )
}