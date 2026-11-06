import { Church, ExternalLink } from "lucide-react"

export function MenuMeta() {
  return (
    <div className="space-y-4">
      <a
        href="https://www.ipimacaubal.com.br"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Church className="size-4 shrink-0" />
        <span className="truncate">IPI Macaubal</span>
        <ExternalLink className="ml-auto size-3.5 shrink-0 text-white/40" />
      </a>

      <p className="px-1 text-xs leading-relaxed text-white/45">
        Todos na mesma casa.
      </p>

      <div className="space-y-1 px-1 text-[0.7rem] leading-relaxed text-white/35">
        <div>© {new Date().getFullYear()}. Todos os direitos reservados.</div>
        <div className="flex items-center gap-1">
          <span>Desenvolvido por</span>
          <a
            href="https://msjc.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Otherside
          </a>
        </div>
      </div>
    </div>
  )
}
