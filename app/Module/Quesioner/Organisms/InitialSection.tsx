import { cn } from "../../Common/Service/utility";

type Props = {
  summary: {
    admin: number;
    fakultas: number;
    prodi: number;
  };
  onStart: () => void;

  info: {
    title: string;
    year: string;
    semester: string;
    startDate?: string;
    endDate?: string;
    listExt?: any[];
  };

  identity: {
    audiens: string; //nama digabung nomor identitas
    fakultas?: string;
    prodi?: string;
    unit?: string;
  };

  TotalInput: number;
  TotalPertanyaan: number;
  availableSteps: string[];
};

export function formatIndonesianDateTime(dateStr?: string | Date): string {
  if (!dateStr) return "-";
  try {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return (
      new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d) + " WIB"
    );
  } catch (e) {
    return String(dateStr);
  }
}

export function checkKuesionerDateStatus(
  startDateStr?: string,
  endDateStr?: string,
  listExt?: any[],
) {
  const now = new Date();
  const ranges: Array<{ start: Date; end: Date; rawStart: string; rawEnd: string }> = [];

  const parseDate = (str?: any): Date | null => {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const mainStart = parseDate(startDateStr);
  const mainEnd = parseDate(endDateStr);

  if (mainStart && mainEnd) {
    ranges.push({
      start: mainStart,
      end: mainEnd,
      rawStart: startDateStr!,
      rawEnd: endDateStr!,
    });
  }

  if (Array.isArray(listExt)) {
    for (const ext of listExt) {
      const extStart = parseDate(ext?.TanggalMulai || ext?.tanggal_mulai) || mainStart;
      const extEnd = parseDate(ext?.TanggalAkhir || ext?.tanggal_akhir) || mainEnd;
      if (extStart && extEnd) {
        ranges.push({
          start: extStart,
          end: extEnd,
          rawStart: ext?.TanggalMulai || ext?.tanggal_mulai || startDateStr || "",
          rawEnd: ext?.TanggalAkhir || ext?.tanggal_akhir || endDateStr || "",
        });
      }
    }
  }

  if (ranges.length === 0) {
    return {
      isExpired: false,
      isNotStarted: false,
      formattedStartDate: formatIndonesianDateTime(startDateStr),
      formattedEndDate: formatIndonesianDateTime(endDateStr),
    };
  }

  const isCurrentlyActive = ranges.some(
    (r) => now.getTime() >= r.start.getTime() && now.getTime() <= r.end.getTime(),
  );

  if (isCurrentlyActive) {
    return {
      isExpired: false,
      isNotStarted: false,
      formattedStartDate: formatIndonesianDateTime(startDateStr),
      formattedEndDate: formatIndonesianDateTime(endDateStr),
    };
  }

  let maxEnd = ranges[0].end;
  let maxEndRaw = ranges[0].rawEnd;
  for (const r of ranges) {
    if (r.end.getTime() > maxEnd.getTime()) {
      maxEnd = r.end;
      maxEndRaw = r.rawEnd;
    }
  }

  let minStart = ranges[0].start;
  let minStartRaw = ranges[0].rawStart;
  for (const r of ranges) {
    if (r.start.getTime() < minStart.getTime()) {
      minStart = r.start;
      minStartRaw = r.rawStart;
    }
  }

  const isExpired = now.getTime() > maxEnd.getTime();
  const isNotStarted = now.getTime() < minStart.getTime();

  return {
    isExpired,
    isNotStarted,
    formattedStartDate: formatIndonesianDateTime(minStartRaw),
    formattedEndDate: formatIndonesianDateTime(maxEndRaw),
  };
}

export default function InitialSection({
  summary,
  onStart,
  info,
  identity,
  TotalInput,
  TotalPertanyaan,
  availableSteps,
}: Props) {
  const items = [
    {
      label: "Admin",
      value: summary.admin,
    },
    {
      label: "Fakultas",
      value: summary.fakultas,
    },
    {
      label: "Program Studi",
      value: summary.prodi,
    },
  ].filter((i) => i.value > 0);

  const { isExpired, isNotStarted, formattedStartDate, formattedEndDate } =
    checkKuesionerDateStatus(info.startDate, info.endDate, info.listExt);

  const isSuccess = TotalInput === TotalPertanyaan && TotalPertanyaan > 0;
  const isError = TotalInput > TotalPertanyaan || TotalPertanyaan < 0 || TotalInput < 0;
  const isCanStart = !isSuccess && !isError && !isExpired && !isNotStarted;

  return (
    <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto flex flex-col gap-10">
      {/* ================= HEADER ================= */}
      <div className="text-center space-y-3">
        {/* JUDUL */}
        <h1 className="text-4xl font-extrabold text-on-surface">
          {info.title}
        </h1>

        {/* TAHUN + SEMESTER */}
        <p className="text-lg text-on-surface-variant">
          Semester {info.semester}
        </p>

        {/* IDENTITAS */}
        <div className="text-sm text-on-surface-variant space-y-1">
          {identity.audiens && <div>Audiens: {identity.audiens}</div>}
          {identity.fakultas && <div>Fakultas: {identity.fakultas}</div>}
          {identity.prodi && <div>Program Studi: {identity.prodi}</div>}
          {identity.unit && <div>Unit: {identity.unit}</div>}
        </div>
      </div>

      {/* ================= RULE / WARNING ================= */}
      {isExpired ? (
        <div className="p-6 rounded-xl border bg-amber-50 border-amber-300 text-amber-900 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-lg font-bold text-amber-800">
            <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0">
              history_toggle_off
            </span>
            Kuesioner Sudah Berakhir (Expired)
          </div>
          <p className="text-sm leading-relaxed text-amber-800/90">
            Masa pengisian kuesioner ini telah berakhir pada{" "}
            <strong className="font-semibold text-amber-950">{formattedEndDate}</strong>.
            Kuesioner yang telah berakhir tidak dapat diisi atau ditanggapi kembali.
          </p>
        </div>
      ) : isNotStarted ? (
        <div className="p-6 rounded-xl border bg-blue-50 border-blue-300 text-blue-900 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-lg font-bold text-blue-800">
            <span className="material-symbols-outlined text-blue-600 text-2xl shrink-0">
              schedule
            </span>
            Kuesioner Belum Dimulai
          </div>
          <p className="text-sm leading-relaxed text-blue-800/90">
            Masa pengisian kuesioner ini baru akan dibuka pada{" "}
            <strong className="font-semibold text-blue-950">{formattedStartDate}</strong>.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-xl border bg-red-50 border-red-200 text-red-700">
          <h2 className="font-bold mb-2">⚠️ Perhatian</h2>
          <p className="text-sm leading-relaxed">
            Kuesioner yang telah diisi{" "}
            <b>
              tidak dapat diubah atau diulang kembali dan bersifat berkelanjutan
            </b>
            . Pastikan semua jawaban yang Anda berikan sudah benar sebelum
            melanjutkan ke tahap berikutnya.
          </p>
        </div>
      )}

      {/* ================= SOURCE ================= */}
      <div className="space-y-4">
        <h2 className="font-bold text-on-surface">Sumber Kuesioner</h2>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {items.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-lg bg-primary-container/20 text-center"
            >
              <div className="text-2xl font-bold text-primary">
                {item.value}
              </div>
              <div className="text-sm text-on-surface-variant">
                {item.label.toLowerCase()=="admin"? "LPM":item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <button
        onClick={() => {
          if (isCanStart && availableSteps.length > 0) {
            onStart();
          }
        }}
        disabled={!isCanStart || availableSteps.length === 0}
        className={cn(
          "w-full py-4 rounded-xl font-bold transition transform disabled:opacity-60 disabled:cursor-not-allowed",

          isCanStart && availableSteps.length > 0 && "bg-primary text-on-primary hover:scale-[1.02]",

          isSuccess && "bg-green-500 text-white cursor-not-allowed opacity-70",

          (isError || isExpired || isNotStarted) && "bg-red-500 text-white cursor-not-allowed opacity-70",
        )}
      >
        {isError
          ? "Data Tidak Valid"
          : isExpired
            ? "Kuesioner Expired"
            : isNotStarted
              ? "Kuesioner Belum Dimulai"
              : isSuccess
                ? "Kuesioner Lengkap"
                : availableSteps.length > 0
                  ? "Mulai Kuesioner"
                  : "Kuesioner Expired"}
      </button>
    </div>
  );
}
