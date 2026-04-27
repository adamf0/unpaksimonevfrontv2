"use client";

import { createContext, useContext } from "react";
import { useAccount } from "../Hook/useAccount";

const AccountContext = createContext<any>(null);

export function AccountProvider({ children }: any) {
  const value = useAccount(); // 🔥 hanya 1 instance
  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}