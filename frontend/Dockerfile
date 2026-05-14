# --- Stage 1: build ----------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Установка зависимостей по lock-файлу для воспроизводимой сборки.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

# URL backend — переопределяется через build-arg при необходимости.
ARG VITE_API_URL=http://localhost:8080/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Stage 2: serve ----------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
