import { motion, useReducedMotion } from 'framer-motion'
import { ScrambleHeading } from '@/components/ui/scramble-heading'
import { CardsParallax } from '@/components/ui/scroll-cards'
import { cardData } from '@/lib/utils'

export default function ServicesStacked() {
  const prefersReduced = useReducedMotion()

  return (
    <section id="services" className="relative bg-charcoal-900 overflow-hidden">
      {/* Faint vanishing-point grid */}
      <div aria-hidden="true" className="absolute inset-0 perspective-grid opacity-30 pointer-events-none" />

      {/* Heading Container (Scrolls away naturally before the sticky stack starts) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          className="max-w-xl"
        >
          <div className="section-tag">Our Services</div>

          <ScrambleHeading
            as="h2"
            className="section-heading-light"
            text="Everything You Need to Sell Faster"
            highlight="Sell Faster"
          />

          <p className="section-sub-light">
            From first impression to final signature, our complete marketing stack is built for the modern real estate market.
          </p>
        </motion.div>
      </div>

      {/* Sticky Cards container */}
      <div className="w-full pb-24">
        <CardsParallax items={cardData} />
      </div>
    </section>
  )
}
