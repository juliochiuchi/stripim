import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { STREAM_CATEGORIES } from "@/constants/streaming/categories"
import { useCreateStream } from "@/hooks/streaming/use-create-stream"
import { createStreamSchema } from "@/schemas/streaming/create-stream"
import { cn } from "@/lib/utils"

export function PublishDialog({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const { mutateAsync, isPending, created } = useCreateStream()

  type CreateStreamFormValues = z.input<typeof createStreamSchema>

  const form = useForm<CreateStreamFormValues>({
    resolver: zodResolver(createStreamSchema),
    defaultValues: {
      title: "",
      channelName: "",
      channelHandle: "@",
      youtubeUrl: "",
      kind: "video",
      category: "Tech",
      tags: "",
    },
  })

  const submit = form.handleSubmit(async (values) => {
    const parsed = createStreamSchema.parse(values)
    await mutateAsync(parsed)
    form.reset()
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn("gap-2", className)}
          size="sm"
          variant="secondary"
          type="button"
        >
          <Plus className="size-4" />
          Publicar (mock)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publicar conteúdo</DialogTitle>
          <DialogDescription>
            Simulação para apresentação. O item aparece no feed desta sessão.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ex: Live de lançamento..." {...form.register("title")} />
            {form.formState.errors.title?.message ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="channelName">Canal</Label>
              <Input id="channelName" placeholder="Nome do canal" {...form.register("channelName")} />
              {form.formState.errors.channelName?.message ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.channelName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelHandle">Handle</Label>
              <Input id="channelHandle" placeholder="@canal" {...form.register("channelHandle")} />
              {form.formState.errors.channelHandle?.message ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.channelHandle.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">Link do YouTube</Label>
            <Input
              id="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              {...form.register("youtubeUrl")}
            />
            {form.formState.errors.youtubeUrl?.message ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.youtubeUrl.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kind">Tipo</Label>
              <select
                id="kind"
                className="h-9 w-full rounded-xl border border-input bg-background/40 px-3 text-sm shadow-sm backdrop-blur focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                {...form.register("kind")}
              >
                <option value="video">Vídeo publicado</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="h-9 w-full rounded-xl border border-input bg-background/40 px-3 text-sm shadow-sm backdrop-blur focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                {...form.register("category")}
              >
                {STREAM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Textarea
              id="tags"
              placeholder="ex: tech, react, setup"
              className="min-h-20"
              {...form.register("tags")}
            />
          </div>

          {created ? (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-3 text-sm">
              <div className="font-medium">Publicado: {created.title}</div>
              <div className="mt-2">
                <Button asChild size="sm">
                  <Link to="/watch/$id" params={{ id: created.id }}>
                    Assistir agora
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-28"
            >
              {isPending ? "Publicando..." : "Publicar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
