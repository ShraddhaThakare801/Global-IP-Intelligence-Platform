export default function SortControls({
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="flex gap-4 items-center">
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className="bg-slate-800 px-4 py-2 rounded-xl"
      >
        <option value="">Sort By</option>
        <option value="status">Status</option>
        <option value="jurisdiction">Jurisdiction</option>
        <option value="inventor">Inventor</option>
        <option value="filingDate">Filing Date</option>
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="px-4 py-2 bg-indigo-600 rounded-xl"
      >
        {sortOrder.toUpperCase()}
      </button>
    </div>
  );
}
