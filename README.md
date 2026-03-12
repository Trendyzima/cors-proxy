# CORS Anywhere with Hono and Cloudflare Workers

A CORS Anywhere proxy using the [Hono](https://github.com/honojs/hono) framework, deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## Features

- Proxy requests to bypass CORS restrictions
- Handles URLs passed directly in the path (with query string support)
- Supports both HTTP and HTTPS
- SSRF protection — blocks private/internal IP ranges and cloud metadata endpoints
- Proper URL parsing via `URL` constructor
- Shows usage instructions when accessed without a URL

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/7a6163/cors-proxy
    cd cors-proxy
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Development**:

    ```bash
    npm run dev
    ```

4. **Deploy to Cloudflare Workers**:

    ```bash
    npm run deploy
    ```

## Usage

Once deployed, pass the target URL directly in the path.

### Examples

- `https://your-worker.workers.dev/http://example.com/` — Proxies with CORS headers
- `https://your-worker.workers.dev/example.com` — Defaults to HTTPS
- `https://your-worker.workers.dev/example.com:8080/path` — Custom port
- `https://your-worker.workers.dev/example.com/api?key=123` — Query strings preserved
- `https://your-worker.workers.dev/` — Shows usage text

## License

This project is licensed under the MIT License.
