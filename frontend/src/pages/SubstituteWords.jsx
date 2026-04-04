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
    if (words.length < 1) return alert("कम से कम 1 word डालो");
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
      setResult("Error: Backend server से connect नहीं हो पाया।");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Substitute Word</strong> technique abstract, foreign, या
        mushkil words को <em>concrete, visualize करने लायक substitutes</em> में बदलती है
        जो सुनने में मिलते-जुलते हों।
      </p>
      <div className="key-points">
        <h3>कैसे काम करता है:</h3>
        <ol>
          <li><strong>तोड़ो</strong> — word को syllables में तोड़ो</li>
          <li><strong>ढूँढो</strong> — हर syllable जैसी सुनाई देने वाली concrete चीज़ ढूँढो</li>
          <li><strong>बनाओ</strong> — उन substitute words को मिला कर एक vivid, bizarre image बनाओ</li>
        </ol>
      </div>
      <div className="example-box">
        <h3>Example (उदाहरण):</h3>
        <p><strong>"Photosynthesis"</strong> (प्रकाश संश्लेषण)</p>
        <p>सुनने में लगता है: <strong>"Photo-Sin-Thesis"</strong></p>
        <p>सोचो: एक <strong>photo</strong> (camera) जो <strong>sin</strong> (पाप) कर रहा है —
        एक <strong>thesis</strong> (किताब) चुरा रहा है — और सब कुछ धूप में हो रहा है!</p>
      </div>
      <div className="example-box">
        <h3>एक और Example:</h3>
        <p><strong>"Mitochondria"</strong> (माइटोकॉन्ड्रिया)</p>
        <p>सुनने में लगता है: <strong>"Mighty-Konda-Ria"</strong></p>
        <p>सोचो: एक <strong>mighty</strong> (ताकतवर) आदमी <strong>कोंडा</strong> (पहाड़) पर
        <strong>रिया</strong> (ladki) को बचा रहा है — Bollywood style!</p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={4} title="Substitute Words (बदली शब्द)" icon={"\u{1F504}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>वो mushkil या abstract words डालो (comma से अलग):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="जैसे: photosynthesis, algorithm, Renaissance, mitochondria"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "बन रही है..." : "Substitutes बनाओ"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>आपके Substitute Words:</h3>
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
