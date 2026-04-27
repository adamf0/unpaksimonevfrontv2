"use client";

import { createContext, useContext } from "react";
import { KuesionerResult } from "../Attribut/KuesionerResult";
import { Payload } from "../Attribut/Payload";
import { useKuesionerReport } from "../Hook/useKuesionerReport";

export type KuesionerReportContextType = {
  data: KuesionerResult[];
  dataDetail: KuesionerResult[];
  dataBankSoal: any[];
  dataFakultas: any[];
  dataProdi: any[];
  dataTemplate: any[];

  loading: boolean;
  loadingDetail: boolean;
  loadingBankSoal: boolean;
  loadingFakultas: boolean;
  loadingProdi: boolean;
  loadingTemplate: boolean;

  errdata: string | null;
  errdataDetail: string | null;

  loadData: () => Promise<void>;
  loadDataDetail: (payload: Payload) => Promise<void>;
  loadBankSoal: () => Promise<void>;
  loadDataFakultas: () => void;
  loadDataProdi: () => void;
  loadTemplateSoal: (uuidbanksoal: any) => void;

  topQuestions: any[];
  yearlyStats: any[];
  facultyStats: any[];
  groupedByFullPath: any[];

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openFilter: () => void;
  closeFilter: () => void;

  query: any;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
  resetFilters: () => void;
};

// =========================
// CONTEXT
// =========================
const KuesionerReportContext = createContext<
  KuesionerReportContextType | undefined
>(undefined);

// =========================
// PROVIDER
// =========================
type Props = {
  children: React.ReactNode;
};

export function KuesionerReportProvider({ children }: Props) {
  const value = useKuesionerReport();

  return (
    <KuesionerReportContext.Provider value={value}>
      {children}
    </KuesionerReportContext.Provider>
  );
}

// =========================
// HOOK
// =========================
export function useKuesionerReportContext() {
  const ctx = useContext(KuesionerReportContext);

  if (ctx === undefined) {
    throw new Error(
      "useKuesionerReportContext must be used inside KuesionerReportProvider",
    );
  }

  return ctx;
}

export { KuesionerReportContext };
