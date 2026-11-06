import { supabase } from "@/lib/supabase"
import type { CreateCategoryInput } from "@/schemas/admin/category"
import type { Category } from "@/types/admin/category"

const UNIQUE_VIOLATION = "23505"

function mapUniqueError(error: { code?: string; message: string }): Error {
  if (error.code === UNIQUE_VIOLATION) {
    return new Error("Já existe uma categoria com esse nome.")
  }
  return new Error(error.message)
}

/** Lista as categorias cadastradas em ordem alfabética. */
export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("strimpim_categories")
    .select("id, name")
    .order("name", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Category[]
}

/** Cadastra uma nova categoria. */
export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from("strimpim_categories")
    .insert({ name: input.name })
    .select("id, name")
    .single()

  if (error) throw mapUniqueError(error)
  return data as Category
}

/** Atualiza o nome de uma categoria. */
export async function updateCategory(
  id: string,
  input: CreateCategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from("strimpim_categories")
    .update({ name: input.name })
    .eq("id", id)
    .select("id, name")
    .single()

  if (error) throw mapUniqueError(error)
  return data as Category
}

/** Remove uma categoria. */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("strimpim_categories")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}
