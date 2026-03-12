import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',
])

const isPrivateIP = (hostname: string): boolean => {
  if (BLOCKED_HOSTNAMES.has(hostname)) return true

  const parts = hostname.split('.').map(Number)
  if (parts.length !== 4 || parts.some(isNaN)) return false

  // 10.0.0.0/8
  if (parts[0] === 10) return true
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true
  // 169.254.0.0/16 (link-local / cloud metadata)
  if (parts[0] === 169 && parts[1] === 254) return true
  // 0.0.0.0/8
  if (parts[0] === 0) return true

  return false
}

const constructUrl = (path: string): string | null => {
  if (!path) return null

  const raw = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `https://${path}`

  try {
    const url = new URL(raw)
    return url.href
  } catch {
    return null
  }
}

const USAGE_TEXT = `Usage: /{url}
Examples:
  /http://example.com/
  /example.com
  /example.com:8080/path`

app.all('/*', async (c) => {
  const reqUrl = new URL(c.req.url)
  const path = reqUrl.pathname.slice(1) + reqUrl.search

  if (!path || path === '?') {
    return c.text(USAGE_TEXT, 200)
  }

  if (path === 'favicon.ico') {
    return c.text('Not found', 404)
  }

  const targetUrl = constructUrl(path)

  if (!targetUrl) {
    return c.text('Invalid URL', 400)
  }

  const parsed = new URL(targetUrl)
  if (isPrivateIP(parsed.hostname)) {
    return c.text('Forbidden: private/internal addresses are not allowed', 403)
  }

  try {
    const reqHeaders = new Headers(c.req.raw.headers)
    reqHeaders.delete('host')

    const response = await fetch(targetUrl, {
      method: c.req.method,
      headers: reqHeaders,
      body: c.req.raw.body,
    })

    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch {
    return c.text('Error fetching target URL', 500)
  }
})

export default app
