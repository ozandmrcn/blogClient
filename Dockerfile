# syntax=docker/dockerfile:1

# ---- Build stage -----------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Dependencies are installed in their own layer so the cache survives code edits.
COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* variables at build time, so the API URL has to be known
# now. Override it per environment, e.g.
#   docker build --build-arg VITE_API_URL=https://blog-api.onrender.com .
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Runtime stage ---------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine already runs as a non-root user via its entrypoint.
CMD ["nginx", "-g", "daemon off;"]
