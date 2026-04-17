"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import apiCall from "../../Common/External/APICall";
import { useToast } from "../../Common/Context/ToastContext";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";
import { isEmpty } from "../../Common/Service/utility";
import { FormValues } from "../Attribut/FormValues";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type QueryState = BaseQuery & {
  role: string;
  banksoal: any;
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

  const [questionState, setQuestionState] = useState<TemplateState>({
    data: [],
    dataBank: [],
    dataKategori: [],
    total: 0,
    loading: false,
    selected: null,
    flag: null,
  });

  const [questionQuery, setQuestionQuery] =
    useState<QueryState>(initialQueryState);

  const [isFilterOpen, setFilterOpen] = useState(false);

  const debounceRef = useRef<any>(null);
  const kategoriESRef = useRef<EventSource | null>(null);
  const bankESRef = useRef<EventSource | null>(null);

  const filterBuilder = useMemo(
    () =>
      new FilterBuilder<QueryState>()
        .add("role", "role")
        .add("nama_fakultas", "nama_fakultas", "like")
        .add("nama_prodi", "nama_prodi", "like")
        .add("banksoal", "uuidbanksoal", "eq", (val) => val?.value, true),
    [],
  );

  async function loadData() {
    if (!questionQuery.banksoal) return;

    setQuestionState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(questionQuery);

      const res = await apiCall.get("/templatepertanyaans", {
        params: {
          mode: "paging",
          flag: isEmpty(questionState.flag) ? "" : questionState.flag,
          page: questionQuery.page,
          limit: questionQuery.limit,
          search: questionQuery.search,
          filters,
        },
      });

      const rows = res?.data?.data ?? [];

      setQuestionState((p) => ({
        ...p,
        data: rows,
        total: rows.length,
      }));
    } catch (error: any) {
      pushToast(error?.response?.data?.message || "Error");
    } finally {
      setQuestionState((p) => ({ ...p, loading: false }));
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
        setQuestionState((p) => ({ ...p, dataKategori: temp }));
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
        setQuestionState((p) => ({ ...p, dataBank: temp }));
        es.close();
        return;
      }
      temp.push(JSON.parse(e.data));
    };
  }

  function toggleFlag() {
    setQuestionState((prev) => ({
      ...prev,
      flag: isEmpty(prev.flag) ? "deleted" : "",
    }));
  }

  const actionQuestion = async (
    uuid?: string,
    data?: FormValues,
    mode: string = "",
  ) => {
    if (isEmpty(mode)) throw new Error("instruksi ditolak");

    if (mode == "delete") {
      const res = await apiCall.delete(`/templatepertanyaan/${uuid}`);
      return res.data?.uuid;
    } else if (mode == "force_delete") {
      const res = await apiCall.delete(`/templatepertanyaan/${uuid}/force`);
      return res.data?.uuid;
    } else if (mode == "restore") {
      const res = await apiCall.put(`/templatepertanyaan/${uuid}/restore`);
      return res.data?.uuid;
    } else if (mode == "draf") {
      const formData = new FormData();
      formData.append("status", "draf");

      const res = await apiCall.put(
        `/templatepertanyaan/${uuid}/status`,
        formData,
      );
      return res.data?.uuid;
    } else if (mode == "active") {
      const formData = new FormData();
      formData.append("status", "active");

      const res = await apiCall.put(
        `/templatepertanyaan/${uuid}/status`,
        formData,
      );
      return res.data?.uuid;
    } else {
      const formData = new FormData();
      formData.append("bank_soal", data?.banksoal?.value ?? "");
      formData.append("kategori", data?.kategori?.value ?? "");
      formData.append("jenis_pilihan", data?.tipepilihan?.value ?? "");
      formData.append("bobot", data?.bobot.toString() ?? "");
      formData.append("required", data?.wajibisi ? "1" : "0");
      formData.append("pertanyaan", data?.pertanyaan ?? "");

      const res = uuid
        ? await apiCall.put(`/templatepertanyaan/${uuid}`, formData)
        : await apiCall.post("/templatepertanyaan", formData);

      return res.data?.uuid;
    }
  };

  useEffect(() => {
    loadDataKategori();
    loadDataBankSoal();
  }, []);

  useEffect(() => {
    if (!questionQuery.banksoal) return;
    loadData();
  }, [questionQuery.banksoal, questionState.flag]);

  useEffect(() => {
    if (!questionQuery.banksoal) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(loadData, 300);
  }, [questionQuery]);

  return {
    isFilterOpen,
    setFilterOpen,

    questionState,
    setQuestionState,

    questionQuery,
    setQuestionQuery,

    toggleFlag,

    loadData,

    actionQuestion,

    resetFiltersQuestion: () => setQuestionQuery(initialQueryState),

    filterCountQuestion: (q: QueryState) => filterBuilder.countFilled(q),
  };
}
