"use client";

import { createContext, useContext } from "react";
import { useTemplateAnswer } from "../Hook/useTemplateAnswer";

const TemplateAnswareContext = createContext<any>(null);

export function TemplateAnswareProvider({ children }: any) {
  const value = useTemplateAnswer(); 
  return (
    <TemplateAnswareContext.Provider value={value}>
      {children}
    </TemplateAnswareContext.Provider>
  );
}

export function useTemplateAnswareContext() {
  return useContext(TemplateAnswareContext);
}