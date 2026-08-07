"use client";

import { Option } from "../../Common/Components/Attribut/Option";
import { RekapRespondenItem } from "../Attribut/RekapRespondenTypes";

type Props = {
  selectedBankSoal: Option | null;
  respondents: RekapRespondenItem[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onView: (item: RekapRespondenItem) => void;
};

export default function RekapRespondenTable({
  selectedBankSoal,
  respondents,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onView,
}: Props) {
  const totalPages = Math.ceil(total / limit) || 1;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to resolve respondent name and ID
  const getRespondentInfo = (item: RekapRespondenItem) => {
    if (item.NamaMahasiswa || item.NPM) {
      return {
        nama: item.NamaMahasiswa || "-",
        id: item.NPM ? `NPM: ${item.NPM}` : "-",
        role: "Mahasiswa",
        badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      };
    }
    if (item.NamaDosen || item.NIDN) {
      return {
        nama: item.NamaDosen || "-",
        id: item.NIDN ? `NIDN: ${item.NIDN}` : "-",
        role: "Dosen",
        badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      };
    }
    if (item.NamaTendik || item.NIP) {
      return {
        nama: item.NamaTendik || "-",
        id: item.NIP ? `NIP: ${item.NIP}` : "-",
        role: "Tendik",
        badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      };
    }
    return {
      nama: "-",
      id: "-",
      role: "Responden",
      badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl lg:rounded-3xl shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] border border-outline-variant/10 overflow-hidden">
      {/* Header Info */}
      <div className="p-5 lg:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-black text-xl text-on-surface">Data Rekap Responden</h3>
          <p className="text-xs text-outline mt-1">
            {selectedBankSoal
              ? `Menampilkan hasil kuesioner untuk "${selectedBankSoal.label}" (${total} responden)`
              : "Pilih Bank Soal di atas untuk menampilkan data."}
          </p>
        </div>

        {selectedBankSoal && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Total: {total} Data
          </span>
        )}
      </div>

      {/* Content States */}
      {!selectedBankSoal ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-3xl">assignment_ind</span>
          </div>
          <h4 className="font-bold text-lg text-on-surface mb-2">
            Bank Soal Belum Dipilih
          </h4>
          <p className="text-sm text-outline max-w-md">
            Silakan pilih <strong>Bank Soal</strong> pada dropdown di atas terlebih dahulu untuk menampilkan daftar rekap responden kuesioner.
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-outline">Memuat data responden...</p>
        </div>
      ) : respondents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-outline/50 mb-2">
            folder_off
          </span>
          <p className="font-bold text-on-surface">Data Tidak Ditemukan</p>
          <p className="text-xs text-outline mt-1">
            Belum ada responden yang mengisi kuesioner untuk Bank Soal ini.
          </p>
        </div>
      ) : (
        <>
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-low/60 text-xs font-extrabold uppercase tracking-wider text-outline border-b border-outline-variant/10">
                  <th className="px-6 py-4 w-16">No</th>
                  <th className="px-6 py-4">Responden</th>
                  <th className="px-6 py-4">Fakultas / Prodi / Unit</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {respondents.map((item, idx) => {
                  const info = getRespondentInfo(item);
                  const rowNo = (page - 1) * limit + idx + 1;

                  return (
                    <tr
                      key={item.UUID || idx}
                      className="hover:bg-surface-container-low/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-outline text-xs">
                        {rowNo}
                      </td>

                      {/* Responden Column */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface text-sm">
                              {info.nama}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${info.badgeColor}`}
                            >
                              {info.role}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-outline">
                            {info.id}
                          </p>
                        </div>
                      </td>

                      {/* Fakultas / Prodi / Unit */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          {(item.Fakultas || item.KodeFakultas) && (
                            <p className="font-semibold text-xs text-on-surface">
                              Fakultas: {item.Fakultas || item.KodeFakultas}
                            </p>
                          )}
                          {(item.Prodi || item.KodeProdi) && (
                            <p className="text-xs text-outline">
                              Prodi: {item.Prodi || item.KodeProdi}
                            </p>
                          )}
                          {item.Unit && (
                            <p className="text-xs text-outline/80">
                              Unit: {item.Unit}
                            </p>
                          )}
                          {!item.Fakultas && !item.Prodi && !item.Unit && (
                            <span className="text-xs text-outline/60">-</span>
                          )}
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="px-6 py-4 text-xs font-medium text-on-surface">
                        {formatDate(item.Tanggal)}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs font-medium text-outline">
                        {formatDateTime(item.CreatedAt)}
                      </td>

                      {/* Aksi Column */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onView(item)}
                          title="Lihat Detail Kuesioner"
                          className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-xs inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 lg:p-5 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest">
            <p className="text-xs text-outline font-medium">
              Menampilkan {Math.min((page - 1) * limit + 1, total)} -{" "}
              {Math.min(page * limit, total)} dari {total} responden
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">chevron_left</span>
                Previous
              </button>

              <span className="text-xs font-bold text-on-surface px-2">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              >
                Next
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
