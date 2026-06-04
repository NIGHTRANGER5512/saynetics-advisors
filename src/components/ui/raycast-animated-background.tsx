// Animated warm glow blob background — replaces the broken unicornstudio-react.
// Uses a canvas-based animated radial gradient system in burnt/amber palette.
// Fix: uses ResizeObserver on the parent div (not canvas.offsetWidth) so it
// always gets correct dimensions even when absolutely positioned.
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface RaycastBgProps {
  className?: string
}

export const RaycastAnimatedBackground = ({ className }: RaycastBgProps) => {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext("2d")!
    let animId: number
    let t = 0

    /* Blobs — positions/radii as fraction of the canvas dimensions */
    const blobs = [
      { bx: 0.35, by: 0.42, ax: 0.14, ay: 0.11, sx: 0.40, sy: 0.30, r: 0.55, color: "rgba(197,82,33,0.22)"  },
      { bx: 0.65, by: 0.55, ax: 0.11, ay: 0.10, sx: 0.50, sy: 0.35, r: 0.50, color: "rgba(204,136,0,0.18)"  },
      { bx: 0.22, by: 0.68, ax: 0.09, ay: 0.09, sx: 0.28, sy: 0.45, r: 0.42, color: "rgba(232,160,32,0.14)" },
      { bx: 0.80, by: 0.28, ax: 0.08, ay: 0.12, sx: 0.60, sy: 0.40, r: 0.40, color: "rgba(197,82,33,0.16)"  },
      { bx: 0.50, by: 0.18, ax: 0.16, ay: 0.10, sx: 0.22, sy: 0.55, r: 0.38, color: "rgba(204,136,0,0.13)"  },
    ]

    const setSize = (w: number, h: number) => {
      canvas.width  = w
      canvas.height = h
    }

    const draw = () => {
      const { width: w, height: h } = canvas
      if (w === 0 || h === 0) { animId = requestAnimationFrame(draw); return }

      ctx.clearRect(0, 0, w, h)

      blobs.forEach(b => {
        const cx = (b.bx + b.ax * Math.sin(t * b.sx)) * w
        const cy = (b.by + b.ay * Math.cos(t * b.sy)) * h
        const r  = b.r * Math.max(w, h)
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        grd.addColorStop(0, b.color)
        grd.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      })

      t += 0.007
      animId = requestAnimationFrame(draw)
    }

    /* Use ResizeObserver on the wrapper so we catch the real pixel dimensions
       even when the canvas is absolutely positioned (offsetWidth would be 0) */
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize(Math.round(width), Math.round(height))
      }
    })
    ro.observe(wrap)

    /* Kick off immediately with current size */
    const { width: iw, height: ih } = wrap.getBoundingClientRect()
    setSize(Math.round(iw), Math.round(ih))
    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Deep charcoal base — visible before canvas is ready */}
      <div className="absolute inset-0 bg-[#120f0d]" />

      {/* Animated warm glow blobs */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Fine noise texture overlay for analogue depth */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Edge vignette — pulls focus to the centre copy */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 20%, rgba(10,8,6,0.72) 100%)",
        }}
      />
    </div>
  )
}

// keep Component export for any legacy references
export const Component = RaycastAnimatedBackground
