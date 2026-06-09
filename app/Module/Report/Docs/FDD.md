# Feature-Driven Development (FDD) Spec: Report Module

This document outlines the architectural components and feature breakdowns of the **Report** module in the `unpaksimonev` project.

---

## 1. Feature Map & Functional Decomposition

The `Report` module delivers interactive analytical charts, response statistics, and Excel spreadsheet downloads.

### Feature 1: Streamed Report Data Loading
*   **Description**: Establishes `fetch` connections requesting `text/event-stream` formats to parse main reports (`/kuesioners/report`) and template question reports progressively using a low-level `ReadableStream` reader.
*   **APIs Used**: POST `/kuesioners/report`, GET `/templatepertanyaan/{uuid}/banksoal`
*   **Key Actors**:
    *   [useKuesionerReport](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Report/Hook/useKuesionerReport.tsx): Handles Chunk/Buffer reconstruction, TextDecoder decoding, line-by-line parsing, and updates the local state on start/done controls.

### Feature 2: SSE Faculty & Department Feeds
*   **Description**: Establishes standard `EventSource` streams for dropdown selectors.
*   **APIs Used**: GET `/fakultass?mode=sse`, GET `/prodis?mode=sse`
*   **Key Actors**:
    *   [useKuesionerReport](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Report/Hook/useKuesionerReport.tsx): Exposes `loadSSE` helper to initialize, accumulate data array entries, toast connection errors, and close connections.

### Feature 3: Multi-Dimensional Statistics calculation
*   **Description**: Computes metrics dynamically via useMemo:
    *   **topQuestions**: Translates score answers into formatted decimal averages.
    *   **yearlyStats**: Computes distinct counts of NIDN (Dosen), NPM (Mahasiswa), and NIP (Tendik) grouped by calendar year.
    *   **facultyStats**: Compiles distinct counts of active users mapped to faculty/department branches.
*   **Key Actors**:
    *   [useKuesionerReport](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Report/Hook/useKuesionerReport.tsx)

### Feature 4: Excel Exporting Services
*   **Description**: Serializes active report collections into Excel files:
    *   **exportRekapKuesioner**: Excludes duplicate entries by combining user credentials (NIDN/NIP/NPM) and questionnaire IDs, fits column widths, and triggers a browser download.
    *   **exportDetailKuesioner**: Combines questions with their responses, merges multi-row cells horizontally/vertically, and structures headings with borders.
*   **Key Actors**:
    *   [ReportExport](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Report/Service/ReportExport.tsx)

---

## 2. Code Ecosystem Architecture

```
app/Module/Report/
├── Adapter/
├── Atoms/
├── Attribut/
├── Context/
│   └── KuesionerReportContext.tsx
├── Hook/
│   └── useKuesionerReport.tsx
├── Molecules/
│   ├── ChartCard.tsx
│   ├── DistributionCard.tsx
│   ├── DistributionChart.tsx
│   ├── FourYearChart.tsx
│   ├── PieChart.tsx
│   ├── RatingChart.tsx
│   └── ReportFilterForm.tsx
├── Organisms/
│   ├── ChartQuestionSection.tsx
│   ├── DistributionSection.tsx
│   ├── FiltersSection.tsx
│   └── TopQuestionsSection.tsx
├── Page/
├── Service/
│   └── ReportExport.tsx
└── Template/
```
