# Changelog

## [1.1.0] - 2026-03-13

### Security

- Add SSRF protection — block private IP ranges (`10.x`, `172.16-31.x`, `192.168.x`, `169.254.x`), localhost, and cloud metadata endpoints
- Remove `Host` header before forwarding to prevent header leakage

### Fixed

- Fix URL parsing — replace manual string splitting with `URL` constructor for correct handling of ports, paths, and special characters
- Fix query string being dropped — use full request URL instead of path-only extraction

### Changed

- Add TypeScript type annotations to `constructUrl`
- Use `c.req.raw.headers` / `c.req.raw.body` for proper request forwarding

## [1.0.0] - Initial Release

- CORS proxy with Hono on Cloudflare Workers
- Support HTTP/HTTPS proxying via URL-in-path
- Global CORS middleware (`Access-Control-Allow-Origin: *`)
