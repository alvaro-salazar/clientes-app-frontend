# ── Etapa 1: compilación ──────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx ng build --configuration=production --localize

# ── Etapa 2: servidor nginx con ambos idiomas ──────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist/clientes-app-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
