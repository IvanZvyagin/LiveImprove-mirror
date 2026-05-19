# liveImprove Backend

Многомодульный монолит на Spring Boot 3.5+, Java 25. В репозитории также лежит **фронтенд** (`frontend/`, Vite + React).

## Быстрый старт

1. Установить Docker, JDK 25, Node.js 22+ (для фронта), Git.
2. Склонировать репозиторий.
3. Скопировать `.env.example` в `.env` и заполнить секреты (можно оставить значения по умолчанию для локальной разработки).
4. Выполнить `docker compose up -d` для поднятия PostgreSQL и Redis (JWT — через [Supabase](https://supabase.com) Auth, не в Docker).
5. Запустить приложение: `./gradlew :liveimprove-app:bootRun --args='--spring.profiles.active=local'`
6. Swagger UI будет доступен по адресу http://localhost:8080/swagger-ui.html после реализации.

## Тестирование JWT (шаг 6)

См. [docs/STEP6-TESTING.md](docs/STEP6-TESTING.md) — Postgres/Redis, профиль `dev`, `SUPABASE_ISSUER_URI`, вызов `GET /auth/me`.

### Фронтенд (локально)

```bash
cd frontend
cp .env.example .env   # при необходимости поправьте VITE_API_URL
npm ci
npm run dev
```

Dev-сервер Vite проксирует `/api` на `http://localhost:8080` (см. `frontend/vite.config.ts`).

### Всё в Docker (демо UI + API, H2)

Сборка фронта на **Vite** вшивает переменные окружения на этапе `docker build`. В корне репозитория скопируйте `.env.example` в `.env` и заполните **`VITE_SUPABASE_URL`** и **`VITE_SUPABASE_ANON_KEY`** (из Supabase Dashboard → Settings → API). Без них приложение на `/auth` упадёт с ошибкой про отсутствие ключей.

Для входа через Google/GitHub в Supabase добавьте redirect URL: `http://localhost:5173/auth/callback`.

```bash
docker compose -f docker-compose.dev.yml up --build
```

- UI: http://localhost:5173  
- API: http://localhost:8080 (профиль Spring `local`, H2 in-memory)

## Модули проекта

* `liveimprove-app` – Spring Boot приложение, конфигурация.
* `liveimprove-common` – общие утилиты, DTO, исключения.
* `liveimprove-domain` – доменные интерфейсы, базовые сущности.
* `liveimprove-auth` – аутентификация (JWT resource server, Supabase Auth).
* `liveimprove-goals` – цели и пункты целей.
* `liveimprove-habits` – привычки и логи.
* `liveimprove-tasks` – задачи и логи задач.
* `liveimprove-calendar` – события календаря.
* `liveimprove-interviews` – собеседования и этапы.
* `liveimprove-analytics` – read-модели, дашборды, CQRS.
* `liveimprove-notification` – уведомления (заглушка).
* `liveimprove-infrastructure` – клиенты Kafka, Redis, Minio (при необходимости).