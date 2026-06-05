export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal-section border-t border-white/8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-8 h-8 rounded bg-burnt-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-orange"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>S</span>
              <span className="text-white font-semibold text-lg uppercase tracking-wider"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Saynetics</span>
            </a>
            {/* Refactoring UI: weaken secondary copy with light weight so brand name dominates */}
            <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              A premier AI-powered real estate marketing studio, turning listings into sold properties.
            </p>
            {/* Burnt accent line — single locked accent */}
            <div className="mt-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-burnt-500" />
              <span className="text-burnt-400 text-xs tracking-widest uppercase"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>Est. 2024</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>Services</h4>
            <ul className="flex flex-col gap-2.5">
              {['AI Cinematic Videography', 'AR Property Viewer', 'Virtual Staging', 'Automated Follow-up System', 'Agent Website Development'].map(s => (
                <li key={s}>
                  <a href="#services" className="text-white/65 hover:text-white text-sm transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>Company</h4>
            <ul className="flex flex-col gap-2.5">
              {['About', 'Contact', 'Privacy Policy'].map(l => (
                <li key={l}>
                  <a href="#" className="text-white/65 hover:text-white text-sm transition-colors">{l}</a>
                </li>
              ))}
            </ul>

            {/* Phone + WhatsApp contact */}
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href="tel:+919234682722"
                className="flex items-center gap-2 text-white/65 hover:text-white text-sm transition-colors"
              >
                <svg className="w-4 h-4 text-burnt-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +91 92346 82722
              </a>
              <a
                href="https://wa.me/919234682722?text=Hi%20Saynetics%2C%20I%20want%20to%20know%20more%20about%20your%20services!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/65 hover:text-white text-sm transition-colors"
              >
                <svg className="w-4 h-4 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
                WhatsApp us
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white/80 text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>Follow Us</h4>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { label: 'Facebook',  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { label: 'LinkedIn',  icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: 'YouTube',   icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              ].map(s => (
                /* rule: touch-target-size min 44x44px; aria-label for icon-only links */
                <a key={s.label} href="#" aria-label={`Follow Saynetics on ${s.label}`}
                  className="w-11 h-11 rounded border border-white/12 text-white/65 hover:text-white hover:border-burnt-500/40 hover:bg-burnt-500/8 flex items-center justify-center transition-all">
                  <span aria-hidden="true">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <span>© {year} Saynetics Advisors. All rights reserved.</span>
          <span>Made with care for modern real estate</span>
        </div>
      </div>
    </footer>
  )
}
