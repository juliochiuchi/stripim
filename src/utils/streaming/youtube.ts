export type YoutubeResolved = {
  id: string
  embedUrl: string
  thumbnailUrl: string
}

const YT_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/|shorts\/|embed\/))([a-zA-Z0-9_-]{6,})/

export function resolveYoutube(input: string): YoutubeResolved | null {
  const match = input.match(YT_ID_RE)
  const id = match?.[1]
  if (!id) return null
  return {
    id,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  }
}

