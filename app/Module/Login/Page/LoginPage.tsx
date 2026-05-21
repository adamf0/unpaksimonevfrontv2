import { Suspense } from "react";

import { ToastProvider } from "../../Common/Context/ToastContext";

import AuthHeroSection from "../Organisms/AuthHeroSection";
import AuthLoginSection from "../Organisms/AuthLoginSection";

/* =========================
   HERO SKELETON
========================= */

function HeroSkeleton() {
  return (
    <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container animate-pulse">
      <div className="absolute inset-0 bg-surface-container-high" />

      <div className="relative z-10 flex flex-col justify-between w-full p-12">
        <div className="space-y-6">
          <div className="w-64 h-14 rounded-2xl bg-surface-container-highest" />

          <div className="space-y-4 mt-12">
            <div className="w-80 h-10 rounded-xl bg-surface-container-highest" />

            <div className="w-full max-w-md h-5 rounded-lg bg-surface-container-highest" />

            <div className="w-2/3 h-5 rounded-lg bg-surface-container-highest" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-40 h-4 rounded bg-surface-container-highest" />

          <div className="w-32 h-4 rounded bg-surface-container-highest" />
        </div>
      </div>
    </section>
  );
}

/* =========================
   LOGIN SKELETON
========================= */

function LoginSkeleton() {
  return (
    <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-surface">
      <div className="w-full max-w-[480px] animate-pulse">
        {/* MOBILE LOGO */}
        <div className="lg:hidden flex flex-col items-center gap-4 mb-12">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-high" />

          <div className="w-52 h-10 rounded-xl bg-surface-container-high" />
        </div>

        {/* TITLE */}
        <div className="mb-10 space-y-4">
          <div className="w-72 h-12 rounded-xl bg-surface-container-high" />

          <div className="w-full h-5 rounded-lg bg-surface-container-high" />

          <div className="w-2/3 h-5 rounded-lg bg-surface-container-high" />
        </div>

        {/* INPUT 1 */}
        <div className="space-y-3 mb-6">
          <div className="w-32 h-4 rounded bg-surface-container-high" />

          <div className="w-full h-[58px] rounded-2xl bg-surface-container-high" />
        </div>

        {/* INPUT 2 */}
        <div className="space-y-3 mb-8">
          <div className="w-28 h-4 rounded bg-surface-container-high" />

          <div className="w-full h-[58px] rounded-2xl bg-surface-container-high" />
        </div>

        {/* BUTTON */}
        <div className="w-full h-[64px] rounded-2xl bg-surface-container-high mb-8" />

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-[1px] bg-surface-container-high" />

          <div className="w-28 h-4 rounded bg-surface-container-high" />

          <div className="flex-1 h-[1px] bg-surface-container-high" />
        </div>

        {/* SOCIAL BUTTON */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-[60px] rounded-2xl bg-surface-container-high" />

          <div className="h-[60px] rounded-2xl bg-surface-container-high" />
        </div>
      </div>
    </section>
  );
}

/* =========================
   PAGE
========================= */

export default function LoginPage() {
  return (
    <ToastProvider>
      <div className="bg-surface font-body text-on-surface min-h-screen flex overflow-y-auto">
        <main className="flex w-full min-h-screen">
          {/* HERO */}
          <Suspense fallback={<HeroSkeleton />}>
            <AuthHeroSection />
          </Suspense>

          {/* LOGIN */}
          <Suspense fallback={<LoginSkeleton />}>
            <AuthLoginSection />
          </Suspense>
        </main>
      </div>
    </ToastProvider>
  );
}