import { useState, useRef } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ExportButtons from "../components/ExportButtons";

const API = "http://localhost:8001";

export default function PurnaMethod() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input || input.trim().length < 2) {
      return alert("Ek proper word daalo");
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/purna-method`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: input.trim() }),
      });
      const data = await res.json();
      setResult(data.purna_breakdown);
    } catch (err) {
      setResult("Error: Backend server se connect nahi ho paaya.");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>PURNA Method</strong> (पूर्ण = Complete) ek powerful technique hai jo
        <em> EK HI SYSTEM</em> mein <strong>DOVEIN problems</strong> solve karti hai:
      </p>
      <div className="key-points">
        <h3>Ye Method Ye 2 Problems Solve Karta Hai:</h3>
        <ol>
          <li>
            <strong>🧠 Word Retrieval (Tip of Tongue)</strong> — "Word kya tha?
            Meaning yaad hai but word atak gaya..." → Multiple trigger pathways banake retrieve karo
          </li>
          <li>
            <strong>✍️ Exact Spelling</strong> — "Word toh yaad hai but spelling mein
            confuse hota hu" → Etymology + Acrostic se EXACT letters lock karo
          </li>
        </ol>
      </div>

      <div className="key-points">
        <h3>5 Steps of PURNA Method:</h3>
        <ol>
          <li><strong>P — Picture (Tasveer)</strong> 🎬 — Visual image trigger + meaning</li>
          <li><strong>U — Utter (Awaaz)</strong> 🎵 — Sound rhyme + phonetic chunks</li>
          <li><strong>R — Roots (Mool)</strong> 🌳 — Etymology + Hindi equivalent</li>
          <li><strong>N — Naam-Vaakya (Overlap-Chain)</strong> 🔗 — Letter-PAIR chain (har pair shares 1 letter with next!)</li>
          <li><strong>A — Active Recall</strong> ✅ — Two-way test (retrieval + spelling)</li>
        </ol>
      </div>

      <div className="example-box">
        <h3>🔗 NEW: Overlap-Chain Acrostic (Step 4 enhanced!)</h3>
        <p>
          Old way: 9 separate words for HIERARCHY (cognitive overload!)
        </p>
        <p>
          <strong>New way:</strong> Letter-PAIRS that overlap and chain naturally:
        </p>
        <p>
          <strong>HIERARCHY</strong> → HI → IE → ER → RA → AR → RC → CH → HY
        </p>
        <p>
          Each pair shares a letter with the next (the <strong>bridge</strong> letter):
          <br />🙋 HI (Hi greeting) → ❄️ IE (Ice) → 🕰️ ER (Era) → 👑 RA (Raja) →
          🏹 AR (Arrow) → 🌈 RC (Arc) → ☕ CH (Chai) → 🐺 HY (Hyena)
        </p>
        <p>
          <strong>Result:</strong> Half the cognitive load + auto-chain via overlap = perfect for long words!
        </p>
      </div>

      <div className="example-box">
        <h3>Best for these problems:</h3>
        <ul>
          <li>Tip of tongue (TOT) — word atak jaaye</li>
          <li>Spelling mistakes — letters confuse ho jaayein</li>
          <li>Hard vocabulary — long ya difficult words</li>
          <li>Bilingual confusion (Hindi+English speakers ke liye perfect!)</li>
          <li>Words you keep forgetting</li>
        </ul>
      </div>

      <div className="example-box">
        <h3>Full Example: HIERARCHY</h3>
        <p>
          <strong>P (Picture):</strong> Pyramid 🔺 with king at top, servants at bottom<br />
          <strong>U (Utter):</strong> "HIGH-er-ar-key" — rhymes with monarchy<br />
          <strong>R (Roots):</strong> HIER (Greek: sacred) + ARCHY (Greek: rule) = "Padanukram" (Hindi)<br />
          <strong>N (Overlap-Chain):</strong> 🙋 HI → ❄️ IE → 🕰️ ER → 👑 RA → 🏹 AR → 🌈 RC → ☕ CH → 🐺 HY<br />
          <em>Story:</em> "Tum HI bolte ho ek ICE ko jo ERA se aaya hai, jahan RAJA ARROW chalata hai jo ARC mein ghoomte hue CHAI tak pahunchti hai aur HYENA peeta hai!"<br />
          <strong>A (Active):</strong> Test both ways — meaning→word AND word→spelling
        </p>
      </div>

      <div className="example-box">
        <h3>Why PURNA is Different:</h3>
        <p>
          <strong>Other methods</strong> approximate ("CHY sounds like KEY") — guessing!<br />
          <strong>PURNA Method</strong> uses <strong>etymology</strong> (real chunks) +
          <strong> acrostic</strong> (every letter locked) — <strong>EXACT</strong> spelling guaranteed!
        </p>
      </div>
    </>
  );

  return (
    <ChapterLayout
      number={7}
      title="PURNA Method (Complete Word Mastery)"
      icon={"\u{1FAB7}"}
      theory={theory}
    >
      <form onSubmit={handleSubmit} className="tool-form">
        <label>Wo word daalo jise master karna hai (retrieval + spelling dono):</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="jaise: hierarchy, serendipity, procrastination, benediction"
          maxLength={50}
        />
        <button type="submit" disabled={loading}>
          {loading ? "PURNA bana raha hu..." : "PURNA Method Apply Karo"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapka PURNA Breakdown:</h3>
          <ExportButtons
            targetRef={resultRef}
            filename="purna-method-breakdown"
            title="PURNA Method — Complete Word Mastery"
            inputLabel="Word to Master"
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
