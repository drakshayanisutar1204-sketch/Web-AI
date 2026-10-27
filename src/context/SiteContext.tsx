import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { sampleArticles } from '../data/articles'
import { fetchLiveArticles } from '../services/newsApi'
import type { Article } from '../types'

type SiteContextValue = {
  articles: Article[]
  bookmarks: string[]
  toggleBookmark: (id: string) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  feedStatus: 'sample' | 'loading' | 'live' | 'error'
  feedError: string
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => readStored('signal-bookmarks', []))
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readStored('signal-theme', 'light'))
  const [articles, setArticles] = useState(sampleArticles)
  const [feedStatus, setFeedStatus] = useState<SiteContextValue['feedStatus']>('sample')
  const [feedError, setFeedError] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('signal-theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    localStorage.setItem('signal-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY
    if (!apiKey) return
    let active = true
    setFeedStatus('loading')
    fetchLiveArticles(apiKey)
      .then((liveArticles) => {
        if (!active) return
        setArticles(liveArticles)
        setFeedStatus('live')
      })
      .catch((error: unknown) => {
        if (!active) return
        setFeedStatus('error')
        setFeedError(error instanceof Error ? error.message : 'Unable to load the live feed')
      })
    return () => { active = false }
  }, [])

  function toggleBookmark(id: string) {
    setBookmarks((current) => current.includes(id) ? current.filter((saved) => saved !== id) : [...current, id])
  }

  return (
    <SiteContext.Provider value={{
      articles, bookmarks, toggleBookmark, theme,
      toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
      feedStatus, feedError,
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) throw new Error('useSite must be used within SiteProvider')
  return context
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}