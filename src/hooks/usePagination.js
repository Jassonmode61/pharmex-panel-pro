import { useState, useMemo } from "react";

export default function usePagination(rows, pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rows.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const current = useMemo(
    () => rows.slice(start, start + pageSize),
    [rows, page, pageSize]
  );

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));

  return { page, totalPages, current, next, prev, setPage };
}