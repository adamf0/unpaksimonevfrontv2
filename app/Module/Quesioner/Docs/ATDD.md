# Acceptance Test-Driven Development (ATDD) Spec: Quesioner Module

This document defines user acceptance criteria for the **Quesioner** module using Gherkin (`Given/When/Then`) syntax to align business rules with test expectations.

---

## Feature 1: Multi-Step Questionnaire Load & Parse

### Scenario: Prefilling answers on load
*   **Given** a user opens a questionnaire with UUID "q-1"
*   **When** the template schema and previous answers are loaded successfully
*   **Then** previously submitted values (radios, ratings, check selections) should display prefilled

---

## Feature 2: Time and Scope Availability Check

### Scenario: Resolving wizard steps based on active dates
*   **Given** the current date is `2026-06-09`
*   **And** the main questionnaire is active until `2026-06-15`
*   **And** a faculty scope extension is active from `2026-06-01` to `2026-06-12`
*   **Then** the survey steps index should include both "admin" and "fakultas" levels

---

## Feature 3: Answer Changes & Concurrent Submission

### Scenario: Displaying warning on mandatory question skip
*   **Given** a user is on the first step of the survey
*   **When** they attempt to submit with required questions unanswered
*   **Then** the form submission blocks
*   **And** displays a "Pertanyaan ini wajib diisi" warning next to each skipped field
*   **And** shows a Toast message "Harap lengkapi semua pertanyaan"
