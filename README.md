# Aapkakaam — Web (React + Vite)

Production-grade React 18 + Vite 5 frontend for the Aapkakaam platform.
Talks to the [Aapkakaam-server](../Aapkakaam-server/README.md) backend.

---

## Tech stack

| Layer         | Choice                             |
| ------------- | ---------------------------------- |
| Framework     | React 18                           |
| Build         | Vite 5 (esbuild + Rollup)          |
| Routing       | react-router-dom 6                 |
| State         | Redux Toolkit + react-redux        |
| HTTP          | axios (central instance w/ interceptors) |
| Notifications | SweetAlert2                        |
| Lint          | ESLint (react + hooks + refresh)   |
| Format        | Prettier                           |
| Runtime img   | nginx-alpine (multi-stage Docker)  |

---

## Quick start

```bash
# 1. Install deps
yarn install         # or: npm install

# 2. Configure the API URL for local dev
cp .env.example .env.development
#    → edit VITE_API_URL (default: http://localhost:3000/api)

# 3. Run
yarn dev             # → http://localhost:5173

# 4. Production build
yarn build:prod
yarn preview         # smoke-test the built bundle locally
```

The dev server also proxies `/api/*` to your backend (see `vite.config.js`), so
you can set `VITE_API_URL="/api"` if you prefer same-origin dev.

## Run with Docker

```bash
# Build the image, baking in your production API URL:
docker build \
  --build-arg VITE_API_URL=https://api.aapkakaam.com/api \
  -t aapkakaam-web:latest .

# Serve on port 8080:
docker run -p 8080:80 aapkakaam-web:latest
```

Behind a reverse proxy that terminates TLS, forward port 80 to nginx.

---

## Environment variables

Vite **inlines** everything prefixed with `VITE_` at build time — treat them as
public. Never put secrets in `.env*`.

| Variable        | Description                                | Example                                 |
| --------------- | ------------------------------------------ | --------------------------------------- |
| `VITE_API_URL`  | Full backend base URL **including `/api`** | `https://api.aapkakaam.com/api`         |

If `VITE_API_URL` is not set at build time, the app defaults to `/api` (which
works when the frontend is served from the same origin as the API).

---

## Project layout

```
.
├── index.html                 # SPA entry
├── src/
│   ├── main.jsx               # Entry — wraps <App/> in <ErrorBoundary/>
│   ├── App.jsx                # Router
│   ├── ErrorBoundary.jsx      # Top-level fallback UI
│   ├── index.css              # Global styles
│   ├── utils/
│   │   ├── base.js            # SERVER_URL from import.meta.env.VITE_API_URL
│   │   ├── api.js             # Central axios instance (auth interceptor + 401 handling)
│   │   ├── store.jsx          # Redux store
│   │   ├── userslice.jsx
│   │   ├── vendorslice.jsx
│   │   └── categoryslice.jsx
│   ├── components/            # Feature-scoped components
│   ├── pages/                 # Static/legal pages
│   ├── payments/              # Razorpay checkout + result screens
│   ├── ads/                   # 3rd-party ad containers
│   ├── data/                  # Static config
│   └── resources/             # SVGs, images
├── public/                    # Copied verbatim to /dist
├── vite.config.js
├── nginx.conf
├── Dockerfile
├── .env.example
├── .env.development
├── .env.production
└── package.json
```

---

## Central axios instance

`src/utils/api.js` exports a pre-configured axios instance:

- Base URL = `SERVER_URL` (from `VITE_API_URL`).
- **Request interceptor** injects `Authorization: Bearer <token>` from
  `localStorage[<category>]` for whichever audience (`user`/`vendor`/
  `admin`/`employee`) is active. Existing `Authorization` headers are
  preserved.
- **Response interceptor**: on `401`, clears the stored session and fires a
  `window` event `auth:unauthorised` so a listener can redirect to `/login`.

Adopt it incrementally:

```js
import api from "./utils/api";
const { data } = await api.get(`/user/getUserByUser/${id}`);
```

Legacy code that constructs URLs with `${SERVER_URL}/...` and passes its own
`Authorization` header continues to work unchanged.

---

## Scripts

| Command           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `yarn dev`        | Vite dev server + HMR (`/api/*` proxied to backend)|
| `yarn build`      | Development-flavoured production build             |
| `yarn build:prod` | Full production build with `.env.production`       |
| `yarn preview`    | Serve the built `dist/` locally                    |
| `yarn lint`       | ESLint                                             |
| `yarn lint:fix`   | ESLint autofix                                     |
| `yarn format`     | Prettier                                           |

---

## Production hardening (already applied)

- [x] `VITE_API_URL` env var — no more hardcoded `localhost:3000`
- [x] Central axios instance with auth-injection + 401 handling
- [x] Top-level `<ErrorBoundary/>` — no more white-screen crashes
- [x] Vite build: source maps in dev, ES2020 target, manual chunking for
      react/redux vendors, `chunkSizeWarningLimit` raised for the ad bundle
- [x] Nginx: gzip on for text/JS/CSS/SVG, immutable `Cache-Control` on hashed
      assets, `no-store` on `index.html`, SPA fallback, security headers
- [x] Multi-stage `Dockerfile` with `HEALTHCHECK`
- [x] `.dockerignore`, `.gitignore` (drops `.wrangler`, `.env*`, `dist`)
- [x] ESLint: pragmatic rules — warns on unused vars / console, no bogus
      `--max-warnings 0` blocker in CI
- [x] GitHub Actions: `ci.yml` (lint + build + docker build on Node 18/20) and
      `deploy.yml` (build → S3 sync w/ correct cache-control → optional
      CloudFront invalidation)

---

## Deployment notes

- **AWS S3 + CloudFront**: `deploy.yml` syncs `dist/` with immutable cache on
  hashed assets and `no-store` on `index.html`. Set repo secrets:
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`,
  `VITE_API_URL`, optional `CLOUDFRONT_DISTRIBUTION_ID`.
- **Docker / Kubernetes**: build with `--build-arg VITE_API_URL=...`, ship the
  resulting image, terminate TLS at your ingress.
- **Vercel / Netlify / Cloudflare Pages**: build command `yarn build:prod`,
  output directory `dist`, set env `VITE_API_URL`. SPA fallback rules should
  route unknown paths to `/index.html`.

---

## Backlog (nice-to-have)

- Introduce Vitest + React Testing Library for unit coverage.
- Adopt the central `api.js` across all remaining components.
- Consider extracting the ~2000-line obfuscated `index.html` inline script
  into an auditable third-party module (`adsterra` / analytics vendor).
# Aapkakaam-web-production
