export type ArticleOrigin = 'sample' | 'live'

export type Article = {
  id: string
  slug: string
  title: string
  dek: string
  category: string
  author: string
  source: string
  date: string
  readingTime: string
  image: string
  tags: string[]
  paragraphs?: string[]
  origin: ArticleOrigin
  url?: string
}