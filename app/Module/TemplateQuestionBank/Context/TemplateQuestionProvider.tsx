"use client";

import { createContext, useContext } from "react";
import { useTemplate } from "../Hook/useTemplate";

const TemplateQuestionContext = createContext<any>(null);

export function TemplateQuestionProvider({ children }: any) {
  const value = useTemplate(); 
  return (
    <TemplateQuestionContext.Provider value={value}>
      {children}
    </TemplateQuestionContext.Provider>
  );
}

export function useTemplateQuestionContext() {
  return useContext(TemplateQuestionContext);
}