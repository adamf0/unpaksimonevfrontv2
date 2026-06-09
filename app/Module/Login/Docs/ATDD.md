# Acceptance Test-Driven Development (ATDD) - Login Module

This document defines user scenarios using Gherkin format to outline acceptance criteria for Login features.

## Scenario 1: User tries to submit empty login forms
```gherkin
Given the user is on the LoginPage
When they submit the form without entering username or password
Then the form shows validation errors: "Username wajib diisi" and "Password wajib diisi"
And no API login request is triggered
```

## Scenario 2: User logs in successfully with valid credentials
```gherkin
Given the user is on the LoginPage
When they type a valid username "admin" and password "secret123"
And they submit the form
Then an authentication POST request is sent to "/login"
And the response returns an access token and refresh token
And the tokens are saved in sessionStorage and cookies
And the user is redirected to "/dashboard"
```

## Scenario 3: User fails authentication with invalid credentials
```gherkin
Given the user is on the LoginPage
When they submit an invalid username and password
Then the POST request to "/login" returns a 401 response with code "Account.InvalidCredential"
And a toast notification "username / password tidak valid" is displayed
And the user remains on the LoginPage
```

## Scenario 4: User lands on LoginPage with session expiry redirect queries
```gherkin
Given the user has been redirected to the login page with query "?r=Ex"
When the page mounts
Then a toast notification "Sesi login berakhir" is displayed
And the sessionStorage is completely cleared
And the URL is replaced to hide "?r=Ex"
```
