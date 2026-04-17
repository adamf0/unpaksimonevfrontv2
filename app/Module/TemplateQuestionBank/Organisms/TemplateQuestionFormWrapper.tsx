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
import { FormValues } from "../Attribut/FormValues";
import { useTemplateAnswerContext } from "../Context/TemplateAnswareProvider";

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
  const {
    questionQuery,
    setQuestionQuery,
    questionState,
    setQuestionState,
    actionQuestion,
  } = useTemplateQuestionContext();

  const { answerState, setAnswerState } = useTemplateAnswerContext();

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

  const getMissingRatingValues = (answers: any[] = []): number[] => {
    const existing = answers
      .map((item) => Number(item?.Nilai ?? item?.payload?.Nilai ?? 0))
      .filter((num) => num >= 1 && num <= 5);

    return Array.from({ length: 5 }, (_, i) => i + 1).filter(
      (num) => !existing.includes(num),
    );
  };

  const createRatingOptions = async (
    uuidtemplate: string,
    missingValues?: number[],
  ) => {
    const token = sessionStorage.getItem("access_token");

    const createValues =
      missingValues && missingValues.length > 0
        ? missingValues
        : Array.from({ length: 5 }, (_, i) => i + 1);

    await Promise.all(
      createValues.map(async (value) => {
        const fd = new FormData();

        fd.append("template_pertanyaan", uuidtemplate);
        fd.append("jawaban", value.toString());
        fd.append("nilai", value.toString());
        fd.append("isFreeText", "0");

        await apiCall.post("/templatejawaban", fd, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }),
    );

    return Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;

      return {
        uuid: `${uuidtemplate}-${value}`,
        label: value.toString(),
        payload: {
          UUID: `${uuidtemplate}-${value}`,
          Jawaban: value.toString(),
          Nilai: value,
          IsFreeText: 0,
        },
      };
    });
  };

  const validateDuplicateRating = (answers: any[] = []): number[] => {
    const values = answers
      .map((item: any) => Number(item?.Nilai ?? item?.payload?.Nilai))
      .filter((num: number) => num >= 1 && num <= 5);

    const duplicates = values.filter(
      (value: number, index: number) => values.indexOf(value) !== index,
    );

    return [...new Set(duplicates)];
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const isEditMode = !!questionState.selected;
      const isRating = data.tipepilihan?.value === "rating";

      if (isEditMode && isRating) {
        const duplicateValues = validateDuplicateRating(answerState.data);

        if (duplicateValues.length > 0) {
          pushToast(
            `Nilai rating duplikat: ${duplicateValues.join(", ")}. Mohon perbaiki dulu.`,
          );
          return;
        }
      }

      const uuid = await actionQuestion(
        questionState?.selected?.uuid,
        data,
        isEditMode ? "edit" : "create",
      );

      if (!uuid) throw new Error("UUID tidak ditemukan");

      if (isRating) {
        let ratingOptions: any[] = [];

        if (!isEditMode) {
          // create baru => generate 1-5 penuh
          ratingOptions = await createRatingOptions(uuid);
        } else {
          // edit => cek nilai yang hilang
          const missingRating = getMissingRatingValues(answerState.data);

          if (missingRating.length > 0) {
            ratingOptions = await createRatingOptions(uuid, missingRating);
          } else {
            // kalau tidak ada yg hilang pakai existing
            ratingOptions = answerState.data.map((item: any) => ({
              uuid: item.UUID,
              label: item.Jawaban,
              payload: item,
            }));
          }
        }

        // sync form
        methods.setValue("options", ratingOptions, {
          shouldDirty: true,
        });

        // sync state
        setAnswerState((prev: any) => ({
          ...prev,
          data: ratingOptions.map((x: any) => x.payload),
        }));
      }

      /** refresh trigger */
      setQuestionQuery((prev: any) => ({
        ...prev,
        banksoal: data.banksoal,
      }));

      pushToast("Berhasil");
    } catch (error: any) {
      console.log(error);

      if (!error.response) {
        pushToast("Server error");
        return;
      }

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) {
        pushToast(cf);
        return;
      }

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
