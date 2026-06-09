# Feature-Driven Development (FDD) Spec: Quesioner Module

This document outlines the architectural components and feature breakdowns of the **Quesioner** (Questionnaire) module in the `unpaksimonev` project.

---

## 1. Feature Map & Functional Decomposition

The `Quesioner` module delivers survey forms to users through three main features:

### Feature 1: Multi-Step Questionnaire Load & Parse
*   **Description**: Concurrently fetches the active questionnaire schema (`/kuesioners/active/{uuid}`), previous answers (`/kuesioner/{uuid}/jawaban`), and user authentication profiles (`/whoami`), then loads each individual template question (`/templatepertanyaan/{uuid}/template`).
*   **APIs Used**: GET `/kuesioners/active/{uuid}`, GET `/kuesioner/{uuid}/jawaban`, GET `/whoami`, GET `/templatepertanyaan/{uuid}/template`
*   **Key Actors**:
    *   [useQuestionerBuilder](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Quesioner/Hook/useQuestionerBuilder.tsx): Orchestrates concurrent promise resolutions and maps responses into unified Questionnaire items.

### Feature 2: Time and Scope Availability Check
*   **Description**: Evaluates active date boundaries (`TanggalMulai` / `TanggalAkhir`) and custom scope extension list (`ListExt` filtering by role and ref ID) to resolve which wizard step index levels (admin, fakultas, prodi) are accessible.
*   **Key Actors**:
    *   [useQuestionerBuilder](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Quesioner/Hook/useQuestionerBuilder.tsx): Computes `availableSteps` via `getAvailableQuestioner` helper.

### Feature 3: Answer Changes & Concurrent Submission
*   **Description**: Captures option selects, text entries for "Other" choice inputs, validates mandatory answers, and submits responses concurrently via REST POST requests.
*   **APIs Used**: POST `/kuesioner/{uuid}/jawaban`
*   **Key Actors**:
    *   [QuestionForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Quesioner/Organisms/QuestionForm.tsx): Grouped-by-topic layout rendering.
    *   [useQuestionerBuilder](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Quesioner/Hook/useQuestionerBuilder.tsx): `handleChange`, `handleExtraChange`, and `handleSubmit` submission logic.

---

## 2. Code Ecosystem Architecture

```
app/Module/Quesioner/
├── Atoms/
├── Attribut/
│   ├── AnswerState.tsx
│   ├── Option.tsx
│   └── Question.tsx
├── Hook/
│   └── useQuestionerBuilder.tsx
├── Molecules/
│   ├── RatingScale.tsx
│   └── SelectableOption.tsx
├── Organisms/
│   ├── Complete.tsx
│   ├── InitialSection.tsx
│   ├── NotFound.tsx
│   ├── Problem.tsx
│   └── QuestionForm.tsx
└── Page/
    └── QuesionerPage.tsx
```
