# LiveImprove Frontend

Визуальный прототип (MVP) для приложения саморазвития: цели, привычки, календарь, аналитика.
Проект ориентирован на дальнейшую интеграцию с API и рост команды.

## Стек
- React + TypeScript
- Vite
- React Router
- CSS Modules + глобальные стили
- Vitest + Testing Library

## Быстрый старт
```bash
npm install
npm run dev
```

## Скрипты
```bash
npm run dev        # dev сервер
npm run build      # production build
npm run preview    # превью build
npm run lint       # ESLint
npm test           # Vitest (watch)
npm run test:run   # Vitest (CI)
```

## Что уже сделано
- Полный набор экранов: Главная / Цели / Привычки / Календарь / Аналитика.
- UI максимально приближен к референсам (dark UI).
- Компоненты переиспользуются (Card, Chip, IconButton, Badge, SectionHeader).
- Слой данных подготовлен для API (`src/api`, `src/hooks`).
- Типы моков вынесены в `src/types`.

## Структура проекта
```
src/
  api/         # слой данных (сейчас моки)
  hooks/       # useGoals/useHabits/useAnalytics и т.д.
  components/  # UI и доменные блоки
  pages/       # страницы роутов
  types/       # контрактные типы данных
  mocks/       # временные данные
```

## Документация
Подробности архитектуры: `docs/FRONTEND.md`.
