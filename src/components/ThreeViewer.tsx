import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import '@google/model-viewer'
import { ScrambleHeading } from '@/components/ui/scramble-heading'

/* model-viewer is a custom element — cast to a permissive tag so JSX accepts
   its kebab-case + boolean attributes without fighting React's typings. */
const MV = 'model-viewer' as unknown as React.FC<Record<string, unknown>>

// real building model (served from /public/models, base-path aware for GH Pages)
const MODEL_URL = `${import.meta.env.BASE_URL}models/building_ar.glb`

export default function ThreeViewer() {
  const mvRef = useRef<(HTMLElement & { canActivateAR?: boolean; activateAR?: () => void }) | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const prefersReduced = useReducedMotion()

  const handleAR = () => {
    const mv = mvRef.current
    if (mv && mv.canActivateAR && mv.activateAR) {
      mv.activateAR()           // launches Scene Viewer (Android) / Quick Look (iOS) / WebXR
    } else {
      setShowQRModal(true)      // desktop → show QR to open on a phone
    }
  }

  return (
    /* Charcoal dark section — intentional contrast after light sections */
    <section id="portfolio" aria-label="AR Property Viewer" className="relative py-24 bg-charcoal-section overflow-hidden">
      {/* Perspective grid overlay — aria-hidden: decorative */}
      <div aria-hidden="true" className="absolute inset-0 perspective-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          className="max-w-xl mb-12"
        >
          <div className="editorial-rule" aria-hidden="true" />
          <ScrambleHeading as="h2" className="section-heading-light" text="Walk Through Properties in Augmented Reality" highlight="Augmented Reality" />
          <p className="section-sub-light">A real project rendered in 3D. Drag to explore it from every angle, or tap “View in AR” on your phone to place it at full scale in your space — no app download needed.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 28, delay: 0.1 }}
          className="rounded-lg overflow-hidden border border-white/8"
          style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.30), 0 12px 32px rgba(0,0,0,0.35), 0 32px 64px rgba(0,0,0,0.25)' }}
        >
          {/* 3D / AR model */}
          <MV
            ref={mvRef as unknown as React.Ref<unknown>}
            src={MODEL_URL}
            alt="3D model of a residential building project"
            camera-controls={true}
            auto-rotate={true}
            auto-rotate-delay={500}
            rotation-per-second="18deg"
            interaction-prompt="auto"
            ar={true}
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            shadow-intensity="1"
            shadow-softness="0.9"
            exposure="1.05"
            environment-image="neutral"
            loading="lazy"
            reveal="auto"
            touch-action="pan-y"
            style={{ width: '100%', height: '460px', backgroundColor: '#15110e', '--poster-color': '#15110e' } as React.CSSProperties}
          >
            {/* progress bar slot */}
            <div slot="progress-bar" className="absolute top-0 left-0 h-0.5 bg-burnt-500" />
            {/* loading hint */}
            <div slot="poster" className="flex h-full w-full items-center justify-center bg-charcoal-800">
              <span className="text-white/40 text-xs tracking-widest uppercase animate-pulse" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Loading 3D model…
              </span>
            </div>
          </MV>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 border-t border-white/8 bg-charcoal-800/60">
            <button onClick={handleAR} className="btn-primary w-full sm:w-auto justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              View in AR
            </button>
            <a href={MODEL_URL} download className="btn-outline-white w-full sm:w-auto justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download 3D Model
            </a>
          </div>
        </motion.div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-depth-4"
          >
            <div className="w-40 h-40 mx-auto mb-6 rounded overflow-hidden border border-cream-300 bg-white">
              <img
                src={`https://chart.googleapis.com/chart?cht=qr&chs=160x160&chl=${encodeURIComponent(window.location.href)}&choe=UTF-8`}
                alt="QR code to open this page on mobile for AR viewing"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="text-ink font-semibold text-lg mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Open on Mobile for AR
            </h3>
            <p className="text-ink-400 text-sm mb-6">AR runs on phones. Scan this with your camera to open the page on your mobile, then tap “View in AR”.</p>
            <button onClick={() => setShowQRModal(false)} className="btn-primary w-full justify-center">Close</button>
          </motion.div>
        </div>
      )}
    </section>
  )
}
