import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Services from './components/Services'
import StagingSlider from './components/StagingSlider'
import HowItWorks from './components/HowItWorks'
import ChatDemo from './components/ChatDemo'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'
import PageSkeleton from './components/PageSkeleton'

/* Lazy-load Three.js viewer — splits ~600KB out of the initial bundle */
const ThreeViewer = lazy(() => import('./components/ThreeViewer'))

/* Lightweight fallback for the lazy AR section (dark charcoal placeholder) */
function SectionFallback() {
  return (
    <div className="py-24 bg-charcoal-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="sk w-40 h-6 rounded mb-4" />
        <div className="sk w-96 max-w-full h-10 rounded mb-8" />
        <div className="sk w-full h-[420px] rounded-lg" />
      </div>
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reveal once fonts are ready (avoids FOUT), with a minimum display time
    const minDisplay = new Promise<void>(r => setTimeout(r, 650))
    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready
        : Promise.resolve()

    Promise.all([minDisplay, fontsReady]).then(() => setLoading(false))
  }, [])

  return (
    <>
      <AnimatePresence>{loading && <PageSkeleton key="skeleton" />}</AnimatePresence>

      {/* skip-links — keyboard users jump past nav */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <StatsBar />
        <Services />
        <StagingSlider />
        <HowItWorks />
        <Suspense fallback={<SectionFallback />}>
          <ThreeViewer />
        </Suspense>
        <ChatDemo />
        <LeadForm />
      </main>

      <Footer />

      {/* ── Floating WhatsApp CTA ── */}
      <a
        href="https://wa.me/919234682722?text=Hi%20Saynetics%2C%20I%20want%20to%20know%20more%20about%20your%20real%20estate%20marketing%20services!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Saynetics on WhatsApp"
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg hover:bg-[#20bc5a] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 group"
        style={{ boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="text-sm font-semibold pr-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Chat with us
        </span>
      </a>
    </>
  )
}
