# Feature-Driven Development (FDD) Spec: QuestionBank Module

This document outlines the architectural components and feature breakdowns of the **QuestionBank** module inside the `unpaksimonev` project.

---

## 1. Feature Map & Functional Decomposition

The `QuestionBank` module is organized around four primary features:

### Feature 1: Paginated Query and Multi-Criteria Filtering
*   **Description**: Retrieves question bank lists with cursor/page pagination, text searching, and filter parameters (creator role, faculty, prodi, etc.).
*   **APIs Used**: Axios GET `/banksoals`
*   **Key Actors**:
    *   [useBankSoal](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Hook/useBankSoal.tsx): Manages query states, debounces user search (300ms), and coordinates data retrieval.
    *   [BankSoalFilterForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Molecules/BankSoalFilterForm.tsx): The form UI capturing filters.
    *   [BankSoalTable](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Organisms/BankSoalTable.tsx): Renders the results list.
    *   [FilterBuilder](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Common/Domain/FilterBuilder.ts): Constructing the filter string query.

### Feature 2: SSE Real-Time Syncing (Faculty & Department Data)
*   **Description**: Establishes continuous Server-Sent Events streams to progressively load faculty lists and department (prodi) lists for filter selector options.
*   **APIs Used**: SSE `/fakultass?mode=sse` and `/prodis?mode=sse`
*   **Key Actors**:
    *   [useBankSoal](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Hook/useBankSoal.tsx): Handshakes with EventSource, processes individual stream lines (`start`, JSON, `done`), handles reconnection failures, and manages `loadingFakultas` / `loadingProdi` states.
    *   [adaptSelectOptions](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Adapter/adaptSelectOptions.tsx): Adapts incoming raw list records into uniform Select options.

### Feature 3: Actions Dispatching (CRUD & Status Changes)
*   **Description**: Creates and modifies Question Banks, modifies statuses (active, draft), performs copy actions, and processes deletion sequences (soft delete, hard delete, restore).
*   **APIs Used**: 
    *   POST `/banksoal`
    *   PUT `/banksoal/{uuid}`
    *   POST `/banksoal/{uuid}/copy`
    *   DELETE `/banksoal/{uuid}`
    *   DELETE `/banksoal/{uuid}/force`
    *   PUT `/banksoal/{uuid}/restore`
    *   PUT `/banksoal/{uuid}/status`
*   **Key Actors**:
    *   [CreateBankSoalForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Organisms/CreateBankSoalForm.tsx): Form interface utilizing `react-hook-form` and `CKEditor` fields.
    *   [useBankSoal](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Hook/useBankSoal.tsx): `actionBankSoal` orchestrates Axios POST/PUT/DELETE commands, handles payloads, and converts validation errors into form errors.

### Feature 4: Schedule Extension Management
*   **Description**: Defines date range schedules for question banks and appends extended dates. Implements calendar representation and collision check.
*   **APIs Used**:
    *   PUT `/banksoal/{uuid}/schedule`
    *   DELETE `/banksoal/{uuid}/time`
    *   DELETE `/banksoal/{uuid}/timeext`
*   **Key Actors**:
    *   [BankSoalTimeForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/QuestionBank/Molecules/BankSoalTimeForm.tsx): Features a date-range calendar picker, overlaps control rules, and renders saved schedules.

---

## 2. Code Ecosystem Architecture

The module represents a clean-architecture model divided into presentation, application logic, and attributes:

```
app/Module/QuestionBank/
├── Adapter/
│   └── adaptSelectOptions.tsx       <- Adapts raw models to UI Select items
├── Attribut/
│   ├── BankSoalItem.tsx             <- Types representing DB questions
│   ├── FormValues.tsx               <- Form values type structure
│   └── ScheduleItem.tsx             <- Schedule entry structures
├── Context/
│   └── QuestionBankProvider.tsx     <- Global Provider exposing hook values
├── Hook/
│   └── useBankSoal.tsx              <- Primary application logic & state management
├── Molecules/
│   ├── BankSoalFilterForm.tsx       <- Filters input inputs
│   └── BankSoalTimeForm.tsx         <- Calendar view & scheduling handlers
├── Organisms/
│   ├── BankSoalTable.tsx            <- Data grid table with item commands
│   └── CreateBankSoalForm.tsx       <- Question editor form
└── Page/
    └── BankSoalPage.tsx             <- Page Entrypoint
```
