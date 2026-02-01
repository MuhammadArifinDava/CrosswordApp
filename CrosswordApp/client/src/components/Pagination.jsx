function Pagination({ page, pages, totalPages, onPageChange }) {
  const total = Number.isFinite(totalPages) ? totalPages : pages;
  if (!total || total <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= total;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={prevDisabled}
        className="rounded-full border border-slate-200 bg-white/80 px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:bg-white disabled:opacity-50"
      >
        Previous
      </button>
      <div className="flex items-center justify-center h-10 min-w-[3rem] rounded-full border border-slate-200 bg-white/90 px-4 text-sm font-semibold text-slate-700">
        {page} <span className="mx-1 text-slate-300">/</span> {total}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={nextDisabled}
        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
      >
        Next Page
      </button>
    </div>
  );
}

export { Pagination };
