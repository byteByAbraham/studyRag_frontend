"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  CreditCard,
  ClipboardList,
  Users,
  TrendingUp,
  LogOut,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Progreso",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    label: "Sala de Estudio",
    href: "/rooms",
    icon: Users,
  },
  {
    label: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    label: "Documentos",
    href: "/documents",
    icon: FileText,
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    icon: CreditCard,
  },
  {
    label: "Exámenes",
    href: "/exams",
    icon: ClipboardList,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col min-h-screen bg-[#2F3A55] text-white shrink-0 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#B0BA92] shrink-0">
            <GraduationCap className="w-5 h-5 text-[#2F3A55]" />
          </div>

          {!collapsed && (
            <div>
              <p className="font-bold text-base tracking-tight text-white">
                StudySpace
              </p>
              <p className="text-[10px] text-white/50 uppercase tracking-wide">
                Plataforma de estudio
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Menú principal
          </p>
        )}

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href))

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : ""}
              className={cn(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
                collapsed
                  ? "justify-center py-3"
                  : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-[#B0BA92] text-[#2F3A55]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  isActive
                    ? "text-[#2F3A55]"
                    : "text-white/50 group-hover:text-white"
                )}
              />

              {!collapsed && (
                <>
                  <span>{item.label}</span>

                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2F3A55]/60" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Botón cerrar sesión */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          className={cn(
            "flex items-center rounded-xl text-sm transition-all text-white/60 hover:text-white hover:bg-white/10",
            collapsed
              ? "justify-center w-full py-3"
              : "gap-3 w-full px-3 py-2.5"
          )}
        >
          <LogOut size={18} />

          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}