import { useEffect, useRef, Suspense, lazy } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

/* Lazy-load the Unicorn Studio background — splits the heavy WebGL SDK
   (~1.7MB) into its own chunk so it never blocks first paint */
const RaycastAnimatedBackground = lazy(() =>
  import('@/components/ui/raycast-animated-background').then(m => ({
    default: m.RaycastAnimatedBackground,
  }))
)

interface Particle {
  x: number; y: number; vx: number; vy: number; r: number
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReduced) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    const init = () => {
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.5 + 0.5,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(204,136,0,0.50)' /* amber — locked warm accent */
        ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(197,82,33,${(1 - d / 110) * 0.20})`
            ctx.lineWidth = 0.6
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
        const dx = particles[i].x - mx
        const dy = particles[i].y - my
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < 150) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(249,115,22,${(1 - d / 150) * 0.45})`
          ctx.lineWidth = 0.8
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mx, my)
          ctx.stroke()
        }
      }
      animId = requestAnimationFrame(draw)
    }
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    resize(); init(); draw()
    window.addEventListener('resize', () => { resize(); init() })
    canvas.addEventListener('mousemove', onMouse)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouse)
    }
  }, [prefersReduced])

  return (
    <section
      aria-label="Saynetics Advisors hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-charcoal-section"
    >
      {/* ── Layer 0: Unicorn Studio animated background (lazy), palette-shifted to burnt/amber.
             Fallback is a static charcoal gradient so the hero looks intentional while it loads ── */}
      <Suspense
        fallback={
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_45%,#28241f_0%,#1c1917_55%,#0f0e0d_100%)]"
          />
        }
      >
        <RaycastAnimatedBackground />
      </Suspense>

      {/* Vanishing-point grid on top of animation */}
      <div aria-hidden="true" className="absolute inset-0 perspective-grid opacity-20" />

      {/* Lighter text-readability scrim — only darkens behind the copy (left), lets the animation breathe on the right */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(100deg,rgba(15,14,13,0.78)_0%,rgba(15,14,13,0.45)_45%,rgba(15,14,13,0.15)_100%)]" />

      {/* Particle canvas — rule: aria-labels for non-text content */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 26, delay: 0.1 }}
          className="max-w-3xl"
        >
          {/* Status badge */}
          <div className="section-tag mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-burnt-500 animate-pulse" />
            Now in Patna · India's First AI Real Estate Studio
          </div>

          {/* Display headline */}
          <h1
            className="section-heading-light mb-6"
            style={{ fontSize: 'clamp(2.4rem, 2rem + 4vw, 4rem)', lineHeight: 1.05 }}
          >
            Sell Properties Faster
            <br />
            <span className="text-burnt-500">with AI-Powered</span>
            <br />
            Marketing
          </h1>

          <p className="section-sub-light text-lg max-w-xl">
            Saynetics Advisors pairs cinematic visuals, precision Facebook ads, and an AI agent that follows up on every lead within minutes, turning listings into closed deals.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            {/* LiquidButton: glass distortion effect pops against the dark particle canvas */}
            <LiquidButton
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              size="xl"
              className="font-display tracking-wider uppercase text-white/90"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              aria-label="Get free strategy call — scroll to contact form"
            >
              Get Free Strategy Call
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </LiquidButton>

            <a href="#portfolio" className="btn-outline-white text-base px-7 py-3.5">
              View Portfolio
            </a>
          </div>

          {/* Perspective-style proof items with JetBrains Mono labels */}
          <div className="mt-12 flex flex-wrap gap-6">
            {['No long-term contracts', '48-hr video delivery', 'Dedicated account manager'].map(f => (
              <span
                key={f}
                className="flex items-center gap-2 text-white/50 text-xs tracking-wider uppercase"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <span className="w-4 h-0.5 bg-burnt-500/60 inline-block" />
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={prefersReduced ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/25"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  )
}
