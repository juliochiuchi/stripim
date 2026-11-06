import { z } from "zod"

export const createVideoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe ao menos 3 caracteres.")
    .max(65, "Máximo de 65 caracteres."),
  description: z
    .string()
    .trim()
    .max(110, "Máximo de 110 caracteres."),
  reference: z
    .string()
    .trim()
    .max(30, "Máximo de 30 caracteres."),
  link: z
    .string()
    .trim()
    .max(255, "Máximo de 255 caracteres.")
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Informe um link válido.",
    })
    .optional(),
  publishDate: z.date("Informe a data de publicação."),
  categoryIds: z.array(z.uuid()).min(1, "Selecione ao menos uma categoria."),
})

export type CreateVideoInput = z.infer<typeof createVideoSchema>
