export type Video = {
  id: string
  title: string
  description: string | null
  reference: string | null
  link: string | null
  publishDateISO: string
  categoryIds: string[]
}
