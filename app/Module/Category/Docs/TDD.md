# Test-Driven Development (TDD) Spec: Category Module

This document outlines the unit test cases (Positive, Negative, and Edge) mapping across the custom hook, components, and adapters in the **Category** module.

---

## 1. Test Environment

*   **Test Runner**: Vitest (globals enabled)
*   **DOM Environment**: JSDOM
*   **Mocks Location**: `app/Module/Category/__tests__/mocks/apiMocks.ts`

---

## 2. Test Suites Matrix

### Part A: Hook Test Suite (`useCategory` tests)

*   **useCategory.queries.test.tsx**:
    *   **Positive**: Init values and default query, debounced search triggers reload after 300ms, filter reset clears parameters.
    *   **Positive**: Toggles soft delete flag between "" and "deleted".
*   **useCategory.sse.test.tsx**:
    *   **Positive**: Mounts 3 SSE streams (Fakultas, Prodi, and Kategori Source).
    *   **Positive**: Streams emit progressive data lines (JSON) and close on "done".
    *   **Negative**: Connection errors trigger connection drop and push Toast message.
*   **useCategory.actions.test.tsx**:
    *   **Positive**: CRUD Axios requests dispatch (POST, PUT, DELETE, restore, status changes) and refresh tree lists.
    *   **Positive**: Tree reordering payload updates (PUT `/kategori` flat list).
    *   **Negative**: Empty action modes throw exceptions.
    *   **Negative**: Handles Cloudflare 403 error codes.

### Part B: Component Test Suites

*   **CategoryFilterForm.test.tsx**:
    *   **Positive**: Renders fields, role options, and department options. Triggers callback on input.
*   **CreateCategoryForm.test.tsx**:
    *   **Positive**: Validates input, preloads selected categories on edit mode, commits REST actions, and shows validation error alerts.
*   **CategoryTable.test.tsx**:
    *   **Positive**: Maps records, renders table grid, shows actions for active items (copy, edit, delete) and soft-deleted items (restore, force-delete). Triggers callbacks on button clicks.
*   **CategoryCard.test.tsx**:
    *   **Positive**: Displays total category length from context data.
*   **SubCategoryCard.test.tsx**:
    *   **Positive**: Computes unique subcategory names and displays count.
