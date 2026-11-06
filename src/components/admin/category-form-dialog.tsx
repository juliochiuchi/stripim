import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2 } from "lucide-react"
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
import { createCategorySchema } from "@/schemas/admin/category"
import {
  createCategory,
  updateCategory,
} from "@/services/admin/categories.service"
import type { Category } from "@/types/admin/category"

type CategoryFormValues = z.input<typeof createCategorySchema>

type CategoryFormDialogProps = {
  category?: Category
  trigger: React.ReactNode
  onSaved: () => void
}

export function CategoryFormDialog({
  category,
  trigger,
  onSaved,
}: CategoryFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const isEditing = Boolean(category)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize o nome da categoria."
              : "Crie uma categoria para vincular aos vídeos."}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          category={category}
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

type CategoryFormProps = {
  category?: Category
  onCancel: () => void
  onDone: () => void
}

function CategoryForm({ category, onCancel, onDone }: CategoryFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: category?.name ?? "" },
  })

  const isPending = form.formState.isSubmitting

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null)
    try {
      const parsed = createCategorySchema.parse(values)
      if (category) {
        await updateCategory(category.id, parsed)
      } else {
        await createCategory(parsed)
      }
      onDone()
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a categoria.",
      )
    }
  })

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          maxLength={50}
          placeholder="Ex: Adoração"
          {...form.register("name")}
        />
        {form.formState.errors.name?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.name.message}
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
          ) : category ? (
            "Salvar alterações"
          ) : (
            "Cadastrar categoria"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
