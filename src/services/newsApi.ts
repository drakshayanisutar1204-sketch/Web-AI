import type { Article } from '../types'

type NewsApiResponse = {
  status: string
  articles: Array<{
    title: string
    description: string | null
    url: string
    urlToImage: string | null
    publishedAt: string
    author: string | null
    source: { name: string }
  }>
}

export async function fetchLiveArticles(apiKey: string): Promise<Article[]> {
  const params = new URLSearchParams({
    q: 'artificial intelligence OR AI technology',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '24',
    apiKey,
  })
  const response = await fetch(`https://newsapi.org/v2/everything?${params}`)
  if (!response.ok) throw new Error(`News API request failed (${response.status})`)

  const payload = (await response.json()) as NewsApiResponse
  if (payload.status !== 'ok') throw new Error('News API returned an unsuccessful response')

  return payload.articles
    .filter((item) => item.title && item.url && item.description)
    .map((item, index) => {
      const date = new Date(item.publishedAt)
      const slug = `${toSlug(item.title)}-${index}`
      return {
        id: `live-${index}-${item.publishedAt}`,
        slug,
        title: item.title.replace(/\s-\s[^-]+$/, ''),
        dek: item.description ?? '',
        category: categorize(item.title, item.description ?? ''),
        author: item.author || item.source.name,
        source: item.source.name,
        date: Number.isNaN(date.getTime()) ? 'Recently published' : date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
        readingTime: 'Source article',
        image: item.urlToImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1100&q=85',
        tags: ['AI', 'Latest'],
        origin: 'live' as const,
        url: item.url,
      }
    })
}

function categorize(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase()
  if (/regulat|policy|law|government|copyright|privacy|safety|bill|court/.test(text)) return 'Policy'
  if (/research|study|paper|benchmark|model|training|scientist|open.?source/.test(text)) return 'Research'
  if (/launch|released?|product|app|assistant|device|feature|tool/.test(text)) return 'Products'
  if (/culture|design|artist|creator|education|workplace|worker/.test(text)) return 'Culture'
  if (/company|startup|funding|investment|market|revenue|ceo|business|enterprise/.test(text)) return 'Business'
  return 'Latest'
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64)
}