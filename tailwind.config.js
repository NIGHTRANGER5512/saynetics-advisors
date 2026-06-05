/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paper palette — cream surfaces, ink text
        cream: {
          50:  '#fefdfb',
          100: '#faf9f6',
          200: '#f3f0eb',
          300: '#e8e3db',
          400: '#d6cfc4',
        },
        ink: {
          DEFAULT: '#111111',
          600: '#3d3935',
          500: '#5a534c',
          400: '#7a7068',
          300: '#a09890',
        },
        // Perspective teal accent
        teal: {
          400: '#34d399',
          500: '#00BD7D',
          600: '#00a36b',
        },
        // Paper purple secondary
        violet: {
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
        },
        // Impeccable amber gold accent
        amber: {
          400: '#e6a020',
          500: '#CC8800',
          600: '#b07500',
        },
        // Impeccable burnt orange — THE single locked accent (taste-skill)
        burnt: {
          50:  '#fdf4f0',
          100: '#fae6dd',
          200: '#f2c9b8',
          400: '#d96a3a',
          500: '#C55221',
          600: '#a84419',
          700: '#8a3914',
        },
        // Brand orange — buttons & CTAs
        brand: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        // Warm charcoal (not pure black) for dark sections
        charcoal: {
          900: '#0f0e0d',
          800: '#1c1917',
          700: '#28241f',
          600: '#3a342c',
        },
      },
      fontFamily: {
        // Space Grotesk display + Plus Jakarta Sans body + JetBrains Mono labels
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        // Perspective + Paper use tight radii
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        // Perspective depth system — layered shadows for spatial feel
        'depth-1': '0 1px 2px rgba(17,11,5,0.06), 0 2px 4px rgba(17,11,5,0.04)',
        'depth-2': '0 2px 4px rgba(17,11,5,0.06), 0 6px 12px rgba(17,11,5,0.06)',
        'depth-3': '2px 4px 8px rgba(17,11,5,0.08), 6px 12px 24px rgba(17,11,5,0.06)',
        'depth-4': '4px 8px 16px rgba(17,11,5,0.10), 12px 24px 48px rgba(17,11,5,0.08)',
        'depth-lift': '0 -2px 0 rgba(255,255,255,0.8) inset, 0 2px 8px rgba(17,11,5,0.12), 0 12px 32px rgba(17,11,5,0.10)',
        'glow-orange': '0 0 24px rgba(249,115,22,0.30), 0 4px 16px rgba(249,115,22,0.20)',
        'glow-teal':   '0 0 24px rgba(0,189,125,0.25), 0 4px 16px rgba(0,189,125,0.15)',
      },
    },
  },
  plugins: [],
}
