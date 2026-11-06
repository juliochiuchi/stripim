export type StreamKind = "live" | "video"

export type StreamCategory =
  | "Adoração"
  | "Música"
  | "Culto"
  | "Louvor"
  | "Ministração"
  | "IPIM"
  | "Church"

export type Stream = {
  id: string
  kind: StreamKind
  title: string
  channelName: string
  channelHandle: string
  category: string
  tags: string[]
  youtubeUrl: string
  createdAtISO: string
  live?: {
    startedAtISO: string
    viewers: number
  }
  video?: {
    publishedAtISO: string
    durationSec: number
    views: number
    reference: string | null
    description: string | null
  }
}

export type ListStreamsParams = {
  q?: string
  kind?: StreamKind | "all"
  category?: string
}

