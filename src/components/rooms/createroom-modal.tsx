"use client"

import { useState } from "react"
import { X, Plus, Lock, Unlock } from "lucide-react"

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newRoom: any) => void
}

const SUBJECTS = [
 "Aplicaciones web", "Inglés", "Programación", "Base de datos",
]

// ←←← CAMBIA ESTA URL SEGÚN TU BACKEND
const CREATE_ROOM_URL = '/api/rooms'; // Ejemplo: http://localhost:3001/api/rooms

export function CreateRoomModal({ isOpen, onClose, onSuccess }: CreateRoomModalProps) {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    isPrivate: false,
    maxParticipants: 10,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name.trim() || !form.subject) {
      setError("El nombre y la materia son obligatorios")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(CREATE_ROOM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          subject: form.subject,
          description: form.description.trim(),
          isPrivate: form.isPrivate,
          maxParticipants: form.maxParticipants,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la sala')
      }

      onSuccess?.(data) 
      resetForm()
      onClose()

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear la sala')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: "",
      subject: "",
      description: "",
      isPrivate: false,
      maxParticipants: 10,
    })
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#2F3A55]/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#e8eaed] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8eaed]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#B0BA92]/20 flex items-center justify-center">
              <Plus size={16} className="text-[#2F3A55]" />
            </div>
            <div>
              <h2 className="font-bold text-[#2F3A55] text-base">Nueva sala de estudio</h2>
              <p className="text-xs text-[#5C6B8A]">Crea un espacio colaborativo</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#5C6B8A] hover:bg-[#f4f5f7] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#2F3A55] mb-1.5">
              Nombre de la sala <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="ej. Álgebra Lineal — Parcial 2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#2F3A55] placeholder-[#5C6B8A]/50 focus:outline-none focus:ring-2 focus:ring-[#5C6B8A]/30 focus:border-[#5C6B8A] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2F3A55] mb-1.5">
              Materia <span className="text-red-400">*</span>
            </label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#2F3A55] focus:outline-none focus:ring-2 focus:ring-[#5C6B8A]/30 focus:border-[#5C6B8A] transition-all bg-white"
              required
            >
              <option value="">Selecciona una materia</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2F3A55] mb-1.5">
              Descripción
            </label>
            <textarea
              placeholder="¿En qué se enfocarán hoy?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#2F3A55] placeholder-[#5C6B8A]/50 focus:outline-none focus:ring-2 focus:ring-[#5C6B8A]/30 focus:border-[#5C6B8A] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2F3A55] mb-1.5">
                Máx. participantes
              </label>
              <input
                type="number"
                min={2}
                max={50}
                value={form.maxParticipants}
                onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8eaed] text-sm text-[#2F3A55] focus:outline-none focus:ring-2 focus:ring-[#5C6B8A]/30 focus:border-[#5C6B8A] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A55] mb-1.5">
                Privacidad
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                  form.isPrivate
                    ? "border-[#2F3A55] bg-[#2F3A55] text-white"
                    : "border-[#e8eaed] text-[#5C6B8A] hover:border-[#5C6B8A]"
                }`}
              >
                {form.isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
                {form.isPrivate ? "Privada" : "Pública"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl text-center">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e8eaed] text-sm font-semibold text-[#5C6B8A] hover:bg-[#f4f5f7] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#2F3A55] text-white text-sm font-semibold hover:bg-[#3d4d6e] disabled:opacity-60 transition-colors"
            >
              {loading ? "Creando sala..." : "Crear sala"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}