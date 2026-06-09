# Acceptance Test-Driven Development (ATDD) Spec: Report Module

This document defines user acceptance criteria for the **Report** module using Gherkin (`Given/When/Then`) syntax.

---

## Feature 1: Streamed Report Data Loading

### Scenario: Progressively showing loaded reports count
*   **Given** a supervisor initiates a request for the questionnaire report
*   **When** the server streams report JSON lines chunk-by-chunk
*   **Then** the UI count of reports increments progressively as chunks arrive
*   **And** the loading state spinner turns off when the `"done"` control stream resolves

---

## Feature 2: Multi-Dimensional Statistics calculation

### Scenario: Summarizing distinct active users count by calendar year
*   **Given** a report list contains:
    *   Year 2026: NPM "A", NPM "B", NIDN "C"
    *   Year 2026: NPM "A" (duplicate response)
*   **When** yearly stats calculation executes
*   **Then** the unique user count for 2026 displays Mahasiswa: 2, Dosen: 1, Tendik: 0

---

## Feature 3: Excel Exporting Services

### Scenario: Deduplicating rows in rekap downloads
*   **Given** an administrator requests a Rekap Excel export for report rows containing multiple replies from the same user NIDN
*   **When** they download the generated XLSX sheet
*   **Then** duplicate user replies are filtered out
*   **And** the downloaded sheet contains only unique users records
