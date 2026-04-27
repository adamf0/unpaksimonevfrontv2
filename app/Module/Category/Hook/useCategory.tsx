"use client";

import { useEffect, useRef, useState } from "react";
import { TabValue } from "../Attribut/TabValue";
import apiCall from "../../Common/External/APICall";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";
import { isEmpty } from "../../Common/Service/utility";
import { FormValues } from "../Attribut/FormValues";

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
  sourceFakultas: any[];
  sourceProdi: any[];
  loadingSource: boolean;
  loadingFakultas: boolean;
  loadingProdi: boolean;
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
    sourceFakultas: [],
    sourceProdi: [],
    total: 0,
    loading: false,
    loadingSource: false,
    loadingFakultas: false,
    loadingProdi: false,
    selected: null,
    flag: null,
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
  const esFakultasRef = useRef<EventSource | null>(null);
  const esProdiRef = useRef<EventSource | null>(null);

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
          flag: state.flag,
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
   * GENERIC SSE LOADER
   * ========================= */
  function loadSSE(
    url: string,
    ref: React.MutableRefObject<EventSource | null>,
    sourceKey: "sourceFakultas" | "sourceProdi",
    loadingKey: "loadingFakultas" | "loadingProdi",
  ) {
    if (ref.current) return;

    setState((p) => ({ ...p, [loadingKey]: true }));

    const es = new EventSource(url);
    ref.current = es;

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
          [sourceKey]: tempData,
          [loadingKey]: false,
        }));

        es.close();
        ref.current = null;
        return;
      }

      try {
        const parsed = JSON.parse(val);
        tempData.push(parsed);

        setState((p) => ({
          ...p,
          [sourceKey]: [...tempData],
        }));
      } catch {}
    };

    es.onerror = () => {
      pushToast("SSE connection error");

      setState((p) => ({
        ...p,
        [loadingKey]: false,
      }));

      es.close();
      ref.current = null;
    };
  }

  /** =========================
   * LOADERS
   * ========================= */
  function loadDataFakultas() {
    loadSSE(
      `${BASE_URL}/fakultass?mode=sse&ctxtoken=${sessionStorage.getItem(
        "access_token",
      )}`,
      esFakultasRef,
      "sourceFakultas",
      "loadingFakultas",
    );
  }

  function loadDataProdi() {
    loadSSE(
      `${BASE_URL}/prodis?mode=sse&ctxtoken=${sessionStorage.getItem(
        "access_token",
      )}`,
      esProdiRef,
      "sourceProdi",
      "loadingProdi",
    );
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
  }, [query, state.flag]);

  useEffect(() => {
    loadDataFakultas();
    loadDataProdi();
    loadDataSource();

    return () => {
      esRef.current?.close();
      esRef.current = null;

      esFakultasRef.current?.close();
      esFakultasRef.current = null;

      esProdiRef.current?.close();
      esProdiRef.current = null;
    };
  }, []);

  function toggleFlag() {
    setState((prev) => ({
      ...prev,
      flag: isEmpty(prev.flag) ? "deleted" : "",
    }));
  }

  const actionCategory = async (
    uuid?: string,
    data?: FormValues,
    mode: string = "",
  ) => {
    if (isEmpty(mode)) throw new Error("instruksi ditolak");

    if (mode == "delete") {
      const res = await apiCall.delete(`/kategori/${uuid}`);
      return res.data?.uuid;
    } else if (mode == "force_delete") {
      const res = await apiCall.delete(`/kategori/${uuid}/force`);
      return res.data?.uuid;
    } else if (mode == "restore") {
      const res = await apiCall.put(`/kategori/${uuid}/restore`);
      return res.data?.uuid;
    } else if (mode == "draf") {
      const formData = new FormData();
      formData.append("status", "draf");

      const res = await apiCall.put(`/kategori/${uuid}/status`, formData);
      return res.data?.uuid;
    } else if (mode == "active") {
      const formData = new FormData();
      formData.append("status", "active");

      const res = await apiCall.put(`/kategori/${uuid}/status`, formData);
      return res.data?.uuid;
    } else {
      const formData = new FormData();
      formData.append("nama_kategori", data?.kategori ?? "");
      formData.append("sub_kategori", data?.subKategori?.value ?? "");

      const res = uuid
        ? await apiCall.put(`/kategori/${uuid}`, formData)
        : await apiCall.post("/kategori", formData);

      return res.data?.uuid;
    }
  };

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
    toggleFlag,
    loadData,
    actionCategory,
    resetFilters,
    filterCount: (q: QueryState) => filterBuilder.countFilled(q),
  };
}
