"use client";

import { createContext, useContext } from "react";
import { useCategory } from "../Hook/useCategory";

const CategoryContext = createContext<any>(null);

export function CategoryProvider({ children }: any) {
  const value = useCategory(); // 🔥 hanya 1 instance
  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  return useContext(CategoryContext);
}