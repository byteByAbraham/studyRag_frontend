"use client"

import { Users, Clock, Lock, Unlock, ArrowRight, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

export type Room = {
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
}

const colorMap = {
  navy: {
    bar: "bg-[#2F3A55]",
    badge: "bg-[#EEF0F5] text-[#2F3A55]",
    avatar: "bg-[#2F3A55] text-white",
    dot: "bg-[#2F3A55]",
    arrow: "bg-[#2F3A55] text-white hover:bg-[#3d4d6e]",
  },
  slate: {
    bar: "bg-[#5C6B8A]",
    badge: "bg-[#EFF1F6] text-[#5C6B8A]",
    avatar: "bg-[#5C6B8A] text-white",
    dot: "bg-[#5C6B8A]",
    arrow: "bg-[#5C6B8A] text-white hover:bg-[#6d7d9e]",
  },
  sage: {
    bar: "bg-[#B0BA92]",
    badge: "bg-[#F5F6F0] text-[#6b7355]",
    avatar: "bg-[#B0BA92] text-[#2F3A55]",
    dot: "bg-[#B0BA92]",
    arrow: "bg-[#B0BA92] text-[#2F3A55] hover:bg-[#9fa882]",
  },
}

interface RoomCardProps {
  room: Room
  // TODO: replace with actual join handler that calls your backend
  // onJoin: (roomId: string) => Promise<void>
  onJoin?: (roomId: string) => void
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const c = colorMap[room.color]
  const occupancy = Math.round((room.participants / room.maxParticipants) * 100)

  return (
    <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top color bar */}
      <div className={cn("h-1.5 w-full", c.bar)} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {room.isActive && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Wifi size={9} />
                  EN VIVO
                </span>
              )}
              {room.isPrivate ? (
                <Lock size={12} className="text-[#5C6B8A]" />
              ) : (
                <Unlock size={12} className="text-[#B0BA92]" />
              )}
            </div>
            <h3 className="font-bold text-[#2F3A55] text-base leading-tight truncate">{room.name}</h3>
            <p className="text-xs text-[#5C6B8A] font-medium mt-0.5">{room.subject}</p>
          </div>
        </div>

        <p className="text-sm text-[#5C6B8A] leading-relaxed mb-4 line-clamp-2 flex-1">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.tags.map((tag) => (
            <span key={tag} className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", c.badge)}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-[#5C6B8A] flex items-center gap-1">
              <Users size={11} />
              {room.participants}/{room.maxParticipants} participantes
            </span>
            <span className="text-[11px] font-semibold text-[#2F3A55]">{occupancy}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#f4f5f7]">
            <div
              className={cn("h-1.5 rounded-full transition-all", c.bar)}
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold",
                c.avatar
              )}
            >
              {room.hostInitials}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2F3A55] leading-tight">{room.host}</p>
              <p className="text-[10px] text-[#5C6B8A] flex items-center gap-1">
                <Clock size={9} />
                {room.duration}
              </p>
            </div>
          </div>

          <button
            onClick={() => onJoin?.(room.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors",
              c.arrow
            )}
          >
            Unirse
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
