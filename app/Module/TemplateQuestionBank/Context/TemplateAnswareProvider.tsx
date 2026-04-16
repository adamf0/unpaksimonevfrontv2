"use client";

import { createContext, useContext } from "react";
import { useTemplateAnswer } from "../Hook/useTemplateAnswer";

const TemplateAnswerContext =
  createContext<ReturnType<typeof useTemplateAnswer> | null>(null);

export function TemplateAnswerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useTemplateAnswer();

  return (
    <TemplateAnswerContext.Provider value={value}>
      {children}
    </TemplateAnswerContext.Provider>
  );
}

export function useTemplateAnswerContext() {
  const ctx = useContext(TemplateAnswerContext);
  if (!ctx)
    throw new Error("useTemplateAnswerContext must be used within Provider");
  return ctx;
}