"use client";

import { useRouter } from "next/navigation";
import Icon from "../../Common/Components/Atoms/Icon";

type Props = {
  title?: string;
  message?: string;
  code?: string;
  sessionActive?: boolean;
};

export default function Problem({
  title = "Something Went South.",
  message = "A technical glitch occurred while processing your request. Our server is feeling a bit under the weather. Don't worry, your data is safe.",
  code = "CQ-ERROR-992-PX",
  sessionActive = true,
}: Props) {
  const router = useRouter();

  return (
    <section
      className="animate-fade-in-up"
      id="error"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-8 bg-white border border-red-50 rounded-3xl p-10 md:p-16 shadow-[0_20px_40px_rgba(180,19,64,0.04)]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-error rounded-[2rem] mb-10">
            <span
              className="material-symbols-outlined text-5xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              report
            </span>
          </div>

          <h2 className="font-headline text-5xl font-extrabold text-on-surface mb-6">
            {title}
          </h2>

          <p className="text-xl text-on-surface-variant mb-12 leading-relaxed max-w-2xl">
            {message}
          </p>

          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-3"
            >
              <span className="material-symbols-outlined">refresh</span>
              Refresh Page
            </button>

            <button
              onClick={() => router.push("/")}
              className="px-10 py-5 bg-indigo-50 text-on-primary-container rounded-2xl font-bold text-lg hover:bg-indigo-100 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-primary-container/40 border border-indigo-100 rounded-3xl p-8 flex-1">
            <h3 className="text-xl font-bold text-on-primary-container mb-6 flex items-center gap-3">
              <Icon name="contact_support" className="text-primary" />
              Contact Admin
            </h3>

            <p className="text-on-surface-variant mb-8 leading-relaxed">
              If this issue persists, please notify the IT department with the
              ticket ID below.
            </p>

            <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border border-indigo-100 font-mono text-sm text-primary flex items-center justify-between group">
              <span className="font-bold tracking-wider">{code}</span>

              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="material-symbols-outlined text-lg opacity-40 group-hover:opacity-100 transition-opacity"
              >
                content_copy
              </button>
            </div>
          </div>

          <div className="bg-on-primary-container text-white rounded-3xl p-8 flex-1 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-5">
              <Icon name="verified_user" className="!text-[10rem]" />
            </div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Icon name="verified_user" className="text-indigo-300" />
              Security Status
            </h3>

            <div className="flex items-center gap-3 py-2 px-4 bg-white/10 backdrop-blur rounded-full w-fit mb-6">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  sessionActive ? "bg-green-400" : "bg-red-400"
                }`}
              />

              <span className="text-sm font-semibold">
                {sessionActive ? "Session Active" : "Session Expired"}
              </span>
            </div>

            <p className="text-indigo-100/80 text-sm leading-relaxed">
              {sessionActive
                ? "Your session is still authenticated. No data loss detected."
                : "Your login session has expired or is missing. Please sign in again to continue."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}