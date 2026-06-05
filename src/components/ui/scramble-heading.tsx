// ScrambleHeading — uses TextEffect (blur preset) for section headings.
// Triggers when the element scrolls into view. Highlighted words get
// the brand burnt-orange colour (#d96a3a).
import { useRef, type ElementType, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { TextEffect } from '@/components/ui/text-effect'

interface AnimatedHeadingProps {
  text: string
  highlight?: string        // space-separated words to colour burnt-orange
  className?: string
  style?: CSSProperties
  as?: ElementType
}

export function AnimatedHeading({
  text,
  highlight,
  className,
  style,
  as: Tag = 'h2',
}: AnimatedHeadingProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()

  const hlSet  = highlight ? new Set(highlight.split(' ')) : null
  const lines  = text.split('\n')

  return (
    <div ref={ref} aria-label={text}>
      <Tag className={className} style={style} aria-hidden="true">
        {lines.map((line, li) => {
          const words = line.split(' ')
          const hasHL = hlSet && words.some(w => hlSet.has(w))

          return (
            <span key={li} style={{ display: 'block' }}>
              {!hasHL ? (
                /* No highlights — single TextEffect for the whole line */
                <TextEffect
                  as='span'
                  per='word'
                  preset='blur'
                  trigger={reduce ? true : inView}
                  delay={li * 0.1}
                >
                  {line}
                </TextEffect>
              ) : (
                /* Has highlights — word by word with colour overrides */
                words.map((w, wi) => (
                  <span key={wi} style={{ color: hlSet!.has(w) ? '#d96a3a' : undefined }}>
                    <TextEffect
                      as='span'
                      per='word'
                      preset='blur'
                      trigger={reduce ? true : inView}
                      delay={li * 0.1 + wi * 0.03}
                    >
                      {w}
                    </TextEffect>
                    {wi < words.length - 1 && ' '}
                  </span>
                ))
              )}
            </span>
          )
        })}
      </Tag>
    </div>
  )
}

// alias kept so existing imports work unchanged
export const ScrambleHeading = AnimatedHeading
