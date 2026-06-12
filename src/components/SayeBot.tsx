import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Types ── */
interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

/* ── Website context injected as system prompt (RAG-style) ── */
const SYSTEM_PROMPT = `You are **Saye**, the friendly AI assistant on the Saynetics Advisors website. You help visitors learn about Saynetics services, answer questions, and guide them toward booking a free strategy call.

## About Saynetics Advisors
Saynetics Advisors is an AI-powered real estate marketing studio based in India. They help brokers, builders, and agents sell properties faster using cutting-edge technology. Contact: +91 92346 82722 (WhatsApp & phone).

## Services Offered
1. **AI Cinematic Videography** (Most Popular) — Photorealistic, AI-generated property films and walkthroughs from photos. No film crew needed. Turns listings into cinematic video tours.
2. **AR Property Viewer** (Cutting Edge) — Buyers walk through properties from their phone via augmented reality. Cuts wasted site visits and pre-qualifies serious buyers.
3. **Virtual Staging** (48hr Delivery) — AI-powered virtual staging transforms bare spaces into beautifully styled interiors without physical staging.
4. **Automated Follow-up** (AI-Powered) — AI sends personalised WhatsApp and email messages within minutes of every enquiry, nurturing prospects 24/7 on autopilot.
5. **Agent Website Development** (Custom Built) — Premium, mobile-first websites with lead capture, property listings, and WhatsApp integration built in.

## How It Works
1. **Discovery Call** — Free 15-minute call to understand the agent's market and goals.
2. **Custom Strategy** — Saynetics designs a marketing package tailored to the agent's listings.
3. **Launch & Scale** — Content goes live within 48 hours; leads start flowing in.

## Key Differentiators
- No long-term contracts
- 48-hour video delivery
- Dedicated account manager
- AI agent (Sayna) that follows up on every lead instantly
- AR property tours with no app download needed

## Pricing
Pricing is custom based on services selected. Visitors should book a free consultation to get a quote.

## Instructions for You (Saye)
- Be warm, professional, and concise.
- Use short paragraphs, max 2-3 sentences per point.
- If someone asks about pricing, say it's custom and suggest booking a free strategy call.
- If someone asks to contact, share the phone number +91 92346 82722 or suggest the contact form on the website.
- You can use emojis sparingly for friendliness.
- Never make up information not in this context.
- If asked something unrelated to real estate or Saynetics, politely redirect.
- Always end with a helpful follow-up question or CTA when appropriate.`

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const API_KEY = import.meta.env.VITE_OPENROUTER_KEY || ''
const MODEL = 'nex-agi/nex-n2-pro:free'

export default function SayeBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', content: "Hi there! 👋 I'm Saye, your AI assistant for Saynetics Advisors. Ask me anything about our AI-powered real estate marketing services!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(1)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    if (open) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { id: idRef.current++, role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const apiMessages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...updatedMessages.map(m => ({ role: m.role, content: m.content })),
      ]

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Saynetics Advisors',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: apiMessages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      })

      if (!res.ok) {
        throw new Error(`API error ${res.status}`)
      }

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Please try again."

      const assistantMsg: Message = { id: idRef.current++, role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])

      if (!open) setHasUnread(true)
    } catch {
      setMessages(prev => [
        ...prev,
        { id: idRef.current++, role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment, or reach us directly at +91 92346 82722. 📞" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-4 sm:left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
        style={{
          background: 'linear-gradient(135deg, #C55221, #CC8800)',
          boxShadow: '0 4px 20px rgba(197, 82, 33, 0.4)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close Saye AI assistant' : 'Open Saye AI assistant'}
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </>
        )}
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-[5.5rem] left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] rounded-2xl overflow-hidden flex flex-col"
            style={{
              maxHeight: 'min(520px, calc(100dvh - 7rem))',
              boxShadow: '0 8px 40px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C55221, #CC8800)' }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Saye · AI Assistant
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/70 text-[10px] tracking-wider uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3"
              style={{ background: '#faf9f6' }}
            >
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-burnt-500 text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-ink border border-cream-300 rounded-2xl rounded-bl-md shadow-sm'
                    }`}
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-cream-300 rounded-2xl rounded-bl-md shadow-sm">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-burnt-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="flex gap-2 p-3 border-t border-cream-300 flex-shrink-0"
              style={{ background: '#ffffff' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Saye anything…"
                autoComplete="off"
                className="flex-1 bg-cream-100 border border-cream-300 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder-ink-400 outline-none focus:border-burnt-500 transition-colors min-h-[44px]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-40"
                style={{
                  background: input.trim() && !loading ? 'linear-gradient(135deg, #C55221, #CC8800)' : '#d6cfc4',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 text-center border-t border-cream-200" style={{ background: '#f3f0eb' }}>
              <span className="text-[9px] text-ink-400 tracking-wider uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Powered by Saynetics AI
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
