"use client";

import { ExportJobState } from "../Service/ExportRekapRespondenJob";

interface Props {
  job: ExportJobState | null;
  onDismiss: () => void;
}

export default function ExportBackgroundJobWidget({ job, onDismiss }: Props) {
  if (!job || job.status === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 p-4 animate-in slide-in-from-bottom duration-300">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {job.status === "running" ? (
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm animate-spin">
                sync
              </span>
            </div>
          ) : job.status === "completed" ? (
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm">error</span>
            </div>
          )}

          <div>
            <h4 className="text-xs font-black text-on-surface">
              Background Job: Export Excel
            </h4>
            <p className="text-[10px] text-outline font-mono">ID: {job.id}</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-surface-container-low text-outline hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* MESSAGE */}
      <p className="text-xs font-medium text-on-surface-variant mb-3">
        {job.message}
      </p>

      {/* PROGRESS BAR */}
      {job.status === "running" && (
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-outline text-right font-mono">
            {job.progress}%
          </p>
        </div>
      )}

      {/* COMPLETED FILE DOWNLOAD NOTIFICATION */}
      {job.status === "completed" && job.filename && (
        <div className="mt-2 pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
          <span className="font-mono text-outline truncate max-w-[200px]">
            {job.filename}
          </span>
          <span className="text-green-600 font-bold">Terunduh ✓</span>
        </div>
      )}
    </div>
  );
}
