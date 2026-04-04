import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

export default function LinkSystem() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length < 2) return alert("कम से कम 2 items डालो, comma से अलग करो");
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
      setResult("Error: Backend server से connect नहीं हो पाया। Server चालू है ना?");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Link System</strong> सबसे basic memory technique है।
        इसमें हम एक <em>अजीबोग़रीब mental images की chain</em> बनाते हैं
        जो list के हर item को अगले item से connect करती है।
      </p>
      <div className="key-points">
        <h3>Key Principles (मुख्य सिद्धांत):</h3>
        <ul>
          <li><strong>अजीब बनाओ</strong> — जितनी strange image, उतना अच्छा याद रहेगा</li>
          <li><strong>Action डालो</strong> — चीज़ें move करें, टकराएँ, उड़ें, नाचें</li>
          <li><strong>बढ़ा-चढ़ा कर सोचो</strong> — Giant बनाओ, tiny बनाओ, लाखों में multiply करो</li>
          <li><strong>जोड़ी बनाओ</strong> — Item 1 को 2 से जोड़ो, फिर 2 को 3 से, और आगे बढ़ो</li>
        </ul>
      </div>
      <div className="example-box">
        <h3>Example (उदाहरण):</h3>
        <p>याद करना है: <strong>दूध, बिल्ली, छाता, पियानो</strong></p>
        <p>
          सोचो एक giant <strong>दूध</strong> का carton एक चिल्लाती <strong>बिल्ली</strong> पर गिरता है,
          बिल्ली <strong>छाता</strong> खोल कर बचती है, लेकिन छाता उड़ कर एक <strong>पियानो</strong> पर
          गिरता है जो अपने आप बजने लगता है!
        </p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={1} title="Link System (कड़ी जोड़ो)" icon={"\u{1F517}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>वो items लिखो जो याद करने हैं (comma से अलग करो):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="जैसे: दूध, बिल्ली, छाता, पियानो, रॉकेट"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "बन रही है..." : "Memory Story बनाओ"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>आपकी Memory Story:</h3>
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
