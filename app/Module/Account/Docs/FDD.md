# Feature-Driven Development (FDD) Spec: Account Module

This document outlines the architectural components and feature breakdowns of the **Account** module inside the `unpaksimonev` project.

---

## 1. Feature Map & Functional Decomposition

The `Account` module delivers functionality around three primary areas:

### Feature 1: Paginated Query and Account Filtering
*   **Description**: Queries accounts list with pagination, search, and filtering keys (such as user level, faculty, department, username, name, email).
*   **APIs Used**: Axios GET `/accounts`
*   **Key Actors**:
    *   [useAccount](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Account/Hook/useAccount.tsx): Manages querying parameters, page changes, and query debounces (300ms).
    *   [AccountFilterForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Account/Molecules/AccountFilterForm.tsx): The filtering options dropdown UI form.
    *   [AccountTable](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Account/Organisms/AccountTable.tsx): Renders list items.

### Feature 2: SSE Real-Time Syncing (Faculty & Department Data)
*   **Description**:progressive data loader via SSE streams to fetch available faculty and department entries.
*   **APIs Used**: SSE `/fakultass?mode=sse` and `/prodis?mode=sse`
*   **Key Actors**:
    *   [useAccount](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Account/Hook/useAccount.tsx): Stream connection handler, `loadingFakultas` / `loadingProdi` states coordinator.

### Feature 3: Actions Dispatching (CRUD operations)
*   **Description**: Registers new user accounts, updates profiles, soft deletes, force deletes, and restores user profiles.
*   **APIs Used**:
    *   POST `/account`
    *   PUT `/account/{uuid}`
    *   DELETE `/account/{uuid}`
    *   DELETE `/account/{uuid}/force`
    *   PUT `/account/{uuid}/restore`
*   **Key Actors**:
    *   [CreateUserForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Account/Organisms/CreateUserForm.tsx): The validation form.
    *   [useAccount](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Account/Hook/useAccount.tsx): REST actions dispatch handler (`actionAccount`).

---

## 2. Code Ecosystem Architecture

```
app/Module/Account/
├── Adapter/
│   └── adaptSelectOptions.tsx
├── Attribut/
│   ├── UserItem.tsx
│   └── FormValues.tsx
├── Context/
│   └── AccountProvider.tsx
├── Hook/
│   └── useAccount.tsx
├── Molecules/
│   └── AccountFilterForm.tsx
├── Organisms/
│   ├── AccountTable.tsx
│   └── CreateUserForm.tsx
└── Page/
    └── AccountPage.tsx
```
