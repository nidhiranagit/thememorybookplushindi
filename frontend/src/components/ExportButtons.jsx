import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";

/**
 * ExportButtons - Export result + input as PDF or Word document
 *
 * Props:
 * - targetRef: ref to result content div
 * - filename: base filename (no extension)
 * - title: document title
 * - inputLabel: label for the user's input section (e.g. "Aapka Input", "Items", "Number")
 * - inputContent: the actual input string/HTML to show in the export
 */
export default function ExportButtons({
  targetRef,
  filename = "memory-aid",
  title = "Memory Aid",
  inputLabel = "Aapka Input",
  inputContent = "",
}) {
  // Build a temporary wrapper that contains: title + input section + result content
  // Used by both PDF and DOCX exports
  const buildExportWrapper = () => {
    if (!targetRef?.current) return null;
    const resultHTML = targetRef.current.innerHTML;
    if (!resultHTML || resultHTML.trim().length === 0) {
      alert("Kuch content nahi hai export karne ke liye!");
      return null;
    }

    const inputSection = inputContent
      ? `
        <div class="export-input-section">
          <h2>📥 ${inputLabel}</h2>
          <div class="input-content">${escapeHtml(inputContent)}</div>
        </div>
        <hr/>
      `
      : "";

    const wrapper = document.createElement("div");
    wrapper.style.fontFamily =
      "'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    wrapper.style.padding = "20px";
    wrapper.style.background = "#ffffff";
    wrapper.innerHTML = `
      <h1 style="color: #6c3ce0; border-bottom: 3px solid #6c3ce0; padding-bottom: 8px; margin-bottom: 16px;">
        ${title}
      </h1>
      ${inputSection}
      <div class="export-result-section">
        <h2>✨ Memory Aid Result</h2>
        ${resultHTML}
      </div>
    `;
    return wrapper;
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, "<br/>");
  };

  const exportPDF = async () => {
    const wrapper = buildExportWrapper();
    if (!wrapper) return;

    // Append off-screen so html2canvas can render it
    wrapper.style.position = "absolute";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.style.width = "800px";
    document.body.appendChild(wrapper);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    try {
      await html2pdf().set(opt).from(wrapper).save();
    } catch (err) {
      alert("PDF export failed: " + err.message);
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  const exportDOCX = () => {
    const wrapper = buildExportWrapper();
    if (!wrapper) return;

    try {
      const inner = wrapper.innerHTML;

      const styles = `
        body {
          font-family: 'Calibri', Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
          margin: 40px;
        }
        h1, h2, h3, h4 {
          color: #6c3ce0;
          font-family: 'Calibri', Arial, sans-serif;
          margin-top: 18px;
          margin-bottom: 8px;
        }
        h1 { font-size: 22pt; border-bottom: 3px solid #6c3ce0; padding-bottom: 6px; }
        h2 { font-size: 18pt; }
        h3 { font-size: 14pt; }
        h4 { font-size: 12pt; font-weight: bold; }
        strong { color: #111827; font-weight: bold; }
        em { font-style: italic; }
        .export-input-section {
          background: #f5f3ff;
          border-left: 4px solid #6c3ce0;
          padding: 14px 18px;
          margin: 12px 0;
        }
        .export-input-section h2 {
          margin-top: 0;
          font-size: 14pt;
          color: #6c3ce0;
        }
        .input-content {
          background: #ffffff;
          padding: 10px 14px;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 11pt;
          color: #444;
          border: 1px solid #d4c5fb;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        th {
          background-color: #6c3ce0;
          color: white !important;
          padding: 10px;
          text-align: left;
          border: 1px solid #4c2db0;
          font-weight: bold;
        }
        td {
          padding: 10px;
          border: 1px solid #cccccc;
          vertical-align: top;
        }
        tr:nth-child(even) td { background-color: #f5f3ff; }
        ul, ol { margin: 8px 0; padding-left: 30px; }
        li { margin-bottom: 4px; }
        pre {
          background: #1f2028;
          color: #e8e6f0;
          padding: 12px;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 10pt;
          white-space: pre;
          border: 1px solid #333;
          margin: 10px 0;
        }
        code {
          background: #ede9fe;
          color: #6c3ce0;
          padding: 2px 5px;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 11pt;
          border: 1px solid #d4c5fb;
        }
        blockquote {
          border-left: 4px solid #8b5cf6;
          padding-left: 14px;
          margin: 10px 0;
          font-style: italic;
          color: #555;
        }
        hr { border: none; border-top: 1px solid #cccccc; margin: 16px 0; }
        p { margin: 8px 0; }
      `;

      const html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<meta name='ProgId' content='Word.Document'>
<meta name='Generator' content='Microsoft Word 15'>
<meta name='Originator' content='Microsoft Word 15'>
<title>${title}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>${styles}</style>
</head>
<body>
${inner}
</body>
</html>`;

      const blob = new Blob(["\ufeff", html], {
        type: "application/msword;charset=utf-8",
      });
      saveAs(blob, `${filename}.doc`);
    } catch (err) {
      alert("DOCX export failed: " + err.message);
    }
  };

  return (
    <div className="export-buttons">
      <button type="button" className="export-btn export-pdf" onClick={exportPDF} title="Export as PDF">
        📄 Export PDF
      </button>
      <button type="button" className="export-btn export-docx" onClick={exportDOCX} title="Export as Word document">
        📝 Export Word
      </button>
    </div>
  );
}
