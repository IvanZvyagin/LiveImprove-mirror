# Шаг 6 — тестирование (Supabase JWT + Spring без Keycloak)

Keycloak **не используется**. Аутентификация — **Supabase Auth** (JWT), бэкенд проверяет токен как OAuth2 Resource Server.

## 1. Инфраструктура (Postgres + Redis)

Из **корня репозитория**:

```bash
docker compose up -d postgres-app redis
```

Учётные данные БД по умолчанию совпадают с `application-dev.yml`: пользователь `appuser`, пароль из `APP_DB_PASSWORD` в `.env` (по умолчанию `apppass` в `docker-compose.yml`).

## 2. Переменные окружения для Spring (профиль `dev`)

Обязательно задайте **`SUPABASE_ISSUER_URI`** — тот же issuer, что и поле **`iss`** в access token (см. [jwt.io](https://jwt.io)).

Формат Supabase (без слеша в конце):

```text
https://<project-ref>.supabase.co/auth/v1
```

Пример (подставьте свой проект из Supabase → Settings → API):

```bash
export SUPABASE_ISSUER_URI="https://pevipmeoruuxqtdraqvr.supabase.co/auth/v1"
```

Дополнительно:

- **`FRONTEND_ORIGIN`** — origin фронта для CORS (если Vite на 5174, укажите `http://localhost:5174`).
- **`DB_URL`**, **`DB_USER`**, **`DB_PASSWORD`** — если отличаются от значений по умолчанию.
- **`REDIS_HOST`**, **`REDIS_PORT`** — по умолчанию `localhost` и `6379`.

Конфиг JWT в **`liveimprove-app/src/main/resources/application-dev.yml`** (и комментарии в `application.yml`).

## 3. Запуск Spring Boot

```bash
./gradlew :liveimprove-app:bootRun --args='--spring.profiles.active=dev'
```

Убедитесь, что порт **8080** свободен. Проверка:

```bash
curl -s http://localhost:8080/actuator/health
# {"status":"UP"}
```

### Скрипт (опционально)

```bash
chmod +x scripts/run-backend-dev.sh
./scripts/run-backend-dev.sh
```

Скрипт читает переменные из корневого `.env`, если файл есть.

## 4. Фронтенд: вход и регистрация

В `frontend/` настройте **`frontend/.env`** (`VITE_SUPABASE_*`, `VITE_API_URL`).

- **Вход / регистрация по email** идут через **Supabase** (`signInWithPassword` / `signUp`), не через самописный `/auth/login` бэкенда.
- После входа в `localStorage` хранится **access token** Supabase — его бэкенд принимает как `Bearer`.

Запуск UI:

```bash
cd frontend
npm run dev
```

Зарегистрируйте тестового пользователя на странице **Регистрация** или через Supabase Dashboard → **Authentication → Users → Add user**.

Если в Supabase включено **подтверждение email**, после `signUp` сессии может не быть — подтвердите почту или отключите подтверждение для тестов.

## 5. Вызов `/auth/me`

Бэкенд отдаёт **`GET /auth/me`** (без префикса `/api/v1`). Нужен заголовок:

```http
Authorization: Bearer <access_token>
```

Получить токен:

- из DevTools → Application → Local Storage (ключи Supabase), или  
- скопировать **`access_token`** с jwt.io после декодирования, или  
- временно `console.log` в приложении после входа.

Пример:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
curl -sS -H "Authorization: Bearer $TOKEN" http://localhost:8080/auth/me
```

Ожидаемый JSON (поля записи `UserInfo`):

```json
{
  "userId": "<uuid>",
  "email": "you@example.com",
  "phone": null,
  "fullName": "Имя или null"
}
```

## 6. Ошибки валидации JWT

Если **401** или ошибка про issuer:

1. Откройте access token на [jwt.io](https://jwt.io) и проверьте поле **`iss`**.  
2. Значение **`SUPABASE_ISSUER_URI`** должно **совпадать** с `iss` **символ в символ** (обычно без завершающего `/`).  
3. Убедитесь, что в запросе передаётся именно **access token**, а не refresh token.

## 7. CORS

Если фронт на другом origin (например `http://localhost:5174`), задайте:

```bash
export FRONTEND_ORIGIN="http://localhost:5174"
```

и перезапустите Spring.

---

**Примечание:** профиль **`local`** (H2, без JWT) не использует Supabase validation; для шага 6 нужен именно **`dev`**.
