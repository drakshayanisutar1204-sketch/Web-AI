import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    const subscribers = readSubscribers()
    if (!subscribers.includes(email.trim().toLowerCase())) {
      localStorage.setItem('signal-newsletter', JSON.stringify([...subscribers, email.trim().toLowerCase()]))
    }
    setSubscribed(true)
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter__orb" aria-hidden="true" />
      <div className="newsletter__copy">
        <span className="eyebrow eyebrow--light">THE SIGNAL LETTER · EVERY THURSDAY</span>
        <h2 id="newsletter-title">A clearer signal<br />in a noisy world.</h2>
        <p>One thoughtful dispatch on AI, technology, and what it means for us.</p>
      </div>
      <form className="newsletter__form" onSubmit={subscribe}>
        <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
        <div className="newsletter__input-wrap">
          <input id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={subscribed} />
          <button type="submit" aria-label={subscribed ? 'Subscribed' : 'Subscribe to newsletter'} disabled={subscribed}>{subscribed ? <Check size={18} /> : <ArrowRight size={18} />}</button>
        </div>
        <span className="newsletter__note" aria-live="polite">{subscribed ? 'Saved on this device. No email is sent in this demo.' : 'Demo signup is stored on this device; no email is sent.'}</span>
      </form>
    </section>
  )
}

function readSubscribers(): string[] {
  try { return JSON.parse(localStorage.getItem('signal-newsletter') || '[]') as string[] } catch { return [] }
}