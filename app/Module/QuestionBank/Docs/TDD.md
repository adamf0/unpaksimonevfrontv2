# Test-Driven Development (TDD) Spec: QuestionBank Module

This document defines the test suite configurations and test matrices (Positive, Negative, and Edge Cases) to verify the correctness of the **QuestionBank** module.

---

## 1. Testing Stack & Environment

*   **Test Runner**: Vitest (globals enabled)
*   **DOM Environment**: JSDOM
*   **Testing Library**: React Testing Library (`@testing-library/react`)
*   **User Action Simulation**: `@testing-library/user-event`
*   **Mocks Location**: [apiMocks.ts](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/__tests__/mocks/apiMocks.ts)

---

## 2. Test Suites Matrix

### Part A: Utility Test Suite (`adaptSelectOptions.test.ts`)

| Case Type | Description | Inputs | Expected Output |
| :--- | :--- | :--- | :--- |
| **Positive** | Correct mapping of array of structures into dropdown options | `[{id: 1, name: "A"}]` | `[{value: "1", label: "A", payload: {...}}]` |
| **Negative** | Handling of null, missing, or undefined keys | `[{id: null, name: "A"}]` | Skip item (returns `[]`) |
| **Edge** | Deduplication of values (keys) in map | `[{id: 1, name: "A"}, {id: 1, name: "B"}]` | `[{value: "1", label: "A", payload: {...}}]` (maps first) |

### Part B: Hook Test Suite (`useBankSoal.test.tsx`)

| Case Type | Description | Trigger Action | Expected Assertions |
| :--- | :--- | :--- | :--- |
| **Positive** | Initial state setup and query reset | Mounting hook & calling `resetFilters()` | Default values are set; query fields are empty |
| **Positive** | Axios loadData page/limit updates | Updating query page/limit | Axios GET `/banksoals` is called with updated params |
| **Positive** | Axios actionBankSoal dispatch CRUD | Calling `actionBankSoal(uuid, data, "copy")` | Axios POST `/banksoal/{uuid}/copy` returns new uuid |
| **Negative** | Axios network connection error handling | Axios GET rejects with no response | Toast display: `"Server error"` |
| **Negative** | Axios Cloudflare protection block handling | Server responds with status code `403` or `503` | `handleCloudflareError` catches, displays error message |
| **Edge** | Search query input fast typing | Rapid query updates within 300ms | Search is debounced; only one API request is dispatched |
| **Edge** | SSE stream data progressive loading | Stream emits `start`, JSONs, and `done` | Data grows incrementally; stream closes, `loading` drops to `false` |
| **Edge** | SSE stream error reconnection | EventSource emits error | Toast display: `"SSE connection error"`; `loading` drops to `false` |

### Part C: Components Test Suite (`components.test.tsx`)

#### 1. `BankSoalFilterForm`
*   **Positive**: Renders role options, faculty options (via state data), and prodi options. Triggering role select calls `onChange`.
*   **Edge**: When `kode_fakultas` is empty and role is NOT admin, Prodi options should return empty list. When role is admin, all prodi options are returned.

#### 2. `CreateBankSoalForm`
*   **Positive**: Renders fields with values if `state.selected` is present. Submitting calls `actionBankSoal` and resets form.
*   **Negative**: Submitting with blank fields shows form validation alerts ("Judul wajib diisi").
*   **Negative**: API validation block updates react-hook-form errors.

#### 3. `BankSoalTimeForm`
*   **Positive**: Renders schedules and calendar. Adding non-overlapping date calls Axios PUT.
*   **Negative**: Selecting overlapping date shows "Jadwal bertabrakan" warning, blocks submit.
*   **Positive**: Deleting schedule checks `item.isExtend` and sends DELETE `/banksoal/{id}/timeext` or `/banksoal/{id}/time`.
