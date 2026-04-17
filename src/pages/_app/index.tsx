import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { STREAM_CATEGORIES } from "@/constants/streaming/categories"
import { HomePage } from "@/pages/_app/-views/home-page"

const CATEGORY_ENUM = ["all", ...STREAM_CATEGORIES] as const

export const Route = createFileRoute('/_app/')({
  validateSearch: (search) =>
    z
      .object({
        tab: z.enum(["for-you", "live", "videos"]).optional(),
        q: z.string().trim().min(1).max(80).optional(),
        category: z.enum(CATEGORY_ENUM).optional(),
      })
      .parse(search),
  component: Index,
})

function Index() {
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <HomePage
      search={search}
      onPickCategory={(category) => {
        void navigate({
          to: "/",
          search: { ...search, category },
        })
      }}
    />
  )
}
