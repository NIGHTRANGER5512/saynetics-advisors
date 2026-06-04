import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ClipboardList, Camera, Megaphone, MessagesSquare, Handshake } from 'lucide-react'
import { ExpandingCards, type CardItem } from '@/components/ui/expanding-cards'
import { ScrambleHeading } from '@/components/ui/scramble-heading'

/* number badge + lucide icon */
const stepIcon = (n: string, Icon: typeof ClipboardList): ReactNode => (
  <span className="flex items-center gap-2.5">
    <Icon size={20} strokeWidth={1.75} />
    <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[10px] tracking-widest text-ink-300">{n}</span>
  </span>
)

const steps: CardItem[] = [
  {
    id: '01', title: 'Share Your Listing Details',
    description: 'Tell us your property type, location, target buyer, and marketing goals. We handle everything from here.',
    imgSrc: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=60',
    icon: stepIcon('01', ClipboardList), linkHref: '#contact',
  },
  {
    id: '02', title: 'We Generate Your Video',
    description: 'We craft photorealistic, AI-generated cinematic walkthroughs and virtual staging from your photos, delivered in 48 hours.',
    imgSrc: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=60',
    icon: stepIcon('02', Camera), linkHref: '#contact',
  },
  {
    id: '03', title: 'Campaigns Go Live & Leads Flow In',
    description: 'Your video and AR tours go live across AI-optimised digital campaigns, reaching verified home-seekers in your area immediately.',
    imgSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=60',
    icon: stepIcon('03', Megaphone), linkHref: '#contact',
  },
  {
    id: '04', title: 'AI Follows Up Instantly',
    description: 'Every enquiry gets a personalised WhatsApp and email response within minutes, day or night.',
    imgSrc: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=60',
    icon: stepIcon('04', MessagesSquare), linkHref: '#contact',
  },
  {
    id: '05', title: 'You Meet Warm Buyers',
    description: 'We hand you qualified prospects who have seen the property, know the price, and are ready to visit.',
    imgSrc: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=60',
    icon: stepIcon('05', Handshake), linkHref: '#contact',
  },
]

export default function HowItWorks() {
  const prefersReduced = useReducedMotion()

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: prefersReduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 200, damping: 28, delay },
  })

  return (
    <section
      id="how-it-works"
      className="py-24 bg-paper border-y border-cream-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <div className="max-w-xl mb-14">
          {/* Editorial burnt rule */}
          <motion.div {...fadeUp(0)} className="editorial-rule" aria-hidden="true" />

          {/* Heading — ink, Space Grotesk, matching site style */}
          <ScrambleHeading
            as="h2"
            className="section-heading-ink"
            text="Five Steps from Listing to Sold"
            highlight="Listing"
          />

          <motion.p {...fadeUp(0.1)} className="section-sub">
            Our end-to-end system is built for busy agents and developers who want results without complexity.
          </motion.p>
        </div>

        {/* ── Expanding cards ── */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 28, delay: 0.12 }}
          className="flex justify-center"
        >
          <ExpandingCards items={steps} defaultActiveIndex={0} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-5 text-center text-ink-300 text-xs tracking-widest uppercase"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Hover or tap a step to explore
        </motion.p>
      </div>
    </section>
  )
}
