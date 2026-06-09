# Acceptance Test-Driven Development (ATDD) - Common Module

This document defines user acceptance scenarios in Gherkin syntax for the key functional units of the `Common` module.

---

## Scenario 1: Option adapter mappings
```gherkin
Given a list of raw entity objects:
  | id  | nama       | kode |
  | 101 | Matematika | MAT  |
  | 102 | Fisika     | FIS  |
When the adaptSelectOptions adapter is called with valueKey "id" and labelKey "nama"
Then the output option list should contain:
  | value | label      |
  | "101" | Matematika |
  | "102" | Fisika     |
```

## Scenario 2: DateRange scheduling status calculation
```gherkin
Given a start datetime "2026-06-10T08:00:00.000Z"
And an end datetime "2026-06-10T17:00:00.000Z"
When the current datetime evaluated is "2026-06-10T07:00:00.000Z"
Then the DateRangeService should return status "SCHEDULED"

When the current datetime evaluated is "2026-06-10T12:00:00.000Z"
Then the DateRangeService should return status "ACTIVE"

When the current datetime evaluated is "2026-06-10T18:00:00.000Z"
Then the DateRangeService should return status "EXPIRED"
```

## Scenario 3: Token refresh swap activation
```gherkin
Given a session with active access_token and refresh_token
And an access_token_exp timestamp representing 25 seconds in the future
When useTokenWatcher interval executes
Then a silent token swap should trigger
And the access_token in storage should be updated to the refresh_token value
And the refresh_token should be deleted to prevent re-swaps
```

## Scenario 4: Dynamic SelectField option selections
```gherkin
Given a SelectField component loaded with mode "multiple"
And options "Matematika", "Fisika", "Biologi"
When the user clicks the select wrapper trigger
Then the dropdown portal overlay should open
When the user clicks the option item "Fisika"
Then the option "Fisika" should render inside the select wrapper as a removable chip
And the onChange handler should be triggered with option item "Fisika"
```
