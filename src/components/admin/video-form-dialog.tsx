import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/hooks/admin/use-categories"
import { createVideoSchema } from "@/schemas/admin/video"
import { createVideo, updateVideo } from "@/services/admin/videos.service"
import type { Video } from "@/types/admin/video"

type VideoFormValues = z.input<typeof createVideoSchema>

type VideoFormDialogProps = {
  video?: Video
  trigger: React.ReactNode
  onSaved: () => void
}

export function VideoFormDialog({
  video,
  trigger,
  onSaved,
}: VideoFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isEditing = Boolean(video)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar vídeo" : "Novo vídeo"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do vídeo e suas categorias."
              : "Adicione um novo vídeo e vincule-o a uma ou mais categorias."}
          </DialogDescription>
        </DialogHeader>

        <VideoForm
          video={video}
          onCancel={() => setOpen(false)}
          onDone={() => {
            setOpen(false)
            onSaved()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

type VideoFormProps = {
  video?: Video
  onCancel: () => void
  onDone: () => void
}

function VideoForm({ video, onCancel, onDone }: VideoFormProps) {
  const { categories, isLoading, error: categoriesError } = useCategories()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      title: video?.title ?? "",
      description: video?.description ?? "",
      reference: video?.reference ?? "",
      link: video?.link ?? "",
      publishDate: video ? new Date(video.publishDateISO) : undefined,
      categoryIds: video?.categoryIds ?? [],
    },
  })

  const isPending = form.formState.isSubmitting

  const categoryOptions = React.useMemo(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories],
  )

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null)
    try {
      const parsed = createVideoSchema.parse(values)
      if (video) {
        await updateVideo(video.id, parsed)
      } else {
        await createVideo(parsed)
      }
      onDone()
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Não foi possível salvar o vídeo.",
      )
    }
  })

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          maxLength={65}
          placeholder="Ex: Culto de domingo — 03/11"
          {...form.register("title")}
        />
        {form.formState.errors.title?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          maxLength={110}
          placeholder="Breve resumo do conteúdo (até 110 caracteres)"
          className="min-h-20"
          {...form.register("description")}
        />
        {form.formState.errors.description?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="reference">Referência</Label>
          <Input
            id="reference"
            maxLength={30}
            placeholder="Ex: dQw4w9WgXcQ"
            {...form.register("reference")}
          />
          {form.formState.errors.reference?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.reference.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishDate">Data de publicação</Label>
          <Controller
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <DatePicker
                id="publishDate"
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione a data"
              />
            )}
          />
          {form.formState.errors.publishDate?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.publishDate.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          type="url"
          maxLength={255}
          placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          {...form.register("link")}
        />
        {form.formState.errors.link?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.link.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryIds">Categorias</Label>
        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <MultiSelect
              id="categoryIds"
              options={categoryOptions}
              value={field.value}
              onChange={field.onChange}
              isLoading={isLoading}
              placeholder="Selecione uma ou mais categorias"
              searchPlaceholder="Buscar categoria…"
              emptyText={
                categoriesError
                  ? categoriesError
                  : "Nenhuma categoria cadastrada. Crie uma na página Categorias."
              }
            />
          )}
        />
        {form.formState.errors.categoryIds?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.categoryIds.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-32 gap-2">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Salvando…
            </>
          ) : video ? (
            "Salvar alterações"
          ) : (
            "Cadastrar vídeo"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
