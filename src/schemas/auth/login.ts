import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Informe o usuário").max(60),
  password: z.string().min(1, "Informe a senha").max(120),
})

export type LoginInput = z.infer<typeof loginSchema>
