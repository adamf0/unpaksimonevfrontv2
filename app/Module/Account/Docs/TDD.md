# Test-Driven Development (TDD) Spec: Account Module

This document outlines the unit test cases (Positive, Negative, and Edge) mapping across the custom hook, components, and adapters in the **Account** module.

---

## 1. Test Environment

*   **Test Runner**: Vitest (globals enabled)
*   **DOM Environment**: JSDOM
*   **Mocks Location**: `app/Module/Account/__tests__/mocks/apiMocks.ts`

---

## 2. Test Suites Matrix

### Part A: Hook Test Suite (`useAccount` tests)

*   **useAccount.queries.test.tsx**:
    *   **Positive**: Init values and default query, debounced search triggers reload after 300ms, filter reset clears parameters.
    *   **Positive**: Toggles soft delete flag between "" and "deleted".
*   **useAccount.sse.test.tsx**:
    *   **Positive**: Mounts 2 SSE streams (Fakultas and Prodi).
    *   **Positive**: Streams emit progressive data lines (JSON) and close on "done".
    *   **Negative**: Connection errors trigger connection drop and push Toast message.
*   **useAccount.actions.test.tsx**:
    *   **Positive**: CRUD Axios requests dispatch (POST, PUT, DELETE, restore) and refresh lists.
    *   **Negative**: Empty action modes throw exceptions.
    *   **Negative**: Handles Cloudflare 403 error codes.

### Part B: Component Test Suites

*   **AccountFilterForm.test.tsx**:
    *   **Positive**: Renders fields, level options, and department options. Triggers callback on input.
*   **CreateUserForm.test.tsx**:
    *   **Positive**: Validates input (including passwords and pattern checks), preloads selected users on edit mode, commits REST actions, and shows validation error alerts.
*   **AccountTable.test.tsx**:
    *   **Positive**: Maps records, renders table grid, shows actions for active items (edit, delete) and soft-deleted items (restore, force-delete). Triggers callbacks on button clicks.
