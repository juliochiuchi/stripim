import type { StreamCategory } from "@/types/streaming/stream"

export const STREAM_CATEGORIES = [
  "Adoração",
  "Música",
  "Culto",
  "Louvor",
  "Ministração",
  "IPIM",
  "Church",
] as const satisfies StreamCategory[]
