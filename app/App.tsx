import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./Module/Common/Context/ToastContext";
import ProtectedRoute from "./ProtectedRoute";
import { DEFAULT_ALLOWED_LEVELS } from "./Module/Common/Const/authRoles";

// Lazy load route pages for code-splitting
const LandingPage = lazy(() => import("./Module/Landing/Page/LandingPage"));
const LoginPage = lazy(() => import("./Module/Login/Page/LoginPage"));
const DashboardPage = lazy(() => import("./Module/Dashboard/Page/DashboardPage"));
const AccountPage = lazy(() => import("./Module/Account/Page/AccountPage"));
const BankSoalPage = lazy(() => import("./Module/QuestionBank/Page/BankSoalPage"));
const CategoryPage = lazy(() => import("./Module/Category/Page/CategoryPage"));
const TemplatePage = lazy(() => import("./Module/TemplateQuestionBank/Page/TemplatePage"));
const ReportPage = lazy(() => import("./Module/Report/Page/ReportPage"));
const RekapRespondenPage = lazy(() => import("./Module/RekapResponden/Page/RekapRespondenPage"));
const SandboxPage = lazy(() => import("./Module/Sandbox/Page/SandboxPage"));
const SettingPage = lazy(() => import("./Module/Setting/Page/SettingPage"));
const SupportPage = lazy(() => import("./Module/Support/Page/SupportPage"));
const CallbackPage = lazy(() => import("./callback/page"));
const CallbackSSOPage = lazy(() => import("./callback_sso/page"));
const QuesionerClient = lazy(() => import("./quesioner/[uuid]/QuesionerClient"));
const NotFound = lazy(() => import("./Module/Quesioner/Organisms/NotFound"));

function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body text-on-surface">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat halaman...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/callback_sso" element={<CallbackSSOPage />} />
          <Route path="/quesioner/:uuid" element={<QuesionerClient />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedLevels={DEFAULT_ALLOWED_LEVELS} redirectTo="/login?r=E0" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/banksoal" element={<BankSoalPage />} />
            <Route path="/kategori" element={<CategoryPage />} />
            <Route path="/template" element={<TemplatePage />} />
            <Route path="/laporan" element={<ReportPage />} />
            <Route path="/rekap-responden" element={<RekapRespondenPage />} />
            <Route path="/sandbox" element={<SandboxPage />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>

          {/* Action / Fallback routes */}
          <Route path="/action/logout" element={<Navigate to="/login?r=Ex" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  );
}
