# Acceptance Test-Driven Development (ATDD) Spec: TemplateQuestionBank Module

This document defines user acceptance criteria for the **TemplateQuestionBank** module using Gherkin (`Given/When/Then`) syntax.

---

## Feature 1: Paginated Template Questions & Filtering

### Scenario: Loading table records when Bank Soal is selected
*   **Given** an admin user is on the template question bank page
*   **When** they select a Bank Soal from the filter dropdown
*   **Then** a paginated request is sent to `/templatepertanyaans`
*   **And** the table updates to display the matched template questions list

### Scenario: Resetting questions when Bank Soal is cleared
*   **Given** a Bank Soal was previously selected and questions loaded
*   **When** the user clears the Bank Soal selection
*   **Then** the table is immediately cleared
*   **And** the question count resets to zero

---

## Feature 2: Multi-Feed EventSource Streams

### Scenario: Populating forms options progressively
*   **Given** a form requires Category, Bank Soal, Faculty, and Prodi selections
*   **When** the page mounts and initiates the 4 SSE stream connections
*   **Then** data elements appear in real-time as they stream from EventSources
*   **And** loading spinner overlays vanish once the `"done"` event is processed

---

## Feature 3: CRUD & Status Alteration Actions

### Scenario: Duplicating an existing template question
*   **Given** an administrator locates a question template in the list
*   **When** they click the "Copy" action button
*   **Then** a POST request is sent to `/templatepertanyaan/{uuid}/copy`
*   **And** a copy of the question is successfully added to the database

---

## Feature 4: Question & Answer Live Preview

### Scenario: Visualizing question format in real-time
*   **Given** a supervisor selects a Bank Soal for preview
*   **When** the preview hook loads the template structure and its corresponding answer choices
*   **Then** the live preview interface displays exact input elements (textfields, radios, checkbox grids) matching the configuration
