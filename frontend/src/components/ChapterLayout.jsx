import { Link } from "react-router-dom";

export default function ChapterLayout({ number, title, icon, theory, children }) {
  return (
    <div className="chapter-page">
      <Link to="/" className="back-link">&larr; सभी Chapters पर वापस जाओ</Link>
      <div className="chapter-header">
        <span className="chapter-icon">{icon}</span>
        <div>
          <span className="chapter-number">अध्याय {number}</span>
          <h1>{title}</h1>
        </div>
      </div>

      <section className="theory-section">
        <h2>ये कैसे काम करता है</h2>
        <div className="theory-content">{theory}</div>
      </section>

      <section className="tool-section">
        <h2>खुद Try करो</h2>
        {children}
      </section>
    </div>
  );
}
