import { Route, Routes } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import { SiteLayout } from './components/SiteLayout'
import {
  AboutPage,
  ArticlePage,
  BookmarksPage,
  CategoriesPage,
  CategoryPage,
  ContactPage,
  HomePage,
  LatestPage,
  NotFoundPage,
  SearchPage,
  TrendingPage,
} from './pages/Pages'

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="latest" element={<LatestPage />} />
          <Route path="trending" element={<TrendingPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </SiteProvider>
  )
}