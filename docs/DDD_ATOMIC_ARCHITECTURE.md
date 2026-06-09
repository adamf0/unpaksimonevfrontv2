# Domain-Driven Design (DDD) & Atomic Pattern Architecture

This project adopts a structured software architecture combining **Domain-Driven Design (DDD)** principles in the business/logic layer with the **Atomic Design Pattern** in the UI/Presentation layer.

---

## 1. Architecture Diagram

Below is the visual overview of how the different layers interact in the system:

![DDD & Atomic Design Architecture](../public/images/ddd_atomic_pattern.png)

---

## 2. Architectural Layers

### Layer 1: Core Domain Layer (Pure Logic)
Located under the module folders (e.g. `app/Module/Common/Domain/`), this layer is completely isolated from UI dependencies and frameworks:
*   **Value Objects (VO)**: Objects that represent concepts defined by their attributes (e.g., [DateTimeVO](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Common/Domain/DateTimeVO.tsx) containing parsing and localization helper routines, `FilterBuilder` to construct query queries). They are immutable.
*   **Domain Services**: Services containing business operations involving multiple VOs or entities (e.g., [DateRangeService](file:///Users/adamf/Documents/next_project/unpaksimonev/app/Module/Common/DomainService/DateRangeService.tsx) evaluating time intervals).
*   **Adapters**: Converters converting raw network types to domain/UI attributes (e.g. `adaptSelectOptions.tsx`).

### Layer 2: Application Layer (State & Operations)
Connects the UI layer with the Domain and External network layers:
*   **Custom React Hooks**: Handle queries, actions, and network interceptors. Hooks are split into single-responsibility sub-hooks (e.g., `useAccount.queries.tsx` for state, `useAccount.actions.tsx` for mutation operations, `useAccount.sse.tsx` for EventSource updates).
*   **Context Providers**: Shared state providers (e.g., `ToastContext` showing notifications, `AdminPanelContext` tracking builder modes).
*   **SSE Streams Loaders**: Manage asynchronous event streaming from backend systems.

### Layer 3: UI Presentation Layer (Atomic Components)
Located under the module components directories, following the Atomic Design pattern:
*   **Atoms**: Standard visual base elements without contextual logic (e.g. `Badge`, `Button`, `Icon`, `Text`, `Checkbox`).
*   **Molecules**: Simple groups of atoms bound together to create functional elements (e.g. `InputField`, `AnimatedButton`, `SelectChip`, `CKEditorField`).
*   **Organisms**: Complex UI components composed of molecules and atoms that form distinct sections of the interface (e.g. `Sidebar`, `Header`, `Modal`, `SelectField`).
*   **Template Layouts**: Grid arrangements and page wrappers (e.g. `AdminPanelTemplate` incorporating sidebars and headers, `FilterSidebar` filters overlay).
