# --- Stage 1: build ----------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Установка зависимостей по lock-файлу для воспроизводимой сборки.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

# Vite подставляет переменные на этапе сборки (не из runtime-контейнера).
ARG VITE_API_URL=http://localhost:8080/api/v1
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN test -n "$VITE_SUPABASE_URL" && test -n "$VITE_SUPABASE_ANON_KEY" || \
    (echo >&2 "Docker build: задайте build-arg VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY (см. README, docker-compose.dev.yml)." && exit 1)

RUN npm run build

# --- Stage 2: serve ----------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
