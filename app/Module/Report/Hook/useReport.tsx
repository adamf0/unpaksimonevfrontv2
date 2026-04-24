"use client";

import { useRef, useState, useMemo } from "react";
import { Payload } from "../Attribut/Payload";
import { KuesionerResult } from "../Attribut/KuesionerResult";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ModeDemo = process.env.NEXT_PUBLIC_DEMO == "1"; 

export function useKuesionerReport() {
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null,
  );
  const controllerRef = useRef<AbortController | null>(null);

  const [data, setData] = useState<KuesionerResult[]>([]);
  const [dataDetail, setDataDetail] = useState<KuesionerResult[]>([]);
  const [dataBankSoal, setDataBankSoal] = useState<any[]>([]);

  const [errdata, setErrData] = useState<string | null>(null);
  const [errdataDetail, setErrDataDetail] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingBankSoal, setLoadingBankSoal] = useState(false);

  // =========================
  // FETCH MAIN DATA
  // =========================
  async function loadData() {
    const payload = { judul: "", semester: "", is4year: "1" };

    setLoading(true);
    setErrData(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // simulasi error
      const random = Math.floor(Math.random() * 3);
      if (ModeDemo && random % 2 === 0) {
        throw new Error("Simulasi error random (genap)");
      }

      const formData = new FormData();
      formData.append("judul", payload.judul);
      formData.append("semester", payload.semester);
      formData.append("is4year", payload.is4year);

      const res = await fetch(`${BASE_URL}/kuesioners/report`, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      readerRef.current = reader;

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
            setData(temp);
            setLoading(false);
            return;
          }

          try {
            temp.push(JSON.parse(val));
          } catch {}
        }

        setData([...temp]);
      }
    } catch (error: any) {
      if (!error.response) return setErrData("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return setErrData(cf);

      setErrData(data?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // FETCH DETAIL DATA
  // =========================
  async function loadDataDetail(payload: Payload) {
    setLoadingDetail(true);
    setErrDataDetail(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const random = Math.floor(Math.random() * 3);
      if (ModeDemo && random % 2 === 0) {
        throw new Error("Simulasi error random (genap)");
      }

      const formData = new FormData();
      formData.append("judul", payload.judul);
      formData.append("semester", payload.semester);
      formData.append("is4year", payload.is4year);

      const res = await fetch(`${BASE_URL}/kuesioners/report`, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      readerRef.current = reader;

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
            setDataDetail(temp);
            setLoadingDetail(false);
            return;
          }

          try {
            temp.push(JSON.parse(val));
          } catch {}
        }

        setDataDetail([...temp]);
      }
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
  // DERIVED DATA
  // =========================

  const topQuestions = useMemo(() => {
    const map: Record<string, any> = {};

    for (const item of dataDetail) {
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
  }, [dataDetail]);

  const yearlyStats = useMemo(() => {
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
  }, [data]);

  const facultyStats = useMemo(() => {
    const map: Record<string, any> = {};

    for (const item of dataDetail) {
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
  }, [dataDetail]);

  const groupedByFullPath = useMemo(() => {
    const map: Record<string, any[]> = {};

    for (const item of dataDetail) {
      const key = item.FullPath || "-";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fullPath, items]) => ({
        fullPath,
        data: items,
      }));
  }, [dataDetail]);

  return {
    data,
    dataDetail,
    dataBankSoal,

    loading,
    loadingDetail,
    loadingBankSoal,

    loadData,
    loadDataDetail,
    loadBankSoal,

    errdata,
    errdataDetail,

    topQuestions,
    yearlyStats,
    facultyStats,
    groupedByFullPath,
  };
}
