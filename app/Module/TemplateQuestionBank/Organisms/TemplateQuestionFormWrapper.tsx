"use client";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CreateTemplateForm } from "../Organisms/CreateTemplateForm";
import CreateTemplateChoiceForm from "../Organisms/CreateTemplateChoiceForm";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";
import apiCall from "../../Common/External/APICall";
import { useToast } from "../../Common/Context/ToastContext";
import { useEffect } from "react";
import { useTemplateAnswer } from "../Hook/useTemplateAnswer";

export type ChoiceOption = {
  value?: number;
  label: string;
  payload?: any;
};

export type FormValues = {
  banksoal: { label: string; value: string } | null;
  kategori: { label: string; value: string } | null;
  tipepilihan: { label: string; value: string } | null;
  bobot: number;
  wajibisi: boolean;
  pertanyaan: string;
  options: ChoiceOption[];
};

const DEFAULT_VALUES: FormValues = {
  banksoal: null,
  kategori: null,
  tipepilihan: null,
  bobot: 1,
  wajibisi: true,
  pertanyaan: "",
  options: [],
};

const EMPTY_VALUES: FormValues = {
  banksoal: null,
  kategori: null,
  tipepilihan: null,
  bobot: 1,
  wajibisi: true,
  pertanyaan: "",
  options: [],
};

export default function TemplateQuestionFormWrapper() {
  const { pushToast } = useToast();
  const { queryQuestion, setQueryQuestion, stateQuestion, setStateQuestion } =
    useTemplateQuestionContext();

  const { state: answerState } = useTemplateAnswer();

  const methods = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  /** 🔥 RESET FORM SAAT EDIT */
  useEffect(() => {
    if (!stateQuestion.selected) return;

    const s = stateQuestion.selected;
    // console.log(s)

    const banksoalObj = queryQuestion?.banksoal;

    methods.reset({
      banksoal: banksoalObj,
      kategori: s.kategori?.uuid
        ? {
            label: s.kategori?.kategori,
            value: s.kategori?.uuid,
          }
        : null,
      tipepilihan: s.tipe
        ? {
            label: s.tipe,
            value: s.tipe,
          }
        : null,
      bobot: s.bobot ?? 1,
      wajibisi: s.require ?? true,
      pertanyaan: s.judul ?? "",
      options: [], // kosong dulu
    });
  }, [stateQuestion.selected]);

  /** 🔥 INJECT JAWABAN KE FIELD ARRAY */
  useEffect(() => {
    if (!answerState.data) return;

    const mapped = answerState.data.map((item: any) => {
      return {
        value: item.UUID,
        label: item.Jawaban,
        payload: item,
      };
    });

    methods.setValue("options", mapped);
  }, [answerState.data]);

  const createTemplatePertanyaan = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("bank_soal", data.banksoal?.value ?? "");
    formData.append("kategori", data.kategori?.value ?? "");
    formData.append("jenis_pilihan", data.tipepilihan?.value ?? "");
    formData.append("bobot", data.bobot.toString());
    formData.append("required", data.wajibisi ? "1" : "0");
    formData.append("pertanyaan", data.pertanyaan);

    const res = await apiCall.post("/templatepertanyaan", formData);

    return res.data?.uuid;
  };

  const createRatingOptions = async (uuidtemplate: string) => {
    const token = sessionStorage.getItem("access_token");

    const requests = Array.from({ length: 5 }, async (_, i) => {
      const value = i + 1;

      const fd = new FormData();
      fd.append("template_pertanyaan", uuidtemplate);
      fd.append("jawaban", value.toString());
      fd.append("nilai", value.toString());
      fd.append("isFreeText", "0");

      const res = await apiCall.post("/templatejawaban", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        uuid: res.data?.uuid,
        label: value.toString(),
        payload: {
          UUID: res.data?.uuid,
          Jawaban: value.toString(),
          Nilai: value,
          IsFreeText: 0,
        },
      };
    });

    return Promise.all(requests);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      /** 1. Create Template */
      const uuidtemplate = await createTemplatePertanyaan(data);

      if (!uuidtemplate) {
        throw new Error("UUID template tidak ditemukan");
      }

      /** 2. Handle tipe pilihan */
      if (data.tipepilihan?.value === "rating") {
        const ratingOptions = await createRatingOptions(uuidtemplate);

        // 🔥 inject ke form state
        methods.setValue("options", ratingOptions, {
          shouldDirty: true,
        });
      }

      /** 3. Refresh state */
      setQueryQuestion((prev: any) => ({
        ...prev,
        banksoal: data.banksoal,
      }));

      /** 4. Success */
      pushToast("Berhasil");
      methods.reset({
        ...DEFAULT_VALUES,
        options:
          data.tipepilihan?.value === "rating"
            ? Array.from({ length: 5 }, (_, i) => ({
                label: (i + 1).toString(),
              }))
            : [],
      });
    } catch (err: any) {
      pushToast(err?.response?.data?.message || err.message || "Error");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <CreateTemplateForm />
        <CreateTemplateChoiceForm
          onReset={() => {
            setStateQuestion((prev: any) => {
              console.log("prev:", prev);
              return {
                ...prev,
                data: [],
              };
            });
            setQueryQuestion((prev: any) => {
              console.log("prev:", prev);
              return {
                ...prev,
                banksoal: null,
              };
            });
            methods.reset(EMPTY_VALUES);
          }}
          isEdit={stateQuestion.selected}
        />
      </form>
    </FormProvider>
  );
}
