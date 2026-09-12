# Testagram Gateway

A locked-down Cloudflare Worker gateway for Testagram's browser-to-Supabase federation relay.

## Purpose

The production Testagram frontend calls:

`https://api.testagram.site/api/gateway`

This Worker provides that public edge endpoint and forwards the request to the existing Supabase `gateway-relay` function. It is **not** a general-purpose CORS proxy and does not implement ActivityPub itself.

## Request flow

```text
Testagram browser
      |
      | POST /api/gateway
      v
Cloudflare Worker
      |
      | server-side HTTPS fetch
      v
Supabase gateway-relay
      |
      v
Testagram Federation
```

## Security boundaries

- Only `POST /api/gateway` is proxied.
- The upstream is fixed by `SUPABASE_GATEWAY_URL`.
- The upstream must use HTTPS.
- Browser origins are restricted by `ALLOWED_ORIGINS`.
- `Authorization`, `Content-Type`, `Accept`, and `X-Request-ID` are forwarded.
- `Origin`, `Host`, and `Content-Length` are not forwarded upstream.
- `Set-Cookie` is removed from upstream responses.
- No arbitrary target URL is accepted from the browser.
- ActivityPub signing, authentication, delivery, retries, and federation state remain in the existing Testagram backend.

## Configuration

`wrangler.toml` contains the non-secret production routing configuration:

- `SUPABASE_GATEWAY_URL`
- `ALLOWED_ORIGINS`

## Local verification

```bash
npm ci
npm run typecheck
npm run dev
```

Health check:

`GET /health`

Gateway endpoint:

`POST /api/gateway`

The gateway body is the existing Testagram gateway envelope and is forwarded without rewriting.

## Deployment

Deploy with:

```bash
npm run deploy
```

The DNS/custom-domain route for `api.testagram.site` must point to this Worker separately. This repository does not claim or perform DNS configuration.
