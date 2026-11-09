import { supabase } from "@/lib/supabase"

export type VideoStats = {
  views: number
  durationSec: number
  viewsSyncedAt?: string
}

/**
 * Atualiza sob demanda as estatísticas reais de um vídeo publicado
 * (Edge Function refresh-video-stats). Silencioso em caso de falha para
 * não impactar a experiência caso a função não esteja disponível.
 */
export async function refreshVideoStats(
  videoId: string,
): Promise<VideoStats | null> {
  const { data, error } = await supabase.functions.invoke<VideoStats>(
    "refresh-video-stats",
    { body: { id: videoId } },
  )

  if (error || !data) return null
  return data
}
