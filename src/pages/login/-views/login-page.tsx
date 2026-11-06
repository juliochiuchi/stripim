import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { AlertCircle, Loader2, LockKeyhole, LogIn, User } from "lucide-react"
import { useForm } from "react-hook-form"

import logoJericoFilms from "@/assets/jericofilms.jpg"
import { MenuMeta } from "@/components/shared/menu-meta"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, type LoginInput } from "@/schemas/auth/login"
import { signIn, storeUser } from "@/services/auth/auth.service"

export function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = React.useState<string | null>(null)

  React.useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  const isPending = form.formState.isSubmitting

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null)
    try {
      const user = await signIn(values)
      storeUser(user)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      void navigate({ to: "/admin" })
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Não foi possível autenticar.",
      )
    }
  })

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(59,130,246,0.20),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
      </div>

      <div className="animate-page w-full max-w-sm">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <span className="grid size-12 place-items-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
              <img
                src={logoJericoFilms}
                alt="Jericó Films"
                className="size-12 object-cover"
              />
            </span>
            <h1 className="mt-4 text-lg font-semibold tracking-tight">
              Painel administrativo
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Entre com suas credenciais para gerenciar o conteúdo.
            </p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/70">
                Usuário
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="seu.usuario"
                  className="h-10 border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                  {...form.register("username")}
                />
              </div>
              {form.formState.errors.username?.message ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.username.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">
                Senha
              </Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-10 border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                  {...form.register("password")}
                />
              </div>
              {form.formState.errors.password?.message ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            {serverError ? (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-full gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Entrando…
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-6">
          <MenuMeta />
        </div>
      </div>
    </div>
  )
}
