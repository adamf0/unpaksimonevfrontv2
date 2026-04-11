"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function FilterSidebar({
  open,
  onClose,
  title = "Filters",
  children,
  footer,
}: FilterSidebarProps) {
  const [mounted, setMounted] = useState(false);

  // ✅ pastikan render sama antara server & client
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC handler
  useEffect(() => {
    if (!mounted) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [mounted, onClose]);

  // scroll lock
  useEffect(() => {
    if (!mounted) return;

    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  // ⛔ penting: jangan render apa-apa sampai mounted
  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-[999] transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-surface shadow-xl z-[1000] transform transition-transform flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-outline/20 flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-outline/20">
            {footer}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}