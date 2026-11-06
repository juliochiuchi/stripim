import { z } from "zod"

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe ao menos 2 caracteres.")
    .max(50, "Máximo de 50 caracteres."),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
