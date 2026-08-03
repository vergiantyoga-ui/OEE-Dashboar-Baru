# OEE Dashboard — MES FRO

Production-ready front-end for the OEE Dashboard defined in the PRD
(FRO OEE Dashboard). Built with **React + Vite + JavaScript**, styled to match
the existing MES theme (navy / blue, card-based). All data is mocked — no backend.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## What's inside

Three dashboard pages behind a shared sticky header and sidebar nav:

1. **Dashboard KPI OEE** (Page 1) — Process Order Performance, IDW Process
   Order, Shift Performance (with SKU-ON/OFF toggle + expandable Line/Machine
   OEE detail), and the QA inspection alert.
2. **Input Reason OEE** (Page 2) — stacked-bar production timeline (click a
   red/yellow segment to classify), plus Downtime and Reject overviews feeding
   a shared classify modal (category → reason → machine → time/qty → notes).
3. **Reject 7-Segments** (Page 3) — reject KPI per category + hourly trend
   charts with a category filter.

## Architecture

```
src/
  theme/tokens.css        Design tokens — the single source of truth for the
                          MES palette, spacing, typography, a11y baseline.
  lib/
    oee.js                Real OEE engine (window classification, A/P/Q,
                          weighted line/zone roll-up) from PRD Bab 5.
    format.js             Number / time / shift formatting helpers.
  data/mockData.js        One coherent scenario; deterministic seeded
                          generators feed the OEE engine so every number on
                          screen is internally consistent.
  components/
    ui/                   Reusable kit: Card, Badge, Button, ProgressBar,
                          RunRateBar, DonutChart, Modal, Toast.
    header/               Global sticky DashboardHeader.
    page1/ page2/ page3/  Feature components per page.
  pages/                  Page composition (Page1Kpi, Page2Reason, Page3Reject).
  App.jsx                 Shell: sidebar + tabs + toast.
```

## Design & quality notes

- **Theme** derives entirely from CSS variables in `theme/tokens.css` — change
  the palette in one place.
- **OEE numbers are calculated, not faked** — the mock windows run through the
  same formulas the real backend would use, so Availability × Performance ×
  Quality actually equals the OEE shown.
- **Responsive**: 3-col → 2-col → 1-col; sidebar hides on mobile.
- **Accessible**: visible keyboard focus, ARIA roles on tabs/nav/progress/
  charts, `prefers-reduced-motion` respected, Esc closes modals.
- Mockup layout of the three pages follows the PRD; the general component
  styling (cards, badges, buttons, tables) matches the existing MES app.
