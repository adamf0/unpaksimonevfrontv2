# Feature Driven Development (FDD) Specification - Login Module

This document outlines the core business values and functional capabilities of the Login module in the `unpaksimonev` frontend application.

## Feature 1: Credentials Form Validation
- **Goal**: Ensure that users enter structurally valid credentials before hitting the authentication endpoint.
- **Rules**:
  - `Username or Email` must not be empty.
  - `Password` must not be empty.
  - Interactive validation messages are displayed immediately below the empty/invalid fields.

## Feature 2: Session Authentication API Handling
- **Goal**: Send validation credentials to the backend, receive JSON tokens, and securely load them into local persistence.
- **Rules**:
  - Submits credentials via POST request to `/login` as `FormData`.
  - On successful HTTP response:
    - Extracts `access_token` and `refresh_token`.
    - Saves `access_token` into `sessionStorage` and `document.cookie` (with `/` path access).
    - Decodes JWT access token expiration date using `getTokenExpiry` and saves it to `sessionStorage` under `access_token_exp`.
    - Saves `refresh_token` in `sessionStorage`.
    - Navigates the client to the `/dashboard` route.

## Feature 3: Session Expiration Router Queries
- **Goal**: Detect and display sessions failures and token terminations via query strings upon mount, and clear them after user notification.
- **Rules**:
  - Reads search query parameter `r`.
  - Translates codes to user alerts:
    - `Ex` -> "Sesi login berakhir"
    - `E0` -> "Terjadi masalah pada session Anda."
    - `E1` -> "Tidak dapat mengambil informasi akun."
    - `F0` -> "Akun Anda tidak memiliki akses ke sistem ini."
  - Clears `sessionStorage` and replaces the window browser history path (removes parameter `r`) to prevent message duplication on reload.

## Feature 4: External Validation Error Mapping
- **Goal**: Display validation warnings returned from the server (e.g. invalid credential format or invalid passwords) on specific fields.
- **Rules**:
  - Catches validation error responses where code ends with `.Validation`.
  - Maps error messages dynamically to the registered form input fields (`username`, `password`).
