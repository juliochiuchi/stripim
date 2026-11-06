import { createFileRoute } from "@tanstack/react-router"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { CategoryFormDialog } from "@/components/admin/category-form-dialog"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
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
import { deleteCategory } from "@/services/admin/categories.service"

export const Route = createFileRoute("/admin/categories/")({
  component: RouteComponent,
})

const COLUMNS = 2

function RouteComponent() {
  const { categories, isLoading, error, refresh } = useCategories()

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Categorias
          </h1>
          <p className="text-sm text-white/50">
            Organize os vídeos criando categorias para vinculá-los.
          </p>
        </div>

        <CategoryFormDialog
          onSaved={refresh}
          trigger={
            <Button className="gap-2">
              <Plus className="size-4" />
              Nova categoria
            </Button>
          }
        />
      </header>

      <Card className="overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
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
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMNS}
                  className="py-14 text-center text-sm text-white/40"
                >
                  Nenhuma categoria cadastrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-white/90">
                    {category.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <CategoryFormDialog
                        category={category}
                        onSaved={refresh}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar ${category.name}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        }
                      />
                      <ConfirmDeleteDialog
                        title="Remover categoria"
                        description={`Tem certeza que deseja remover "${category.name}"? Os vídeos vinculados perderão essa categoria.`}
                        onConfirm={async () => {
                          await deleteCategory(category.id)
                          await refresh()
                        }}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            aria-label={`Remover ${category.name}`}
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
