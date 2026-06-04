import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const stats = [
  { value: 240,  suffix: '+', label: 'Properties Marketed' },
  { value: 8400, suffix: '+', label: 'Leads Generated' },
  { value: 3200, suffix: '+', label: 'AR Sessions Delivered' },
  { value: 89,   suffix: '%', label: 'Faster Response Rate' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
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
        const duration = 1800
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(Math.floor(eased * target))
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
      {count.toLocaleString('en-IN')}{suffix}
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
              {prefersReduced
                ? <span className="stat-number">{s.value.toLocaleString('en-IN')}{s.suffix}</span>
                : <Counter target={s.value} suffix={s.suffix} />
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
