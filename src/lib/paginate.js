export function filterSortPaginate(items, {
  page = 1,
  pageSize = 10,
  q = "",
  sort = "id",
  dir = "asc"
} = {}, searchable = []) {

  // Arama
  const needle = (q || "").toString().toLowerCase().trim();
  let filtered = !needle ? items : items.filter(it =>
    searchable.some(k => String(it[k] ?? "").toLowerCase().includes(needle))
  );

  // Sıralama
  filtered.sort((a,b) => {
    const va = a[sort]; const vb = b[sort];
    if (va == null && vb == null) return 0;
    if (va == null) return dir === "asc" ? -1 : 1;
    if (vb == null) return dir === "asc" ?  1 : -1;
    if (va < vb)  return dir === "asc" ? -1 : 1;
    if (va > vb)  return dir === "asc" ?  1 : -1;
    return 0;
  });

  // Sayfalama
  page = Math.max(1, parseInt(page));
  pageSize = Math.max(1, Math.min(100, parseInt(pageSize)));
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}