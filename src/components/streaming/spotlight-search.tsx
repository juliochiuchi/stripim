import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import { Search, X } from "lucide-react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SpotlightContextValue = {
  openSpotlight: () => void
}

const SpotlightContext = React.createContext<SpotlightContextValue | null>(null)

export function useSpotlight() {
  const ctx = React.useContext(SpotlightContext)
  if (!ctx) throw new Error("useSpotlight must be used within SpotlightProvider")
  return ctx
}

export function SpotlightProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const openSpotlight = React.useCallback(() => {
    setOpen(true)
  }, [])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey && e.code === "Space")) return
      const el = document.activeElement as HTMLElement | null
      const tag = el?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || (el as any)?.isContentEditable) return
      e.preventDefault()
      setOpen(true)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  const submit = async () => {
    const q = value.trim()
    if (!q) return
    setOpen(false)
    setValue("")
    await navigate({ to: "/search", search: { q } as never })
  }

  return (
    <SpotlightContext.Provider value={{ openSpotlight }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "max-w-[760px] border-white/10 bg-black/55 p-0 text-white backdrop-blur-2xl",
            "shadow-[0_40px_120px_rgba(0,0,0,0.65)]",
            "**:data-[slot=dialog-close]:hidden",
          )}
        >
          <div className="relative overflow-hidden rounded-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_-10%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(700px_circle_at_90%_10%,rgba(59,130,246,0.16),transparent_60%)]" />
            <div className="relative px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Search className="size-4 text-white/80" />
                </span>

                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        void submit()
                      }
                      if (e.key === "Escape") setOpen(false)
                    }}
                    placeholder="Digite para buscar vídeos e lives…"
                    className="h-12 border-white/10 bg-white/5 pl-4 text-base text-white placeholder:text-white/40 focus-visible:ring-white/20"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/20"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-2 ml-[52px] flex items-center justify-between pr-[52px] text-xs text-white/45">
                <span>Enter para pesquisar · Esc para fechar</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                  ⌘ Space
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SpotlightContext.Provider>
  )
}
