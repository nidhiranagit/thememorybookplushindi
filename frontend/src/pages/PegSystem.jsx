import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

const PEGS = [
  { num: 1, word: "ताज", why: "त = 1" },
  { num: 2, word: "नाग", why: "न = 2" },
  { num: 3, word: "मोर", why: "म = 3" },
  { num: 4, word: "रथ", why: "र = 4" },
  { num: 5, word: "लड्डू", why: "ल = 5" },
  { num: 6, word: "छाता", why: "छ = 6" },
  { num: 7, word: "कमल", why: "क = 7" },
  { num: 8, word: "फूल", why: "फ = 8" },
  { num: 9, word: "पंखा", why: "प = 9" },
  { num: 10, word: "तोता", why: "त=1, त=0" },
];

export default function PegSystem() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length < 1) return alert("कम से कम 1 item डालो");
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
      setResult("Error: Backend server से connect नहीं हो पाया।");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Peg System</strong> से तुम items को <em>number wise</em> याद कर सकते हो।
        पहले, हर number के लिए एक permanent "peg" word याद करो।
        फिर, हर peg को अपने item से एक bizarre image बना कर जोड़ो।
      </p>
      <div className="peg-table">
        <h3>Hindi Peg List (हिंदी खूंटी सूची):</h3>
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
        <h3>Example (उदाहरण):</h3>
        <p>Item #3 = "सेब" याद करना है:</p>
        <p>Peg #3 = <strong>मोर</strong>। सोचो एक <strong>मोर</strong> अपनी पूँछ में
        giant <strong>सेब</strong> लगा कर नाच रहा है और सेब चारों तरफ उड़ रहे हैं!</p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={2} title="Peg System (खूंटी विधि)" icon={"\u{1F4CC}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>10 items तक डालो (comma से अलग) — ये 1-10 positions पर peg होंगे:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="जैसे: सेब, साइकिल, डायनासोर, टेलीफ़ोन"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "बन रही है..." : "Peg Associations बनाओ"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>आपकी Peg Associations:</h3>
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
