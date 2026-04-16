"use client";

import { createContext, useContext } from "react";
import { useTemplate } from "../Hook/useTemplate";

const TemplateQuestionContext =
  createContext<ReturnType<typeof useTemplate> | null>(null);

export function TemplateQuestionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useTemplate();

  return (
    <TemplateQuestionContext.Provider value={value}>
      {children}
    </TemplateQuestionContext.Provider>
  );
}

export function useTemplateQuestionContext() {
  const ctx = useContext(TemplateQuestionContext);
  if (!ctx)
    throw new Error("useTemplateQuestionContext must be used within Provider");
  return ctx;
}