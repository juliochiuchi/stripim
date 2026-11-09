import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { VideoFormDialog } from "@/components/admin/video-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCategories } from "@/hooks/admin/use-categories"
import { useVideos } from "@/hooks/admin/use-videos"
import { deleteVideo } from "@/services/admin/videos.service"
import { formatCompactNumber, formatDate } from "@/utils/streaming/format"

export const Route = createFileRoute("/admin/videos/")({
  component: RouteComponent,
})

const COLUMNS = 6

function RouteComponent() {
  const { videos, isLoading, error, refresh } = useVideos()
  const { categories, isLoading: isLoadingCategories } = useCategories()

  const categoryNameById = React.useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Vídeos
          </h1>
          <p className="text-sm text-white/50">
            Gerencie os vídeos cadastrados e suas categorias.
          </p>
        </div>

        <VideoFormDialog
          onSaved={refresh}
          trigger={
            <Button className="gap-2">
              <Plus className="size-4" />
              Novo vídeo
            </Button>
          }
        />
      </header>

      <Card className="overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Referência</TableHead>
              <TableHead>Publicação</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead className="w-px text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={COLUMNS} className="py-12">
                  <div className="flex items-center justify-center">
                    <Spinner className="size-5 text-white/50" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS}
                  className="py-12 text-center text-sm text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : videos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS}
                  className="py-14 text-center text-sm text-white/40"
                >
                  Nenhum vídeo cadastrado ainda.
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="max-w-[22rem]">
                    <span className="line-clamp-1 font-medium text-white/90">
                      {video.title}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-white/60">
                    {video.reference || "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-white/60">
                    {formatDate(video.publishDateISO)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {video.views > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-white/80">
                          {formatCompactNumber(video.views)}
                        </span>
                        {video.viewsSyncedAtISO ? (
                          <span className="text-[11px] text-white/35">
                            sync {formatDate(video.viewsSyncedAtISO)}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {video.categoryIds.length === 0 ? (
                      <span className="text-white/40">—</span>
                    ) : isLoadingCategories ? (
                      <Spinner className="size-4 text-white/50" />
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {video.categoryIds.map((id) => (
                          <Badge key={id}>{categoryNameById.get(id) ?? "—"}</Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <VideoFormDialog
                        video={video}
                        onSaved={refresh}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar ${video.title}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <ConfirmDeleteDialog
                        title="Remover vídeo"
                        description={`Tem certeza que deseja remover "${video.title}"? Esta ação não pode ser desfeita.`}
                        onConfirm={async () => {
                          await deleteVideo(video.id)
                          await refresh()
                        }}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            aria-label={`Remover ${video.title}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
