import { useState, useRef } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ExportButtons from "../components/ExportButtons";

const API = "http://localhost:8001";

const PLACES = [
  "Mera Ghar (My Home)",
  "Mandir (Temple)",
  "Bazaar (Market)",
  "School",
  "Railway Station",
  "Park",
];

export default function LociMethod() {
  const [place, setPlace] = useState("");
  const [customPlace, setCustomPlace] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const selectedPlace = place === "custom" ? customPlace : place;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlace) return alert("Pehle ek jagah chuno ya likho");
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length < 2) return alert("Kam se kam 2 items daalo");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/loci-walkthrough`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place: selectedPlace, items }),
      });
      const data = await res.json();
      setResult(data.walkthrough);
    } catch (err) {
      setResult("Error: Backend server se connect nahi ho paaya.");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Loci Method</strong> — jise <em>Memory Palace</em> bhi kehte hain —
        ye sabse puraani aur powerful memory technique hai. Ismein tum mentally
        items ko kisi jaani-pehchaani jagah mein specific spots par rakhte ho.
      </p>
      <div className="key-points">
        <h3>Kaise kaam karta hai:</h3>
        <ol>
          <li><strong>Jagah chuno</strong> — Koi aisi jagah jo tum achhi tarah jaante ho (ghar, mandir, school)</li>
          <li><strong>Raasta banao</strong> — Specific spots tay karo (darwaaza, baramda, rasoi...)</li>
          <li><strong>Items rakho</strong> — Har spot par item ko bizarre, exaggerated tarike se rakho</li>
          <li><strong>Yaad karo</strong> — Mentally walk karo — har spot par item yaad aayega!</li>
        </ol>
      </div>
      <div className="example-box">
        <h3>Example: Ghar mein Shopping List yaad karo</h3>
        <p>
          <strong>Darwaaza</strong>: Ek giant <strong>kela</strong> darwaaza block kar raha hai, chhilka utaar kar hi andar ja sakte ho.<br />
          <strong>Baramda</strong>: Poora floor <strong>doodh</strong> se bhara hai — phisalte ja rahe ho.<br />
          <strong>Rasoi</strong>: Ek <strong>murghi</strong> table par baith kar akhbaar padh rahi hai!
        </p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={5} title="Loci Method (Memory Palace)" icon={"\u{1F3F0}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>Apna Memory Palace chuno:</label>
        <div className="place-selector">
          {PLACES.map((p) => (
            <button
              type="button"
              key={p}
              className={`place-btn ${place === p ? "active" : ""}`}
              onClick={() => { setPlace(p); setCustomPlace(""); }}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={`place-btn ${place === "custom" ? "active" : ""}`}
            onClick={() => setPlace("custom")}
          >
            Koi aur jagah...
          </button>
        </div>

        {place === "custom" && (
          <input
            type="text"
            value={customPlace}
            onChange={(e) => setCustomPlace(e.target.value)}
            placeholder="Apni jagah likho (jaise: Naani ka ghar, Office)"
            className="custom-place-input"
          />
        )}

        <label>Wo items likho jo yaad karne hain (comma se alag):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="jaise: hydrogen, helium, lithium, beryllium, boron"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ban rahi hai..." : "Memory Palace Banao"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapka Memory Palace Walkthrough:</h3>
          <ExportButtons targetRef={resultRef} filename="memory-palace-walkthrough" title="Memory Palace Walkthrough" />
          <div ref={resultRef}>
            <MarkdownRenderer content={result} />
          </div>
        </div>
      )}
    </ChapterLayout>
  );
}
