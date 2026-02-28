# ArogyaMitra UI Handoff (Design + Engineering)

## 1) Design Tokens

### Colors
- `--color-bg-base`: `#071226`
- `--color-bg-surface`: `#0d1420`
- `--color-text-primary`: `#E6EEF8`
- `--color-text-secondary`: `#AAB7C3`
- `--color-text-muted`: `#6B7785`
- `--color-accent-start`: `#00D1FF`
- `--color-accent-end`: `#00A9D6`
- `--color-accent-violet`: `#9B5CFF`
- `--color-success`: `#28C76F`
- `--color-warning`: `#F6C84C`
- `--color-error`: `#FF6B6B`

### Spacing / Radius / Elevation
- Spacing scale: `4, 8, 12, 16, 24, 32, 48`
- Radius scale: `8, 12, 16`
- Shadow: `0 8px 24px rgba(4, 6, 12, 0.5)` (+ hover variant in CSS)

### Typography
- Font: `Inter`
- Body: `14px`, line-height `1.4`
- Heading scale: `h1 28`, `h2 22`, `h3 18`

## 2) Layout & Grid Rules
- Sidebar: `240px` expanded, `72px` collapsed.
- Topbar: `64px`.
- Content max width: `1280px` (`.content-shell`).
- Gutters: `24px` desktop, `16px` mobile.
- Dashboard: 12-column responsive grid (`xl:grid-cols-12`).

## 3) Component Specs

### Card Anatomy
- Header: icon + title + optional subtitle/action.
- Body: core content.
- Footer: subtle top border and secondary actions.
- Base class: `glass glass-lens rounded-2xl`.

### FormField Anatomy
- Label (top), control, helper text, error text.
- Error uses `role="alert"`.
- Controls get `aria-describedby` and `aria-invalid`.
- Focus ring: 2px cyan (`:focus-visible`).

### Core Reusable Components
- `MetricCard`
- `ChartCard`
- `ActionCard`
- `PlanCard`
- `ConfirmDialog` (Radix Dialog primitive)
- `FormField`

## 4) Accessibility Rules (WCAG AA)
- High-contrast neutrals on dark surfaces.
- Visible focus states on links, buttons, inputs.
- Semantic regions (`section`, `header`, `article`) and dialog roles.
- Keyboard accessible destructive actions via `ConfirmDialog`.
- AROMI message area uses `role="log"` and `aria-live="polite"`.

## 5) Motion Rules
- Hover lift: `translateY(-4px) scale(1.01)`, `150ms`.
- Standard transitions: `150–250ms`.
- Staggered entrances with spring damping `20`.
- Global reduced-motion fallback via media query.

## 6) Breakpoints
- `sm` ≥ 640px
- `md` ≥ 768px
- `lg` ≥ 1024px
- `xl` ≥ 1280px

## 7) Architecture & Data Flow
- Runtime: React + TypeScript + Vite (`src/**/*.ts(x)`).
- Server state: React Query feature hooks (dashboard/workouts/health modules).
- Client/global state: Zustand for auth/chat and lightweight UI state (sidebar state).
- API contracts remain hosting-agnostic in `src/lib/api/contracts.ts`.
- Transport base URL is environment-driven (`VITE_API_BASE_URL`) with `/api` fallback.
- Layering:
  - `src/design-tokens`
  - `src/ui`
  - `src/features`
  - `src/layouts`
  - `src/hooks`
  - `src/lib/api`

## 8) Prioritized Backlog
1. Global tokens and theme hardening (including light variant token overrides).
2. Layout and navigation refinements (breadcrumb data mapping and keyboard shortcuts).
3. Core components and form patterns expansion.
4. Charts + metrics enhancements (lazy charts, richer tooltips, trend comparisons).
5. AROMI chat feature deep integration (context actions + offline UX).

## 9) QA Checklist
- Keyboard-only navigation across all routes.
- Contrast audit for text and interactive controls.
- Lighthouse checks (performance/accessibility/best practices).
- Storybook component state review with a11y addon.
