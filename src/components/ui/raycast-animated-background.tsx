// Self-contained WebGL fragment-shader background — flowing fractal-noise
// gradient in the site palette (charcoal #1c1917 → burnt #C55221 → amber #CC8800).
// No external SDK/CDN, so it always renders. Falls back to a CSS gradient if
// WebGL is unavailable, and respects prefers-reduced-motion (renders one frame).
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface ShaderBgProps {
  className?: string
}

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // smoothed pointer, normalized uv (y up)
uniform vec2  u_mvel;    // pointer velocity (uv / frame), gives physics feel

// value noise + fbm
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = uv;  p.x *= aspect;          // aspect-correct
  vec2 m = u_mouse; m.x *= aspect;
  float t = u_time * 0.04;

  // ── cursor interaction: fluid swirl + outward push (physics-driven) ──
  vec2 toM   = p - m;
  float d    = length(toM);
  float infl = smoothstep(0.55, 0.0, d);        // 1 at cursor → 0 at radius
  float vmag = length(u_mvel);

  // vortex: rotate the sample field around the cursor, harder when moving fast
  float ang  = infl * (1.4 + vmag * 16.0);
  float si = sin(ang), co = cos(ang);
  vec2 rotated = m + mat2(co, -si, si, co) * toM;
  // push the smoke outward from the cursor, flung along the motion direction
  vec2 push = normalize(toM + 1e-4) * infl * (0.05 + vmag * 1.2)
            + u_mvel * infl * 6.0;
  vec2 q = mix(p, rotated + push, infl);

  // domain-warped flow on the (locally perturbed) field
  float n1 = fbm(q * 2.2 + vec2(t, t * 0.6));
  float n2 = fbm(q * 3.1 - vec2(t * 0.7, t * 0.9));
  float m2 = fbm(q * 1.9 + vec2(n1, n2) * 1.5);

  // palette — dark charcoal base with glowing burnt veins + amber highlights
  vec3 charcoal = vec3(0.055, 0.048, 0.042);
  vec3 burnt    = vec3(0.760, 0.290, 0.110);
  vec3 amber    = vec3(0.870, 0.560, 0.040);

  vec3 col = charcoal;
  col = mix(col, burnt, smoothstep(0.42, 0.88, m2));
  col += amber * smoothstep(0.72, 1.0, n1) * 0.45;
  col += burnt * smoothstep(0.80, 1.0, n2) * 0.20;

  // the smoke "heats up" where the cursor stirs it
  col += amber * infl * (0.10 + vmag * 2.2);

  // moody vignette so white hero text stays legible
  float vig = smoothstep(1.30, 0.30, length(uv - 0.5));
  col *= mix(0.45, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`

export const RaycastAnimatedBackground = ({ className }: ShaderBgProps) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const gl = (canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true, // keep buffer so it composites reliably (screenshots / all browsers)
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null
    if (!gl) return // CSS fallback gradient stays visible

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("[shader] compile error:", gl.getShaderInfoLog(s))
      }
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[shader] link error:", gl.getProgramInfoLog(prog))
    }
    gl.useProgram(prog)
    // guaranteed warm-dark base even if a frame is skipped
    gl.clearColor(0.055, 0.048, 0.042, 1)

    // full-screen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "u_res")
    const uTime = gl.getUniformLocation(prog, "u_time")
    const uMouse = gl.getUniformLocation(prog, "u_mouse")
    const uMvel = gl.getUniformLocation(prog, "u_mvel")

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = (w: number, h: number) => {
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      resize(width, height)
    })
    ro.observe(wrap)
    const r = wrap.getBoundingClientRect()
    resize(r.width, r.height)

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const start = performance.now()
    let animId = 0

    /* ── Pointer physics: target → inertia-smoothed position + velocity ── */
    const target = { x: 0.5, y: 0.5 } // normalized, y up
    const pos = { x: 0.5, y: 0.5 }
    const prev = { x: 0.5, y: 0.5 }
    const vel = { x: 0, y: 0 }

    const onPointer = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      target.x = (e.clientX - rect.left) / rect.width
      target.y = 1 - (e.clientY - rect.top) / rect.height // flip Y to match gl uv
    }

    if (reduce) {
      // static single frame, no motion / no interaction
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, 0)
      gl.uniform2f(uMouse, 0.5, 0.5)
      gl.uniform2f(uMvel, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true })

      let visible = true
      let running = false
      const render = (now: number) => {
        running = true
        // inertia — pos eases toward the cursor (momentum / trailing)
        pos.x += (target.x - pos.x) * 0.10
        pos.y += (target.y - pos.y) * 0.10
        // velocity from the smoothed delta (decays naturally when still)
        vel.x = pos.x - prev.x
        vel.y = pos.y - prev.y
        prev.x = pos.x
        prev.y = pos.y

        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform1f(uTime, (now - start) / 1000)
        gl.uniform2f(uMouse, pos.x, pos.y)
        gl.uniform2f(uMvel, vel.x, vel.y)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        if (visible) animId = requestAnimationFrame(render)
        else running = false // pause when hero is off-screen
      }

      // pause the GPU loop when the hero scrolls out of view (perf)
      const vio = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        if (visible && !running) animId = requestAnimationFrame(render)
      }, { threshold: 0 })
      vio.observe(wrap)

      render(start)

      return () => {
        cancelAnimationFrame(animId)
        ro.disconnect()
        vio.disconnect()
        window.removeEventListener("pointermove", onPointer)
      }
    }

    return () => {
      // reduced-motion path: just stop the observer (no loop / listener was added)
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
      {/* CSS gradient fallback — visible if WebGL is unavailable / before first frame */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_45%,#3a2418_0%,#1c1917_55%,#100d0b_100%)]" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* fine grain for analogue depth */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// keep Component export for any legacy references
export const Component = RaycastAnimatedBackground
