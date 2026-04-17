import dayjs from "dayjs"
import "dayjs/locale/pt-br"

dayjs.locale("pt-br")

export function formatDate(iso: string) {
  return dayjs(iso).format("DD MMM YYYY")
}

export function formatTime(iso: string) {
  return dayjs(iso).format("HH:mm")
}

export function formatCompactNumber(n: number) {
  if (!Number.isFinite(n)) return "-"
  const abs = Math.abs(n)
  if (abs < 1_000) return `${n}`
  if (abs < 1_000_000) return `${(n / 1_000).toFixed(abs < 10_000 ? 1 : 0)}K`
  if (abs < 1_000_000_000)
    return `${(n / 1_000_000).toFixed(abs < 10_000_000 ? 1 : 0)}M`
  return `${(n / 1_000_000_000).toFixed(1)}B`
}

export function formatDuration(totalSec: number) {
  const sec = Math.max(0, Math.floor(totalSec))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

