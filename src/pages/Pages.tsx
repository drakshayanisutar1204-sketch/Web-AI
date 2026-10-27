import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check, Clock3, ExternalLink, Mail, Share2, Sparkles } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArticleGrid, ArticleSkeletonGrid } from '../components/ArticleCard'
import { categories } from '../data/articles'
import { useSite } from '../context/SiteContext'

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — Signal`
    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description)
  }, [title, description])
}

export function HomePage() {
  const { articles, feedStatus } = useSite()
  usePageMeta('Intelligence, in context', 'An independent journal for artificial intelligence and the people shaping what comes next.')
  const lead = articles[0]
  return (
    <>
      <section className="hero container">
        <div className="hero__topline"><span className="eyebrow">A JOURNAL FOR THE AGE OF AI</span><span className="hero__date">VOL. 01 <i /> ISSUE 026 <i /> EST. 2026</span></div>
        <div className="hero__title-row"><h1>Intelligence,<br /><em>in context.</em></h1><p>Technology moves fast.<br />Understanding takes a little longer.</p></div>
        {lead && <Link to={`/article/${lead.slug}`} className="hero-feature">
          <div className="hero-feature__image"><img src={lead.image} alt="" /><span className="hero-feature__image-label"><Sparkles size={13} /> THE SIGNAL / LEAD STORY</span></div>
          <div className="hero-feature__copy"><span className="eyebrow">{lead.category} <i /> {lead.readingTime}</span><h2>{lead.title}</h2><p>{lead.dek}</p><div className="hero-feature__byline"><span>WORDS BY <b>{lead.author.toUpperCase()}</b></span><span className="round-arrow"><ArrowUpRight size={19} /></span></div></div>
        </Link>}
        <div className="hero__foot"><span><span className={`status-dot status-dot--${feedStatus}`} />{feedStatus === 'live' ? 'CONNECTED TO LIVE SOURCES' : 'SAMPLE STORIES · NOT LIVE REPORTING'}</span><a href="#latest-stories">SCROLL TO EXPLORE <ArrowRight size={14} /></a></div>
      </section>
      <section className="section-block section-block--border" id="latest-stories"><div className="container">
        <SectionHeading index="01" title="The latest thinking" link="/latest" linkText="ALL STORIES" />
        <ArticleGrid articles={articles.slice(1, 4)} />
      </div></section>
      <CategoryStrip />
      <section className="section-block"><div className="container">
        <SectionHeading index="02" title="Worth your attention" link="/trending" linkText="WHAT’S TRENDING" />
        <ArticleGrid articles={articles.slice(4, 7)} />
      </div></section>
    </>
  )
}

export function LatestPage() {
  const { articles, feedStatus, feedError } = useSite()
  const [page, setPage] = useState(1)
  usePageMeta('Latest stories', 'The latest stories and perspectives on artificial intelligence from Signal.')
  return <section className="listing-page container"><PageIntro index="01 / THE JOURNAL" title="Latest stories" description="Fresh perspectives on the ideas, people, and technologies changing how we live and work." />
    <FeedNotice status={feedStatus} error={feedError} />
    {feedStatus === 'loading' ? <ArticleSkeletonGrid /> : <ArticleGrid articles={articles.slice((page - 1) * 6, page * 6)} />}
    {feedStatus !== 'loading' && articles.length > 6 && <Pagination page={page} pages={Math.ceil(articles.length / 6)} onChange={setPage} />}
  </section>
}

export function TrendingPage() {
  const { articles } = useSite()
  usePageMeta('Trending', 'Stories readers are spending time with on Signal.')
  return <section className="listing-page container"><PageIntro index="02 / READER SIGNAL" title="Worth your attention." description="A considered list of the stories readers are spending time with. Curated by our editors, not an algorithm." />
    <div className="editor-note"><span className="editor-note__icon"><Sparkles size={18} /></span><p><b>EDITOR’S NOTE</b> This selection is editorially curated. Sample stories are illustrative and are not live news.</p></div>
    <ArticleGrid articles={articles.slice(0, 6)} />
  </section>
}

export function CategoriesPage() {
  const { articles } = useSite()
  usePageMeta('Topics', 'Explore Signal stories by topic, from AI research to policy and culture.')
  return <section className="listing-page container"><PageIntro index="03 / THE INDEX" title="Ideas, in focus." description="Follow a thread. Find a new one. Every story, organized around the questions worth asking." />
    <div className="topic-grid">{categories.map((category, index) => {
      const count = articles.filter((article) => article.category.toLowerCase() === category.name.toLowerCase()).length
      return <Link key={category.slug} to={`/category/${category.slug}`} className={`topic-card topic-card--${category.color}`}><span className="topic-card__number">0{index + 1} / {String(count).padStart(2, '0')} STORIES</span><span className="topic-card__title">{category.name}</span><span className="topic-card__arrow"><ArrowUpRight size={19} /></span></Link>
    })}</div>
  </section>
}

export function CategoryPage() {
  const { slug = '' } = useParams()
  const { articles } = useSite()
  const category = categories.find((item) => item.slug === slug)
  const matching = articles.filter((article) => article.category.toLowerCase() === category?.name.toLowerCase())
  usePageMeta(category ? `${category.name} stories` : 'Topic not found', 'Explore thoughtful Signal coverage by topic.')
  if (!category) return <NotFoundPage />
  return <section className="listing-page container"><Link className="back-link" to="/categories"><ArrowLeft size={15} /> ALL TOPICS</Link><PageIntro index={`TOPIC / ${category.slug.toUpperCase()}`} title={category.name} description={`Stories and perspectives across ${category.name.toLowerCase()}.`} /><ArticleGrid articles={matching} /></section>
}

export function ArticlePage() {
  const { slug } = useParams()
  const { articles, bookmarks, toggleBookmark } = useSite()
  const article = articles.find((item) => item.slug === slug)
  usePageMeta(article?.title ?? 'Story not found', article?.dek ?? 'The story you are looking for could not be found.')
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    if (navigator.share) await navigator.share({ title: article?.title, url })
    else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }
  }

  if (!article) return <NotFoundPage />
  const related = articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 2)
  const saved = bookmarks.includes(article.id)
  return <article className="story container">
    <Link className="back-link" to={article.origin === 'live' ? '/latest' : '/latest'}><ArrowLeft size={15} /> BACK TO STORIES</Link>
    <header className="story__header"><div className="eyebrow">{article.category.toUpperCase()} <i /> {article.origin === 'live' ? 'SOURCE REPORT' : 'SIGNAL STUDIO'}</div><h1>{article.title}</h1><p className="story__dek">{article.dek}</p>
      <div className="story__byline"><div className="author-mark">{article.author.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><b>{article.author}</b><span>{article.source} <i /> {article.date} <i /> {article.readingTime}</span></div><div className="story__actions"><button className={`icon-button${saved ? ' is-saved' : ''}`} onClick={() => toggleBookmark(article.id)} aria-label={saved ? 'Remove bookmark' : 'Save article'} aria-pressed={saved} title={saved ? 'Remove bookmark' : 'Save article'}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button><button className="icon-button" onClick={() => void share()} aria-label="Share story" title="Share story">{copied ? <Check size={18} /> : <Share2 size={18} />}</button></div></div>
    </header>
    {article.origin === 'sample' && <div className="sample-article-note"><Sparkles size={16} /><span><b>ILLUSTRATIVE AI-GENERATED SAMPLE</b> This is a fictional demonstration story, not live reporting.</span></div>}
    <figure className="story__cover"><img src={article.image} alt="" /><figcaption>IMAGE FOR ILLUSTRATIVE PURPOSES</figcaption></figure>
    <div className="story__body-wrap"><div className="story__body">
      {article.origin === 'live' ? <><p className="story__lead">{article.dek}</p><p>This story was published by {article.source}. Signal links to the original report and does not reproduce its full text.</p><a className="button button--dark story__source-link" href={article.url} target="_blank" rel="noreferrer">READ THE ORIGINAL REPORT <ExternalLink size={15} /></a><p className="story__source-credit">Originally published {article.date} by {article.author || article.source}.</p></> : article.paragraphs?.map((paragraph, index) => index === 0 ? <p className="story__lead" key={paragraph}>{paragraph}</p> : <p key={paragraph}>{paragraph}</p>)}
      <div className="story__tags"><span>IN THIS STORY</span>{article.tags.map((tag) => <span className="story__tag" key={tag}>{tag}</span>)}</div>
    </div><aside className="story__aside"><span className="story__aside-label"><Clock3 size={14} /> {article.readingTime.toUpperCase()}</span><div className="story__aside-rule" /><p>Signal brings context to the stories shaping our relationship with technology.</p><Link to="/about">OUR POINT OF VIEW <ArrowRight size={14} /></Link></aside></div>
    {related.length > 0 && <section className="related-stories"><SectionHeading index="MORE / SIGNAL" title="Stay curious." /><ArticleGrid articles={related} /></section>}
  </article>
}

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const { articles } = useSite()
  usePageMeta(query ? `Search: ${query}` : 'Search', 'Search Signal stories by title, topic, or author.')
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results = articles.filter((article) => words.some((word) => `${article.title} ${article.dek} ${article.category} ${article.author} ${article.tags.join(' ')}`.toLowerCase().includes(word)))
  return <section className="listing-page container"><PageIntro index="04 / SEARCH THE JOURNAL" title={query ? <>Results for <em>“{query}”</em></> : 'Search the journal'} description={query ? `${results.length} ${results.length === 1 ? 'story' : 'stories'} found in the Signal archive.` : 'Find a story by topic, title, or author.'} />{query ? <ArticleGrid articles={results} /> : <SearchPrompt />}</section>
}

export function BookmarksPage() {
  const { articles, bookmarks } = useSite()
  const saved = articles.filter((article) => bookmarks.includes(article.id))
  usePageMeta('Saved stories', 'Your saved Signal stories, stored on this device.')
  return <section className="listing-page container"><PageIntro index="05 / YOUR READING LIST" title="Keep close." description="Stories you’ve saved for another moment. Your reading list stays on this device." />{saved.length ? <ArticleGrid articles={saved} /> : <div className="editor-note"><span className="editor-note__icon"><Bookmark size={18} /></span><p><b>YOUR READING LIST IS EMPTY</b> Save any story with the bookmark icon and it will be waiting here.</p><Link to="/latest" className="text-link">EXPLORE STORIES <ArrowRight size={14} /></Link></div>}</section>
}

export function AboutPage() {
  usePageMeta('About Signal', 'Why Signal exists: independent perspective on artificial intelligence and technology.')
  return <section className="editorial-page container"><PageIntro index="06 / WHY SIGNAL" title={<>A little more<br /><em>signal.</em></>} description="Technology deserves more than a hot take. It deserves attention, context, and a human point of view." />
    <div className="about-layout"><div className="about-stamp">S<span>·</span></div><div className="about-copy"><span className="eyebrow">OUR POINT OF VIEW</span><h2>Curiosity without the noise.</h2><p>Signal is an independent journal exploring artificial intelligence and the people shaping what comes next. We look beyond the launch cycle to ask better questions about how technology changes everyday life.</p><p>We value clarity over certainty, context over speed, and the people behind the systems. Our aim is to make a fast-moving subject feel a little more human, a little more understandable, and much harder to ignore.</p><div className="about-values"><div><span>01</span><b>Stay curious</b><p>Good questions are a form of progress.</p></div><div><span>02</span><b>Bring context</b><p>Technology never happens in a vacuum.</p></div><div><span>03</span><b>Keep it human</b><p>People are the point, not the footnote.</p></div></div></div></div>
  </section>
}

export function ContactPage() {
  const [sent, setSent] = useState(false)
  usePageMeta('Contact Signal', 'Get in touch with the Signal editorial team.')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }
  return <section className="editorial-page container"><PageIntro index="07 / SAY HELLO" title={<>Good things<br /><em>start here.</em></>} description="Have a story tip, a thoughtful disagreement, or just want to say hello? We’re listening." />
    <div className="contact-layout"><div className="contact-aside"><span className="eyebrow">THE INBOX IS OPEN</span><span className="contact-email">Editorial inbox <ArrowUpRight size={17} /></span><p>This contact-page demo does not send messages. Connect an inbox or mail service to receive editorial tips and reader notes.</p><div className="contact-stamp"><Mail size={18} /><span>HUMAN<br />ON THE OTHER<br />END.</span></div></div>
      <form className="contact-form" onSubmit={submit}><span className="eyebrow">SEND A NOTE</span><label htmlFor="contact-name">YOUR NAME</label><input id="contact-name" name="name" placeholder="How should we address you?" required disabled={sent} /><label htmlFor="contact-email">EMAIL ADDRESS</label><input id="contact-email" name="email" type="email" placeholder="you@example.com" required disabled={sent} /><label htmlFor="contact-message">WHAT’S ON YOUR MIND?</label><textarea id="contact-message" name="message" placeholder="A few words are plenty..." rows={5} required disabled={sent} /><button className="button button--dark" type="submit" disabled={sent}>{sent ? <>DEMO COMPLETE <Check size={16} /></> : <>SEND YOUR NOTE <ArrowRight size={16} /> </>}</button><p className="contact-form__status" aria-live="polite">{sent ? 'Demo complete. Your note was not sent or stored.' : 'This form is a front-end demo; connect a mail service to receive submissions.'}</p></form>
    </div>
  </section>
}

export function NotFoundPage() {
  usePageMeta('Page not found', 'This page could not be found on Signal.')
  return <section className="not-found container"><span className="eyebrow">404 / OFF THE RECORD</span><h1>Nothing here<br /><em>but possibility.</em></h1><p>We couldn’t find that page. It may have moved on to the next big thing.</p><Link className="button button--dark" to="/">BACK TO THE SIGNAL <ArrowRight size={15} /></Link></section>
}

function CategoryStrip() {
  return <section className="category-strip"><div className="container category-strip__inner"><span className="eyebrow">FOLLOW YOUR CURIOSITY</span><div>{categories.map((category, index) => <Link key={category.slug} to={`/category/${category.slug}`}><span>0{index + 1}</span>{category.name}<ArrowUpRight size={16} /></Link>)}</div></div></section>
}

function PageIntro({ index, title, description }: { index: string; title: React.ReactNode; description: string }) {
  return <header className="page-intro"><span className="eyebrow">{index}</span><h1>{title}</h1><p>{description}</p><div className="page-intro__line" /></header>
}

function SectionHeading({ index, title, link, linkText }: { index: string; title: string; link?: string; linkText?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{index}</span><h2>{title}</h2></div>{link && <Link to={link} className="text-link">{linkText} <ArrowRight size={15} /></Link>}</div>
}

function FeedNotice({ status, error }: { status: string; error: string }) {
  if (status === 'live') return <div className="feed-notice feed-notice--live"><span className="status-dot status-dot--live" />LIVE SOURCE FEED · ARTICLES LINK TO ORIGINAL PUBLISHERS</div>
  if (status === 'loading') return <div className="feed-notice"><span className="loading-pulse" />CONNECTING TO LIVE SOURCES…</div>
  return <div className={`feed-notice${status === 'error' ? ' feed-notice--error' : ''}`}><Sparkles size={15} />ILLUSTRATIVE AI-GENERATED SAMPLES · NOT LIVE NEWS{error && <span> · {error}</span>}</div>
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  return <nav className="pagination" aria-label="Pagination"><button className="icon-button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page"><ArrowLeft size={16} /></button>{Array.from({ length: pages }, (_, index) => <button key={index} className={`pagination__page${page === index + 1 ? ' is-current' : ''}`} onClick={() => onChange(index + 1)} aria-current={page === index + 1 ? 'page' : undefined}>{String(index + 1).padStart(2, '0')}</button>)}<button className="icon-button" onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="Next page"><ArrowRight size={16} /></button><span>PAGE {String(page).padStart(2, '0')} OF {String(pages).padStart(2, '0')}</span></nav>
}

function SearchPrompt() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`) }
  return <form className="search-prompt" onSubmit={submit}><label htmlFor="search-prompt-input">SEARCH BY TITLE, TOPIC, OR AUTHOR</label><div><input id="search-prompt-input" autoFocus placeholder="Try ‘research’ or ‘Maya Chen’" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button button--dark">FIND STORIES <ArrowRight size={15} /></button></div></form>
}