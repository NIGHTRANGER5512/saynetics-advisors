// Adapted from shadcn tubelight-navbar for Vite + React.
// - removed "use client" and next/link (uses <a>)
// - themed to the site accent (burnt #C55221 / amber #CC8800) on glass
// - added single-page scroll-spy so the "lamp" tracks the section in view
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  /** floating = native fixed pill (top desktop / bottom mobile). false = inline. */
  floating?: boolean
}

export function NavBar({ items, className, floating = true }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)

  /* Single-page scroll-spy — the lamp follows the section you're viewing */
  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + window.innerHeight * 0.35
      let current = items[0].name
      for (const it of items) {
        if (it.url === "#") {
          if (window.scrollY < window.innerHeight * 0.5) current = it.name
          continue
        }
        const el = document.getElementById(it.url.slice(1))
        if (el && el.offsetTop <= line) current = it.name
      }
      setActiveTab(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  return (
    <div
      className={cn(
        floating &&
          "fixed bottom-6 sm:bottom-auto sm:top-5 left-1/2 -translate-x-1/2 z-50",
        className,
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-white/12 bg-charcoal-900/55 px-1.5 py-1.5 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.18)]">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                "text-white/70 hover:text-white",
                isActive && "text-white",
              )}
              style={{ fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.01em" }}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.4} />
              </span>

              {isActive && (
                <motion.div
                  layoutId="tubelight-lamp"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-burnt-500/15"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* the glowing tube/lamp above the active item */}
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-burnt-500 to-amber-500">
                    <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-burnt-500/25 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-amber-500/20 blur-md" />
                    <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-amber-400/20 blur-sm" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
