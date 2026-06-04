// Refined heading reveal — each word rises smoothly from behind a clip-mask with
// a gentle staggered spring. Subtle and professional (no glitch/scramble).
// Accessible (real text via aria-label) and respects prefers-reduced-motion.
import { useRef, type ElementType, type CSSProperties } from "react"
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion"

interface AnimatedHeadingProps {
  text: string
  highlight?: string            // word(s) to tint burnt
  className?: string
  style?: CSSProperties
  as?: ElementType              // h1 / h2 / ... (default h2)
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
const word: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { type: "spring", stiffness: 200, damping: 26 } },
}

export function AnimatedHeading({
  text,
  highlight,
  className,
  style,
  as: Tag = "h2",
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()

  const hlWords = highlight ? new Set(highlight.split(" ")) : null
  const lines = text.split("\n")

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      <motion.span
        aria-hidden="true"
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : inView ? "show" : "hidden"}
        style={{ display: "block" }}
      >
        {lines.map((line, li) => (
          <span key={li} style={{ display: "block" }}>
            {line.split(" ").map((w, wi, arr) => (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  // a little breathing room so the clip never crops the glyphs
                  paddingBottom: "0.08em",
                  marginBottom: "-0.08em",
                }}
              >
                <motion.span
                  variants={reduce ? undefined : word}
                  style={{
                    display: "inline-block",
                    willChange: "transform",
                    color: hlWords?.has(w) ? "#d96a3a" : undefined,
                  }}
                >
                  {w}
                </motion.span>
                {wi < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

// alias kept so existing imports (`ScrambleHeading`) keep working
export const ScrambleHeading = AnimatedHeading
