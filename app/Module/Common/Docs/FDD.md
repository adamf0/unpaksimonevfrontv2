# Feature Driven Development (FDD) Spec - Common Module

This document outlines the functional specifications for the shared utilities, state selectors, contexts, value objects, and component categories inside the `Common` module.

## 1. Functional Feature Breakdown

### Feature 1: Option Adapters & Data Converters
*   **adaptSelectOptions**: Converts lists of objects of generic type `T` into standard `SelectOption` array using target config keys. Filters out duplicate values and empty keys using a Map collector.
*   **adaptSelectOptionsMerge**: Similar to `adaptSelectOptions`, but merges multiple label keys into a single label string using custom templates or sequential spaces.
*   **ActionTableAdapter**: Adapts table rows for rendering with standard action buttons.

### Feature 2: Value Objects and Query Rules
*   **DateTimeVO**: Models a calendar date and time. Validates input timestamps, formats output representations based on Indonesian locales (`id-ID`), detects past/future states, and handles invalid fallbacks seamlessly.
*   **FilterBuilder**: Constructs API query parameters by dynamically appending matching field predicates (`field:op:value`) from an input query record, skipping empty values.
*   **DateRangeService**: Computes the scheduling status of a start-to-end datetime interval (e.g., active, expired, scheduled, range invalid) relative to an current point in time, checking for active extension overrides.

### Feature 3: Security & Session Interceptors
*   **tokenExpiry**: Parsers JWT payloads to extract token expiration timestamps. Corrects padding and converts base64url characters prior to parsing.
*   **useTokenWatcher**: React hook executing a background watcher interval that:
    *   Examines access token expiration.
    *   Initiates silent refresh/swap sequences 30 seconds before expiration if a refresh token is present.
    *   Clears sessionStorage and redirect to `/action/logout` when expiration criteria are met without refresh options.
*   **axiosErrorHandler**: Maps Cloudflare custom server codes (520-526) to Indonesian error messages and identifies raw HTML responses (e.g., login pages returned due to session timeouts).

### Feature 4: Toast Feedback System
*   **ToastContext**: Context provider exposing `pushToast` and a notifications state list. Manages timers to automatically remove toasts after their durations elapse.

### Feature 5: Shared Layout Component Collections
*   **Atoms**: Basic styling components (e.g. `Badge`, `Button`, `Checkbox`, `Icon`, `Text`, `Input`).
*   **Molecules**: Compound elements implementing events (e.g. `AnimatedButton`, `CKEditorField` editor mock wrappers, `Pagination` pages shifts, `SelectSearch` inputs).
*   **Organisms & Templates**: Complex page wrappers and layout bindings (e.g. `SelectField` floating portal overlay, `Header`, `Sidebar`, `AdminPanelTemplate`).
