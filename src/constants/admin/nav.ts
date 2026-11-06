import type { ComponentType } from "react"
import { Clapperboard, Tags } from "lucide-react"

type AdminNavItem = {
  key: "videos" | "categories"
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  to: "/admin/videos" | "/admin/categories"
}

export const ADMIN_NAV: readonly AdminNavItem[] = [
  {
    key: "videos",
    label: "Cadastrar vídeos",
    description: "Cadastre e gerencie os vídeos e suas categorias.",
    icon: Clapperboard,
    to: "/admin/videos",
  },
  {
    key: "categories",
    label: "Cadastrar categorias",
    description: "Organize as categorias disponíveis para os vídeos.",
    icon: Tags,
    to: "/admin/categories",
  },
]
