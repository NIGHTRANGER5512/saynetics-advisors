import { type ReactNode } from 'react'
import { motion, type Variants, useReducedMotion } from 'framer-motion'
import { GlowCard } from '@/components/ui/spotlight-card'
import { ScrambleHeading } from '@/components/ui/scramble-heading'

interface Service { icon: ReactNode; title: string; desc: string; tag: string; featured?: boolean }

const services: Service[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'AI Cinematic Videography',
    desc: 'Photorealistic, AI-generated property films and walkthroughs, created from your photos with no film crew or location delays. We turn your listing into a cinematic video tour buyers fall in love with before they ever visit.',
    tag: 'Most Popular',
    featured: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: 'AR Property Viewer',
    desc: 'Let buyers walk through your property from their phone before leaving home. Our AR viewer is built to cut wasted site visits and pre-qualify serious buyers automatically.',
    tag: 'Cutting Edge',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: 'Virtual Staging',
    desc: 'Transform bare spaces into beautifully styled interiors with AI-powered virtual staging. Buyers see the full potential of every room without costly physical staging or delays.',
    tag: '48hr Delivery',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Automated Follow-up',
    desc: 'Never lose a lead to slow follow-up again. Our AI sends personalised WhatsApp and email messages within minutes of every enquiry, nurturing prospects 24/7 on full autopilot.',
    tag: 'AI-Powered',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: 'Agent Website Development',
    desc: 'Premium, mobile-first websites for agents and developers, with lead capture, property listings, and WhatsApp integration built in from day one.',
    tag: 'Custom Built',
  },
]

/* ── Shutter reveal — horizontal slats retract upward to unveil each card ── */
const SLATS = 6
const shutterParent: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.05 } },
}
const slat: Variants = {
  closed: { scaleY: 1 },
  open:   { scaleY: 0, transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] } },
}

export default function Services() {
  const prefersReduced = useReducedMotion()

  return (
    /* Dark charcoal section — spotlight glow cards need a dark base */
    <section id="services" className="relative py-24 bg-charcoal-section overflow-hidden">
      {/* Faint vanishing-point grid */}
      <div aria-hidden="true" className="absolute inset-0 perspective-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Section header — fade + rise ── */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          className="max-w-xl mb-16"
        >
          <div className="section-tag">Our Services</div>

          <ScrambleHeading
            as="h2"
            className="section-heading-light"
            text="Everything You Need to Sell Faster"
            highlight="Sell Faster"
          />

          <p className="section-sub-light">
            From first impression to final signature, our complete marketing stack is built for the modern Indian real estate market.
          </p>
        </motion.div>

        {/* ── Card grid — each card unveils with a camera-shutter reveal ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className="relative overflow-hidden rounded-xl"
              initial={prefersReduced ? false : 'closed'}
              whileInView={prefersReduced ? undefined : 'open'}
              viewport={{ once: true, amount: 0.3 }}
              variants={shutterParent}
              transition={{ delayChildren: i * 0.08 }}
            >
              <GlowCard
                glowColor={s.featured ? 'amber' : 'orange'}
                customSize
                className="w-full !h-full min-h-[280px] !grid-rows-none flex flex-col gap-4 !p-6 group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded flex items-center justify-center bg-burnt-500/15 text-burnt-400 ring-1 ring-burnt-500/20">
                    {s.icon}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                      s.featured
                        ? 'bg-burnt-500 text-white border-burnt-500'
                        : 'bg-white/5 text-white/55 border-white/10'
                    }`}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {s.tag}
                  </span>
                </div>

                <div>
                  <h3
                    className="text-white font-black text-base mb-2"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
                </div>

                <a
                  href="#contact"
                  className="mt-auto text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all text-burnt-400"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.03em', textTransform: 'uppercase', fontSize: '0.7rem' }}
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </GlowCard>

              {/* Shutter slats — collapse upward, top-to-bottom, to reveal the card */}
              {!prefersReduced && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 flex flex-col rounded-xl overflow-hidden">
                  {Array.from({ length: SLATS }).map((_, k) => (
                    <motion.div
                      key={k}
                      variants={slat}
                      style={{ originY: 0 }}
                      className="flex-1 bg-charcoal-900 border-b border-burnt-500/15 last:border-b-0"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
