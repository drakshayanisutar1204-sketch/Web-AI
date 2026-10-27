import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, Bookmark, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { Newsletter } from './Newsletter'

export function SiteLayout() {
  const { pathname } = useLocation()
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main id="main-content" key={pathname} className="page-main" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: 0.2 }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

function Header() {
  const { feedStatus, toggleTheme, theme, bookmarks } = useSite()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setMenuOpen(false)
  }

  const statusText = feedStatus === 'live' ? 'LIVE SOURCES CONNECTED' : feedStatus === 'loading' ? 'CONNECTING TO LIVE SOURCES' : 'ILLUSTRATIVE SAMPLE · NOT LIVE NEWS'

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <span className="utility-bar__edition"><span className={`status-dot status-dot--${feedStatus}`} />{statusText}</span>
          <span className="utility-bar__right">INDEPENDENT JOURNALISM FOR WHAT’S NEXT <span className="utility-bar__index">NO. 026</span></span>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="wordmark" to="/" aria-label="Signal home"><span className="wordmark__symbol">S</span><span>SIGNAL<span className="wordmark__period">.</span></span><small>INTELLIGENCE, IN CONTEXT</small></Link>
          <nav className={`main-nav${menuOpen ? ' main-nav--open' : ''}`} aria-label="Main navigation">
            <NavLink to="/latest" onClick={() => setMenuOpen(false)}>Latest</NavLink>
            <NavLink to="/trending" onClick={() => setMenuOpen(false)}>Trending</NavLink>
            <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Topics</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          </nav>
          <div className="header-actions">
            <form className={`header-search${searchOpen ? ' header-search--open' : ''}`} onSubmit={search} role="search">
              <label className="visually-hidden" htmlFor="site-search">Search stories</label>
              <input id="site-search" type="search" placeholder="Search stories" value={query} onChange={(event) => setQuery(event.target.value)} />
              <button className="icon-button" type="submit" aria-label="Search"><Search size={17} /></button>
            </form>
            <Link to="/bookmarks" className="icon-button header-bookmarks" aria-label={`Saved stories${bookmarks.length ? `, ${bookmarks.length}` : ''}`} title="Saved stories"><Bookmark size={18} /><span className="bookmark-count">{bookmarks.length || ''}</span></Link>
            <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
            <button className="icon-button mobile-search-toggle" onClick={() => setSearchOpen((open) => !open)} aria-label={searchOpen ? 'Close search' : 'Open search'}>{searchOpen ? <X size={19} /> : <Search size={19} />}</button>
            <button className="icon-button menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {searchOpen && <form className="mobile-search-form container" onSubmit={search}><label className="visually-hidden" htmlFor="mobile-site-search">Search stories</label><input id="mobile-site-search" type="search" placeholder="Search stories" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button button--dark" type="submit">Search <ArrowRight size={15} /></button></form>}
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container"><Newsletter />
        <div className="footer-main">
          <div className="footer-brand"><Link className="wordmark wordmark--footer" to="/"><span className="wordmark__symbol">S</span><span>SIGNAL<span className="wordmark__period">.</span></span></Link><p>Independent perspective on artificial intelligence and the people shaping what comes next.</p></div>
          <div className="footer-links"><div><span className="footer-heading">EXPLORE</span><Link to="/latest">Latest stories</Link><Link to="/trending">Trending</Link><Link to="/categories">All topics</Link></div><div><span className="footer-heading">SIGNAL</span><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/bookmarks">Saved stories</Link></div></div>
          <Link to="/latest" className="footer-top">BACK TO THE SIGNAL <ArrowDownRight size={15} /></Link>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} SIGNAL JOURNAL</span><span>MADE FOR THE CURIOUS, NOT THE ALGORITHM.</span><span>ALL SAMPLE STORIES ARE CLEARLY LABELED.</span></div>
      </div>
    </footer>
  )
}