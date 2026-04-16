"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import apiCall from "../../Common/External/APICall";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { useToast } from "../../Common/Context/ToastContext";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type QueryState = BaseQuery & {
  role: string;
  banksoal: string | null; // ✅ FIX
  kategori?: string | null;
  pertanyaan: string;
  tipepilihan: string;
  bobot: number;
  wajibisi: boolean;
  nama_fakultas: string;
  nama_prodi: string;
};

export type TemplateState = {
  dataBank: any[];
  dataKategori: any[];
} & BaseResultState<any>;

const initialQueryState: QueryState = {
  page: 1,
  limit: 10,
  search: "",
  role: "",
  banksoal: null,
  kategori: null,
  pertanyaan: "",
  tipepilihan: "",
  bobot: 1,
  wajibisi: true,
  nama_fakultas: "",
  nama_prodi: "",
};

export function useTemplate() {
  const { pushToast } = useToast();

  const [stateQuestion, setStateQuestion] = useState<TemplateState>({
    data: [],
    dataBank: [],
    dataKategori: [],
    total: 0,
    loading: false,
    selected: null,
  });

  const [queryQuestion, setQueryQuestion] =
    useState<QueryState>(initialQueryState);

  const [openQuestion, setOpenQuestion] = useState(false);
  const debounceRef = useRef<any>(null);

  const kategoriESRef = useRef<EventSource | null>(null);
  const bankESRef = useRef<EventSource | null>(null);

  const filterBuilder = useMemo(
    () =>
      new FilterBuilder<QueryState>()
        .add("role", "role")
        .add("nama_fakultas", "nama_fakultas", "like")
        .add("nama_prodi", "nama_prodi", "like")
        .add("banksoal", "uuidbanksoal", "eq", (val) => val?.value),
    [],
  );

  async function loadData() {
    if (!queryQuestion.banksoal) return;

    setStateQuestion((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(queryQuestion); // ✅ FIX

      const res = await apiCall.get("/templatepertanyaans", {
        params: {
          mode: "paging",
          page: queryQuestion.page,
          limit: queryQuestion.limit,
          search: queryQuestion.search,
          filters,
        },
      });

      setStateQuestion((p) => ({
        ...p,
        data: res.data?.data ?? [],
        total: res.data?.total ?? 0,
      }));
    } catch (error: any) {
      pushToast(error?.response?.data?.message || "Error");
    } finally {
      setStateQuestion((p) => ({ ...p, loading: false }));
    }
  }

  function loadDataKategori() {
    kategoriESRef.current?.close();

    const token = sessionStorage.getItem("access_token");

    if (!token) return;

    const es = new EventSource(
      `${BASE_URL}/kategoris?mode=sse&ctxtoken=${token}`,
    );

    kategoriESRef.current = es;

    let temp: any[] = [];

    es.onmessage = (e) => {
      if (e.data === "start") return (temp = []);
      if (e.data === "done") {
        setStateQuestion((p) => ({ ...p, dataKategori: temp }));
        es.close();
        return;
      }
      temp.push(JSON.parse(e.data));
    };
  }

  function loadDataBankSoal() {
    if (bankESRef.current) return;

    const token = sessionStorage.getItem("access_token");
    if (!token) return;

    const es = new EventSource(
      `${BASE_URL}/banksoals?mode=sse&ctxtoken=${token}`,
    );

    bankESRef.current = es;

    let temp: any[] = [];

    es.onmessage = (e) => {
      if (e.data === "start") return (temp = []);
      if (e.data === "done") {
        setStateQuestion((p) => ({ ...p, dataBank: temp }));
        es.close();
        return;
      }
      temp.push(JSON.parse(e.data));
    };
  }

  useEffect(() => {
    loadDataKategori();
    loadDataBankSoal();
  }, []);

  useEffect(() => {
    if (!queryQuestion.banksoal) return;

    loadData();
  }, [queryQuestion.banksoal]);

  useEffect(() => {
    if (!queryQuestion.banksoal) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(loadData, 300);
  }, [queryQuestion]);

  return {
    openQuestion,
    setOpenQuestion,
    stateQuestion,
    setStateQuestion,
    queryQuestion,
    setQueryQuestion,
    resetFiltersQuestion: () => setQueryQuestion(initialQueryState),
    filterCountQuestion: (q: QueryState) => filterBuilder.countFilled(q),
  };
}
