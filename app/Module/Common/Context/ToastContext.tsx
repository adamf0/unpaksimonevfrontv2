"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

type Toast = {
  id: string;
  message: string;
};

type ToastContextType = {
  pushToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  // ✅ FIX: pastikan hanya jalan di client
  useEffect(() => {
    setMounted(true);
  }, []);

  const pushToast = useCallback((message: string) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}

      {/* ✅ hanya render kalau sudah client */}
      {mounted &&
        createPortal(
          <div className="fixed bottom-4 right-4 space-y-2 z-[9999]">
            {toasts.map((t) => (
              <div
                key={t.id}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-slide-in"
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}