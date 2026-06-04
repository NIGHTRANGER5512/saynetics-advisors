import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion'

const links = [
  { label: 'Services',     href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Portfolio',    href: '#portfolio' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('')
  const prefersReduced          = useReducedMotion()
  const headerRef               = useRef<HTMLElement>(null)

  /* No window scroll listener — use Motion’s scroll value */
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 40))

  /* Close menu on outside click */
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler as unknown as EventListener)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler as unknown as EventListener)
    }
  }, [open])

  /* Track which section is in view */
  useEffect(() => {
    const ids = links.map(l => l.href.slice(1))
    const observers: IntersectionObserver[] = []

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <header
      ref={headerRef}
      role="banner"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-charcoal-800/95 backdrop-blur-md border-b border-white/8 shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16"
      >
        {/* Logo */}
        <a href="#" aria-label="Saynetics Advisors, home" className="flex items-center gap-2.5 group">
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded bg-burnt-500 flex items-center justify-center text-white font-bold text-sm"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >S</span>
          <span
            className="text-white font-semibold text-lg uppercase tracking-wider"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Saynetics
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {links.map(l => {
            const isActive = active === l.href.slice(1)
            return (
              <li key={l.label}>
                <a
                  href={l.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`text-sm font-medium tracking-wide transition-colors duration-150 relative pb-0.5 ${
                    isActive
                      ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burnt-500 after:rounded'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <a href="#contact" className="btn-primary text-sm px-5 py-2.5">
            Free Consultation
          </a>
        </div>

        {/* Hamburger — rule: aria-labels for icon-only button */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden p-2.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-charcoal-800/98 backdrop-blur-md border-b border-white/8"
          >
            <ul className="px-4 py-4 flex flex-col gap-1" role="list">
              {links.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.href.slice(1) ? 'true' : undefined}
                    className="block px-3 py-3 rounded text-white/70 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors min-h-[44px] flex items-center"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center text-sm"
                >
                  Free Consultation
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
