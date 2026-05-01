import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

export default function DefinitionMemorizer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input || input.trim().length < 20) {
      return alert("Kam se kam ek proper definition daalo (20+ characters)");
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/definition-memorize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definition: input }),
      });
      const data = await res.json();
      setResult(data.memory_aid);
    } catch (err) {
      setResult("Error: Backend server se connect nahi ho paaya.");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>MOVIE Method</strong> paragraph-style technical definitions yaad karne ke liye
        <em> hybrid technique</em> hai. Ye 3 systems combine karta hai — <strong>Substitute Words +
        Link System + Loci Method</strong> — taaki tum textbook ka koi bhi definition
        permanent memory mein store kar sako.
      </p>
      <div className="key-points">
        <h3>5 Steps of MOVIE Method:</h3>
        <ol>
          <li><strong>M — Mark</strong> key points (paragraph ko 3-5 ideas mein todo)</li>
          <li><strong>O — Object-ify</strong> (har concept ko character banao)</li>
          <li><strong>V — Visualize</strong> (sab characters ki funny scene banao)</li>
          <li><strong>I — Install</strong> in Memory Palace (ghar ke rooms mein rakho)</li>
          <li><strong>E — Encode</strong> meaning + recall triggers</li>
        </ol>
      </div>
      <div className="example-box">
        <h3>Best for these types of content:</h3>
        <ul>
          <li>Loss functions (MSE vs MAE vs Huber)</li>
          <li>Optimizers (Adam vs SGD vs RMSprop)</li>
          <li>ML/DL theory paragraphs</li>
          <li>Scientific definitions with multiple sub-points</li>
          <li>Comparisons aur trade-offs wali content</li>
        </ul>
      </div>
      <div className="example-box">
        <h3>Example:</h3>
        <p><strong>Definition:</strong> "Use Huber loss when regression data has outliers. MSE squares errors so outlier dominates. MAE has gradient discontinuous at zero. Huber compromises..."</p>
        <p><strong>MOVIE Method output:</strong></p>
        <p>
          • <strong>Hubby (Huber)</strong> = referee between Muscle bhai (MSE) & Maa (MAE)<br />
          • Muscle bhai squares errors → outlier 100 ka 10,000 → dominates gradient<br />
          • Maa zero pe phisalti → MAE gradient discontinuous<br />
          • Hubby ke haath mein triangle (delta) → transition point control<br />
          • Sab "Mera Ghar" ke rooms mein installed!
        </p>
      </div>
    </>
  );

  return (
    <ChapterLayout
      number={6}
      title="Definition Memorizer (MOVIE Method)"
      icon={"\u{1F3AC}"}
      theory={theory}
    >
      <form onSubmit={handleSubmit} className="tool-form">
        <label>Wo paragraph ya definition daalo jise yaad karna hai:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="jaise: Use Huber loss when your regression data has outliers. MSE squares errors, so an outlier with error 100 contributes 10,000 to the loss..."
          rows={8}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ban rahi hai..." : "MOVIE Method Apply Karo"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapka Memory Aid (MOVIE Method):</h3>
          <div
            className="result-content"
            dangerouslySetInnerHTML={{
              __html: result
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      )}
    </ChapterLayout>
  );
}
