import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { SearchPage } from "@/pages/_app/-views/search-page"

export const Route = createFileRoute("/_app/search/")({
  validateSearch: (search) =>
    z
      .object({
        q: z.string().trim().min(1).max(80),
      })
      .parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const { q } = Route.useSearch()
  return <SearchPage q={q} />
}

