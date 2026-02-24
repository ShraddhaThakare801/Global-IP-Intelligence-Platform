export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-center gap-3 mt-6">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === i + 1
              ? "bg-indigo-600"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
