import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* Capability stats — true on day one for a brand-new firm (no fabricated traction) */
interface Stat {
  value?: number   // animated count-up (optional)
  prefix?: string
  suffix?: string
  static?: string  // non-numeric display (e.g. "24/7")
  label: string
}

const stats: Stat[] = [
  { value: 48, suffix: 'hr', label: 'Video Delivery' },
  { static: '24/7',          label: 'AI Lead Follow-Up' },
  { value: 2, prefix: '<', suffix: ' min', label: 'Lead Response Time' },
  { value: 100, suffix: '%', label: 'Done-For-You Service' },
]

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const duration = 1600
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(Math.round(eased * target))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="stat-number">
      {prefix}{count}{suffix}
    </span>
  )
}

export default function StatsBar() {
  const prefersReduced = useReducedMotion()
  return (
    /* Paper section — cream with border */
    <section className="bg-paper border-y border-cream-300 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 lg:divide-x divide-cream-300"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start lg:px-8 first:pl-0 gap-2 text-center lg:text-left">
              {s.static !== undefined || prefersReduced || s.value === undefined
                ? <span className="stat-number">{s.static ?? `${s.prefix ?? ''}${s.value}${s.suffix ?? ''}`}</span>
                : <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
              }
              {/* Refactoring UI: weaken the label so the number dominates hierarchy */}
              <span
                className="text-ink-300 text-xs tracking-widest uppercase font-normal"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
