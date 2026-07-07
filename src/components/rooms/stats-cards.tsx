"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, Zap } from "lucide-react"

interface Stats {
  activeRooms: number
  sessionsToday: number
  connectedStudents: number
}

const DEFAULT_STATS: Stats = {
  activeRooms: 0,
  sessionsToday: 0,
  connectedStudents: 0,
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ←←← AJUSTA ESTA URL SEGÚN TU BACKEND
  const STATS_URL = '/api/stats' // Ej: http://localhost:3001/api/stats o /api/dashboard/stats

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(STATS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
       
      })

      if (!res.ok) throw new Error('No se pudieron cargar las estadísticas')

      const data: Stats = await res.json()

      setStats(data)
    } catch (err) {
      console.error(err)
      setError('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refreshStats = () => fetchStats()

  const statItems = [
    {
      label: "Salas activas",
      value: stats.activeRooms,
      icon: Users,
      color: "#2F3A55",
      border: "#B0BA92",
      bg: "#F0F2F5",
      sub: "Activos",
    },
    {
      label: "Sesiones hoy",
      value: stats.sessionsToday,
      icon: BookOpen,
      color: "#5C6B8A",
      border: "#D6E6F0",
      bg: "#EBF2F9",
      sub: "Hoy",
    },
    {
      label: "Estudiantes conectados",
      value: stats.connectedStudents,
      icon: Zap,
      color: "#C28A2B",
      border: "#B0BA92",
      bg: "#FFF5E6",
      sub: "Conectados",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon

        return (
          <div
            key={index}
            className="rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-l-4"
            style={{ borderLeftColor: stat.border }}
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon size={22} style={{ color: stat.color }} />
              </div>

              <span
                className="text-[11px] font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: stat.bg,
                  color: stat.color,
                }}
              >
                {stat.sub}
              </span>
            </div>

            <h2 className="text-4xl font-bold text-[#2F3A55]">
              {loading ? "—" : stat.value}
            </h2>

            <p className="mt-2 text-sm font-medium text-gray-500">
              {stat.label}
            </p>

            {error && (
              <p className="text-[10px] text-red-500 mt-1">⚠️ {error}</p>
            )}
          </div>
        )
      })}

      {/* Botón de refrescar (opcional) */}
      {!loading && (
        <button
          onClick={refreshStats}
          className="absolute top-4 right-4 text-xs text-[#5C6B8A] hover:text-[#2F3A55] flex items-center gap-1"
        >
          ↻ Actualizar
        </button>
      )}
    </div>
  )
}