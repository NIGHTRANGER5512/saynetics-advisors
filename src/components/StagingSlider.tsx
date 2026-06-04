import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function StagingSlider() {
  const prefersReduced = useReducedMotion()
  const [pct, setPct] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const phaseRef = useRef(0)

  const calcPct = useCallback((clientX: number) => {
    const rect = containerRef.current!.getBoundingClientRect()
    return Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseDown = () => { setDragging(true); cancelAnimationFrame(animRef.current!) }
  const onMouseUp   = () => setDragging(false)
  const onMouseMove = (e: React.MouseEvent) => { if (dragging) setPct(calcPct(e.clientX)) }
  const onTouchStart = () => { setDragging(true); cancelAnimationFrame(animRef.current!) }
  const onTouchEnd   = () => setDragging(false)
  const onTouchMove  = (e: React.TouchEvent) => { if (dragging) setPct(calcPct(e.touches[0].clientX)) }

  useEffect(() => {
    if (dragging || prefersReduced) return
    const go = () => {
      phaseRef.current += 0.008
      setPct(50 + 30 * Math.sin(phaseRef.current))
      animRef.current = requestAnimationFrame(go)
    }
    animRef.current = requestAnimationFrame(go)
    return () => cancelAnimationFrame(animRef.current!)
  }, [dragging, prefersReduced])

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    /* Warm paper section */
    <section className="py-24 bg-paper-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Copy side */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          >
            {/* graphic rule instead of an eyebrow label (taste-skill: limit eyebrows) */}
            <div className="editorial-rule" aria-hidden="true" />
            <h2 className="section-heading-ink">From Empty Shell to Dream Home in 48 Hours</h2>
            <p className="section-sub">
              Our AI-powered virtual staging removes the guesswork for buyers. See any unfurnished space transformed into a fully styled interior, ready to share online, in ads, or on WhatsApp.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Photorealistic results indistinguishable from real furniture',
                'Multiple styles: modern, classic, and contemporary',
                'Delivered within 48 hours, print & web resolution',
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-ink-500">
                  <span className="w-5 h-5 rounded-full bg-burnt-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-burnt-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a href="#contact" className="btn-primary">Get Virtual Staging Quote</a>
            </div>
          </motion.div>

          {/* Slider side */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 28, delay: 0.12 }}
          >
            {/* Perspective depth frame — layered shadows */}
            <div
              ref={containerRef}
              className="relative h-[360px] rounded-lg overflow-hidden cursor-ew-resize select-none border border-cream-300 bg-cream-200"
              style={{ boxShadow: '4px 8px 16px rgba(17,11,5,0.10), 12px 24px 40px rgba(17,11,5,0.08)' }}
              onMouseMove={onMouseMove}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
            >
              {/* Before — real unfurnished room */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=70"
                  alt="Before: Empty unfurnished room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* After — virtually staged */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=70"
                  alt="After: Virtually staged with AI"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5" />
              </div>

              {/* Handle */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-ink/40" style={{ left: `${pct}%` }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-ink/20 shadow-depth-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
                  </svg>
                </div>
              </div>

              {/* Corner labels */}
              <div className="absolute bottom-3 left-3 text-xs font-mono px-2 py-1 rounded bg-ink/10 text-ink-500 border border-ink/10">BEFORE</div>
              <div className="absolute bottom-3 right-3 text-xs font-mono px-2 py-1 rounded bg-burnt-500/10 text-burnt-700 border border-burnt-200">AFTER</div>
            </div>
            <p className="text-center text-ink-300 text-xs mt-3"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Drag to compare · AI-powered virtual staging
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
