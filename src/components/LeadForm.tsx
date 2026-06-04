import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MetalButton } from '@/components/ui/liquid-glass-button'

interface Fields {
  name: string; email: string; phone: string
  service: string; budget: string; city: string
}

const services = [
  'Cinematic Video Production', 'Facebook Ads Management', 'AR Property Viewer',
  'Virtual Staging', 'Automated Follow-up System', 'Agent Website Development',
]
const budgets = ['Under ₹50K', '₹50K – ₹1 Lakh', '₹1 Lakh – ₹3 Lakh', '₹3 Lakh – ₹5 Lakh', 'Above ₹5 Lakh']

/* SVG icons replacing emoji — rule: no-emoji-icons */
const IconPhone = () => (
  <svg aria-hidden="true" className="w-5 h-5 text-burnt-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
)
const IconChart = () => (
  <svg aria-hidden="true" className="w-5 h-5 text-burnt-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)
const IconLock = () => (
  <svg aria-hidden="true" className="w-5 h-5 text-burnt-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)
const IconSpinner = () => (
  <svg aria-hidden="true" className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const proofItems = [
  { icon: <IconPhone />, title: 'Quick Response',        desc: 'We call back within 2 hours on business days' },
  { icon: <IconChart />, title: 'Free Strategy Session', desc: 'A detailed audit of your current marketing' },
  { icon: <IconLock />,  title: 'Your Data is Safe',     desc: 'We never share your details with third parties' },
]

export default function LeadForm() {
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const prefersReduced            = useReducedMotion()

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm<Fields>({ mode: 'onBlur' })

  const next = async () => {
    const fields: (keyof Fields)[] = step === 1 ? ['name', 'email', 'phone'] : ['service', 'budget', 'city']
    if (await trigger(fields)) setStep(s => s + 1)
  }

  const onSubmit = async (data: Fields) => {
    setLoading(true)
    try {
      // Replace YOUR_FORM_ID with your Formspree form ID from https://formspree.io
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    data.name,
          email:   data.email,
          phone:   data.phone,
          service: data.service,
          budget:  data.budget,
          city:    data.city,
          _subject: `New enquiry from ${data.name} — Saynetics Advisors`,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const json = await res.json().catch(() => ({}))
        toast.error((json as { error?: string }).error || 'Submission failed. Please try WhatsApp instead.')
      }
    } catch {
      toast.error('Network error. Please check your connection or reach us on WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="contact" aria-label="Contact form success" className="py-24 bg-paper-warm">
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div role="status" aria-live="polite" className="bg-white rounded-lg p-16 border border-cream-300 shadow-depth-3">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <svg aria-hidden="true" className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="section-heading-ink text-2xl mb-3">You're All Set!</h2>
            <p className="text-ink-400 text-sm leading-relaxed mb-6">
              Our team will contact you within 2 hours to discuss your marketing strategy.
              Check your WhatsApp for a confirmation message.
            </p>
            <a
              href="https://wa.me/917999999999?text=Hi%20Saynetics%2C%20I%20just%20submitted%20an%20enquiry%20and%20would%20love%20to%20chat!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    )
  }

  const vals = getValues()

  return (
    <section id="contact" aria-label="Contact and enquiry form" className="py-24 bg-paper-warm">
      <Toaster
        position="top-center"
        toastOptions={{ duration: 4000, ariaProps: { role: 'alert', 'aria-live': 'assertive' } }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 28 }}
          >
            <div className="section-tag">Get Started</div>
            <h2 className="section-heading-ink">Start Selling Smarter Today</h2>
            <p className="section-sub">Fill in your details and we'll build a custom marketing strategy. Completely free, no obligation.</p>

            <ul className="mt-10 flex flex-col gap-5" aria-label="Why choose Saynetics">
              {proofItems.map(f => (
                <li key={f.title} className="flex items-start gap-4">
                  {f.icon}
                  <div>
                    <div className="text-ink font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.02em' }}>
                      {f.title}
                    </div>
                    <div className="text-ink-400 text-sm">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* MetalButton gold — premium feel, sits above the social proof block */}
            <div className="mt-8">
              <MetalButton
                variant="gold"
                onClick={() => document.getElementById('contact')?.querySelector('input')?.focus()}
                aria-label="Start your free strategy session"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}
              >
                Start Free Strategy Session
              </MetalButton>
            </div>

            {/* Social proof */}
            <div className="mt-8 p-5 rounded-lg border border-cream-300 bg-white shadow-depth-2">
              <p className="text-xs tracking-widest uppercase text-ink-300 mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Trusted by agents across Bihar
              </p>
              <div className="flex -space-x-2" role="img" aria-label="89 real estate agents trust Saynetics">
                {['A', 'R', 'P', 'S', 'M'].map((l, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-cream-300 to-cream-400 flex items-center justify-center text-ink-500 text-xs font-bold shadow-depth-1"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', zIndex: 5 - i }}
                  >{l}</div>
                ))}
                <div aria-hidden="true" className="w-9 h-9 rounded-full border-2 border-white bg-burnt-500 flex items-center justify-center text-white text-xs font-bold shadow-depth-1">+89</div>
              </div>
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 28, delay: 0.1 }}
            className="bg-white rounded-lg border border-cream-300 p-8"
            style={{ boxShadow: '4px 6px 12px rgba(17,11,5,0.08), 10px 20px 40px rgba(17,11,5,0.06)' }}
          >
            {/* Step progress — rule: multi-step-progress */}
            <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map(n => (
                <div key={n} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 ${
                    step >= n ? 'bg-burnt-500 text-white raised' : 'bg-cream-200 text-ink-300 border border-cream-300'
                  }`} style={{ fontFamily: 'JetBrains Mono, monospace' }} aria-hidden="true">
                    {step > n
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      : n}
                  </div>
                  {n < 3 && <div className={`flex-1 h-px transition-colors ${step > n ? 'bg-burnt-500' : 'bg-cream-300'}`} aria-hidden="true" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Enquiry form">
              {/* rule: aria-live-errors — live region announces errors to screen readers */}
              <div role="alert" aria-live="polite" className="sr-only">
                {Object.values(errors).map(e => e?.message).filter(Boolean).join('. ')}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1"
                    initial={{ opacity: 0, x: prefersReduced ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: prefersReduced ? 0 : -14 }}
                    transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="text-ink font-semibold text-sm uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Your Contact Details
                    </h3>
                    <Field id="name" label="Full Name" required error={errors.name?.message}>
                      <input
                        {...register('name', { required: 'Full name is required' })}
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Rajesh Kumar"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={inp(!!errors.name)}
                      />
                    </Field>
                    <Field id="email" label="Email Address" required error={errors.email?.message}>
                      <input
                        {...register('email', {
                          required: 'Email address is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                        })}
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="rajesh@example.com"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={inp(!!errors.email)}
                      />
                    </Field>
                    <Field id="phone" label="Mobile Number" required error={errors.phone?.message}>
                      <input
                        {...register('phone', {
                          required: 'Mobile number is required',
                          pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number (starts with 6–9)' },
                        })}
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        maxLength={10}
                        aria-required="true"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className={inp(!!errors.phone)}
                      />
                    </Field>
                    <button type="button" onClick={next} className="btn-primary w-full justify-center mt-2">
                      Next Step →
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2"
                    initial={{ opacity: 0, x: prefersReduced ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: prefersReduced ? 0 : -14 }}
                    transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="text-ink font-semibold text-sm uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Your Marketing Needs
                    </h3>
                    <Field id="service" label="Service Interest" required error={errors.service?.message}>
                      <select
                        {...register('service', { required: 'Please select a service', validate: v => v !== '' || 'Please select a service' })}
                        id="service"
                        defaultValue=""
                        aria-required="true"
                        aria-invalid={!!errors.service}
                        className={inp(!!errors.service)}
                      >
                        <option value="" disabled>Please select…</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field id="budget" label="Monthly Budget" required error={errors.budget?.message}>
                      <select
                        {...register('budget', { required: 'Please select a budget', validate: v => v !== '' || 'Please select a budget' })}
                        id="budget"
                        defaultValue=""
                        aria-required="true"
                        aria-invalid={!!errors.budget}
                        className={inp(!!errors.budget)}
                      >
                        <option value="" disabled>Please select…</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </Field>
                    <Field id="city" label="City / Area" required error={errors.city?.message}>
                      <input
                        {...register('city', { required: 'City is required' })}
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="Patna, Bihar"
                        aria-required="true"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                        className={inp(!!errors.city)}
                      />
                    </Field>
                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center text-sm">
                        ← Back
                      </button>
                      <button type="button" onClick={next} className="btn-primary flex-1 justify-center">
                        Next →
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3"
                    initial={{ opacity: 0, x: prefersReduced ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: prefersReduced ? 0 : -14 }}
                    transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="text-ink font-semibold text-sm uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Confirm Your Details
                    </h3>
                    {/* Summary — read-only, rule: read-only-distinction */}
                    <dl className="rounded border border-cream-300 bg-cream-100 p-4 flex flex-col gap-2.5">
                      {([
                        { label: 'Name',    val: vals.name },
                        { label: 'Email',   val: vals.email },
                        { label: 'Phone',   val: vals.phone },
                        { label: 'Service', val: vals.service },
                        { label: 'Budget',  val: vals.budget },
                        { label: 'City',    val: vals.city },
                      ] as const).map(r => (
                        <div key={r.label} className="flex justify-between text-sm">
                          <dt className="text-ink-300 text-xs uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{r.label}</dt>
                          <dd className="text-ink font-medium text-right max-w-[60%]">{r.val || '·'}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={() => setStep(2)} className="btn-outline px-4 justify-center">
                        ← Back
                      </button>
                      {/* rule: submit-feedback — loading state during async op */}
                      <button
                        type="submit"
                        disabled={loading}
                        aria-disabled={loading}
                        className="btn-primary flex-1 justify-center disabled:opacity-60"
                      >
                        {loading ? <><IconSpinner /> Submitting…</> : 'Submit Request ✓'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* rule: form-labels — label always has htmlFor matching input id */
function Field({ id, label, required, error, children }: {
  id: string; label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-ink-400 uppercase tracking-widest"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {label}
        {/* rule: required-indicators */}
        {required && <span aria-hidden="true" className="text-burnt-500 ml-1">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {/* rule: error-placement + aria-live-errors */}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <svg aria-hidden="true" className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function inp(hasErr: boolean) {
  return `w-full bg-cream-100 border ${hasErr ? 'border-red-400 focus:border-red-500' : 'border-cream-300 focus:border-burnt-500'} rounded px-3 py-2.5 text-sm text-ink placeholder-ink-300 outline-none transition-colors appearance-none min-h-[44px]`
}
