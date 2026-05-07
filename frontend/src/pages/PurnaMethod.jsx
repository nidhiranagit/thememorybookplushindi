import { useState, useRef } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ExportButtons from "../components/ExportButtons";
import TypingKeyboard from "../components/TypingKeyboard";

const API = "http://localhost:8001";

const CHAIN_MODES = [
  {
    value: "quick",
    label: "Quick (Light)",
    desc: "2 chars/chunk, 1 overlap — best for short words",
    example: "HI→IE→ER→RA",
  },
  {
    value: "bridge",
    label: "Bridge (Medium) ⭐",
    desc: "3 chars/chunk, 2 overlap — recommended default",
    example: "HIE→IER→ERA",
  },
  {
    value: "strong",
    label: "Strong (Max)",
    desc: "4 chars/chunk, 2-3 overlap — best for long/tough words",
    example: "HIER→ERAR→ARCH",
  },
];

export default function PurnaMethod() {
  const [input, setInput] = useState("");
  const [chainMode, setChainMode] = useState("bridge");
  const [includeFamily, setIncludeFamily] = useState(true);
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
        body: JSON.stringify({
          word: input.trim(),
          chain_mode: chainMode,
          include_family: includeFamily,
        }),
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

      <div className="example-box">
        <h3>🆕 NEW Features (just added!):</h3>
        <ul>
          <li>
            <strong>🔗 Chain Strength Control</strong> — Choose how much overlap between chunks!
            <ul>
              <li><strong>Quick</strong>: 2-char chunks (HI→IE→ER) — fast for short words</li>
              <li><strong>Bridge ⭐</strong>: 3-char chunks (HIE→IER→ERA) — recommended</li>
              <li><strong>Strong</strong>: 4-char chunks (HIER→ERAR→ARCH) — for long/tough words, max chain power!</li>
            </ul>
          </li>
          <li>
            <strong>🌳 Word Family — INTEGRATED into Story!</strong> ⭐⭐⭐
            <br />
            Family words are now <strong>woven INTO the chain story</strong> as characters/events!
            <br />
            Example: HIERARCHY story includes MONARCHY (one king), ANARCHY (chaos), OLIGARCHY (few rulers),
            PATRIARCHY (father), MATRIARCHY (mother) — all in ONE flowing narrative.
            <br />
            <em>Result: Replay the story → 6 words yaad ek saath! Pattern + narrative = sticky!</em>
          </li>
        </ul>
      </div>

      <div className="example-box">
        <h3>🤣 FUNNY Story Example (HIERARCHY) — Comedy + Family + Chain!</h3>
        <p>
          <strong>Story</strong> ab ekdum <em>Bollywood comedy style</em> mein hoti hai —
          slapstick, absurd, exaggerated imagery jo tumhe hasaye!
        </p>
        <p>
          <em>Sample funny story:</em>
          <br />
          "ARRE YAAR! 🤯 Ek <strong>HIER</strong> (high-ear) wala haathi 🐘 mike pakad ke
          'OYE BHAGAT SINGH ZINDABAD!' chillata hai — itni zor se ki uske kaan udd jaate hain!
          Achanak ek <strong>ERA</strong> ka portal khulta hai aur 1947 ka <strong>MONARCH</strong>
          (akela raja 👑) modern Mumbai mein gir jata hai — DHADDAM! 💥 Wo Uber book karne ki
          koshish karta hai but <strong>ANARCHY</strong> (chaos!) mach jaata hai 🚕💥.
          <strong>OLIGARCHY</strong> (4-5 Tata-Ambani type 💼) bilkul ghabra ke jet pakdte hain.
          <strong>PATRIARCHY</strong> waale dadaji aur <strong>MATRIARCHY</strong> waali daadi ji
          apas mein ladai start kar dete hain — 'TUMHARA SYSTEM PURANA!' shouting match. Yahi sab
          milke banta hai HIERARCHY ka mahaul!"
        </p>
        <p>
          <strong>Why funny stories stick</strong>: Research shows <em>laughter + bizarre imagery
          = strongest memory encoding</em>. Aapka brain comedy never forgets! 🧠😂
        </p>
        <p>
          <strong>Result</strong>: Hasi-hasi mein 6 words yaad ho gaye! HIERARCHY + 5 family! 🎯
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

        <label>🔗 Chain Strength chuno (overlap level):</label>
        <div className="place-selector">
          {CHAIN_MODES.map((mode) => (
            <button
              type="button"
              key={mode.value}
              className={`place-btn ${chainMode === mode.value ? "active" : ""}`}
              onClick={() => setChainMode(mode.value)}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "-4px" }}>
          {CHAIN_MODES.find((m) => m.value === chainMode)?.desc}
          <br />
          <strong>Example:</strong> {CHAIN_MODES.find((m) => m.value === chainMode)?.example}
        </p>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={includeFamily}
            onChange={(e) => setIncludeFamily(e.target.checked)}
            style={{ width: "auto", padding: 0, margin: 0 }}
          />
          🌳 Include Word Family Multiplier (5-7 related words FREE!)
        </label>

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
            <TypingKeyboard word={input} />
          </div>
        </div>
      )}
    </ChapterLayout>
  );
}
