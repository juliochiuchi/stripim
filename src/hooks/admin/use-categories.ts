import * as React from "react"

import { listCategories } from "@/services/admin/categories.service"
import type { Category } from "@/types/admin/category"

/** Carrega as categorias disponíveis para seleção e listagem. */
export function useCategories() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(
    () =>
      listCategories()
        .then((data) => {
          setCategories(data)
          setError(null)
        })
        .catch((err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Erro ao carregar categorias.",
          )
        })
        .finally(() => setIsLoading(false)),
    [],
  )

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  return { categories, isLoading, error, refresh }
}
