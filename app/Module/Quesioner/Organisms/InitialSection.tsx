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
  };

  identity: {
    audiens: string; //nama digabung nomor identitas
    fakultas?: string;
    prodi?: string;
    unit?: string;
  };
};

export default function InitialSection({
  summary,
  onStart,
  info,
  identity,
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
          {info.year} • Semester {info.semester}
        </p>

        {/* IDENTITAS */}
        <div className="text-sm text-on-surface-variant space-y-1">
          {identity.audiens && <div>Audiens: {identity.audiens}</div>}
          {identity.fakultas && <div>Fakultas: {identity.fakultas}</div>}
          {identity.prodi && <div>Program Studi: {identity.prodi}</div>}
          {identity.unit && <div>Unit: {identity.unit}</div>}
        </div>
      </div>

      {/* ================= RULE ================= */}
      <div className="p-6 rounded-xl border bg-red-50 border-red-200 text-red-700">
        <h2 className="font-bold mb-2">⚠️ Perhatian</h2>
        <p className="text-sm leading-relaxed">
          Kuesioner yang telah diisi{" "}
          <b>tidak dapat diubah atau diulang kembali dan bersifat berkelanjutan</b>. Pastikan semua jawaban
          yang Anda berikan sudah benar sebelum melanjutkan ke tahap berikutnya.
        </p>
      </div>

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
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <button
        onClick={onStart}
        className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold hover:scale-[1.02] transition"
      >
        Mulai Kuesioner
      </button>
    </div>
  );
}