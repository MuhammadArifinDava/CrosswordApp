function Alert({ children, tone = "error" }) {
  const classes =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-slate-200 bg-slate-50 text-slate-900";

  return <div className={`rounded-lg border px-3 py-2 text-sm ${classes}`}>{children}</div>;
}

export { Alert };
