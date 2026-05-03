import { useState, useRef } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ExportButtons from "../components/ExportButtons";

const API = "http://localhost:8001";

export default function LinkSystem() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length < 2) return alert("Kam se kam 2 items daalo, comma se alag karo");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/link-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      setResult(data.story);
    } catch (err) {
      setResult("Error: Backend server se connect nahi ho paaya. Server chaalu hai na?");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Link System</strong> sabse basic memory technique hai.
        Ismein hum ek <em>ajeeboghareeb mental images ki chain</em> banaate hain
        jo list ke har item ko agle item se connect karti hai.
      </p>
      <div className="key-points">
        <h3>Key Principles:</h3>
        <ul>
          <li><strong>Ajeeb banao</strong> — Jitni strange image, utna achha yaad rahega</li>
          <li><strong>Action daalo</strong> — Cheezein move karein, takraayein, udein, naachein</li>
          <li><strong>Badha-chadha kar socho</strong> — Giant banao, tiny banao, laakhon mein multiply karo</li>
          <li><strong>Jodi banao</strong> — Item 1 ko 2 se jodo, phir 2 ko 3 se, aur aage badho</li>
        </ul>
      </div>
      <div className="example-box">
        <h3>Example:</h3>
        <p>Yaad karna hai: <strong>Doodh, Billi, Chhaata, Piano</strong></p>
        <p>
          Socho ek giant <strong>Doodh</strong> ka carton ek chillaati <strong>Billi</strong> par girta hai,
          billi <strong>Chhaata</strong> khol kar bachti hai, lekin chhaata udd kar ek <strong>Piano</strong> par
          girta hai jo apne aap bajne lagta hai!
        </p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={1} title="Link System (Kadi Jodo)" icon={"\u{1F517}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>Wo items likho jo yaad karne hain (comma se alag karo):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="jaise: doodh, billi, chhaata, piano, rocket"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ban rahi hai..." : "Memory Story Banao"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapki Memory Story:</h3>
          <ExportButtons
            targetRef={resultRef}
            filename="link-system-story"
            title="Link System — Memory Story"
            inputLabel="Items to Memorize"
            inputContent={input}
          />
          <div ref={resultRef}>
            <MarkdownRenderer content={result} />
          </div>
        </div>
      )}
    </ChapterLayout>
  );
}
