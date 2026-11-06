import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { HomePage } from "@/pages/_app/-views/home-page"

export const Route = createFileRoute('/_app/')({
  validateSearch: (search) =>
    z
      .object({
        tab: z.enum(["for-you", "live", "videos"]).optional(),
        q: z.string().trim().min(1).max(80).optional(),
        category: z.string().trim().min(1).max(60).optional(),
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
          to: "/search",
          search: { q: search.q, category },
        })
      }}
    />
  )
}
