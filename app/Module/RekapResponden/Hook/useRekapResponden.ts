"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Option } from "../../Common/Components/Attribut/Option";
import { adaptSelectOptionsMerge } from "../../Common/Adapter/adaptSelectOptionsMerge";
import { RekapRespondenItem } from "../Attribut/RekapRespondenTypes";
import { isRespondentInUserScope } from "../Service/RekapScopeFilter";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useRekapResponden() {
  const [bankSoalOptions, setBankSoalOptions] = useState<Option[]>([]);
  const [selectedBankSoal, setSelectedBankSoal] = useState<Option | null>(null);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [respondents, setRespondents] = useState<RekapRespondenItem[]>([]);
  const [loadingBankSoal, setLoadingBankSoal] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const esBankSoalRef = useRef<EventSource | null>(null);

  /** =========================
   * LOAD LOGGED-IN USER PROFILE (whoami)
   * ========================= */
  const loadUserProfile = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("access_token") || "";
      const res = await fetch(`${BASE_URL}/whoami`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error("loadUserProfile error:", e);
    }
  }, []);

  /** =========================
   * LOAD BANK SOAL OPTIONS
   * ========================= */
  const loadBankSoalOptions = useCallback(() => {
    if (esBankSoalRef.current) return;
    setLoadingBankSoal(true);

    const token = sessionStorage.getItem("access_token") || "";
    const es = new EventSource(
      `${BASE_URL}/banksoals?mode=sse&ctxtoken=${sessionStorage.getItem(
        "access_token",
      )}`,
    );
    esBankSoalRef.current = es;

    let temp: any[] = [];

    es.onmessage = (event) => {
      const val = event.data;

      if (val === "start") {
        temp = [];
        return;
      }

      if (val === "done") {
        const opts = adaptSelectOptionsMerge(temp, {
          valueKey: "UUID",
          labelKeys: ["Judul"],
        });
        setBankSoalOptions(opts);
        setLoadingBankSoal(false);
        es.close();
        esBankSoalRef.current = null;
        return;
      }

      try {
        temp.push(JSON.parse(val));
      } catch {}
    };

    es.onerror = () => {
      setLoadingBankSoal(false);
      es.close();
      esBankSoalRef.current = null;
    };
  }, []);

  /** =========================
   * FETCH RESPONDENTS (WITH ROLE & ORGANIZATIONAL SCOPE FILTER)
   * ========================= */
  const fetchRespondents = useCallback(async () => {
    if (!selectedBankSoal?.value) {
      setRespondents([]);
      setTotal(0);
      return;
    }

    setLoadingData(true);
    try {
      const token = sessionStorage.getItem("access_token") || "";
      const filterStr = `uuid_bank_soal:eq:${selectedBankSoal.value}`;

      // Mode all or paging to ensure scope filter is applied accurately
      const url = `${BASE_URL}/kuesioners?mode=all&search=${encodeURIComponent(
        search,
      )}&filters=${encodeURIComponent(filterStr)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data rekap responden");

      const json = await res.json();
      const rawList: RekapRespondenItem[] = Array.isArray(json)
        ? json
        : json.data || json.Data || [];

      // Filter respondents based on logged-in user's role & faculty/prodi scope
      const scopedList = userProfile
        ? rawList.filter((item) => isRespondentInUserScope(item, userProfile))
        : rawList;

      // Local Pagination for scoped list
      const startIndex = (page - 1) * limit;
      const paginatedList = scopedList.slice(startIndex, startIndex + limit);

      setRespondents(paginatedList);
      setTotal(scopedList.length);
    } catch (err) {
      console.error("fetchRespondents error:", err);
      setRespondents([]);
      setTotal(0);
    } finally {
      setLoadingData(false);
    }
  }, [selectedBankSoal, page, limit, search, userProfile]);

  useEffect(() => {
    loadUserProfile();
    loadBankSoalOptions();

    return () => {
      esBankSoalRef.current?.close();
      esBankSoalRef.current = null;
    };
  }, [loadUserProfile, loadBankSoalOptions]);

  useEffect(() => {
    fetchRespondents();
  }, [fetchRespondents]);

  const handleSelectBankSoal = (opt: Option | null) => {
    setSelectedBankSoal(opt);
    setPage(1);
  };

  return {
    bankSoalOptions,
    selectedBankSoal,
    setSelectedBankSoal: handleSelectBankSoal,

    userProfile,
    respondents,
    loadingBankSoal,
    loadingData,

    page,
    setPage,
    limit,
    setLimit,
    total,
    search,
    setSearch,

    refresh: fetchRespondents,
  };
}
