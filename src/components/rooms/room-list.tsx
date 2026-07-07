"use client"

import { RoomCard } from "./room-card"
import { Room } from "@/app/rooms/page" 

interface RoomListProps {
  rooms: Room[]
  onJoinRoom: (roomId: string) => void
}

export function RoomList({ rooms, onJoinRoom }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 text-[#5C6B8A]">
        No hay salas disponibles aún. ¡Crea una!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onJoin={onJoinRoom} />
      ))}
    </div>
  )
}