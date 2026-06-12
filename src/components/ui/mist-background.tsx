import React, { useEffect, useRef } from 'react'

/**
 * Mist Background Component
 * Technology: WebGL 2D Fragment Shaders (GLSL)
 * Style: Ethereal Generative Fluid / Mist
 *
 * Performance-optimised:
 * - IntersectionObserver pauses rendering when off-screen
 * - Mobile: renders at half resolution & caps at ~30 fps
 * - Graceful fallback if WebGL unavailable
 */
const MistBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Detect mobile / low-power devices
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    const dpr = isMobile ? 0.5 : Math.min(window.devicePixelRatio, 1.5)

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    // Reduced iterations on mobile (4 vs 6) for cheaper fbm
    const fbmIterations = isMobile ? 4 : 6

    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
      }

      float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < ${fbmIterations}; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
          }
          return v;
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv.x *= u_resolution.x / u_resolution.y;

          vec2 q = vec2(0.0);
          q.x = fbm(uv + 0.07 * u_time);
          q.y = fbm(uv + vec2(1.0, 1.0));

          vec2 r = vec2(0.0);
          r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
          r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

          float f = fbm(uv + r);

          vec3 baseColor = vec3(0.03, 0.03, 0.05);
          vec3 mistColor = vec3(0.18, 0.20, 0.25);
          vec3 accentColor = vec3(0.3, 0.35, 0.45);

          vec3 color = mix(baseColor, mistColor, f);
          color = mix(color, accentColor, dot(q, r) * 0.5);
          color = pow(color, vec3(1.1)) * 1.4;
          gl_FragColor = vec4(color, 1.0);
      }
    `

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const program = gl.createProgram()!
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource))
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource))
    gl.linkProgram(program)
    gl.useProgram(program)

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const posAttrib = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posAttrib)
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0)

    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_resolution')

    /* ── Visibility tracking: pause when off-screen ── */
    let isVisible = false
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(canvas)

    /* ── Resize: match parent, scaled by DPR ── */
    const syncSize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = Math.round(parent.clientWidth * dpr)
      const h = Math.round(parent.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const ro = new ResizeObserver(syncSize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    syncSize()

    /* ── Render loop: throttled on mobile ── */
    const minFrameMs = isMobile ? 33 : 0 // ~30fps cap on mobile
    let lastFrame = 0
    let animationFrameId: number

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render)
      if (!isVisible) return // skip work when off-screen

      if (time - lastFrame < minFrameMs) return
      lastFrame = time

      syncSize()
      gl.uniform1f(timeLoc, time * 0.001)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? ''}`}
      style={{ background: '#0f0e0d' }}
    />
  )
}

export default MistBackground
