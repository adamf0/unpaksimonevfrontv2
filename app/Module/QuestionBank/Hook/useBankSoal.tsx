"use client";

import { useEffect, useRef, useState } from "react";
import apiCall from "../../Common/External/APICall";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { useToast } from "../../Common/Context/ToastContext";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";
import { isEmpty } from "../../Common/Service/utility";
import { FormValues } from "../Attribut/FormValues";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

export type BankSoalState = BaseResultState<any> & {
  sourceFakultas: any[];
  sourceProdi: any[];
  loadingFakultas: boolean;
  loadingProdi: boolean;
};

/** =========================
 * HOOK
 * ========================= */
export function useBankSoal() {
  const { pushToast } = useToast();

  const [state, setState] = useState<BankSoalState>({
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
    role: "",
    judul: "",
    semester: "",
    nama_fakultas: "",
    nama_prodi: "",
  });

  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const esFakultasRef = useRef<EventSource | null>(null);
  const esProdiRef = useRef<EventSource | null>(null);
  const debounceRef = useRef<any>(null);

  const filterBuilder = new FilterBuilder<QueryState>()
    .add("role", "role")
    .add("judul", "judul", "like")
    .add("semester", "semester")
    .add("nama_fakultas", "nama_fakultas", "like")
    .add("nama_prodi", "nama_prodi", "like");

  function toggleFlag() {
    setState((prev) => ({
      ...prev,
      flag: isEmpty(prev.flag) ? "deleted" : "",
    }));
  }

  async function loadData() {
    setState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(query);

      const res = await apiCall.get("/banksoals", {
        params: {
          mode: "paging",
          flag: isEmpty(state?.flag) ? "" : state.flag,
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

  const actionBankSoal = async (
    uuid?: string,
    data?: FormValues,
    mode: string = "",
  ) => {
    if (isEmpty(mode)) throw new Error("instruksi ditolak");

    if (mode == "delete") {
      const res = await apiCall.delete(`/banksoal/${uuid}`);
      return res.data?.uuid;
    } else if (mode == "force_delete") {
      const res = await apiCall.delete(`/banksoal/${uuid}/force`);
      return res.data?.uuid;
    } else if (mode == "restore") {
      const res = await apiCall.put(`/banksoal/${uuid}/restore`);
      return res.data?.uuid;
    } else if (mode == "draf") {
      const formData = new FormData();
      formData.append("status", "draf");

      const res = await apiCall.put(`/banksoal/${uuid}/status`, formData);
      return res.data?.uuid;
    } else if (mode == "active") {
      const formData = new FormData();
      formData.append("status", "active");

      const res = await apiCall.put(`/banksoal/${uuid}/status`, formData);
      return res.data?.uuid;
    } else {
      const formData = new FormData();
      formData.append("judul", data?.judul ?? "");
      formData.append("semester", data?.semester ?? "");
      formData.append("content", data?.konten ?? "");
      formData.append("deskripsi", data?.deskripsi ?? "");

      const res = uuid
        ? await apiCall.put(`/banksoal/${uuid}`, formData)
        : await apiCall.post("/banksoal", formData);

      return res.data?.uuid;
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(loadData, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, , state.flag]);

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
    openTime,
    setOpenTime,
    actionBankSoal,
    loadData,
    toggleFlag,
    resetFilters,
    filterCount: (q: QueryState) => filterBuilder.countFilled(q),
  };
}
