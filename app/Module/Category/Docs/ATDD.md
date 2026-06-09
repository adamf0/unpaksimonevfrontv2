# Acceptance Test-Driven Development (ATDD) Spec: Category Module

This document defines user acceptance criteria for the **Category** module using Gherkin (`Given/When/Then`) syntax to align business rules with test expectations.

---

## Feature 1: Pagination, Filtering & Search

### Scenario: Filtering list by Name
*   **Given** a user is on the Category management dashboard
*   **When** they enter "Kurikulum" into the category name filter field
*   **Then** the list results should reload via Axios GET `/kategoris` with name filter parameters
*   **And** only render categories matching "Kurikulum"

---

## Feature 2: EventSource (SSE) Sync

### Scenario: Loading tree and select dropdowns progressively
*   **Given** the dashboard is loaded
*   **When** EventSource connections establish for `/kategoris?mode=sse`, `/fakultass?mode=sse`, and `/prodis?mode=sse`
*   **Then** the options loader should set `loadingSource = true` and `loadingFakultas = true`
*   **And** items are added to local arrays as they are streamed line by line
*   **When** streams emit the `"done"` message
*   **Then** connections close and the loader indicators clear

---

## Feature 3: Action CRUD & Status Changes

### Scenario: Registering a new Category
*   **Given** a user opens the Create Category form
*   **When** they type "Kategori Baru" in the name field and choose "ROOT" parent category
*   **And** submit the form
*   **Then** an Axios POST request is sent to `/kategori`
*   **And** the tree list reloads
*   **And** a success notification appears

### Scenario: Deleting a category
*   **Given** a category named "Kategori Lama" is in the table
*   **When** the user clicks "Delete" on the action button list
*   **Then** a delete confirmation modal triggers
*   **When** they confirm the deletion
*   **Then** Axios DELETE is called on `/kategori/{uuid}`
*   **And** the list refreshes
