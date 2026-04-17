"use client";

import { FormProvider, useForm } from "react-hook-form";
import { CreateTemplateForm } from "../Organisms/CreateTemplateForm";
import CreateTemplateChoiceForm from "../Organisms/CreateTemplateChoiceForm";
import apiCall from "../../Common/External/APICall";
import { useToast } from "../../Common/Context/ToastContext";
import { useEffect } from "react";
import { useTemplateAnswer } from "../Hook/useTemplateAnswer";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";

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
  const { questionQuery, setQuestionQuery, questionState, setQuestionState } =
    useTemplateQuestionContext();

  const { answerState } = useTemplateAnswer();

  const methods = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  /** RESET WHEN SELECTED */
  useEffect(() => {
    if (!questionState.selected) return;

    const s = questionState.selected;

    methods.reset({
      banksoal: questionQuery?.banksoal,
      kategori: s.kategori?.uuid
        ? {
            label: s.kategori.kategori,
            value: s.kategori.uuid,
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
      options: [],
    });
  }, [questionState.selected]);

  /** INJECT ANSWER */
  useEffect(() => {
    if (!answerState.data) return;

    const mapped = answerState.data.map((item: any) => ({
      value: item.UUID,
      label: item.Jawaban,
      payload: item,
    }));

    methods.setValue("options", mapped);
  }, [answerState.data]);

  const createTemplatePertanyaan = async (
    data: FormValues,
    isEdit: boolean,
  ) => {
    if (isEdit) throw new Error("update belum implemen");

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
      const isEditMode = !!questionState.selected;

      const uuid = await createTemplatePertanyaan(data, isEditMode);

      if (!uuid) throw new Error("UUID tidak ditemukan");

      if (data.tipepilihan?.value === "rating" && !isEditMode) {
        const ratingOptions = await createRatingOptions(uuid);

        methods.setValue("options", ratingOptions, {
          shouldDirty: true,
        });
      }

      setQuestionQuery((prev: any) => ({
        ...prev,
        banksoal: data.banksoal,
      }));

      pushToast("Berhasil");
    } catch (error: any) {
      if (!error.response) return pushToast("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return pushToast(cf);

      pushToast(data?.message || "Error");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <CreateTemplateForm />
        <CreateTemplateChoiceForm
          onReset={() => {
            setQuestionState((prev: any) => ({
              ...prev,
              data: [],
            }));

            setQuestionQuery((prev: any) => ({
              ...prev,
              banksoal: null,
            }));

            methods.reset(EMPTY_VALUES);
          }}
          isEdit={!!questionState.selected}
        />
      </form>
    </FormProvider>
  );
}
