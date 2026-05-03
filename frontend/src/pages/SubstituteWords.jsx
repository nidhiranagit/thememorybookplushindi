import { useState, useRef } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ExportButtons from "../components/ExportButtons";

const API = "http://localhost:8001";

export default function SubstituteWords() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const words = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (words.length < 1) return alert("Kam se kam 1 word daalo");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/substitute-words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words }),
      });
      const data = await res.json();
      setResult(data.substitutes);
    } catch (err) {
      setResult("Error: Backend server se connect nahi ho paaya.");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Substitute Word</strong> technique mushkil words ko <em>picture-worthy substitutes</em> mein badalti hai — lekin sirf naam yaad karna kaafi nahi!
        Image aisi honi chahiye jo word ka <strong>naam BHI</strong> aur uska <strong>actual meaning BHI</strong> encode kare.
      </p>
      <div className="key-points">
        <h3>Kaise kaam karta hai:</h3>
        <ol>
          <li><strong>Samjho</strong> — Pehle word ka real meaning samjho</li>
          <li><strong>Todo</strong> — Word ko similar-sounding concrete words mein todo</li>
          <li><strong>Jodo</strong> — Ab ek image banao jo DONO kaam kare: pronunciation yaad rahe + meaning bhi dikhe</li>
        </ol>
      </div>
      <div className="example-box">
        <h3>Example:</h3>
        <p><strong>"Photosynthesis"</strong> — Matlab: Plants sunlight se apna food (glucose) aur oxygen banaate hain</p>
        <p>Sunne mein lagta hai: <strong>"Photo-Sin-Thesis"</strong></p>
        <p>Socho: Ek <strong>photo</strong> (camera) dhoop mein khada hai, <strong>sin</strong> (paap) karke
        ek plant se khana chura raha hai, aur plant apni <strong>thesis</strong> (kitaab) se oxygen ke bubbles
        chhod raha hai! Camera = photo, dhoop = sunlight, plant = plant, khana = food, oxygen = bubbles!</p>
        <p><em>Kaise yaad rahega: Photo = naam, dhoop + plant + khana + oxygen = poora meaning!</em></p>
      </div>
      <div className="example-box">
        <h3>Ek aur Example:</h3>
        <p><strong>"Mitochondria"</strong> — Matlab: Cell ka powerhouse, energy (ATP) produce karta hai</p>
        <p>Sunne mein lagta hai: <strong>"Mighty-Konda-Ria"</strong></p>
        <p>Socho: Ek <strong>mighty</strong> (takatwar) aadmi ek chhote se cell ke andar <strong>Konda</strong> (pahaad)
        par khada hai, uske haathon mein bijli ke bolts hain, aur <strong>Ria</strong> (ladki) ko energy de raha hai
        taaki wo superpower se udd sake!</p>
        <p><em>Kaise yaad rahega: Mighty = powerhouse naam, cell ke andar = cell mein hota hai, bijli = energy produce karta hai!</em></p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={4} title="Substitute Words (Badli Shabd)" icon={"\u{1F504}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>Wo mushkil ya abstract words daalo (comma se alag):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="jaise: photosynthesis, algorithm, Renaissance, mitochondria"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ban rahi hai..." : "Substitutes Banao"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapke Substitute Words:</h3>
          <ExportButtons
            targetRef={resultRef}
            filename="substitute-words"
            title="Substitute Words"
            inputLabel="Words to Memorize"
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
