# Signal Journal

A responsive editorial blog about artificial intelligence and technology, built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Run locally

1. Install Node.js 20.19+ or 22.12+ and npm.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and optionally add a NewsAPI.org API key.
4. Run `npm run dev` and open the local URL printed by Vite.

Run `npm run build` for a production build and `npm run preview` to serve it locally.

## News and data

Without `VITE_NEWS_API_KEY`, the site displays AI-generated illustrative sample stories. They are labeled as samples and are not live reporting. With a NewsAPI.org key, the app requests current AI-related articles and links each result to its publisher. The public client bundle exposes `VITE_*` values, so this direct integration is suitable for local demonstration only. For production, put the API key behind a server-side endpoint and review NewsAPI's plan, terms, and browser/CORS requirements.

Bookmarks, theme preference, and newsletter demo signups are saved in this browser's local storage. The contact form is a front-end demonstration and does not send email; connect a mail provider or backend to receive submissions. No database or backend is required for the local demo.

## Pages and features

- Home, latest, trending, topics, topic-filtered stories, story detail, search, saved stories, about, and contact routes.
- Responsive navigation, theme switching, animated page transitions and story reveals, local bookmarks, search, pagination, sharing, and empty/error/loading states.
- Accessible labels, semantic landmarks, focus styles, and page-specific document titles and descriptions.