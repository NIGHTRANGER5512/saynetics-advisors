import { motion } from 'framer-motion'

/* Full-page shimmer skeleton mirroring the real layout.
   Shown on initial load until fonts are ready, then fades out. */
export default function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-[200] overflow-hidden bg-charcoal-section"
      aria-hidden="true"
      role="presentation"
    >
      {/* Navbar skeleton */}
      <div className="h-16 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="sk w-8 h-8 rounded" />
          <div className="sk w-28 h-4 rounded" />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="sk w-16 h-3 rounded" />
          <div className="sk w-20 h-3 rounded" />
          <div className="sk w-16 h-3 rounded" />
          <div className="sk w-16 h-3 rounded" />
        </div>
        <div className="sk w-36 h-9 rounded" />
      </div>

      {/* Hero skeleton (dark) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">
        <div className="max-w-3xl flex flex-col gap-5">
          {/* eyebrow */}
          <div className="sk w-72 h-6 rounded-full" />
          {/* headline — three lines */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="sk h-12 sm:h-14 w-[85%] rounded-lg" />
            <div className="sk h-12 sm:h-14 w-[70%] rounded-lg" />
            <div className="sk h-12 sm:h-14 w-[45%] rounded-lg" />
          </div>
          {/* subtitle */}
          <div className="flex flex-col gap-2 mt-3 max-w-xl">
            <div className="sk h-4 w-full rounded" />
            <div className="sk h-4 w-[80%] rounded" />
          </div>
          {/* buttons */}
          <div className="flex gap-4 mt-4">
            <div className="sk w-52 h-12 rounded-md" />
            <div className="sk w-40 h-12 rounded-md" />
          </div>
          {/* proof line */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="sk w-36 h-3 rounded" />
            <div className="sk w-32 h-3 rounded" />
            <div className="sk w-44 h-3 rounded" />
          </div>
        </div>
      </div>

      {/* Stats strip skeleton (light) */}
      <div className="absolute bottom-0 inset-x-0 bg-paper border-t border-cream-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center lg:items-start gap-2">
              <div className="sk sk-light w-24 h-10 rounded" />
              <div className="sk sk-light w-32 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Centered brand pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded bg-burnt-500 flex items-center justify-center text-white font-bold animate-pulse"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          S
        </div>
        <span className="text-white/30 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Loading
        </span>
      </div>
    </motion.div>
  )
}
