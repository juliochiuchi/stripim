import { z } from "zod"

import { STREAM_CATEGORIES } from "@/constants/streaming/categories"

export const createStreamSchema = z.object({
  title: z.string().trim().min(3).max(120),
  channelName: z.string().trim().min(2).max(60),
  channelHandle: z
    .string()
    .trim()
    .min(2)
    .max(32)
    .regex(/^@[\w.-]+$/, "Use um @handle (ex: @canal)"),
  youtubeUrl: z.string().url(),
  kind: z.enum(["live", "video"]),
  category: z.enum(STREAM_CATEGORIES),
  tags: z.string().trim().max(80).optional(),
})

export type CreateStreamInput = z.infer<typeof createStreamSchema>
