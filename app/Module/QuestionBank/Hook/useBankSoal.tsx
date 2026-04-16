"use client";

import { useEffect, useRef, useState } from "react";
import apiCall from "../../Common/External/APICall";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { useToast } from "../../Common/Context/ToastContext";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";

/** =========================
 * TYPES
 * ========================= */
export type QueryState = BaseQuery & {
  role: string;
  judul: string;
  semester: string;
  nama_fakultas: string;
  nama_prodi: string;
};

export type BankSoalState = BaseResultState<any>;

/** =========================
 * HOOK
 * ========================= */
export function useBankSoal() {
  const { pushToast } = useToast();

  const [state, setState] = useState<BankSoalState>({
    data: [],
    total: 0,
    loading: false,
    selected: null,
  });

  const [query, setQuery] = useState<QueryState>({
    page: 1,
    limit: 10,
    search: "",
    role: "",
    judul: "",
    semester: "",
    nama_fakultas: "",
    nama_prodi: "",
  });

  const [open, setOpen] = useState(false);

  const debounceRef = useRef<any>(null);

  const filterBuilder = new FilterBuilder<QueryState>()
    .add("role", "role")
    .add("judul", "judul", "like")
    .add("semester", "semester")
    .add("nama_fakultas", "nama_fakultas", "like")
    .add("nama_prodi", "nama_prodi", "like");

  async function loadData() {
    setState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(query);

      const res = await apiCall.get("/banksoals", {
        params: {
          mode: "paging",
          page: query.page,
          limit: query.limit,
          search: query.search,
          filters,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      setState((p) => ({
        ...p,
        data: res.data?.data ?? [],
        total: res.data?.total ?? 0,
      }));
    } catch (error: any) {
      if (!error.response) return pushToast("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return pushToast(cf);

      pushToast(data?.message || "Error");
    } finally {
      setState((p) => ({ ...p, loading: false }));
    }
  }

  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(loadData, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const resetFilters = () => {
    setQuery({
      page: 1,
      limit: 10,
      search: "",
      role: "",
      judul: "",
      semester: "",
      nama_fakultas: "",
      nama_prodi: "",
    });
  };

  return {
    state,
    setState,
    query,
    setQuery,
    open,
    setOpen,
    resetFilters,
    filterCount: (q: QueryState) => filterBuilder.countFilled(q),
  };
}