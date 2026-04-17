import type { CreateStreamInput } from "@/schemas/streaming/create-stream"
import { STREAMS_MOCK } from "@/services/streaming/streaming-mock.data"
import type { ListStreamsParams, Stream } from "@/types/streaming/stream"

let customStreams: Stream[] = []

function sortByNewest(a: Stream, b: Stream) {
  return new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()
}

function includesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase())
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function parseTags(input?: string) {
  return input
    ? input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6)
    : []
}

export async function listStreams(params: ListStreamsParams = {}) {
  const q = params.q?.trim()
  const all = [...customStreams, ...STREAMS_MOCK].sort(sortByNewest)

  return all.filter((s) => {
    if (params.kind && params.kind !== "all" && s.kind !== params.kind) return false
    if (params.category && params.category !== "all" && s.category !== params.category)
      return false
    if (!q) return true
    return (
      includesQuery(s.title, q) ||
      includesQuery(s.channelName, q) ||
      includesQuery(s.category, q) ||
      s.tags.some((t) => includesQuery(t, q))
    )
  })
}

export async function getStreamById(id: string) {
  const all = [...customStreams, ...STREAMS_MOCK]
  return all.find((s) => s.id === id) ?? null
}

export async function createStream(input: CreateStreamInput) {
  const now = new Date().toISOString()
  const tags = parseTags(input.tags)

  const created: Stream =
    input.kind === "live"
      ? {
        id: makeId("live"),
        kind: "live",
        title: input.title,
        channelName: input.channelName,
        channelHandle: input.channelHandle,
        category: input.category,
        tags,
        youtubeUrl: input.youtubeUrl,
        createdAtISO: now,
        live: {
          startedAtISO: now,
          viewers: Math.floor(800 + Math.random() * 120_000),
        },
      }
      : {
        id: makeId("video"),
        kind: "video",
        title: input.title,
        channelName: input.channelName,
        channelHandle: input.channelHandle,
        category: input.category,
        tags,
        youtubeUrl: input.youtubeUrl,
        createdAtISO: now,
        video: {
          publishedAtISO: now,
          durationSec: Math.floor(180 + Math.random() * 2700),
          views: Math.floor(2000 + Math.random() * 4_500_000),
        },
      }

  customStreams = [created, ...customStreams].slice(0, 40)
  return created
}

export async function searchStreamsMock(q: string) {
  const trimmed = q.trim()
  const base = await listStreams({ q: trimmed, kind: "all", category: "all" })
  const fallback = await listStreams({ kind: "all", category: "all" })
  const source = base.length ? base : fallback

  const results: Stream[] = []
  for (let i = 0; i < 50; i++) {
    const s = source[i % source.length]!
    const createdAtISO = new Date(Date.now() - i * 60_000).toISOString()
    const id = `search-${i + 1}-${s.id}`
    const title = trimmed ? `${s.title} · ${trimmed}` : s.title

    results.push(
      s.kind === "live"
        ? {
            ...s,
            id,
            title,
            createdAtISO,
            live: {
              startedAtISO: createdAtISO,
              viewers: Math.floor(700 + Math.random() * 180_000),
            },
          }
        : {
            ...s,
            id,
            title,
            createdAtISO,
            video: {
              publishedAtISO: createdAtISO,
              durationSec: s.video?.durationSec ?? Math.floor(240 + Math.random() * 2400),
              views: Math.floor(2000 + Math.random() * 9_500_000),
            },
          },
    )
  }

  return results
}
