# Feature-Driven Development (FDD) Spec: TemplateQuestionBank Module

This document outlines the architectural components and feature breakdowns of the **TemplateQuestionBank** (Question Templates Bank) module in the `unpaksimonev` project.

---

## 1. Feature Map & Functional Decomposition

The `TemplateQuestionBank` module allows administrators and supervisors to create, update, configure, delete, and copy question templates.

### Feature 1: Paginated Template Questions & Filtering
*   **Description**: Retrieves question templates paginated list (`/templatepertanyaans`) filtered by Bank Soal UUID, Faculty, Prodi, and Search Query.
*   **APIs Used**: GET `/templatepertanyaans`
*   **Key Actors**:
    *   [useTemplate](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/TemplateQuestionBank/Hook/useTemplate.tsx): Manages filtering parameters, debounce triggers, and total count calculations.
    *   [TemplateFilterForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/TemplateQuestionBank/Molecules/TemplateFilterForm.tsx): The form component capturing filters inputs.

### Feature 2: Multi-Feed EventSource Streams
*   **Description**: Establishes Server-Sent Events (SSE) connections to fetch Categories, Bank Soals, Faculties, and Study Programs (Prodis) progressively for form dropdowns.
*   **APIs Used**: SSE `/kategoris?mode=sse`, `/banksoals?mode=sse`, `/fakultass?mode=sse`, `/prodis?mode=sse`
*   **Key Actors**:
    *   [useTemplate](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/TemplateQuestionBank/Hook/useTemplate.tsx): Launches streams upon mount, processes start/done control commands, parses streaming JSON data chunks, and closes active EventSources.

### Feature 3: CRUD & Status Alteration Actions
*   **Description**: Handles template creation, edits, duplication (copying), soft/hard deleting, and restoring, plus toggling statuses between draft and active.
*   **APIs Used**:
    *   POST `/templatepertanyaan` (Create)
    *   PUT `/templatepertanyaan/{uuid}` (Update)
    *   POST `/templatepertanyaan/{uuid}/copy` (Duplicate)
    *   DELETE `/templatepertanyaan/{uuid}` (Soft Delete)
    *   DELETE `/templatepertanyaan/{uuid}/force` (Hard Delete)
    *   PUT `/templatepertanyaan/{uuid}/restore` (Restore)
    *   PUT `/templatepertanyaan/{uuid}/status` (Status Toggle)
    *   GET `/templatepertanyaan/{uuid}` (Load Single)
*   **Key Actors**:
    *   [useTemplate](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/TemplateQuestionBank/Hook/useTemplate.tsx): Exposes `actionQuestion` and `loadSinglePertanyaan`.

### Feature 4: Template Answers Loader
*   **Description**: Fetches answers associated with a selected question template via Axios.
*   **APIs Used**: GET `/templatejawabans`
*   **Key Actors**:
    *   [useTemplateAnswer](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/TemplateQuestionBank/Hook/useTemplateAnswer.tsx): Updates queries based on selected question and fetches option records.

### Feature 5: Question & Answer Live Preview
*   **Description**: Merges question templates and answers in parallel stream processes to build a simulated real-time preview dashboard.
*   **APIs Used**: SSE `/templatepertanyaans?mode=sse`, `/templatejawabans?mode=sse`
*   **Key Actors**:
    *   [useTemplatePreview](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/TemplateQuestionBank/Hook/useTemplatePreview.tsx): Resolves nested parallel EventSource streams and formats previews.

---

## 2. Code Ecosystem Architecture

```
app/Module/TemplateQuestionBank/
├── Adapter/
├── Atoms/
├── Attribut/
├── Context/
│   ├── TemplateAnswareProvider.tsx
│   └── TemplateQuestionProvider.tsx
├── Hook/
│   ├── useTemplate.tsx
│   ├── useTemplateAnswer.tsx
│   └── useTemplatePreview.tsx
├── Molecules/
│   ├── BannerPreview.tsx
│   ├── DeletedTime.tsx
│   ├── GuideCard.tsx
│   ├── LaunchCard.tsx
│   ├── QuickInfoCard.tsx
│   ├── StatusState.tsx
│   └── TemplateFilterForm.tsx
├── Organisms/
│   ├── CreateTemplateChoiceForm.tsx
│   ├── CreateTemplateForm.tsx
│   ├── TemplateQuestionFormWrapper.tsx
│   ├── TemplateQuestionPreview.tsx
│   └── TemplateTable.tsx
└── Page/
```
