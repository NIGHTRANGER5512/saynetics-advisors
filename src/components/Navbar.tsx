import { motion, useReducedMotion } from 'framer-motion'
import { Home, Clapperboard, Workflow, Box, Mail } from 'lucide-react'
import { NavBar, type NavItem } from '@/components/ui/tubelight-navbar'

const items: NavItem[] = [
  { name: 'Home',         url: '#',             icon: Home },
  { name: 'Services',     url: '#services',     icon: Clapperboard },
  { name: 'How It Works', url: '#how-it-works', icon: Workflow },
  { name: 'Portfolio',    url: '#portfolio',    icon: Box },
  { name: 'Contact',      url: '#contact',      icon: Mail },
]

const chip =
  'fixed top-4 z-50 flex items-center rounded-full border border-white/12 bg-charcoal-900/55 backdrop-blur-xl ' +
  'shadow-[0_8px_28px_rgba(0,0,0,0.35),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.18)]'

export default function Navbar() {
  const prefersReduced = useReducedMotion()
  const enter = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { y: -40, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { type: 'spring' as const, stiffness: 260, damping: 30, delay },
        }

  return (
    <header role="banner">
      {/* Logo chip — top left */}
      <motion.a
        href="#"
        aria-label="Saynetics Advisors, home"
        {...enter(0.05)}
        className={`${chip} left-4 sm:left-6 gap-2.5 px-3 py-2 group`}
      >
        <span
          aria-hidden="true"
          className="w-7 h-7 rounded-lg bg-gradient-to-br from-burnt-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-orange transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          S
        </span>
        <span
          className="hidden sm:inline text-white font-semibold text-base uppercase tracking-wider pr-1"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Saynetics
        </span>
      </motion.a>

      {/* Tubelight pill — top-center on desktop, bottom-center (icons) on mobile */}
      <NavBar items={items} />

      {/* CTA chip — top right */}
      <motion.a
        href="#contact"
        {...enter(0.1)}
        className="btn-primary fixed top-4 right-4 sm:right-6 z-50 !px-4 sm:!px-5 !py-2.5 text-xs sm:text-sm"
      >
        <span className="hidden sm:inline">Free Consultation</span>
        <span className="sm:hidden">Enquire</span>
      </motion.a>
    </header>
  )
}
