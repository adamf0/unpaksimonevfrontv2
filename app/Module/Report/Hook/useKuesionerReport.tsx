"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Payload } from "../Attribut/Payload";
import { KuesionerResult } from "../Attribut/KuesionerResult";
import { ReportSummaryData } from "../Attribut/ReportSummaryTypes";
import { fetchAllReportSummaries } from "../Service/fetchReportSummary";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { useToast } from "../../Common/Context/ToastContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ModeDemo = process.env.NEXT_PUBLIC_DEMO == "1";

type OptionBank = { value: string; label: string };

type QueryState = {
  kode_fakultas: string | null;
  nama_fakultas: string | null;
  kode_prodi: string | null;
  nama_prodi: string | null;

  bankSoal: OptionBank[];
};

export function useKuesionerReport() {
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null,
  );
  const controllerRef = useRef<AbortController | null>(null);
  const esFakultasRef = useRef<EventSource | null>(null);
  const esProdiRef = useRef<EventSource | null>(null);

  const [data, setData] = useState<KuesionerResult[]>([]);
  const [dataDetail, setDataDetail] = useState<KuesionerResult[]>([]);
  const [dataBankSoal, setDataBankSoal] = useState<any[]>([]);
  const [dataFakultas, setDataFakultas] = useState<any[]>([]);
  const [dataProdi, setDataProdi] = useState<any[]>([]);
  const [dataTemplate, setDataTemplate] = useState<any[]>([]);

  const [errdata, setErrData] = useState<string | null>(null);
  const [errdataDetail, setErrDataDetail] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingBankSoal, setLoadingBankSoal] = useState(false);
  const [loadingFakultas, setLoadingFakultas] = useState(false);
  const [loadingProdi, setLoadingProdi] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const [summaryData, setSummaryData] = useState<ReportSummaryData | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  async function loadSummary(judul: string) {
    setLoadingSummary(true);
    const res = await fetchAllReportSummaries(judul);
    setSummaryData(res);
    setLoadingSummary(false);
    return res;
  }

  const [open, setOpen] = useState(false);

  const { pushToast } = useToast();

  const [query, setQuery] = useState<QueryState>({
    kode_fakultas: null,
    nama_fakultas: null,
    kode_prodi: null,
    nama_prodi: null,
    bankSoal: [],
  });

  const openFilter = () => setOpen(true);
  const closeFilter = () => setOpen(false);

  // =========================
  // FETCH MAIN DATA
  // =========================
  async function loadData() {
    setLoading(true);
    setErrData(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch(`${BASE_URL}/kuesioners/report_year`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token") || ""}`,
        },
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Server error");

      const json = await res.json();
      const list = json.data || json || [];

      setSummaryData((prev) => ({
        overview: prev?.overview || {
          id: 0,
          judul: "",
          semester: "",
          total_responden: 0,
          total_jawaban: 0,
          rata_rata_rating: 0,
        },
        distribusi_fakultas: prev?.distribusi_fakultas || [],
        top_questions: prev?.top_questions || [],
        kategori_summary: prev?.kategori_summary || [],
        report_year: Array.isArray(list) ? list : [],
      }));
    } catch (error: any) {
      if (error.name !== "AbortError") {
        setErrData("Server error");
      }
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // FETCH DETAIL DATA
  // =========================
  async function loadDataDetail(payloads: Payload[]) {
    setLoadingDetail(true);
    setErrDataDetail(null);
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        process.env.NODE_ENV === "test" ? 0 : 1000,
      ),
    );

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const random = Math.floor(Math.random() * 3);
      if (ModeDemo && random % 2 === 0) {
        throw new Error("Simulasi error random (genap)");
      }

      const results = await Promise.all(
        payloads.map(async (payload) => {
          const formData = new FormData();

          formData.append("judul", payload.judul);
          // formData.append("semester", payload.semester);
          formData.append("is4year", payload.is4year);

          const res = await fetch(`${BASE_URL}/kuesioners/report`, {
            method: "POST",
            headers: {
              Accept: "text/event-stream",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
            body: formData,
          });

          if (!res.ok || !res.body) {
            throw new Error("Network error");
          }

          const reader = res.body.getReader();

          const decoder = new TextDecoder("utf-8");

          let buffer = "";
          let temp: KuesionerResult[] = [];

          while (true) {
            const { value, done } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const chunks = buffer.split("\n\n");

            buffer = chunks.pop() || "";

            for (const chunk of chunks) {
              const line = chunk.trim();

              if (!line.startsWith("data:")) continue;

              const val = line.replace("data:", "").trim();

              if (val === "start") {
                temp = [];
                continue;
              }

              if (val === "done") {
                return temp;
              }

              try {
                temp.push(JSON.parse(val));
              } catch {}
            }
          }

          return temp;
        }),
      );

      const merged = results.flat();

      setDataDetail(merged);
    } catch (error: any) {
      if (!error.response) return setErrDataDetail("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return setErrDataDetail(cf);

      setErrDataDetail(data?.message || "Error");
    } finally {
      setLoadingDetail(false);
    }
  }

  // =========================
  // BANK SOAL
  // =========================
  async function loadBankSoal() {
    setLoadingBankSoal(true);

    try {
      const res = await fetch(`${BASE_URL}/banksoals?mode=sse`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      readerRef.current = reader;

      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let temp: any[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;

          const val = line.replace("data:", "").trim();

          if (val === "start") {
            temp = [];
            continue;
          }

          if (val === "done") {
            setDataBankSoal(temp);
            setLoadingBankSoal(false);
            return;
          }

          try {
            temp.push(JSON.parse(val));
          } catch {}
        }

        setDataBankSoal([...temp]);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoadingBankSoal(false);
    }
  }

  // =========================
  // Template SOAL
  // =========================
  async function loadTemplateSoal(uuidbanksoals: string[]) {
    console.log("panggil", uuidbanksoals);
    setLoadingTemplate(true);

    try {
      const results = await Promise.all(
        uuidbanksoals.map(async (uuidbanksoal) => {
          const res = await fetch(
            `${BASE_URL}/templatepertanyaan/${uuidbanksoal}/banksoal`,
            {
              method: "GET",
              headers: {
                Accept: "text/event-stream",
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access_token",
                )}`,
              },
            },
          );

          if (!res.ok || !res.body) {
            throw new Error("Network error");
          }

          const reader = res.body.getReader();

          const decoder = new TextDecoder("utf-8");

          let buffer = "";

          let temp: any[] = [];

          while (true) {
            const { value, done } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const chunks = buffer.split("\n\n");

            buffer = chunks.pop() || "";

            for (const chunk of chunks) {
              const line = chunk.trim();

              if (!line.startsWith("data:")) continue;

              const val = line.replace("data:", "").trim();

              if (val === "start") {
                temp = [];
                continue;
              }

              if (val === "done") {
                return temp;
              }

              try {
                temp.push(JSON.parse(val));
              } catch {}
            }
          }

          return temp;
        }),
      );

      const merged = results
        .flat()
        .filter(
          (item, index, self) =>
            index === self.findIndex((x) => x.UUID === item.UUID),
        );

      setDataTemplate(merged);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoadingTemplate(false);
    }
  }

  /** =========================
   * GENERIC SSE LOADER
   * ========================= */
  function loadSSE(
    url: string,
    ref: React.MutableRefObject<EventSource | null>,
    sourceKey: "dataFakultas" | "dataProdi",
    loadingKey: "loadingFakultas" | "loadingProdi",
  ) {
    if (ref.current) return;

    if (loadingKey === "loadingFakultas") setLoadingFakultas(true);
    if (loadingKey === "loadingProdi") setLoadingProdi(true);

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
        if (sourceKey === "dataFakultas") setDataFakultas(tempData);
        if (sourceKey === "dataProdi") setDataProdi(tempData);

        if (loadingKey === "loadingFakultas") setLoadingFakultas(false);
        if (loadingKey === "loadingProdi") setLoadingProdi(false);

        es.close();
        ref.current = null;
        return;
      }

      try {
        tempData.push(JSON.parse(val));

        if (sourceKey === "dataFakultas") {
          setDataFakultas([...tempData]);
        }

        if (sourceKey === "dataProdi") {
          setDataProdi([...tempData]);
        }
      } catch {}
    };

    es.onerror = () => {
      pushToast("SSE connection error");

      if (loadingKey === "loadingFakultas") setLoadingFakultas(false);
      if (loadingKey === "loadingProdi") setLoadingProdi(false);

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
      "dataFakultas",
      "loadingFakultas",
    );
  }

  function loadDataProdi() {
    loadSSE(
      `${BASE_URL}/prodis?mode=sse&ctxtoken=${sessionStorage.getItem(
        "access_token",
      )}`,
      esProdiRef,
      "dataProdi",
      "loadingProdi",
    );
  }

  // =========================
  // DERIVED DATA
  // =========================

  const filteredDetail = useMemo(() => {
    return dataDetail.filter((item) => {
      const matchFakultas =
        !query.kode_fakultas ||
        String(item.KodeFakultas) === String(query.kode_fakultas);

      const matchProdi =
        !query.kode_prodi ||
        String(item.KodeProdi) === String(query.kode_prodi);

      return matchFakultas && matchProdi;
    });
  }, [dataDetail, query]);

  const topQuestions = useMemo(() => {
    if (summaryData?.top_questions?.length) {
      return summaryData.top_questions.map((q: any) => ({
        title: q.pertanyaan,
        category: q.nama_kategori,
        score: Number(((q.rata_rata_skor / 5) * 10).toFixed(1)),
      }));
    }

    const map: Record<string, any> = {};

    for (const item of filteredDetail) {
      const key = `${item.Pertanyaan}||${item.FullPath}`;

      if (!map[key]) {
        map[key] = {
          total: 0,
          count: 0,
          category: item.FullPath,
          title: item.Pertanyaan,
        };
      }

      const score = Number(item.Jawaban);
      if (!isNaN(score)) {
        map[key].total += score;
        map[key].count += 1;
      }
    }

    return Object.values(map).map((val: any) => {
      const avg = val.count ? val.total / val.count : 0;
      return {
        title: val.title,
        category: val.category,
        score: Number(((avg / 5) * 10).toFixed(1)),
      };
    });
  }, [summaryData, filteredDetail]);

  const yearlyStats = useMemo(() => {
    if (summaryData?.report_year?.length) {
      return summaryData.report_year.map((ry: any) => ({
        year: ry.tahun,
        mahasiswa: ry.total_mahasiswa,
        dosen: ry.total_dosen,
        tendik: ry.total_tendik,
      }));
    }

    const map: Record<string, any> = {};

    for (const item of data) {
      const year = String(item.Semester).slice(0, 4);

      if (!map[year]) {
        map[year] = {
          mahasiswa: new Set(),
          dosen: new Set(),
          tendik: new Set(),
        };
      }

      if (item.NPM) map[year].mahasiswa.add(item.NPM);
      if (item.NIDN) map[year].dosen.add(item.NIDN);
      if (item.NIP) map[year].tendik.add(item.NIP);
    }

    return Object.entries(map).map(([year, val]: any) => ({
      year,
      mahasiswa: val.mahasiswa.size,
      dosen: val.dosen.size,
      tendik: val.tendik.size,
    }));
  }, [summaryData, data]);

  const facultyStats = useMemo(() => {
    if (summaryData?.distribusi_fakultas?.length) {
      return summaryData.distribusi_fakultas.map((f: any) => {
        let prodiArr: any[] = [];
        try {
          if (typeof f.prodi_distribution === "string") {
            prodiArr = JSON.parse(f.prodi_distribution);
          } else if (Array.isArray(f.prodi_distribution)) {
            prodiArr = f.prodi_distribution;
          }
        } catch {}

        if (!prodiArr.length) {
          prodiArr = [
            {
              title: f.nama_fakultas,
              total: f.total_responden,
            },
          ];
        }

        return {
          title: f.nama_fakultas,
          data: prodiArr,
        };
      });
    }

    const map: Record<string, any> = {};

    for (const item of filteredDetail) {
      const f = item.Fakultas;
      const p = item.Prodi;

      if (!map[f]) map[f] = {};
      if (!map[f][p]) map[f][p] = new Set();

      const id = item.NPM || item.NIDN || item.NIP;
      if (id) map[f][p].add(id);
    }

    return Object.entries(map).map(([faculty, prodiMap]: any) => ({
      title: faculty,
      data: Object.entries(prodiMap).map(([prodi, users]: any) => ({
        title: prodi,
        total: users.size,
      })),
    }));
  }, [summaryData, filteredDetail]);

  const groupedByFullPath = useMemo(() => {
    if (summaryData?.kategori_summary?.length) {
      return summaryData.kategori_summary.map((kat: any) => {
        let qList: any[] = [];
        try {
          if (typeof kat.questions_json === "string") {
            qList = JSON.parse(kat.questions_json);
          } else if (Array.isArray(kat.questions_json)) {
            qList = kat.questions_json;
          }
        } catch {}

        let pertanyaan: any[] = [];

        if (qList.length) {
          pertanyaan = qList.map((q: any) => ({
            title: q.title,
            jenispilihan: q.jenispilihan || "rating",
            jawaban: Object.entries(q.chart_distribution || {}).map(([label, total]) => ({
              label,
              total,
            })),
          }));
        } else {
          let chartMap: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
          try {
            if (typeof kat.chart_distribution === "string") {
              chartMap = JSON.parse(kat.chart_distribution);
            } else if (kat.chart_distribution) {
              chartMap = kat.chart_distribution as Record<string, number>;
            }
          } catch {}

          const jawaban = Object.entries(chartMap).map(([label, total]) => ({
            label,
            total,
          }));

          pertanyaan = [
            {
              title: kat.nama_kategori,
              jenispilihan: "rating",
              jawaban,
            },
          ];
        }

        return {
          fullPath: kat.full_text || kat.nama_kategori,
          pertanyaan,
        };
      });
    }

    if (!filteredDetail.length || !dataTemplate.length) return [];

    type AnswerAgg = {
      count: Record<string, number>;
      data: Record<string, any[]>;
    };

    const answerMap: Record<string, AnswerAgg> = {};

    for (const item of filteredDetail) {
      const key = `${item.FullPath}||${item.Pertanyaan}`;

      if (!answerMap[key]) {
        answerMap[key] = {
          count: {},
          data: {},
        };
      }

      const value = item.Jawaban || item.FreeText;

      if (!value) continue;

      answerMap[key].count[value] = (answerMap[key].count[value] || 0) + 1;

      if (!answerMap[key].data[value]) {
        answerMap[key].data[value] = [];
      }

      answerMap[key].data[value].push(item);
    }

    const map: Record<string, any> = {};

    for (const t of dataTemplate) {
      const fullPath = t.FullPath || "-";

      const questionKey = `${fullPath}||${t.Pertanyaan}`;

      if (!map[fullPath]) {
        map[fullPath] = {
          fullPath,
          pertanyaan: [],
        };
      }

      const existingQuestion = map[fullPath].pertanyaan.find(
        (x: any) => x.title === t.Pertanyaan,
      );

      if (existingQuestion) continue;

      const agg = answerMap[questionKey];

      let jawaban: any[] = [];

      if (agg) {
        jawaban = Object.entries(agg.count).map(([label, total]) => ({
          label,
          total,
          data: agg.data[label] || [],
        }));
      }

      map[fullPath].pertanyaan.push({
        title: t.Pertanyaan,
        jenispilihan: t.JenisPilihan,
        jawaban,
      });
    }

    return Object.values(map);
  }, [summaryData, filteredDetail, dataTemplate]);

  const resetFilters = () => {
    setQuery({
      kode_fakultas: null,
      nama_fakultas: null,
      kode_prodi: null,
      nama_prodi: null,
      bankSoal: [],
    });
  };

  useEffect(() => {
    loadDataFakultas();
    loadDataProdi();
    loadData();
    loadBankSoal();

    return () => {
      esFakultasRef.current?.close();
      esFakultasRef.current = null;

      esProdiRef.current?.close();
      esProdiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!query.bankSoal?.length) return;

    loadTemplateSoal(query.bankSoal.map((item) => item.value));
  }, [query.bankSoal]);

  function resetDataDetail(){
    setDataDetail([]);
  }

  return {
    data,
    dataDetail,
    dataBankSoal,
    dataFakultas,
    dataProdi,
    dataTemplate,

    loading,
    loadingDetail,
    loadingBankSoal,
    loadingFakultas,
    loadingProdi,
    loadingTemplate,

    loadData,
    loadDataDetail,
    loadBankSoal,
    loadDataFakultas,
    loadDataProdi,
    loadTemplateSoal,

    errdata,
    errdataDetail,

    topQuestions,
    yearlyStats,
    facultyStats,
    groupedByFullPath,

    open,
    setOpen,
    openFilter,
    closeFilter,
    query,
    setQuery,
    resetFilters,
    resetDataDetail,

    filteredDetail,

    summaryData,
    loadingSummary,
    loadSummary,
  };
}
