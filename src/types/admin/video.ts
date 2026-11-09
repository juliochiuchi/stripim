export type Video = {
  id: string
  title: string
  description: string | null
  reference: string | null
  link: string | null
  publishDateISO: string
  categoryIds: string[]
  /** Contagem de visualizações sincronizada do YouTube. */
  views: number
  /** Duração em segundos sincronizada do YouTube. */
  durationSec: number
  /** Momento do último sync das estatísticas (null para vídeos sem sync). */
  viewsSyncedAtISO: string | null
}
