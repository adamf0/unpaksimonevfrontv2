# Acceptance Test-Driven Development (ATDD) Spec: Category Module

This document defines user acceptance criteria for the **Account** module using Gherkin (`Given/When/Then`) syntax to align business rules with test expectations.

---

## Feature 1: Pagination, Filtering & Search

### Scenario: Searching accounts by username
*   **Given** an administrator is on the Account management dashboard
*   **When** they type "evaluator1" in the search box
*   **Then** the list results should reload after a 300ms debounce
*   **And** only display user accounts matching "evaluator1"

---

## Feature 2: EventSource (SSE) Sync

### Scenario: Progressively streaming selectors data
*   **Given** the register form is opened
*   **When** the EventSource loads `/fakultass?mode=sse`
*   **Then** the faculties dropdown enters a loading state (`loadingFakultas = true`)
*   **And** is populated incrementally by parsed JSON blocks
*   **When** the stream completes
*   **Then** the connection closes and the loader stops

---

## Feature 3: Action CRUD operations

### Scenario: Creating a new user account
*   **Given** the user is filling the registration form
*   **When** they select "Prodi" level, select "Fakultas Teknik" and "Teknik Informatika"
*   **And** enter valid login credentials
*   **And** submit the form
*   **Then** Axios POST is sent to `/account`
*   **And** the list refreshes
*   **And** a success notification toast displays
