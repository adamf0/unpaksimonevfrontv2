# Test-Driven Development (TDD) Spec: TemplateQuestionBank Module

This document outlines the unit test cases (Positive, Negative, and Edge) mapping across custom hooks and components in the **TemplateQuestionBank** module.

---

## 1. Test Environment

*   **Test Runner**: Vitest (globals enabled)
*   **DOM Environment**: JSDOM
*   **Mocks Location**: `app/Module/TemplateQuestionBank/__tests__/mocks/apiMocks.ts`

---

## 2. Test Suites Matrix

### Part A: Hooks Test Suites

*   **useTemplate.queries.test.tsx**:
    *   **Positive**: Verify default states are correctly initialized.
    *   **Positive**: Verify querying template list occurs when Bank Soal is selected.
    *   **Positive**: Verify search queries are debounced.
    *   **Edge**: Verify clearing Bank Soal calls `resetQuestionTable()` and clears data.
*   **useTemplate.sse.test.tsx**:
    *   **Positive**: Verify EventSource streams for Categories, Bank Soals, Faculties, and Prodis initiate on mount.
    *   **Positive**: Verify progressive addition of data chunks upon receiving data events.
    *   **Negative**: Verify toast dispatch and state cleanup on SSE errors.
*   **useTemplate.actions.test.tsx**:
    *   **Positive**: REST calls for Copy (`/copy`), Delete (DELETE), Restore (`/restore`), and status changes.
    *   **Positive**: Submission of create/update FormData formats.
    *   **Positive**: Loading detailed data using `loadSinglePertanyaan`.
    *   **Negative**: Ensure rejection with `"instruksi ditolak"` if the action mode is empty.
*   **useTemplateAnswer.test.tsx**:
    *   **Positive**: Updates active query parameters when parent question selection changes.
    *   **Positive**: Queries and parses associated template answer lists.
*   **useTemplatePreview.test.tsx**:
    *   **Positive**: Streams templates and nested choices in parallel through parallel SSE promises.

### Part B: Components Test Suites

*   **Molecules.test.tsx**:
    *   **Positive**: Verifies correct styling, badge coloring, and text outputs across `BannerPreview`, `DeletedTime`, `GuideCard`, `LaunchCard`, `QuickInfoCard`, and `StatusState`.
    *   **Positive**: Verifies form selection options updating values on change in `TemplateFilterForm`.
*   **Organisms.test.tsx**:
    *   **Positive**: Verifies row rendering, paginated buttons rendering, and role action triggers inside `TemplateTable`.
    *   **Positive**: Verifies editor entries, input change emissions, validation requirements, and submits in `CreateTemplateForm` and `CreateTemplateChoiceForm`.
    *   **Positive**: Verifies form layout assembly in `TemplateQuestionFormWrapper` and review sheets formatting in `TemplateQuestionPreview`.
