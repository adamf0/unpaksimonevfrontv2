# System Flow & Activity Diagrams

This document outlines key application lifecycles and user flows using Mermaid diagram flowcharts.

---

## 1. Authentication & Login Flow

This diagram describes what happens when a user visits the login portal and submits their credentials.

```mermaid
flowchart TD
    Start([User visits Login Page]) --> ParamCheck{r query param present?}
    ParamCheck -- Yes --> TranslateReason[Translate code e.g. Ex, E0, E1, F0]
    TranslateReason --> ShowToast[Show pushToast Alert]
    ShowToast --> ClearSession[Clear sessionStorage]
    ClearSession --> FormRender[Render Login Form]
    ParamCheck -- No --> FormRender
    
    FormRender --> Submit[User submits form]
    Submit --> ClientVal{Valid inputs?}
    ClientVal -- No --> ValidationErr[Show field required errors] --> FormRender
    ClientVal -- Yes --> APICall[POST /login via apiCall]
    
    APICall --> APIResponse{Response success?}
    APIResponse -- Yes --> SaveTokens[Save access_token, refresh_token & expiry]
    SaveTokens --> RedirectDashboard[Redirect router.push /dashboard]
    RedirectDashboard --> End([Dashboard Loaded])
    
    APIResponse -- No --> CheckErrType{No response?}
    CheckErrType -- Yes --> OfflineErr[Show pushToast: Ada masalah pada server] --> FormRender
    CheckErrType -- No --> CheckCF{Status 520-526?}
    CheckCF -- Yes --> CFBlocked[Show pushToast: CF Error message] --> FormRender
    CheckCF -- No --> InvalidCreds{Code Account.InvalidCredential?}
    InvalidCreds -- Yes --> InvalidToast[Show pushToast: username/password tidak valid] --> FormRender
    InvalidCreds -- No --> ServerValidation[Map messages array to form errors] --> FormRender
```

---

## 2. Background Token Watcher Swap Lifecycle

This diagram outlines the automatic background token watcher (`useTokenWatcher`) checks that occur on a 1-second interval to ensure session persistence.

```mermaid
flowchart TD
    Start([Interval fires every 1000ms]) --> GetTokens[Retrieve access_token, refresh_token, exp]
    GetTokens --> CheckExists{Tokens present?}
    CheckExists -- No --> End([Skip])
    CheckExists -- Yes --> CheckNearExpiry{now >= expiry - 30s?}
    
    CheckNearExpiry -- No --> ResetSwapped[Set hasSwapped.current = false] --> End
    CheckNearExpiry -- Yes --> AlreadySwapped{hasSwapped.current === true?}
    
    AlreadySwapped -- Yes --> CheckExpired{now >= expiry?}
    AlreadySwapped -- No --> SetSwappedFlags[Set hasSwapped = true, isRefreshing = true]
    
    SetSwappedFlags --> HasRefreshToken{refresh_token present?}
    HasRefreshToken -- No --> CheckExpired
    HasRefreshToken -- Yes --> SwapAPI[Swap token: Set access_token = refresh_token]
    
    SwapAPI --> DecodeNewExp{Decode expiry of new token?}
    DecodeNewExp -- Success --> SaveNewExpiry[Set access_token_exp = newExpiry]
    SaveNewExpiry --> End
    DecodeNewExp -- Fail --> HandleSwapFail[sessionStorage.clear]
    HandleSwapFail --> LogoutRedirect[window.location.href = /action/logout?r=E00] --> End
    
    CheckExpired -- Yes --> NoRefresh{No refresh_token present?}
    NoRefresh -- Yes --> HandleSwapFail
    NoRefresh -- No --> End
    CheckExpired -- No --> End
```

---

## 3. Visual System Activity Diagram

This diagram displays the full system activity schema, showing the transitions and relationships between authentication, admin CRUD modules, SSE stream syncs, client questionnaire builders, and report exports:

![Complete Project Flow Chart](../public/images/full_system_flow.png)

---

## 4. Visual Component Interaction Sequence Diagram

This sequence diagram displays how different components, custom hooks, and external API services communicate:

![Component Interaction Sequence Diagram](../public/images/component_interaction.png)

---

## 5. Complete Project Flow & Lifecycle Activity Diagram

