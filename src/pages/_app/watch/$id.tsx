import { createFileRoute } from "@tanstack/react-router"

import { WatchPage } from "@/pages/_app/-views/watch-page"

export const Route = createFileRoute("/_app/watch/$id")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <WatchPage id={id} />
}
