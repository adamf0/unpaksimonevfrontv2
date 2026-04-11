"use client";

import Icon from "../Atoms/Icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  showing: number;
  onChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  showing,
  onChange,
}: PaginationProps) {
  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      {/* LEFT: INFO */}
      <div className="w-full md:w-auto">
        <p className="text-xs text-on-surface-variant font-medium">
          Showing <span className="font-bold">{showing}</span> of{" "}
          <span className="font-bold">{totalItems}</span> results
        </p>
      </div>

      {/* RIGHT: PAGINATION */}
      <div className="w-full md:w-auto md:ml-auto flex justify-start md:justify-end">
        <div className="flex flex-wrap items-center gap-2">
          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => onChange?.(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline disabled:opacity-40"
          >
            <Icon name="chevron_left" className="!text-lg" />
          </button>

          {/* PAGE NUMBERS */}
          {pages.map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2 text-outline">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => onChange?.(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? "bg-primary text-on-primary"
                    : "hover:bg-surface-container-high"
                }`}
              >
                {page}
              </button>
            ),
          )}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onChange?.(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-outline disabled:opacity-40"
          >
            <Icon name="chevron_right" className="!text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
