"use client";

import { useEffect, useRef, useState } from "react";
import { TabValue } from "../Attribut/TabValue";
import apiCall from "../../Common/External/APICall";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** =========================
 * TYPES
 * ========================= */
export type QueryState = BaseQuery & {
  kategori: string;
  full_text: string;
  role: "";
  nama_fakultas: string;
  nama_prodi: string;
};

export type KategoriState = BaseResultState<any> & {
  source: any[];
  loadingSource: boolean;
};

/** =========================
 * HOOK
 * ========================= */
export function useCategory() {
  const [view, setView] = useState<TabValue>("table");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(1);

  const openFilter = () => setOpen(true);
  const closeFilter = () => setOpen(false);

  const { pushToast } = useToast();

  const [state, setState] = useState<KategoriState>({
    data: [],
    source: [],
    total: 0,
    loading: false,
    loadingSource: false,
    selected: null,
  });

  const [query, setQuery] = useState<QueryState>({
    page: 1,
    limit: 10,
    search: "",
    kategori: "",
    full_text: "",
    role: "",
    nama_fakultas: "",
    nama_prodi: "",
  });

  const debounceRef = useRef<any>(null);
  const esRef = useRef<EventSource | null>(null);

  const filterBuilder = new FilterBuilder<QueryState>()
    .add("kategori", "kategori", "like")
    .add("full_text", "full_text", "like")
    .add("role", "role", "like")
    .add("nama_fakultas", "nama_fakultas", "like")
    .add("nama_prodi", "nama_prodi", "like");

  /** =========================
   * PAGING API
   * ========================= */
  async function loadData() {
    setState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(query);

      const res = await apiCall.get("/kategoris", {
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

  /** =========================
   * SSE SOURCE (ONLY ONCE)
   * ========================= */
  function loadDataSource() {
    // 🔥 prevent duplicate connection
    if (esRef.current) return;

    setState((p) => ({ ...p, loadingSource: true }));

    const url = `${BASE_URL}/kategoris?mode=sse&ctxtoken=${sessionStorage.getItem("access_token")}`;
    const es = new EventSource(url);

    esRef.current = es;

    let tempData: any[] = [];

    es.onmessage = (event) => {
      const val = event.data;

      if (val === "start") {
        tempData = [];
        return;
      }

      if (val === "done") {
        setState((p) => ({
          ...p,
          source: tempData,
          loadingSource: false,
        }));

        es.close();
        esRef.current = null;
        return;
      }

      try {
        const parsed = JSON.parse(val);
        tempData.push(parsed);

        // 🔥 streaming update (optional realtime)
        setState((p) => ({
          ...p,
          source: [...tempData],
        }));
      } catch {
        console.warn("Invalid SSE data:", val);
      }
    };

    es.onerror = () => {
      pushToast("SSE connection error");
      setState((p) => ({ ...p, loadingSource: false }));

      es.close();
      esRef.current = null;
    };
  }

  /** =========================
   * EFFECTS
   * ========================= */

  // 🔥 Paging (reactive)
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(loadData, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // 🔥 SSE (ONLY ONCE)
  useEffect(() => {
    loadDataSource();

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, []);

  /** =========================
   * RESET
   * ========================= */
  const resetFilters = () => {
    setQuery({
      page: 1,
      limit: 10,
      search: "",
      kategori: "",
      full_text: "",
      role: "",
      nama_fakultas: "",
      nama_prodi: "",
    });
  };

  return {
    state,
    setState,
    query,
    setQuery,
    view,
    setView,
    open,
    setOpen,
    openFilter,
    closeFilter,
    current,
    setCurrent,
    resetFilters,
    filterCount: (q: QueryState) => filterBuilder.countFilled(q),
  };
}