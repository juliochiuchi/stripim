import { supabase } from "@/lib/supabase"
import type { CreateVideoInput } from "@/schemas/admin/video"
import type { Video } from "@/types/admin/video"

const VIDEO_COLUMNS = "id, title, description, reference, link, publish_date, category_ids"

type VideoRow = {
  id: string
  title: string
  description: string | null
  reference: string | null
  link: string | null
  publish_date: string
  category_ids: string[] | null
}

function mapVideo(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    reference: row.reference,
    link: row.link,
    publishDateISO: row.publish_date,
    categoryIds: row.category_ids ?? [],
  }
}

function toRow(input: CreateVideoInput) {
  return {
    title: input.title,
    description: input.description || null,
    reference: input.reference || null,
    link: input.link || null,
    publish_date: input.publishDate.toISOString(),
    category_ids: input.categoryIds,
  }
}

/** Lista os vídeos cadastrados do mais recente para o mais antigo. */
export async function listVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("strimpim_videos")
    .select(VIDEO_COLUMNS)
    .order("publish_date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data as VideoRow[]).map(mapVideo)
}

/** Escapa curingas/reservados para uso seguro em filtros LIKE do PostgREST. */
function toLikePattern(term: string) {
  const escaped = term.replace(/[\\%_]/g, "\\$&")
  return `%${escaped}%`
}

/** Monta o filtro OR de busca textual (título ou descrição). */
function toSearchFilter(term: string) {
  const pattern = toLikePattern(term)
  const value = /[,()]/.test(pattern) ? `"${pattern}"` : pattern
  return `title.ilike.${value},description.ilike.${value}`
}

/**
 * Busca vídeos por texto (LIKE em título e descrição) e/ou categoria.
 * Os filtros são opcionais e podem ser combinados.
 */
export async function searchVideos(params: {
  q?: string
  categoryId?: string
}): Promise<Video[]> {
  let query = supabase.from("strimpim_videos").select(VIDEO_COLUMNS)

  const q = params.q?.trim()
  if (q) query = query.or(toSearchFilter(q))
  if (params.categoryId) query = query.contains("category_ids", [params.categoryId])

  const { data, error } = await query.order("publish_date", { ascending: false })

  if (error) throw new Error(error.message)
  return (data as VideoRow[]).map(mapVideo)
}

/** Cadastra um novo vídeo vinculado às categorias selecionadas. */
export async function createVideo(input: CreateVideoInput): Promise<Video> {
  const { data, error } = await supabase
    .from("strimpim_videos")
    .insert(toRow(input))
    .select(VIDEO_COLUMNS)
    .single()

  if (error) throw new Error(error.message)
  return mapVideo(data as VideoRow)
}

/** Atualiza um vídeo existente. */
export async function updateVideo(
  id: string,
  input: CreateVideoInput,
): Promise<Video> {
  const { data, error } = await supabase
    .from("strimpim_videos")
    .update(toRow(input))
    .eq("id", id)
    .select(VIDEO_COLUMNS)
    .single()

  if (error) throw new Error(error.message)
  return mapVideo(data as VideoRow)
}

/** Remove um vídeo. */
export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from("strimpim_videos").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
