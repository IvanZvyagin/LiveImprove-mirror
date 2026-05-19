# Frontend Documentation

## Overview
LiveImprove frontend is a single-page React application that renders the product dashboard,
goals, habits, calendar, and analytics modules using mock data. The UI is built to match the
dark-themed reference designs and is prepared for API integration.

## Stack
- React + TypeScript
- Vite
- React Router
- CSS Modules (UI + page-level modules)
- Vitest + Testing Library (unit/UI tests)

## Architecture
```
src/
  api/         -> data access (currently mocks)
  hooks/       -> UI-facing data hooks (useGoals, useHabits, ...)
  components/  -> reusable UI + domain blocks
  pages/       -> route-level screens
  types/       -> shared types for data contracts
```

## Data Flow
- Pages call `useX()` hooks (e.g. `useGoals`).
- Hooks call `fetchX()` functions from `src/api`.
- `fetchX()` currently returns mock data but is structured to swap to real API calls.

## Styling
- Global layout + shared styles live in `src/index.css`.
- Component-level styles are in `src/components/ui/*.module.css`.
- Page-level styles for Goals and Habits are in `src/pages/*.module.css`.

## Tests
Run unit/UI tests:
```
npm test
```

## Next Steps
- Replace `src/api/*` mocks with real API calls.
- Finish moving remaining page styles to modules (Calendar/Analytics/Home).
- Add integration tests for data hooks when API is connected.
