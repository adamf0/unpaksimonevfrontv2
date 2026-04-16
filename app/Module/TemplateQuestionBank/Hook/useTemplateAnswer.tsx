"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import apiCall from "../../Common/External/APICall";
import { useToast } from "../../Common/Context/ToastContext";
import { BaseResultState } from "../../Common/Attribut/BaseResultState";
import { BaseQuery } from "../../Common/Attribut/BaseQuery";
import { FilterBuilder } from "../../Common/Domain/FilterBuilder";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";

export type QueryState = BaseQuery & {
  role: string;
  uuidtemplate: string;
  nama_fakultas: string;
  nama_prodi: string;
};

export type TemplateState = BaseResultState<any>;

export function useTemplateAnswer() {
  const { stateQuestion } = useTemplateQuestionContext();
  const { pushToast } = useToast();

  const [state, setState] = useState<TemplateState>({
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
    uuidtemplate: "",
    nama_fakultas: "",
    nama_prodi: "",
  });

  const debounceRef = useRef<any>(null);

  const filterBuilder = useMemo(
    () =>
      new FilterBuilder<QueryState>()
        .add("uuidtemplate", "uuidtemplate")
        .add("role", "role")
        .add("nama_fakultas", "nama_fakultas", "like")
        .add("nama_prodi", "nama_prodi", "like"),
    [],
  );

  /** 🔥 SYNC SELECTED → QUERY */
  useEffect(() => {
    if (!stateQuestion.selected) return;

    setQuery((prev) => ({
      ...prev,
      uuidtemplate: stateQuestion.selected.uuid,
      page: 1,
    }));
  }, [stateQuestion.selected]);

  async function loadData(q: QueryState) {
    if (!q.uuidtemplate) return;

    setState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(q);

      const res = await apiCall.get("/templatejawabans", {
        params: {
          mode: "paging",
          page: q.page,
          limit: q.limit,
          search: q.search,
          filters,
        },
      });

      setState((p) => ({
        ...p,
        data: res.data?.data ?? [],
        total: res.data?.total ?? 0,
      }));
    } catch (err: any) {
      pushToast(err?.response?.data?.message || "Error");
    } finally {
      setState((p) => ({ ...p, loading: false }));
    }
  }

  /** 🔥 AUTO LOAD */
  useEffect(() => {
    clearTimeout(debounceRef.current);

    const snapshot = { ...query };

    debounceRef.current = setTimeout(() => {
      loadData(snapshot);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return {
    state,
    setState,
    query,
    setQuery,
  };
}