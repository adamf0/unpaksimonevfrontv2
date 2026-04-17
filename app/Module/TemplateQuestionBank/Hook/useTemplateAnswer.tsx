"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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

export function useTemplateAnswer() {
  const { questionState } = useTemplateQuestionContext();
  const { pushToast } = useToast();

  const [answerState, setAnswerState] = useState<BaseResultState<any>>({
    data: [],
    total: 0,
    loading: false,
    selected: null,
    flag: null,
  });

  const [answerQuery, setAnswerQuery] = useState<QueryState>({
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

  useEffect(() => {
    if (!questionState.selected) return;

    setAnswerQuery((prev) => ({
      ...prev,
      uuidtemplate: questionState.selected.uuid,
      page: 1,
    }));
  }, [questionState.selected]);

  async function loadData(q: QueryState) {
    if (!q.uuidtemplate) return;

    setAnswerState((p) => ({ ...p, loading: true }));

    try {
      const filters = filterBuilder.build(q);

      const res = await apiCall.get("/templatejawabans", {
        params: {
          mode: "all",
          // page: q.page,
          // limit: q.limit,
          search: q.search,
          filters,
        },
      });

      const rows = res?.data ?? [];

      setAnswerState((p) => ({
        ...p,
        data: rows,
        total: rows.length,
      }));
    } catch (err: any) {
      pushToast(err?.response?.data?.message || "Error");
    } finally {
      setAnswerState((p) => ({ ...p, loading: false }));
    }
  }

  useEffect(() => {
    clearTimeout(debounceRef.current);

    const snapshot = { ...answerQuery };

    debounceRef.current = setTimeout(() => {
      loadData(snapshot);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [answerQuery]);

  return {
    answerState,
    setAnswerState,
    answerQuery,
    setAnswerQuery,
  };
}
