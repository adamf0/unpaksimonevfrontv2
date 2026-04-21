"use client";

import { useEffect, useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  eachDayOfInterval,
  format,
  isValid,
  isWithinInterval,
  parseISO,
} from "date-fns";

import { id } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { useQuestionBankContext } from "../Context/QuestionBankProvider";
import { useAdminPanel } from "../../Common/Components/Template/AdminPanelTemplate";
import { useToast } from "../../Common/Context/ToastContext";

import apiCall from "../../Common/External/APICall";
import { clipCreatedBy } from "../../Common/Service/clipData";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { ScheduleItem } from "../Attribut/ScheduleItem";

/* =========================================================
COMPONENT
========================================================= */

export function BankSoalTimeForm() {
  const {
    state,
    loadData,
    setOpenTime,
  } = useQuestionBankContext();

  const { userProfile } =
    useAdminPanel();

  const { pushToast } =
    useToast();

  const [month, setMonth] =
    useState(new Date());

  const [selectedRange, setSelectedRange] =
    useState<
      DateRange | undefined
    >();

  const [errorMessage, setErrorMessage] =
    useState("");

  const [selectedData, setSelectedData] =
    useState(state.selected);

  const today = new Date();

  /* =========================================================
  WATCH SELECTED DATA
  ========================================================= */

  useEffect(() => {
    setSelectedData(
      state.selected
    );
  }, [state.selected]);

  /* =========================================================
  HELPERS
  ========================================================= */

  const showApiError = (
    error: any
  ) => {
    if (!error?.response) {
      pushToast("Server error");
      return;
    }

    const { status, data } =
      error.response;

    const cloudflareMessage =
      handleCloudflareError(
        status
      );

    if (cloudflareMessage) {
      pushToast(
        cloudflareMessage
      );
      return;
    }

    pushToast(
      data?.message ||
        "Error"
    );
  };

  const convertToDateString = (
    value: any
  ): string => {
    if (!value) return "";

    if (
      typeof value ===
      "string"
    ) {
      return value;
    }

    if (
      value instanceof Date
    ) {
      return format(
        value,
        "yyyy-MM-dd HH:mm:ss"
      );
    }

    if (
      typeof value ===
        "object" &&
      "value" in value
    ) {
      return convertToDateString(
        value.value
      );
    }

    return "";
  };

  const parseDate = (
    value: any
  ): Date | null => {
    if (!value) return null;

    if (
      value instanceof Date
    ) {
      return isValid(value)
        ? value
        : null;
    }

    const raw =
      convertToDateString(
        value
      );

    if (!raw) return null;

    const normalized =
      raw.includes(" ") &&
      !raw.includes("T")
        ? raw.replace(
            " ",
            "T"
          )
        : raw;

    const date =
      parseISO(
        normalized
      );

    return isValid(date)
      ? date
      : null;
  };

  const formatDateOnly = (
    date: Date
  ) =>
    format(
      date,
      "yyyy-MM-dd"
    );

  const formatDisplayDate = (
    date: Date
  ) =>
    format(
      date,
      "dd MMM yyyy",
      {
        locale: id,
      }
    );

  /* =========================================================
  BUILD DATA
  ========================================================= */

  const scheduleList: ScheduleItem[] =
    useMemo(() => {
      const rows: ScheduleItem[] =
        [];

      const mainStart =
        selectedData?.tanggalmulai;

      const mainEnd =
        selectedData?.tanggalakhir;

      if (
        mainStart &&
        mainEnd
      ) {
        rows.push({
          id:
            selectedData?.uuid ??
            "main-row",

          startDate:
            convertToDateString(
              mainStart
            ),

          endDate:
            convertToDateString(
              mainEnd
            ),

          createdBy:
            selectedData?.createdby ??
            "-",

          createdByRef:
            String(
              selectedData?.createdbyref ??
                ""
            ),

          canDelete:
            String(
              selectedData?.createdbyref ??
                ""
            ) ===
            String(
              userProfile?.ID ??
                ""
            ),

          isExtend: false,
        });
      }

      const extraList =
        selectedData?.listextend ??
        [];

      extraList.forEach(
        (
          item: any,
          index: number
        ) => {
          rows.push({
            id:
              item.UUID ??
              `row-${index}`,

            startDate:
              convertToDateString(
                item.TanggalMulai
              ),

            endDate:
              convertToDateString(
                item.TanggalAkhir
              ),

            createdBy:
              item.CreatedBy ??
              "-",

            createdByRef:
              item.CreatedByRef,

            canDelete:
              String(
                item.CreatedByRef
              ) ===
              String(
                userProfile?.ID ??
                  ""
              ),

            isExtend: true,
          });
        }
      );

      return rows;
    }, [
      selectedData,
      userProfile,
    ]);

  /* =========================================================
  CALENDAR BOOKED DATE
  ========================================================= */

  const bookedDates =
    useMemo(() => {
      const dates: Date[] =
        [];

      scheduleList.forEach(
        (item) => {
          const start =
            parseDate(
              item.startDate
            );

          const end =
            parseDate(
              item.endDate
            );

          if (
            !start ||
            !end
          )
            return;

          dates.push(
            ...eachDayOfInterval(
              {
                start,
                end,
              }
            )
          );
        }
      );

      return dates;
    }, [scheduleList]);

  /* =========================================================
  VALIDATION
  ========================================================= */

  const isDateOverlap = (
    startDate: string,
    endDate: string
  ) => {
    return scheduleList.some(
      (item) => {
        const oldStart =
          parseDate(
            item.startDate
          );

        const oldEnd =
          parseDate(
            item.endDate
          );

        if (
          !oldStart ||
          !oldEnd
        ) {
          return false;
        }

        const start =
          formatDateOnly(
            oldStart
          );

        const end =
          formatDateOnly(
            oldEnd
          );

        return !(
          endDate <
            start ||
          startDate >
            end
        );
      }
    );
  };

  /* =========================================================
  ACTION ADD
  ========================================================= */

  const addSchedule =
    async () => {
      if (
        !selectedRange?.from ||
        !selectedRange?.to
      ) {
        setErrorMessage(
          "Pilih tanggal mulai dan selesai"
        );
        return;
      }

      const startDate =
        formatDateOnly(
          selectedRange.from
        );

      const endDate =
        formatDateOnly(
          selectedRange.to
        );

      if (
        isDateOverlap(
          startDate,
          endDate
        )
      ) {
        setErrorMessage(
          "Jadwal bertabrakan"
        );
        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "tanggal_mulai",
          startDate
        );

        formData.append(
          "tanggal_akhir",
          endDate
        );

        await apiCall.put(
          `/banksoal/${selectedData?.uuid}/schedule`,
          formData
        );

        await loadData();

        setOpenTime(
          false
        );

        setSelectedRange(
          undefined
        );

        setErrorMessage(
          ""
        );
      } catch (error) {
        showApiError(
          error
        );
      }
    };

  /* =========================================================
  ACTION DELETE
  ========================================================= */

  const deleteSchedule =
    async (
      item: ScheduleItem
    ) => {
      try {
        if (
          item.isExtend
        ) {
          const formData =
            new FormData();

          formData.append(
            "banksoal",
            selectedData?.uuid
          );

          await apiCall.delete(
            `/banksoal/${item.id}/timeext`,
            {
              data: formData,
            }
          );
        } else {
          await apiCall.delete(
            `/banksoal/${item.id}/time`
          );
        }

        await loadData();

        setOpenTime(
          false
        );
      } catch (error) {
        showApiError(
          error
        );
      }
    };

  /* =========================================================
  RENDER
  ========================================================= */

  return (
    <div className="flex flex-col gap-5">
      {/* CALENDAR */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center">
            Atur Jadwal Bank
            Soal
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          <Calendar
            mode="range"
            selected={
              selectedRange
            }
            onSelect={(
              value
            ) => {
              setSelectedRange(
                value
              );
              setErrorMessage(
                ""
              );
            }}
            month={month}
            onMonthChange={
              setMonth
            }
            locale={id}
            modifiers={{
              booked:
                bookedDates,
            }}
            modifiersClassNames={{
              booked:
                "bg-primary text-white",
            }}
          />

          <div className="text-center text-sm text-muted-foreground">
            {selectedRange
              ?.from &&
            selectedRange?.to
              ? `${formatDisplayDate(
                  selectedRange.from
                )} - ${formatDisplayDate(
                  selectedRange.to
                )}`
              : "Pilih range tanggal"}
          </div>

          {errorMessage && (
            <p className="text-center text-sm text-red-500">
              {
                errorMessage
              }
            </p>
          )}

          <Button
            type="button"
            className="w-full"
            onClick={
              addSchedule
            }
          >
            Tambahkan
            Jadwal
          </Button>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>
            Jadwal
            Tersimpan
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {scheduleList.length ===
            0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada
              jadwal
            </p>
          )}

          {scheduleList.map(
            (item) => {
              const start =
                parseDate(
                  item.startDate
                );

              const end =
                parseDate(
                  item.endDate
                );

              if (
                !start ||
                !end
              )
                return null;

              const isActive =
                isWithinInterval(
                  today,
                  {
                    start,
                    end,
                  }
                );

              return (
                <div
                  key={
                    item.id
                  }
                  className="rounded-xl border p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {formatDisplayDate(
                          start
                        )}{" "}
                        s/d{" "}
                        {formatDisplayDate(
                          end
                        )}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {item.canDelete
                          ? `${clipCreatedBy(item)} (pemilik)`
                          : clipCreatedBy(
                              item
                            )}
                      </p>
                    </div>

                    <Badge variant="default">
                      {isActive
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </Badge>
                  </div>

                  {item.canDelete && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteSchedule(
                          item
                        )
                      }
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              );
            }
          )}
        </CardContent>
      </Card>
    </div>
  );
}