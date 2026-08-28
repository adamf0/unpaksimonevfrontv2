"use client";

import Icon from "../Atoms/Icon";

type HeaderProps = {
  onToggleSidebar: () => void;
  title: string;
  user: {
    name: string|null;
    role: string|null;
  };
};

export default function Header({
  onToggleSidebar,
  title,
  user,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 bg-[#f9f5ff]/85 backdrop-blur-xl border-b border-outline-variant/10 shadow-[0_8px_24px_-4px_rgba(44,42,81,0.05)] gap-4">
      {/* LEFT: HAMBURGER TOGGLE BUTTON & TITLE */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka Menu Navigasi"
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 border border-primary/20 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Icon name="menu" className="text-xl pointer-events-none" />
        </button>

        {title ? (
          <h1 className="editorial-headline text-base sm:text-xl font-extrabold text-on-surface truncate">
            {title}
          </h1>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-outline">Simonev Admin Portal</span>
          </div>
        )}
      </div>

      {/* RIGHT: USER PROFILE & MOBILE TOGGLE */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex items-center gap-3 p-1.5 sm:p-0 rounded-2xl hover:bg-black/5 md:hover:bg-transparent transition-all text-left sm:text-right shrink-0 cursor-pointer md:cursor-default"
      >
        <div className="hidden sm:block h-7 w-px bg-outline-variant/30"></div>

        <div className="leading-tight">
          <p className="text-xs sm:text-sm font-extrabold text-on-surface truncate max-w-[160px] sm:max-w-[240px]">
            {user?.name ?? "N/A"}
          </p>
          <span className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-0.5">
            {user?.role ?? "-"}
          </span>
        </div>
      </button>
    </header>
  );
}