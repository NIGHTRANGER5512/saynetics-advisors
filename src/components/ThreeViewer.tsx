import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

export default function ThreeViewer() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(3.5, 2.5, 4.5)
    camera.lookAt(0, 0, 0)

    /* Three-point lighting — threejs-webgl skill */
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.2)
    keyLight.position.set(5, 10, 7.5)
    keyLight.castShadow = true
    scene.add(keyLight)

    /* fill + rim in the locked warm family (amber / burnt) */
    const fillLight = new THREE.DirectionalLight(0xcc8800, 0.7)
    fillLight.position.set(-5, 2, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xc55221, 0.5)
    rimLight.position.set(0, -3, -6)
    scene.add(rimLight)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))

    /* REPLACE BoxGeometry with GLTFLoader pointing to your GLB file path */
    const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6)
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xcc8800), /* amber — locked accent */
      metalness: 0.25,
      roughness: 0.35,
    })
    material.color.convertSRGBToLinear()

    const box = new THREE.Mesh(geometry, material)
    box.castShadow = true
    scene.add(box)

    const edgesGeo = new THREE.EdgesGeometry(geometry)
    const edgesMat = new THREE.LineBasicMaterial({ color: 0xc55221, transparent: true, opacity: 0.35 })
    const edges = new THREE.LineSegments(edgesGeo, edgesMat)
    scene.add(edges)

    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      if (!prefersReduced) {
        box.rotation.y = t * 0.55
        box.rotation.x = t * 0.22
        box.position.y = Math.sin(t * 0.9) * 0.07
        edges.rotation.copy(box.rotation)
        edges.position.copy(box.position)
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = el.clientWidth; const nh = el.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      geometry.dispose(); edgesGeo.dispose()
      material.dispose(); edgesMat.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [prefersReduced])

  const handleAR = async () => {
    if (navigator.xr) {
      const supported = await navigator.xr.isSessionSupported('immersive-ar').catch(() => false)
      if (supported) await navigator.xr.requestSession('immersive-ar')
      else setShowQRModal(true)
    } else {
      setShowQRModal(true)
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
          {/* graphic rule instead of eyebrow label (taste-skill: limit eyebrows) */}
          <div className="editorial-rule" aria-hidden="true" />
          <h2 className="section-heading-light">Walk Through Properties in Augmented Reality</h2>
          <p className="section-sub-light">Place any property directly into your space. No app download needed, it runs in your browser on any modern smartphone.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 28, delay: 0.1 }}
          className="rounded-lg overflow-hidden border border-white/8"
          style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.30), 0 12px 32px rgba(0,0,0,0.35), 0 32px 64px rgba(0,0,0,0.25)' }}
        >
          {/* aria-hidden: canvas is a 3D decoration — label provided by section heading */}
          <div ref={mountRef} aria-hidden="true" className="w-full h-[420px] bg-charcoal-800" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 border-t border-white/8 bg-charcoal-800/60">
            <button onClick={handleAR} className="btn-primary w-full sm:w-auto justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              View in AR
            </button>
            <a href="#" className="btn-outline-white w-full sm:w-auto justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Floor Plan
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
              Open on Mobile
            </h3>
            <p className="text-ink-400 text-sm mb-6">Scan with your smartphone camera to launch the AR viewer directly in your mobile browser.</p>
            <button onClick={() => setShowQRModal(false)} className="btn-primary w-full justify-center">Close</button>
          </motion.div>
        </div>
      )}
    </section>
  )
}
