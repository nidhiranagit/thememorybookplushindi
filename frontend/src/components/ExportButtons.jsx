import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

export default function ExportButtons({ targetRef, filename = "memory-aid", title = "Memory Aid" }) {
  const exportPDF = async () => {
    if (!targetRef?.current) return;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    try {
      await html2pdf().set(opt).from(targetRef.current).save();
    } catch (err) {
      alert("PDF export failed: " + err.message);
    }
  };

  const exportDOCX = async () => {
    if (!targetRef?.current) return;
    try {
      // Build a complete HTML document with inline styles for DOCX
      const inner = targetRef.current.innerHTML;
      const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
  body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 12pt; line-height: 1.6; color: #333; }
  h1, h2, h3, h4 { color: #6c3ce0; margin-top: 16px; margin-bottom: 8px; }
  h1 { font-size: 22pt; }
  h2 { font-size: 18pt; }
  h3 { font-size: 14pt; }
  h4 { font-size: 12pt; }
  strong { color: #111827; font-weight: bold; }
  table { border-collapse: collapse; width: 100%; margin: 10px 0; }
  th { background-color: #6c3ce0; color: white; padding: 8px; text-align: left; border: 1px solid #ccc; }
  td { padding: 8px; border: 1px solid #ccc; }
  tr:nth-child(even) td { background-color: #f5f3ff; }
  ul, ol { padding-left: 24px; }
  li { margin-bottom: 4px; }
  pre { background: #1f2028; color: #e8e6f0; padding: 12px; border-radius: 4px; font-family: 'Consolas', 'Courier New', monospace; font-size: 10pt; white-space: pre; }
  code { background: #ede9fe; color: #6c3ce0; padding: 2px 4px; border-radius: 3px; font-family: 'Consolas', monospace; }
  blockquote { border-left: 4px solid #8b5cf6; padding-left: 12px; margin: 10px 0; font-style: italic; color: #555; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
</style>
</head>
<body>
<h1>${title}</h1>
${inner}
</body>
</html>`;
      const blob = await asBlob(html);
      saveAs(blob, `${filename}.docx`);
    } catch (err) {
      alert("DOCX export failed: " + err.message);
    }
  };

  return (
    <div className="export-buttons">
      <button type="button" className="export-btn export-pdf" onClick={exportPDF} title="Export as PDF">
        📄 Export PDF
      </button>
      <button type="button" className="export-btn export-docx" onClick={exportDOCX} title="Export as DOCX">
        📝 Export DOCX
      </button>
    </div>
  );
}
