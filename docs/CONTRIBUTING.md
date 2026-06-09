# Developer & Contribution Guide

This guide describes how to set up the environment, run unit tests, and build new modules in accordance with the established architecture conventions of **unpaksimonev**.

---

## 1. Local Development Setup

To configure and run the project locally:

```bash
# 1. Install packages
npm install

# 2. Start the development server (runs on port 4000 by default)
npm run dev

# 3. Build the production package (standalone container mode)
npm run build
```

---

## 2. Testing Instructions

All modules are expected to maintain 100% test coverage with zero warnings.

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests in a specific module folder
npx vitest run app/Module/Category/
```

---

## 3. Directory & Folder Conventions

When creating or modifying modules, enforce the following DDD + Atomic component layout:

```text
app/Module/[ModuleName]/
├── Docs/                  # Specifications docs
│   ├── FDD.md             # Feature Driven Development spec
│   ├── ATDD.md            # Acceptance Test-Driven Development Gherkin scenarios
│   └── TDD.md             # Test-Driven Development test cases matrices
├── Atoms/                 # Pure presentational styles (spans, labels)
├── Molecules/             # Compound simple inputs (inputs, select chips)
├── Organisms/             # Complex components (floating lists, sidebars, modals)
├── Page/                  # Page-level containers (LoginPage, DashboardPage)
├── Hook/                  # React custom hooks (split by query, sse, and action)
├── Domain/                # Pure value objects (DateTimeVO)
├── DomainService/         # Pure domain operational services
├── Service/               # General helper scripts
└── __tests__/             # Unit tests folder
    ├── mocks/
    │   └── apiMocks.tsx   # Custom module mock wrappers
    ├── Molecules.test.tsx # Specific molecule test files
    ├── Organisms.test.tsx # Specific organism test files
    └── use[Name].test.tsx # Split hooks test files
```

---

## 4. Testing Checklist for New Modules

When building a new module, you **must** follow the Testing Ecosystem standard:

1.  **Draft Documentation first (TDD/ATDD/FDD)**:
    *   Map out all features, write Gherkin syntax statements for acceptance criteria, and detail a test matrix table mapping positive, negative, and edge inputs.
2.  **Define Mock wrappers (`mocks/apiMocks.tsx`)**:
    *   Isolate components and hook operations by mocking routers, context providers, Excel export functions, SSE sources, and network call modules.
3.  **Split tests into single-responsibility files**:
    *   Do not aggregate all components/hooks into single large test files.
    *   Separate component tests by category (e.g. `Molecules.test.tsx`, `Organisms.test.tsx`).
    *   Separate hook tests by operational category (e.g. `use[Name].queries.test.tsx`, `use[Name].sse.test.tsx`, `use[Name].actions.test.tsx`).
4.  **Cover Positive, Negative, and Edge Cases**:
    *   *Positive*: successful inputs, token storage saves, page transitions.
    *   *Negative*: validation errors representation, backend network failures handles, Cloudflare status drops.
    *   *Edge*: parameter redirect overrides, zero boundary number parsers.
