import { useState, useEffect } from "react";

export function usePagination<T>(items: T[], pageSize = 6) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the items list changes (e.g. filter applied)
  useEffect(() => {
    setPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return { page, setPage, totalPages, paginatedItems };
}
