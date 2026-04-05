import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

export default function SubstituteWords() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
        <strong>Substitute Word</strong> technique abstract, foreign, ya
        mushkil words ko <em>concrete, visualize karne laayak substitutes</em> mein badalti hai
        jo sunne mein milte-julte hon.
      </p>
      <div className="key-points">
        <h3>Kaise kaam karta hai:</h3>
        <ol>
          <li><strong>Todo</strong> — Word ko syllables mein todo</li>
          <li><strong>Dhundho</strong> — Har syllable jaisi sunaai dene wali concrete cheez dhundho</li>
          <li><strong>Banao</strong> — Un substitute words ko mila kar ek vivid, bizarre image banao</li>
        </ol>
      </div>
      <div className="example-box">
        <h3>Example:</h3>
        <p><strong>"Photosynthesis"</strong></p>
        <p>Sunne mein lagta hai: <strong>"Photo-Sin-Thesis"</strong></p>
        <p>Socho: Ek <strong>photo</strong> (camera) jo <strong>sin</strong> (paap) kar raha hai —
        ek <strong>thesis</strong> (kitaab) chura raha hai — aur sab kuch dhoop mein ho raha hai!</p>
      </div>
      <div className="example-box">
        <h3>Ek aur Example:</h3>
        <p><strong>"Mitochondria"</strong></p>
        <p>Sunne mein lagta hai: <strong>"Mighty-Konda-Ria"</strong></p>
        <p>Socho: Ek <strong>mighty</strong> (takatwar) aadmi <strong>Konda</strong> (pahaad) par
        <strong> Ria</strong> (ladki) ko bacha raha hai — Bollywood style!</p>
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
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
