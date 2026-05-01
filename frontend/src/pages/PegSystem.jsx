import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownRenderer from "../components/MarkdownRenderer";

const API = "http://localhost:8001";

const PEGS = [
  { num: 1, word: "Taaj", why: "T = 1" },
  { num: 2, word: "Naag", why: "N = 2" },
  { num: 3, word: "Mor", why: "M = 3" },
  { num: 4, word: "Rath", why: "R = 4" },
  { num: 5, word: "Laddu", why: "L = 5" },
  { num: 6, word: "Chhaata", why: "Chh = 6" },
  { num: 7, word: "Kamal", why: "K = 7" },
  { num: 8, word: "Phool", why: "Ph = 8" },
  { num: 9, word: "Pankha", why: "P = 9" },
  { num: 10, word: "Tota", why: "T=1, T=0" },
];

export default function PegSystem() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length < 1) return alert("Kam se kam 1 item daalo");
    if (items.length > 10) return alert("Maximum 10 items (pegs 1-10)");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/peg-associate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      setResult(data.associations);
    } catch (err) {
      setResult("Error: Backend server se connect nahi ho paaya.");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Peg System</strong> se tum items ko <em>number wise</em> yaad kar sakte ho.
        Pehle, har number ke liye ek permanent "peg" word yaad karo.
        Phir, har peg ko apne item se ek bizarre image bana kar jodo.
      </p>
      <div className="peg-table">
        <h3>Hindi Peg List (Khunti Soochi):</h3>
        <div className="peg-grid">
          {PEGS.map((p) => (
            <div key={p.num} className="peg-item">
              <span className="peg-num">{p.num}</span>
              <span className="peg-word">{p.word}</span>
              <span className="peg-why">{p.why}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="example-box">
        <h3>Example:</h3>
        <p>Item #3 = "Seb (Apple)" yaad karna hai:</p>
        <p>Peg #3 = <strong>Mor (Peacock)</strong>. Socho ek <strong>Mor</strong> apni poonchh mein
        giant <strong>Seb</strong> laga kar naach raha hai aur seb chaaron taraf udd rahe hain!</p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={2} title="Peg System (Khunti Vidhi)" icon={"\u{1F4CC}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>10 items tak daalo (comma se alag) — ye 1-10 positions par peg honge:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="jaise: seb, cycle, dinosaur, telephone"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ban rahi hai..." : "Peg Associations Banao"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapki Peg Associations:</h3>
          <MarkdownRenderer content={result} />
        </div>
      )}
    </ChapterLayout>
  );
}
