# Test-Driven Development (TDD) - Login Module

This document maps positive, negative, and edge case unit tests for hooks, components, and pages.

## Test Matrix

| Category | Target | Method / Scenario | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Positive** | LoginPage | Mount and initial rendering | Renders layout structure, AuthHeroSection, and AuthLoginSection |
| **Positive** | AuthLoginSection | Submit valid credentials | Triggers Axios POST, saves tokens into sessionStorage and cookies, decodes expiration, redirects to `/dashboard` |
| **Positive** | Molecules | InputField rendering | Renders inputs, labels, placeholders, and error messages |
| **Positive** | Molecules | SocialButton trigger | Renders SSO and Google buttons and runs callbacks |
| **Negative** | AuthLoginSection | Form validation check | Submitting blank forms shows required error text, blocks fetch triggers |
| **Negative** | AuthLoginSection | Invalid credentials payload | API returns 400/401, error code is mapped to "username / password tidak valid" toast |
| **Negative** | AuthLoginSection | Server Validation errors | Server returns field-specific validations, mapped to react-hook-form error state |
| **Negative** | AuthLoginSection | Server connection offline | Handles network dropouts (missing error.response) and shows generic error alert |
| **Negative** | AuthLoginSection | Cloudflare status code block | Triggers Cloudflare helper message translations on toast |
| **Edge** | AuthLoginSection | Query params session flags | Mounts with `?r=Ex`, clears sessionStorage, displays translated toast message, removes param |
| **Edge** | AuthLoginSection | JWT decode failures | Handles corrupted token string decode errors safely without failing logins |
