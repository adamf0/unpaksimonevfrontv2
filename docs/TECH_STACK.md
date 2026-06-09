# Tech Stack & Specifications - Unpak Simonev

This document lists the technical specifications, frameworks, libraries, and integration strategies used in the **unpaksimonev** frontend client.

---

## 1. Core Framework & Language
*   **Next.js (v16.3.0-canary.25)**: Core framework configured for React Server Components (RSC) and standard client-side page rendering.
*   **React (v19.2.6)**: UI component rendering library.
*   **TypeScript (v6.x)**: Static type safety checking compiler.

## 2. Styling & Design System
*   **TailwindCSS (v4.3.0)**: Modern styling framework using vanilla CSS variables.
*   **Material Symbols (v0.44.8)**: System icons font provider (`material-symbols-outlined`).
*   **Framer Motion (v12.39.0)**: Animation utility for premium interactive transitions.
*   **clsx & tailwind-merge**: Merging styling classes and overriding dynamic styles.

## 3. Libraries & Integrations
*   **Axios (v1.16.1)**: HTTP client configured for REST endpoints.
*   **React Hook Form (v7.76.0)**: Form data collection and validation handler.
*   **CKEditor 5 (v48.1.1)**: Rich Text Editor for questionnaire construction.
*   **DOMPurify (v3.4.5)**: Clean sanitization of HTML data inside rich text outputs (mitigates XSS injection).
*   **ExcelJS (v4.4.0) & File Saver**: Spreadsheet document export generation (Rekap & Detail Laporan).
*   **Recharts (v3.8.1)**: Interactive charting libraries for statistics distributions.
*   **@dnd-kit**: Drag-and-drop mechanics for builder interfaces.

## 4. Testing Suite
*   **Vitest (v4.1.8)**: Lightweight, fast test runner configured with JSDOM environments.
*   **React Testing Library (v16.3.2)**: Component interaction testing in jsdom contexts.
*   **DOM Testing Library**: Standard DOM queries selectors.

## 5. Development Utilities
*   **Docker & Docker Compose**: Local containerized development servers support.
*   **ESLint**: Code syntax formatting guidelines.
