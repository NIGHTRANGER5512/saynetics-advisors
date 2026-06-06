import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

function leadsApiPlugin(): Plugin {
  return {
    name: 'leads-api',
    configureServer(server) {
      server.middlewares.use('/api/leads', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.method !== 'POST') return next()
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const { name, email, phone } = data
            if (!name || !email || !phone || typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: false, message: 'Name, email, and phone are required.' }))
              return
            }
            // replace console.log with your database insert, e.g. Prisma create on Lead model
            console.log('[Lead captured]', data)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true }))
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Invalid JSON.' }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  // Served from https://<user>.github.io/saynetics-advisors/ on GitHub Pages.
  // Use root base for local dev so the dev server still works at /.
  base: process.env.GITHUB_ACTIONS ? '/saynetics-advisors/' : '/',
  plugins: [react(), leadsApiPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
