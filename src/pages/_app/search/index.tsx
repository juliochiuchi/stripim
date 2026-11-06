import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { SearchPage } from "@/pages/_app/-views/search-page"

export const Route = createFileRoute("/_app/search/")({
  validateSearch: (search) =>
    z
      .object({
        q: z.string().trim().max(80).optional(),
        category: z.string().trim().min(1).max(60).optional(),
      })
      .parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const { q, category } = Route.useSearch()
  const navigate = useNavigate()

  return (
    <SearchPage
      q={q ?? ""}
      category={category ?? "all"}
      onPickCategory={(next) => {
        void navigate({
          to: "/search",
          search: { q, category: next },
        })
      }}
    />
  )
}
