// Adapted from shadcn expanding-cards for Vite + React.
// Light-themed redesign: cream/white cards, thumbnail top, rich animated text body.
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardItem {
  id: string | number
  title: string
  description: string
  imgSrc: string
  icon: React.ReactNode
  linkHref: string
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[]
  defaultActiveIndex?: number
}

/* Animation variants for the text content inside an active card */
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const textItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex)
    const [isDesktop, setIsDesktop] = React.useState(false)

    React.useEffect(() => {
      const handleResize = () => setIsDesktop(window.innerWidth >= 768)
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    const gridStyle = React.useMemo(() => {
      if (activeIndex === null) return {}
      if (isDesktop) {
        return {
          gridTemplateColumns: items
            .map((_, i) => (i === activeIndex ? "5fr" : "1fr"))
            .join(" "),
        }
      }
      return {
        gridTemplateRows: items
          .map((_, i) => (i === activeIndex ? "5fr" : "1fr"))
          .join(" "),
      }
    }, [activeIndex, items, isDesktop])

    return (
      <ul
        ref={ref}
        className={cn(
          "w-full max-w-6xl gap-2.5 grid h-[600px] md:h-[480px]",
          "transition-[grid-template-columns,grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          className,
        )}
        style={{
          ...gridStyle,
          ...(isDesktop ? { gridTemplateRows: "1fr" } : { gridTemplateColumns: "1fr" }),
        }}
        {...props}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index
          return (
            <li
              key={item.id}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-500",
                "md:min-w-[72px] min-h-0 min-w-0",
                isActive
                  ? "border border-burnt-500/30 shadow-[0_4px_24px_rgba(197,82,33,0.12),0_1px_4px_rgba(17,11,5,0.08)]"
                  : "border border-cream-300 shadow-depth-2 hover:border-burnt-500/25 hover:shadow-depth-3",
              )}
              style={{
                background: isActive
                  ? "#ffffff"
                  : "#faf9f6",
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              tabIndex={0}
              data-active={isActive}
            >
              {/* ── COLLAPSED — centred step number + vertical label ── */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300",
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100",
                )}
              >
                {/* Step number */}
                <span
                  className="font-black leading-none select-none text-burnt-500/60"
                  style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem" }}
                >
                  {item.id}
                </span>

                {/* Rotated title — desktop only */}
                <span
                  className="hidden origin-center -rotate-90 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] text-ink-400 md:block"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {item.title}
                </span>

                {/* Burnt bottom accent */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-burnt-500/35"
                />
              </div>

              {/* ── EXPANDED — thumbnail + animated text body ── */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                {/* ── Thumbnail (top 42%) ── */}
                <div className="relative h-[42%] flex-shrink-0 overflow-hidden rounded-t-xl">
                  <img
                    src={item.imgSrc}
                    alt={`${item.title} illustration`}
                    loading="lazy"
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-700",
                      isActive ? "scale-100" : "scale-110",
                    )}
                  />
                  {/* Subtle bottom fade into the card body */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/80" />

                  {/* Step badge */}
                  <span
                    className="absolute top-3 left-3 flex items-center gap-1.5 rounded border border-burnt-500/30 bg-white/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-burnt-600 backdrop-blur-sm"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Step {item.id}
                  </span>
                </div>

                {/* ── Text body (bottom 58%) — stagger animated ── */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key={`card-body-${item.id}`}
                      variants={textContainer}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="flex flex-1 flex-col gap-2.5 overflow-hidden p-4"
                    >
                      {/* Icon + step label row */}
                      <motion.div variants={textItem} className="flex items-center gap-2 text-burnt-500">
                        {item.icon}
                      </motion.div>

                      {/* Title — ink, Space Grotesk Black */}
                      <motion.h3
                        variants={textItem}
                        className="font-black leading-tight tracking-tight text-ink"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "1rem",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.title}
                      </motion.h3>

                      {/* Burnt underline accent — animates after title */}
                      <motion.span
                        variants={textItem}
                        aria-hidden="true"
                        className="block h-[2px] w-8 rounded-full bg-gradient-to-r from-burnt-500 to-amber-400"
                      />

                      {/* Description */}
                      <motion.p
                        variants={textItem}
                        className="text-[0.78rem] leading-relaxed text-ink-400 line-clamp-3"
                        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                      >
                        {item.description}
                      </motion.p>

                      {/* CTA link */}
                      <motion.a
                        variants={textItem}
                        href={item.linkHref}
                        onClick={e => e.stopPropagation()}
                        className="mt-auto flex w-fit items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-burnt-500 transition-colors hover:text-burnt-600"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        Get started
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ul>
    )
  },
)
ExpandingCards.displayName = "ExpandingCards"
