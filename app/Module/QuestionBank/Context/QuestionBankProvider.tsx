"use client";

import { createContext, useContext } from "react";
import { useBankSoal } from "../Hook/useBankSoal";

const QuestionBankContext = createContext<any>(null);

export function QuestionBankProvider({ children }: any) {
  const value = useBankSoal(); 
  return (
    <QuestionBankContext.Provider value={value}>
      {children}
    </QuestionBankContext.Provider>
  );
}

export function useQuestionBankContext() {
  return useContext(QuestionBankContext);
}