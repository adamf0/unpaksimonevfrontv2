# Feature-Driven Development (FDD) Spec: Category Module

This document outlines the architectural components and feature breakdowns of the **Category** module inside the `unpaksimonev` project.

---

## 1. Feature Map & Functional Decomposition

The `Category` module provides functionality around four main features:

### Feature 1: Paginated Query and Filtering
*   **Description**: Loads categories with pagination, search strings, and filters (such as creator role, title, parent categories, etc.).
*   **APIs Used**: Axios GET `/kategoris`
*   **Key Actors**:
    *   [useCategory](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Category/Hook/useCategory.tsx): Manages query states, debounces search, and handles paging.
    *   [CategoryFilterForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Category/Molecules/CategoryFilterForm.tsx): Captures filter params in UI.
    *   [CategoryTable](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Category/Organisms/CategoryTable.tsx): Renders list results.

### Feature 2: SSE Real-Time Syncing (Faculty, Prodi, & Tree Source)
*   **Description**: Implements continuous SSE connections to load Faculty options, Prodi options, and raw categories tree source list dynamically.
*   **APIs Used**: SSE `/fakultass?mode=sse`, `/prodis?mode=sse`, and `/kategoris?mode=sse`
*   **Key Actors**:
    *   [useCategory](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Category/Hook/useCategory.tsx): Manages multiple EventSource lifecycles, load status variables (`loadingSource`, `loadingFakultas`, etc.), start/done emissions, and error connections.

### Feature 3: Actions Dispatching (CRUD & Tree updates)
*   **Description**: Creates and modifies categories (binding to parent/subcategories), copies models, soft deletes, hard deletes, restores, and commits drag-and-drop category tree reordering.
*   **APIs Used**:
    *   POST `/kategori`
    *   PUT `/kategori/{uuid}`
    *   POST `/kategori/{uuid}/copy`
    *   DELETE `/kategori/{uuid}`
    *   DELETE `/kategori/{uuid}/force`
    *   PUT `/kategori/{uuid}/restore`
    *   PUT `/kategori` (updating flat categories reorder array)
*   **Key Actors**:
    *   [CreateCategoryForm](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Category/Organisms/CreateCategoryForm.tsx): Forms interface.
    *   [useCategory](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Category/Hook/useCategory.tsx): `actionCategory` and `updateTree` REST handlers.

---

## 2. Code Ecosystem Architecture

```
app/Module/Category/
├── Attribut/
│   ├── KategoriFlat.tsx
│   ├── TabValue.tsx
│   └── FormValues.tsx
├── Context/
│   └── CategoryProvider.tsx
├── Hook/
│   └── useCategory.tsx
├── Molecules/
│   ├── CategoryCard.tsx
│   ├── CategoryFilterForm.tsx
│   ├── KategoriTableSection.tsx
│   ├── KategoriTreeSection.tsx
│   └── SubCategoryCard.tsx
├── Organisms/
│   ├── CategoryTable.tsx
│   └── CreateCategoryForm.tsx
└── Page/
    └── CategoryPage.tsx
```
