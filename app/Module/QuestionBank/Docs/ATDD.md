# Acceptance Test-Driven Development (ATDD) Spec: QuestionBank Module

This document defines user acceptance criteria for the **QuestionBank** module using Gherkin (`Given/When/Then`) syntax to align business logic with test cases.

---

## Feature 1: Pagination, Filtering & Search

### Scenario: Filtering list by Faculty and Department (Prodi)
*   **Given** a user is on the Question Bank management dashboard
*   **When** they select "Fakultas Teknik" from the Faculty dropdown
*   **Then** the Department dropdown should only display departments associated with "Fakultas Teknik"
*   **And** the table lists should automatically reload via Axios GET `/banksoals` with the selected filters

### Scenario: Searching with input debouncing
*   **Given** a user is on the Question Bank management dashboard
*   **When** they type "Ujian Akhir" in the search input
*   **Then** the app should wait for 300ms of inactivity before firing the API request
*   **And** the table should display the filtered results matching "Ujian Akhir"

---

## Feature 2: EventSource (SSE) Sync

### Scenario: Loading dropdown data progressively
*   **Given** the dashboard is loaded
*   **When** the EventSource stream connects to `/fakultass?mode=sse`
*   **Then** the dropdown should enter a loading state (`loadingFakultas = true`)
*   **And** each parsed JSON object emitted by the stream should append to the options source
*   **When** the stream emits the `"done"` termination message
*   **Then** the stream connection should close
*   **And** the dropdown loading state should toggle to `false`

### Scenario: Handling EventSource errors gracefully
*   **Given** the dashboard starts loading options
*   **When** the SSE stream encounters a connection failure
*   **Then** a Toast notification displaying "SSE connection error" should appear
*   **And** the loading state should toggle to `false`

---

## Feature 3: Action CRUD & Status Changes

### Scenario: Registering a new Question Bank
*   **Given** a user fills out the "Register New Question Bank" form with a valid title, semester, and content
*   **When** they submit the form
*   **Then** an Axios POST request should be made to `/banksoal`
*   **And** a "Berhasil simpan" Toast should be displayed
*   **And** the form values should reset to default

### Scenario: Displaying API server validations
*   **Given** a user submits the form with empty or invalid parameters
*   **When** the server responds with a `400 Bad Request` validation block
*   **Then** the specific field warnings (e.g., "Judul wajib diisi") should display next to their inputs

---

## Feature 4: Schedule Overlaps Control

### Scenario: Restricting overlapping schedule ranges
*   **Given** a Question Bank has an active schedule from `2026-06-01` to `2026-06-10`
*   **When** the user attempts to add an extension from `2026-06-05` to `2026-06-15`
*   **Then** the calendar should block the save action
*   **And** display the warning message "Jadwal bertabrakan"
