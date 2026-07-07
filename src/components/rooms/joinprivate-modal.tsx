"use client"

import { useState } from "react"
import { X, Lock } from "lucide-react"
import { Room } from "@/app/rooms/page"

interface JoinPrivateModalProps {
  isOpen: boolean
  onClose: () => void
  room: Room | null
  onSuccess?: (roomData: any) => void   // ←← Aquí estaba el error (faltaba coma)
}

export function JoinPrivateModal({ 
  isOpen, 
  onClose, 
  room, 
  onSuccess 
}: JoinPrivateModalProps) {
  
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !room) return null

  // ←←← AJUSTA ESTA URL SEGÚN TU BACKEND
  const JOIN_ROOM_URL = `/api/rooms/${room.id}/join`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedCode = code.trim().toUpperCase()
    if (!trimmedCode) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(JOIN_ROOM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: trimmedCode 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido o sala no disponible')
      }

      onSuccess?.(data)
      setCode("")
      onClose()

    } catch (err: any) {
      setError(err.message || 'No se pudo unir a la sala')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCode("")
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#2F3A55]/50 backdrop-blur-sm" 
        onClick={handleClose} 
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Lock className="text-[#2F3A55]" size={22} />
            <div>
              <h3 className="font-bold text-[#2F3A55]">Sala Privada</h3>
              <p className="text-sm text-[#5C6B8A]">{room.name}</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="text-[#5C6B8A] hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2F3A55] mb-1.5">
              Ingresa el código de acceso
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: COMP2026"
              className="w-full px-4 py-3 rounded-xl border border-[#e8eaed] text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2F3A55]"
              maxLength={8}
              required
              disabled={loading}
            />
            <p className="text-[10px] text-[#5C6B8A] mt-1 text-center">
              Pídele el código al anfitrión
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl text-center">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-[#e8eaed] font-semibold text-[#5C6B8A] hover:bg-[#f4f5f7] transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="flex-1 py-3 rounded-xl bg-[#2F3A55] text-white font-semibold hover:bg-[#3d4d6e] disabled:opacity-60 transition-colors"
            >
              {loading ? "Uniéndose..." : "Unirse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}