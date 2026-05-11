"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { TemplatePertanyaanWithAnswareDefault } from "../Attribut/TemplatePertanyaanWithAnswareDefault";
import { TemplateJawabanDefault } from "../Attribut/TemplateJawabanDefault";
import { isEmpty } from "../../Common/Service/utility";

/* =========================================================
   TYPES
========================================================= */

type TemplatePreviewContextType = {
  loading: boolean;

  previewData: TemplatePertanyaanWithAnswareDefault[];

  setPreviewData: React.Dispatch<
    React.SetStateAction<TemplatePertanyaanWithAnswareDefault[]>
  >;

  loadPreview: (
    uuidBankSoal?: string|null,
  ) => Promise<TemplatePertanyaanWithAnswareDefault[]>;
};

/* =========================================================
   CONTEXT
========================================================= */

const TemplatePreviewContext =
  createContext<TemplatePreviewContextType | null>(null);

/* =========================================================
   PROVIDER
========================================================= */

export function TemplatePreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);

  const [previewData, setPreviewData] = useState<
    TemplatePertanyaanWithAnswareDefault[]
  >([]);

  /**
   * prevent duplicate request
   */
  const loadingRef = useRef(false);

  /* =========================================================
     SSE HELPER
  ========================================================= */

  function loadSSE<T = any>(url: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const es = new EventSource(url);

      let tempData: T[] = [];

      es.onmessage = (event) => {
        const val = event.data;

        /**
         * START
         */
        if (val === "start") {
          tempData = [];

          return;
        }

        /**
         * DONE
         */
        if (val === "done") {
          es.close();

          resolve(tempData);

          return;
        }

        /**
         * PUSH DATA
         */
        try {
          const parsed = JSON.parse(val);

          tempData.push(parsed);
        } catch (err) {
          console.error("PARSE ERROR", err);
        }
      };

      es.onerror = (err) => {
        console.error("SSE ERROR", err);

        es.close();

        reject(err);
      };
    });
  }

  /* =========================================================
     LOAD PREVIEW
  ========================================================= */

  const loadPreview = useCallback(
    async (uuidBankSoal?: string|null) => {
      console.log(`◉ uuidBankSoal: ${uuidBankSoal}`)

      if (loadingRef.current) return [];

      try {
        loadingRef.current = true;

        setLoading(true);

        if(isEmpty(uuidBankSoal)){
            setPreviewData([]);
            return [];
        }
        /**
         * STEP 1
         * LOAD PERTANYAAN
         */
        const pertanyaanList = await loadSSE<any>(
          `${BASE_URL}/templatepertanyaans?mode=sse&ctxtoken=${sessionStorage.getItem(
            "access_token",
          )}&filters=uuidbanksoal:eq:${uuidBankSoal}`,
        );

        if (!pertanyaanList.length) {
          setPreviewData([]);

          return [];
        }

        /**
         * STEP 2
         * LOAD JAWABAN PARALEL
         */
        const jawabanResults = await Promise.all(
          pertanyaanList.map(async (pertanyaan: any) => {
            const jawabanList = await loadSSE<TemplateJawabanDefault>(
              `${BASE_URL}/templatejawabans?mode=sse&ctxtoken=${sessionStorage.getItem(
                "access_token",
              )}&filters=uuidtemplate:eq:${pertanyaan.UUID}`,
            );

            return {
              uuid: pertanyaan.UUID,
              jawabanList,
            };
          }),
        );

        /**
         * STEP 3
         * MAP JAWABAN
         */
        const jawabanMap: Record<
          string,
          TemplateJawabanDefault[]
        > = {};

        for (const item of jawabanResults) {
          jawabanMap[item.uuid] = item.jawabanList || [];
        }

        /**
         * STEP 4
         * MERGE
         */
        const result: TemplatePertanyaanWithAnswareDefault[] =
          pertanyaanList.map((item: any) => ({
            ...item,

            ListJawaban: jawabanMap[item.UUID] || [],
          }));

        setPreviewData(result);

        return result;
      } catch (err) {
        console.error("LOAD ERROR", err);

        return [];
      } finally {
        loadingRef.current = false;

        setLoading(false);
      }
    },
    [BASE_URL],
  );

  return (
    <TemplatePreviewContext.Provider
      value={{
        loading,
        previewData,

        setPreviewData,

        loadPreview,
      }}
    >
      {children}
    </TemplatePreviewContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useTemplatePreview() {
  const ctx = useContext(TemplatePreviewContext);

  if (!ctx) {
    throw new Error(
      "useTemplatePreview must be used inside TemplatePreviewProvider",
    );
  }

  return ctx;
}