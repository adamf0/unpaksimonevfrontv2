'use client';

import Link from "next/link";

export default function NavItem({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "font-label px-3 py-2 rounded-lg transition-colors",
        active
          ? "text-indigo-700 font-bold bg-indigo-100/50"
          : "text-slate-500 hover:bg-indigo-100/50",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}