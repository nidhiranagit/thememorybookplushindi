import { Link } from "react-router-dom";

export default function ChapterLayout({ number, title, icon, theory, children }) {
  return (
    <div className="chapter-page">
      <Link to="/" className="back-link">&larr; Sabhi Chapters par wapas jaao</Link>
      <div className="chapter-header">
        <span className="chapter-icon">{icon}</span>
        <div>
          <span className="chapter-number">Chapter {number}</span>
          <h1>{title}</h1>
        </div>
      </div>

      <section className="theory-section">
        <h2>Ye Kaise Kaam Karta Hai</h2>
        <div className="theory-content">{theory}</div>
      </section>

      <section className="tool-section">
        <h2>Khud Try Karo</h2>
        {children}
      </section>
    </div>
  );
}
