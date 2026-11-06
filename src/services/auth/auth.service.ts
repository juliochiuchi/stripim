import { supabase } from "@/lib/supabase"
import type { AdminUser } from "@/types/auth/user"

const SESSION_STORAGE_KEY = "stripim:admin-session"

type UserRow = {
  id: string | number
  username: string
}

/**
 * Autentica o usuário na tabela `strimpim_users` do Supabase
 * e retorna o usuário autenticado para a dashboard admin.
 */
export async function signIn(input: {
  username: string
  password: string
}): Promise<AdminUser> {
  const { data, error } = await supabase
    .from("strimpim_users")
    .select("id, username")
    .eq("username", input.username)
    .eq("password", input.password)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Usuário ou senha inválidos.")

  const row = data as UserRow
  return { id: String(row.id), username: row.username }
}

export function getStoredUser(): AdminUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function storeUser(user: AdminUser) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}
