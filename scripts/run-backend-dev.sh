#!/usr/bin/env bash
# Запуск бэкенда с профилем dev (Postgres + Redis + Supabase JWT).
# Использование: из корня репозитория  ./scripts/run-backend-dev.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${SUPABASE_ISSUER_URI:=https://pevipmeoruuxqtdraqvr.supabase.co/auth/v1}"
: "${FRONTEND_ORIGIN:=http://localhost:5173}"
: "${DB_URL:=jdbc:postgresql://localhost:5432/liveimprove}"
: "${DB_USER:=appuser}"
: "${DB_PASSWORD:=${APP_DB_PASSWORD:-apppass}}"
: "${REDIS_HOST:=localhost}"
: "${REDIS_PORT:=6379}"

export SUPABASE_ISSUER_URI FRONTEND_ORIGIN DB_URL DB_USER DB_PASSWORD REDIS_HOST REDIS_PORT

exec ./gradlew :liveimprove-app:bootRun --args='--spring.profiles.active=dev' "$@"
