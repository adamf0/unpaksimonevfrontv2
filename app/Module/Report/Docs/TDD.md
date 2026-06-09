# Test-Driven Development (TDD) Spec: Report Module

This document outlines unit test cases (Positive, Negative, and Edge) mapping across custom hooks and components in the **Report** module.

---

## 1. Test Environment

*   **Test Runner**: Vitest (globals enabled)
*   **DOM Environment**: JSDOM
*   **Mocks Location**: `app/Module/Report/__tests__/mocks/apiMocks.ts`

---

## 2. Test Suites Matrix

### Part A: Hooks & Service Test Suites

*   **useKuesionerReport.queries.test.tsx**:
    *   **Positive**: Initial states setups, opening/closing filters pane, resetting filter states.
*   **useKuesionerReport.streams.test.tsx**:
    *   **Positive**: Mocking `fetch` to return streams, reading JSON string chunks, parsing start/done events in `loadData` and `loadDataDetail`.
    *   **Negative**: Fails with random demo mode exceptions or network errors (abort controller signal handling).
*   **useKuesionerReport.actions.test.tsx**:
    *   **Positive**: Querying dynamic averages (top questions), unique year-over-year counts (yearlyStats), faculty user sums.
    *   **Positive**: EventSource mock triggers for faculties/prodis.
*   **ReportExport.test.ts**:
    *   **Positive**: Excel workbook construction, auto width calculations.
    *   **Positive**: Merging duplicate cell indexes, border formatting settings.

### Part B: Components Test Suites

*   **Molecules.test.tsx**:
    *   **Positive**: Renders `ChartCard`, `DistributionCard`, and form options changes in `ReportFilterForm`.
    *   **Positive**: Mock renders Recharts charts (`DistributionChart`, `FourYearChart`, `PieChart`, `RatingChart`).
*   **Organisms.test.tsx**:
    *   **Positive**: Renders `FiltersSection`, `DistributionSection`, `ChartQuestionSection`, and `TopQuestionsSection`.
