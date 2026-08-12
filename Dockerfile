# ---- Build stage --------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first for optimal caching.
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy sources.
COPY . .

# Bake the API URL into the bundle at build time. Override via
#   docker build --build-arg VITE_API_URL=https://api.example.com/api ...
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN yarn build

# ---- Runtime stage ------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Nginx SPA + gzip config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ship the built assets.
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root: nginx-alpine already runs worker processes as `nginx`; the
# master needs root to bind :80. If you want fully rootless, use nginx
# unprivileged image and adjust listen port.
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1
