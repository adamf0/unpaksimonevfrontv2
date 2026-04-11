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
    <header className="sticky top-0 z-30 flex flex-wrap items-center w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#f9f5ff]/80 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] gap-y-2">
      
      {/* LEFT */}
      <div className="flex items-center min-w-0 flex-1">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
        >
          <Icon name="menu" className="pointer-events-none" />
        </button>

        <h1 className="editorial-headline text-lg sm:text-xl lg:text-2xl font-extrabold text-on-surface truncate">
          {title}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto w-full sm:w-auto pl-10 sm:pl-0">
        <div className="hidden sm:block h-8 w-px bg-outline-variant/30"></div>

        <div className="text-left sm:text-right leading-tight w-full">
          <p className="text-xs sm:text-sm font-bold text-on-surface">
            {user?.name ?? "NA"}
          </p>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-outline">
            {user?.role ?? "-"}
          </p>
        </div>
      </div>
    </header>
  );
}