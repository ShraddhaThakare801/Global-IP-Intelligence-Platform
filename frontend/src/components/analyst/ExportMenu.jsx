import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportMenu({ data }) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "filings.json");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filings");
    XLSX.writeFile(workbook, "filings.xlsx");
  };

  const exportSummary = () => {
    const summary = {
      total: data.length,
      active: data.filter((f) => f.status === "Active").length,
      pending: data.filter((f) => f.status === "Pending").length,
      expired: data.filter((f) => f.status === "Expired").length,
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "summary_report.json");
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={exportJSON}
        className="px-4 py-2 bg-indigo-600 rounded-xl"
      >
        JSON
      </button>
      <button
        onClick={exportExcel}
        className="px-4 py-2 bg-purple-600 rounded-xl"
      >
        Excel
      </button>
      <button
        onClick={exportSummary}
        className="px-4 py-2 bg-teal-600 rounded-xl"
      >
        Summary
      </button>
    </div>
  );
}
