import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

interface Msg { id: number; from: 'bot' | 'user'; text: string }

const script: { from: 'bot' | 'user'; text: string }[] = [
  { from: 'bot',  text: 'Hello! 👋 I\'m Sayna, your AI property assistant. Are you looking to buy a new home?' },
  { from: 'user', text: 'Yes, looking for a 3BHK. Budget around ₹80 lakhs.' },
  { from: 'bot',  text: 'Great choice! Two options for you:\n\n🏠 Option A · Riverside Heights, 3BHK, 1,450 sq ft, premium society\n🏠 Option B · Parkview Residences, 3BHK, 1,280 sq ft, ready to move\n\nWhich interests you more?' },
  { from: 'user', text: 'Tell me more about the first one.' },
  { from: 'bot',  text: 'Riverside Heights 3BHK · 1,450 sq ft\nPrice: ₹75L to ₹82L\n\nModular kitchen, 24x7 security, covered parking, rooftop garden, 2 min from highway.\n\nShall I schedule a site visit this weekend? 🗓️' },
  { from: 'user', text: 'Yes, Saturday works for me.' },
  { from: 'bot',  text: '✅ Confirmed for Saturday! Our agent will call you in 15 minutes to set the exact time. See you there! 🏡' },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-cream-200 rounded-lg rounded-bl-none w-fit">
      {[0, 1, 2].map(i => (
        <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-400"
          style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  )
}

export default function ChatDemo() {
  const [msgs, setMsgs]           = useState<Msg[]>([])
  const [typing, setTyping]       = useState(false)
  const [done, setDone]           = useState(false)
  const [input, setInput]         = useState('')
  const [inputTyping, setInputTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const sectionRef  = useRef<HTMLElement>(null)
  const startedRef  = useRef(false)   // single-run guard (ref so it never re-triggers the effect)
  const idRef       = useRef(0)
  const timers      = useRef<ReturnType<typeof setTimeout>[]>([])
  const prefersReduced = useReducedMotion()

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const playScript = useCallback(() => {
    clearTimers(); setMsgs([]); setTyping(false); setDone(false); setInput(''); idRef.current = 0
    let delay = 600
    script.forEach((m, i) => {
      if (m.from === 'bot') {
        const t1 = setTimeout(() => setTyping(true), delay)
        delay += prefersReduced ? 0 : 900
        const t2 = setTimeout(() => {
          setTyping(false)
          setMsgs(prev => [...prev, { id: idRef.current++, from: 'bot', text: m.text }])
          if (i === script.length - 1) setTimeout(() => setDone(true), 400)
        }, delay)
        delay += 400
        timers.current.push(t1, t2)
      } else {
        const t = setTimeout(() => {
          setMsgs(prev => [...prev, { id: idRef.current++, from: 'user', text: m.text }])
        }, delay)
        delay += 600
        timers.current.push(t)
      }
    })
  }, [prefersReduced])

  /* ── Start the script once, when the chat scrolls into view ── */
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })
  useEffect(() => {
    if (inView && !startedRef.current) {
      startedRef.current = true
      playScript()
    }
  }, [inView, playScript])

  /* Clear any pending timers only on unmount */
  useEffect(() => clearTimers, [])

  // Scroll only the inner message list — NOT the page (scrollIntoView would yank the page down)
  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, inputTyping])

  const sendLive = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMsgs(prev => [...prev, { id: idRef.current++, from: 'user', text }])
    const t1 = setTimeout(() => setInputTyping(true), 1000)
    const t2 = setTimeout(() => {
      setInputTyping(false)
      setMsgs(prev => [...prev, { id: idRef.current++, from: 'bot', text: 'Thank you! Our team has been notified. An agent will follow up within the hour. 📞' }])
    }, 1800)
    timers.current.push(t1, t2)
  }

  return (
    /* Paper cream section — chat reveals via 3D scroll-tilt (ContainerScroll) */
    <section ref={sectionRef} aria-label="AI follow-up demo" className="bg-paper overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            {/* AI badge chip */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-burnt-500/30 bg-burnt-500/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-burnt-600"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-burnt-500 animate-pulse" />
                Live AI Demo
              </span>
            </div>

            {/* Two-line display heading */}
            <h2
              className="mb-5 font-black leading-[1.05] tracking-tight text-center"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 1.2rem + 3.5vw, 3.2rem)',
                letterSpacing: '-0.02em',
              }}
            >
              <span className="block text-[#16110c]">See Your AI Sales Agent</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(100deg, #c55221 0%, #cc8800 60%, #e8a020 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Close Deals in Real Time
              </span>
            </h2>

            {/* Accent bars centred */}
            <div className="flex items-center justify-center gap-2.5 mb-6" aria-hidden="true">
              <div className="h-[2px] w-12 rounded-full bg-gradient-to-r from-burnt-500 to-amber-400" />
              <div className="h-[2px] w-4 rounded-full bg-burnt-500/25" />
            </div>

            {/* Sub */}
            <p
              className="section-sub mx-auto text-center"
              style={{ maxWidth: '42rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Every lead gets an instant, intelligent response — around the clock. Here's what a real conversation looks like.
            </p>
          </>
        }
      >
        {/* Chat window fills the device card seamlessly */}
        <div
          role="region"
          aria-label="Live chat demo with Sayna AI assistant"
          className="flex h-full flex-col bg-white text-left"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-cream-100 border-b border-cream-300 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-burnt-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              S
            </div>
            <div>
              <div className="text-ink font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Sayna · AI Property Assistant
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* green dot = functional "online" status (semantic), not a brand accent */}
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-700 text-xs font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Messages — flex-1 fills the card; min-h-0 lets it scroll internally */}
          <div
            ref={messagesRef}
            aria-live="polite"
            aria-label="Conversation messages"
            className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-3 bg-cream-50"
          >
            {/* Idle state — shown before scroll triggers the script */}
            {msgs.length === 0 && !typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-burnt-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-burnt-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <p className="text-ink-400 text-xs tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  Conversation starting…
                </p>
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-burnt-500/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            )}
              <AnimatePresence initial={false}>
                {msgs.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed whitespace-pre-line ${
                      m.from === 'user'
                        ? 'bg-burnt-500 text-white rounded-br-none'
                        : 'bg-white text-ink border border-cream-300 rounded-bl-none shadow-depth-1'
                    }`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {(typing || inputTyping) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <TypingDots />
                </motion.div>
              )}
              {done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center pt-2">
                  <button
                    onClick={playScript}
                    className="text-xs text-burnt-600 border border-burnt-200 px-3 py-1.5 rounded hover:bg-burnt-50 transition-colors"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    ↺ Replay conversation
                  </button>
                </motion.div>
              )}
            </div>

          {/* Input — rule: form-labels + aria-labels */}
          <div className="flex gap-2 p-3 border-t border-cream-300 bg-white flex-shrink-0" role="form" aria-label="Send a message">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendLive()}
              placeholder="Type a message…"
              autoComplete="off"
              className="flex-1 bg-cream-100 border border-cream-300 rounded px-3 py-2.5 text-sm text-ink placeholder-ink-400 outline-none focus:border-burnt-500 transition-colors min-h-[44px]"
            />
            <button
              type="button"
              onClick={sendLive}
              disabled={!input.trim()}
              aria-label="Send message"
              className="w-9 h-9 rounded bg-burnt-500 hover:bg-burnt-600 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </ContainerScroll>
    </section>
  )
}
