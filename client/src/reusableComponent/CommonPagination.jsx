import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CommonPagination = ({
  totalItems,
  pageSize = 5,
  currentPage = 1,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goTo = (n) => {
    const clamped = Math.min(Math.max(1, n), totalPages);
    if (clamped !== currentPage) onPageChange(clamped);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed">
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "min-w-10 h-10 px-3 flex items-center justify-center rounded-md text-sm font-medium border border-neutral-700 transition-colors",
              isActive
                ? "bg-purple-600 text-white"
                : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
            ].join(" ")}>
            {p}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed">
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// To Slice Pages
export const paginate = (items, currentPage, pageSize = 5) => {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

export default CommonPagination;
