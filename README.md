# liveImprove Backend

Многомодульный монолит на Spring Boot 3.3+, Java 21.

## Быстрый старт

1. Установить Docker, JDK 21, Git.
2. Склонировать репозиторий.
3. Скопировать `.env.example` в `.env` и заполнить секреты (можно оставить значения по умолчанию для локальной разработки).
4. Выполнить `docker-compose up -d` для поднятия PostgreSQL, Redis, Keycloak.
5. Запустить приложение: `./gradlew :liveimprove-app:bootRun --args='--spring.profiles.active=local'`
6. Swagger UI будет доступен по адресу http://localhost:8080/swagger-ui.html после реализации.

## Модули проекта

* `liveimprove-app` – Spring Boot приложение, конфигурация.
* `liveimprove-common` – общие утилиты, DTO, исключения.
* `liveimprove-domain` – доменные интерфейсы, базовые сущности.
* `liveimprove-auth` – аутентификация через Keycloak.
* `liveimprove-goals` – цели и пункты целей.
* `liveimprove-habits` – привычки и логи.
* `liveimprove-tasks` – задачи и логи задач.
* `liveimprove-calendar` – события календаря.
* `liveimprove-interviews` – собеседования и этапы.
* `liveimprove-analytics` – read-модели, дашборды, CQRS.
* `liveimprove-notification` – уведомления (заглушка).
* `liveimprove-infrastructure` – клиенты Kafka, Redis, Minio (при необходимости).