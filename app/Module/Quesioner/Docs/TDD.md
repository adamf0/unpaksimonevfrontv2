# Test-Driven Development (TDD) Spec: Quesioner Module

This document outlines the unit test cases (Positive, Negative, and Edge) mapping across the custom hook, components, and adapters in the **Quesioner** module.

---

## 1. Test Environment

*   **Test Runner**: Vitest (globals enabled)
*   **DOM Environment**: JSDOM
*   **Mocks Location**: `app/Module/Quesioner/__tests__/mocks/apiMocks.ts`

---

## 2. Test Suites Matrix

### Part A: Hook Test Suite (`useQuestionerBuilder` tests)

*   **useQuestionerBuilder.queries.test.tsx**:
    *   **Positive**: Init values, active date parsing check, available steps calculation based on user info.
    *   **Positive**: Change answer (handleChange) for radio and multiple choices, change extra comments (handleExtraChange).
*   **useQuestionerBuilder.actions.test.tsx**:
    *   **Positive**: Concurrently posts answers via POST `/kuesioner/{uuid}/jawaban` on submit.
    *   **Negative**: Fails validation checks on mandatory fields or missing "Other" descriptions.
    *   **Negative**: Handles REST network errors.

### Part B: Component Test Suites

*   **QuestionForm.test.tsx**:
    *   **Positive**: Groups questions by topic (fullpath header), renders selectable options and rating scales.
    *   **Positive**: Submits and fires callback, shows empty skeleton when no questions exist.
*   **RatingScale.test.tsx**:
    *   **Positive**: Renders rating scale options, toggles active scale, triggers parent onChange callbacks.
*   **SelectableOption.test.tsx**:
    *   **Positive**: Renders radios and checkboxes, displays optional comments text fields when freetext is set, captures onChange callbacks.
