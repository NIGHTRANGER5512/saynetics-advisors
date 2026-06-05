import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Home, Clapperboard, Workflow, Box, Mail } from 'lucide-react'
import { NavBar, type NavItem } from '@/components/ui/tubelight-navbar'
import { GlassEffect } from '@/components/ui/liquid-glass'

const items: NavItem[] = [
  { name: 'Home',         url: '#',             icon: Home },
  { name: 'Services',     url: '#services',     icon: Clapperboard },
  { name: 'How It Works', url: '#how-it-works', icon: Workflow },
  { name: 'Portfolio',    url: '#portfolio',    icon: Box },
  { name: 'Contact',      url: '#contact',      icon: Mail },
]

/* ── Detect whether the navbar is floating over a light section ──────────
   We sample the colour of the pixel 80px below the top of the page at the
   horizontal centre using getComputedStyle + getBoundingClientRect on each
   known section.  This is pure DOM — no canvas, no IntersectionObserver
   complexity — and fires on every scroll tick.                             */
const LIGHT_SECTIONS = ['stats', 'how-it-works', 'portfolio', 'contact']

function useLightBackground(): boolean {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const NAV_Y = 60 // px from top where navbar pills sit

    const check = () => {
      // Walk through elements at the sample point
      const el = document.elementFromPoint(window.innerWidth / 2, NAV_Y)
      if (!el) return

      // Climb ancestors until we find a section
      let node: Element | null = el
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor
        // Parse rgb(a) → luminance check
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (m) {
          const r = +m[1], g = +m[2], b = +m[3]
          // Relative luminance (WCAG formula, simplified)
          const lum = 0.299 * r + 0.587 * g + 0.114 * b
          if (lum > 30) { // not transparent / not near-black
            setIsLight(lum > 160) // cream/paper sections are ~245–250
            return
          }
        }
        node = node.parentElement
      }

      // Fallback: check section IDs
      const sectionInView = LIGHT_SECTIONS.some(id => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= NAV_Y && rect.bottom >= NAV_Y
      })
      setIsLight(sectionInView)
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return isLight
}

export default function Navbar() {
  const prefersReduced = useReducedMotion()
  const isLight = useLightBackground()

  const enter = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { y: -30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { type: 'spring' as const, stiffness: 180, damping: 35, delay },
        }

  /* ── Logo chip glass style adapts to bg ── */
  const logoBgOverlay = isLight
    ? 'rgba(255, 255, 255, 0.45)'
    : 'rgba(15, 15, 15, 0.25)'

  const logoStyle = isLight
    ? {
        boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 1px 1px 1px rgba(255,255,255,0.5)',
        border: '1px solid rgba(0,0,0,0.08)',
      }
    : {
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 1px 1px 1px rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.12)',
      }

  const logoTextColor = isLight ? '#111111' : '#ffffff'

  /* ── CTA chip glass style adapts to bg ── */
  const ctaBgOverlay = isLight
    ? 'rgba(197, 82, 33, 0.85)'
    : 'rgba(197, 82, 33, 0.65)'

  const ctaStyle = isLight
    ? {
        boxShadow: '0 8px 32px rgba(197, 82, 33, 0.35), inset 1px 1px 1px rgba(255,255,255,0.2)',
        border: '1px solid rgba(0,0,0,0.1)',
      }
    : {
        boxShadow: '0 8px 32px rgba(197, 82, 33, 0.25), inset 1px 1px 1px rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.15)',
      }

  return (
    <header role="banner">
      {/* ── Logo chip ── */}
      <motion.div
        {...enter(0.05)}
        className="fixed top-4 left-4 sm:left-6 z-50"
      >
        <GlassEffect
          href="#"
          target="_self"
          className="rounded-2xl px-3 py-2 group hover:scale-[1.02] active:scale-[0.98]"
          bgOverlay={logoBgOverlay}
          style={logoStyle}
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-burnt-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              S
            </span>
            <span
              className="hidden sm:inline font-semibold text-base uppercase tracking-wider pr-1 whitespace-nowrap transition-colors duration-500"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: logoTextColor }}
            >
              Saynetics
            </span>
          </div>
        </GlassEffect>
      </motion.div>

      {/* Tubelight pill — passes theme so it can adapt too */}
      <NavBar items={items} isLight={isLight} />

      {/* ── CTA chip ── */}
      <motion.div
        {...enter(0.1)}
        className="fixed top-4 right-4 sm:right-6 z-50"
      >
        <GlassEffect
          href="#contact"
          target="_self"
          className="rounded-2xl px-4 sm:px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98]"
          bgOverlay={ctaBgOverlay}
          style={ctaStyle}
        >
          <span
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
          >
            <span className="hidden sm:inline">Free Consultation</span>
            <span className="sm:hidden">Enquire</span>
          </span>
        </GlassEffect>
      </motion.div>
    </header>
  )
}
