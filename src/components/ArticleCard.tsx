import { motion } from 'framer-motion'
import { ArrowUpRight, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import type { Article } from '../types'

type ArticleCardProps = { article: Article; featured?: boolean; index?: number }

export function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const { bookmarks, toggleBookmark } = useSite()
  const saved = bookmarks.includes(article.id)

  return (
    <motion.article
      className={`article-card${featured ? ' article-card--featured' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.055, 0.22) }}
    >
      <Link to={`/article/${article.slug}`} className="article-card__image-link" aria-label={`Read ${article.title}`}>
        <img className="article-card__image" src={article.image} alt="" loading="lazy" />
        <span className="article-card__category">{article.category}</span>
        <span className="article-card__open" aria-hidden="true"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="article-card__copy">
        <div className="article-card__meta"><span>{article.source}</span><i />{article.date}<i />{article.readingTime}</div>
        <h3><Link to={`/article/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.dek}</p>
        <div className="article-card__bottom">
          <span className="article-card__author">By {article.author}</span>
          <button className={`icon-button bookmark-button${saved ? ' is-saved' : ''}`} onClick={() => toggleBookmark(article.id)} aria-label={saved ? 'Remove bookmark' : 'Save article'} aria-pressed={saved} title={saved ? 'Remove bookmark' : 'Save article'}>
            <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function ArticleGrid({ articles, featured = false }: { articles: Article[]; featured?: boolean }) {
  if (!articles.length) return <div className="empty-state"><span className="empty-state__mark">∅</span><h3>No stories here yet</h3><p>Try another topic or come back soon.</p></div>
  return <div className={`article-grid${featured ? ' article-grid--featured' : ''}`}>{articles.map((article, index) => <ArticleCard key={article.id} article={article} featured={featured && index === 0} index={index} />)}</div>
}

export function ArticleSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="article-grid article-grid--skeleton" role="status" aria-label="Loading stories" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <article className="article-skeleton" key={index} aria-hidden="true">
          <div className="article-skeleton__image" />
          <div className="article-skeleton__copy">
            <span className="article-skeleton__line article-skeleton__line--meta" />
            <span className="article-skeleton__line article-skeleton__line--title" />
            <span className="article-skeleton__line article-skeleton__line--title-short" />
            <span className="article-skeleton__line article-skeleton__line--dek" />
          </div>
        </article>
      ))}
      <span className="visually-hidden">Loading stories</span>
    </div>
  )
}