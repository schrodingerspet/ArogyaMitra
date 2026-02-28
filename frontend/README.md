# ArogyaMitra Frontend

Future-ready wellness dashboard frontend built with React + TypeScript + Vite.

## Stack

- React 19 + TypeScript (Vite)
- Tailwind CSS with tokenized theme config (`tailwind.config.ts`) + CSS variable tokens (`src/index.css`)
- React Query for server state, Zustand for lightweight client/global state
- React Hook Form for form workflows
- Radix Dialog primitive for accessible confirmation dialogs
- Storybook for isolated UI development (`npm run storybook`)

## Setup

```bash
npm install
cp .env.example .env
```

`VITE_API_BASE_URL` is optional. If omitted, the client defaults to `/api` so hosting can be decided later without frontend refactors.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run storybook
npm run build-storybook
```

Default local URL: `http://127.0.0.1:5173`

## Frontend Layering

```text
src/
├── design-tokens/   # token map + semantic design roles
├── ui/              # reusable presentational primitives
├── features/        # feature-specific hooks and data modules
├── layouts/         # route-level shells
├── hooks/           # shared hooks
└── lib/api          # API contracts and transport abstraction
```
