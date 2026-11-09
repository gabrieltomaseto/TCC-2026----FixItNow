function Badge({ total, rotulo = "notificações não lidas", className = "" }) {
  if (!total) return null;

  return (
    <span
      role="status"
      aria-label={`${total} ${rotulo}`}
      className={`inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold leading-none text-white ${className}`}
    >
      {total > 99 ? "99+" : total}
    </span>
  );
}

export default Badge;
