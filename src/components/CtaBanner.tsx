import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { AnimatedHeading } from '@/components/ui/scramble-heading'

/* Full-width CTA band — the Three.js shader runs as the background, recoloured
   to the burnt/amber palette via a mix-blend overlay so it stays on-brand.
   The shader only mounts once the band scrolls into view (perf + "does its
   thing on scroll"). */
export default function CtaBanner() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()

  return (
    <section ref={ref} aria-label="Get started" className="relative overflow-hidden bg-black">
      <div className="relative h-[520px] md:h-[600px] flex items-center justify-center">

        {/* Shader background — mounts when scrolled into view (skipped for reduced-motion) */}
        <div aria-hidden="true" className="absolute inset-0">
          {inView && !reduce && <ShaderAnimation />}
        </div>

        {/* Recolour the rainbow lines to burnt-orange (keeps luminance, swaps hue) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: '#C55221', mixBlendMode: 'color' }}
        />
        {/* Warm amber centre glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(204,136,0,0.18), transparent 70%)' }}
        />
        {/* Edge vignette so the copy stays legible */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.78) 100%)' }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          className="relative z-10 px-4 max-w-3xl text-center"
        >
          <div
            className="inline-flex items-center gap-2 mb-5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400 backdrop-blur-sm"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-burnt-500 animate-pulse" />
            Let's build your engine
          </div>

          <AnimatedHeading
            as="h2"
            className="section-heading-light"
            style={{ fontSize: 'clamp(2rem, 1.4rem + 3.5vw, 3.4rem)' }}
            text={'Ready to Sell Properties Faster?'}
            highlight="Faster?"
          />

          <p className="mt-4 text-white/65 text-base sm:text-lg max-w-xl mx-auto" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Get a free strategy session and see exactly how AI-powered marketing turns your listings into closed deals.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#contact" className="btn-primary text-base px-7 py-3.5">
              Get Free Strategy Call
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#services" className="btn-outline-white text-base px-7 py-3.5">
              Explore Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
