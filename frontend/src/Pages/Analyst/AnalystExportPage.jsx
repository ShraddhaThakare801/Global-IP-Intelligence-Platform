import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";

export default function AnalystExportPage() {

  const location = useLocation();
  const assets = location.state?.results || [];

  if (!assets.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="glass-card text-center p-10">
          <h2 className="text-2xl text-red-400 font-bold">No Data Found</h2>
          <p className="text-gray-400 mt-2">
            Please search patents first
          </p>
        </div>
      </div>
    );
  }

  const formattedData = useMemo(() =>
    assets.map(a => ({
      Title: a.title,
      Inventor: a.inventors?.join(", "),
      Applicant: a.applicants?.join(", "),
      Status: a.patentStatus,
      Jurisdiction: a.jurisdiction,
      PublishedDate: a.datePublished
    })),
  [assets]);

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    saveAs(new Blob([csv]), "Patent_Report.csv");
  };

  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Patent_Report.xlsx");
  };

  const exportJSON = () => {
    saveAs(
      new Blob([JSON.stringify(formattedData, null, 2)]),
      "Patent_Report.json"
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Patent Intelligence Report", 14, 15);

    doc.autoTable({
      head: [["Title","Inventor","Applicant","Status","Country"]],
      body: formattedData.map(a => [
        a.Title,
        a.Inventor,
        a.Applicant,
        a.Status,
        a.Jurisdiction
      ]),
      startY: 25
    });

    doc.save("Patent_Report.pdf");
  };

  const exportWord = async () => {

    const rows = formattedData.map(a =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(a.Title)] }),
          new TableCell({ children: [new Paragraph(a.Inventor)] }),
          new TableCell({ children: [new Paragraph(a.Applicant)] }),
          new TableCell({ children: [new Paragraph(a.Status)] }),
          new TableCell({ children: [new Paragraph(a.Jurisdiction)] })
        ]
      })
    );

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph("Patent Intelligence Report"),
          new Table({ rows })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Patent_Report.docx");
  };

  return (

    <div className="min-h-screen p-10 text-white bg-gradient-to-br from-black via-slate-900 to-black space-y-10">

      {/* HEADER */}
      <div className="glass-card text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          📦 Export Center
        </h1>
        <p className="text-gray-400 mt-2">
          Total Records: {assets.length}
        </p>
      </div>

      {/* EXPORT GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        <ExportCard title="CSV" desc="Download raw CSV file" action={exportCSV} color="green"/>
        <ExportCard title="Excel" desc="Professional spreadsheet" action={exportXLSX} color="emerald"/>
        <ExportCard title="PDF" desc="Formatted report" action={exportPDF} color="red"/>
        <ExportCard title="Word" desc="Editable document" action={exportWord} color="blue"/>
        <ExportCard title="JSON" desc="Developer format" action={exportJSON} color="purple"/>

      </div>

      {/* STYLE */}
      <style jsx>{`

        .glass-card {
          background: rgba(30,41,59,0.6);
          backdrop-filter: blur(25px);
          padding:25px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.1);
          box-shadow:0 0 40px rgba(99,102,241,0.2);
        }

      `}</style>

    </div>
  );
}

/* CARD */

function ExportCard({ title, desc, action, color }) {

  const colors = {
    green: "from-green-400 to-green-600",
    emerald: "from-emerald-400 to-emerald-600",
    red: "from-red-400 to-red-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600"
  };

  return (
    <div className="card">

      <div className={`icon bg-gradient-to-r ${colors[color]}`}>
        ⬇
      </div>

      <h3 className="title">{title} Export</h3>
      <p className="desc">{desc}</p>

      <button onClick={action} className="download-btn">
        Download
      </button>

      <style jsx>{`
        .card {
          background: rgba(15,23,42,0.7);
          border:1px solid rgba(255,255,255,0.1);
          padding:25px;
          border-radius:20px;
          text-align:center;
          transition:0.3s;
        }

        .card:hover {
          transform:translateY(-10px);
          box-shadow:0 0 40px rgba(99,102,241,0.5);
        }

        .icon {
          width:50px;
          height:50px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          margin:auto;
          margin-bottom:15px;
          font-size:20px;
        }

        .title {
          font-weight:bold;
          color:#818cf8;
        }

        .desc {
          font-size:14px;
          color:#9ca3af;
          margin:10px 0;
        }

        .download-btn {
          width:100%;
          padding:10px;
          border-radius:10px;
          background:#6366f1;
          transition:0.3s;
        }

        .download-btn:hover {
          transform:scale(1.05);
          box-shadow:0 0 20px #6366f1;
        }
      `}</style>

    </div>
  );
}