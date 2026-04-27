"use client";

import { useEffect, useRef, useState } from "react";
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
  username: string;
  name: string;
  email: string;
  level: string;
  nama_fakultas: string;
  nama_prodi: string;
};

export type AccountState = BaseResultState<any> & {
  sourceFakultas: any[];
  sourceProdi: any[];
  loadingFakultas: boolean;
  loadingProdi: boolean;
};

/** =========================
 * HOOK
 * ========================= */
export function useAccount() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(1);

  const openFilter = () => setOpen(true);
  const closeFilter = () => setOpen(false);

  const { pushToast } = useToast();

  const [state, setState] = useState<AccountState>({
    data: [],
    sourceFakultas: [],
    sourceProdi: [],
    total: 0,
    loading: false,
    loadingFakultas: false,
    loadingProdi: false,
    selected: null,
    flag: null,
  });

  const [query, setQuery] = useState<QueryState>({
    page: 1,
    limit: 10,
    search: "",
    username: "",
    name: "",
    email: "",
    level: "",
    nama_fakultas: "",
    nama_prodi: "",
  });

  const debounceRef = useRef<any>(null);
  const esFakultasRef = useRef<EventSource | null>(null);
  const esProdiRef = useRef<EventSource | null>(null);

  const filterBuilder = new FilterBuilder<QueryState>()
    .add("username", "username", "like")
    .add("name", "name", "like")
    .add("email", "email", "like")
    .add("level", "level", "like")
    .add("nama_fakultas", "nama_fakultas", "like")
    .add("nama_prodi", "nama_prodi", "like");

  /** =========================
   * PAGING API
   * ========================= */
  async function loadData() {
    setState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(query);

      const res = await apiCall.get("/accounts", {
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
      handleError(error);
    } finally {
      setState((p) => ({ ...p, loading: false }));
    }
  }

  /** =========================
   * COMMON ERROR
   * ========================= */
  function handleError(error: any) {
    if (!error?.response) {
      pushToast("Server error");
      return;
    }

    const { status, data } = error.response;

    const cf = handleCloudflareError(status);
    if (cf) {
      pushToast(cf);
      return;
    }

    pushToast(
      typeof data?.message === "string"
        ? data.message
        : "Terjadi kesalahan"
    );
  }

  /** =========================
   * GENERIC SSE LOADER
   * ========================= */
  function loadSSE(
    url: string,
    ref: React.MutableRefObject<EventSource | null>,
    sourceKey: "sourceFakultas" | "sourceProdi",
    loadingKey: "loadingFakultas" | "loadingProdi"
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
        "access_token"
      )}`,
      esFakultasRef,
      "sourceFakultas",
      "loadingFakultas"
    );
  }

  function loadDataProdi() {
    loadSSE(
      `${BASE_URL}/prodis?mode=sse&ctxtoken=${sessionStorage.getItem(
        "access_token"
      )}`,
      esProdiRef,
      "sourceProdi",
      "loadingProdi"
    );
  }

  /** =========================
   * EFFECT
   * ========================= */
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(loadData, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, state.flag]);

  useEffect(() => {
    loadDataFakultas();
    loadDataProdi();

    return () => {
      esFakultasRef.current?.close();
      esFakultasRef.current = null;

      esProdiRef.current?.close();
      esProdiRef.current = null;
    };
  }, []);

  /** =========================
   * TOGGLE FLAG
   * ========================= */
  function toggleFlag() {
    setState((prev) => ({
      ...prev,
      flag: isEmpty(prev.flag) ? "deleted" : "",
    }));
  }

  /** =========================
   * CRUD ACTION
   * ========================= */
  const actionAccount = async (
    uuid?: string,
    data?: FormValues,
    mode: string = ""
  ) => {
    if (isEmpty(mode)) throw new Error("instruksi ditolak");

    if (mode === "delete") {
      const res = await apiCall.delete(`/account/${uuid}`);
      return res.data?.uuid;
    }

    if (mode === "force_delete") {
      const res = await apiCall.delete(`/account/${uuid}/force`);
      return res.data?.uuid;
    }

    if (mode === "restore") {
      const res = await apiCall.put(`/account/${uuid}/restore`);
      return res.data?.uuid;
    }

    const formData = new FormData();

    formData.append("username", data?.username ?? "");
    formData.append("password", data?.password ?? "");
    formData.append("level", data?.level?.value ?? "");
    formData.append("name", data?.name ?? "");
    formData.append("email", data?.email ?? "");
    formData.append("fakultas", data?.fakultas?.value ?? "");
    formData.append("prodi", data?.prodi?.value ?? "");

    const res = uuid
      ? await apiCall.put(`/account/${uuid}`, formData)
      : await apiCall.post(`/account`, formData);

    return res.data?.uuid;
  };

  /** =========================
   * RESET
   * ========================= */
  function resetFilters() {
    setQuery({
      page: 1,
      limit: 10,
      search: "",
      username: "",
      name: "",
      email: "",
      level: "",
      nama_fakultas: "",
      nama_prodi: "",
    });
  }

  return {
    state,
    setState,
    query,
    setQuery,
    open,
    setOpen,
    openFilter,
    closeFilter,
    current,
    setCurrent,
    toggleFlag,
    loadData,
    actionAccount,
    resetFilters,
    filterCount: (q: QueryState) => filterBuilder.countFilled(q),
  };
}