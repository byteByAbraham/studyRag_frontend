"use client"

import { useState, useEffect } from "react"
import { FileText, HardDrive, FolderOpen, Clock } from "lucide-react"

interface StatsData {
  totalDocs: number
  storageUsed: string
  folders: number
  recentThisWeek: number
}

export function DocStatsBar() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reemplaza con la URL de tu endpoint 
    fetch("http://localhost:8000/stats")
      .then((res) => res.json())
      .then((json: StatsData) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error cargando estadísticas:", err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) return null 

  const stats = [
    {
      label: "Total documentos",
      value: data.totalDocs.toString(),
      sub: "archivos subidos",
      icon: FileText,
      color: "bg-[#2F3A55]",
      iconColor: "text-white",
    },
    {
      label: "Almacenamiento",
      value: data.storageUsed,
      sub: "usados",
      icon: HardDrive,
      color: "bg-[#5C6B8A]",
      iconColor: "text-white",
    },
    {
      label: "Carpetas",
      value: data.folders.toString(),
      sub: "categorías activas",
      icon: FolderOpen,
      color: "bg-[#B0BA92]",
      iconColor: "text-[#2F3A55]",
    },
    {
      label: "Recientes",
      value: data.recentThisWeek.toString(),
      sub: "subidos esta semana",
      icon: Clock,
      color: "bg-[#D6DCCA]",
      iconColor: "text-[#2F3A55]",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#e8eaed] p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
            >
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#2F3A55] leading-tight">{stat.value}</p>
              <p className="text-xs text-[#5C6B8A] mt-0.5">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}