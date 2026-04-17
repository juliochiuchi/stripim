import type { StreamCategory } from "@/types/streaming/stream"

export const STREAM_CATEGORIES = [
  "Games",
  "Música",
  "Esportes",
  "Tech",
  "Educação",
  "Lifestyle",
  "Notícias",
] as const satisfies StreamCategory[]
