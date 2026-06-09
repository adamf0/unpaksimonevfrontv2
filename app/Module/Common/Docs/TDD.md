# Test-Driven Development (TDD) Spec - Common Module

This document details the test matrices covering positive, negative, and edge cases across the modules of `Common`.

---

## 1. Unit Test Matrix

| Component / File | Test Type | Case Description | Input / Trigger | Expected Output |
| :--- | :--- | :--- | :--- | :--- |
| **adaptSelectOptions** | Positive | Convert raw keys | `[{id:1, name:"A"}]` | `[{value:"1", label:"A", payload:...}]` |
| | Negative | Skip empty ids | `[{id:"", name:"A"}]` | `[]` |
| **adaptSelectOptionsMerge** | Positive | Join labels with spacing | Keys `["firstName", "lastName"]` | Joined label `A B` |
| | Positive | Template replacement | Template `"%s - %s"` | Formatted label `A - B` |
| **DateTimeVO** | Positive | Localized string formats | Date `2026-06-09` | ID Date/Time outputs |
| | Negative | Handle invalid inputs | `"invalid-date"` | `isValid() === false`, output `"-"` |
| | Edge | Past/Future bounds | Current time | correct boolean state flags |
| **FilterBuilder** | Positive | Serialize rules | `{name: "John", status: "active"}` | `"name:eq:John;status:eq:active"` |
| | Negative | Skip empty/null keys | `{name: "", status: null}` | `""` (empty string) |
| **DateRangeService** | Positive | Active / Expired intervals | Start, end, current times | Correct scheduling status strings |
| | Edge | End before start | start > end | `"TIME_RANGE_INVALID"` |
| **tokenExpiry** | Positive | Decodes standard JWT | `"header.payload.signature"` | Expiration time * 1000 |
| | Negative | Corrupted/Invalid JWT | `"invalid-token"` | `null` |
| **useTokenWatcher** | Positive | Token refresh swap | Expiry < 30s | Updates storage, sets cookie, clears refresh token |
| | Negative | Expired token redirect | Expiry reached, no refresh token | Clears storage, redirects to `/action/logout?r=E00` |
| **ToastContext** | Positive | Add and dismiss toasts | `pushToast("test")` | Renders notification toast, clears after duration |
| **CKEditorField** | Positive | Rich text inputs purification | `"<p>Hello <b>World</b></p>"` | Safe HTML output |
| | Negative | Strip disallowed tags/JS | `"<script>alert(1)</script>"` | Clean text without tags |
| **SelectField** | Positive | Single selection triggers | Click option item | Renders selected, triggers onChange, closes dropdown |
| | Positive | Multiple option selection | Select multiple items | Renders multiple chips, triggers array onChange |
| | Edge | Outside click dismissal | MouseDown on body | Closes dropdown |
