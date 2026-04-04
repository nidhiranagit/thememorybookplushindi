import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

const PLACES = [
  "मेरा घर (My Home)",
  "मंदिर (Temple)",
  "बाज़ार (Market)",
  "स्कूल (School)",
  "रेलवे स्टेशन (Railway Station)",
  "पार्क (Park)",
];

export default function LociMethod() {
  const [place, setPlace] = useState("");
  const [customPlace, setCustomPlace] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPlace = place === "custom" ? customPlace : place;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlace) return alert("पहले एक जगह चुनो या लिखो");
    const items = input.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length < 2) return alert("कम से कम 2 items डालो");
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
      setResult("Error: Backend server से connect नहीं हो पाया।");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Loci Method</strong> (लोकी मेथड) — जिसे <em>Memory Palace</em> भी कहते हैं —
        ये सबसे पुरानी और powerful memory technique है। इसमें तुम mentally
        items को किसी जानी-पहचानी जगह में specific spots पर रखते हो।
      </p>
      <div className="key-points">
        <h3>कैसे काम करता है:</h3>
        <ol>
          <li><strong>जगह चुनो</strong> — कोई ऐसी जगह जो तुम अच्छी तरह जानते हो (घर, मंदिर, स्कूल)</li>
          <li><strong>रास्ता बनाओ</strong> — specific spots तय करो (दरवाज़ा, बरामदा, रसोई...)</li>
          <li><strong>Items रखो</strong> — हर spot पर item को bizarre, exaggerated तरीके से रखो</li>
          <li><strong>याद करो</strong> — mentally walk करो — हर spot पर item याद आएगा!</li>
        </ol>
      </div>
      <div className="example-box">
        <h3>Example: घर में Shopping List याद करो</h3>
        <p>
          <strong>दरवाज़ा</strong>: एक giant <strong>केला</strong> दरवाज़ा block कर रहा है, छिलका उतार कर ही अंदर जा सकते हो।<br />
          <strong>बरामदा</strong>: पूरा floor <strong>दूध</strong> से भरा है — फिसलते जा रहे हो।<br />
          <strong>रसोई</strong>: एक <strong>मुर्गी</strong> table पर बैठ कर अखबार पढ़ रही है!
        </p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={5} title="Loci Method (Memory Palace)" icon={"\u{1F3F0}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>अपना Memory Palace चुनो:</label>
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
            कोई और जगह...
          </button>
        </div>

        {place === "custom" && (
          <input
            type="text"
            value={customPlace}
            onChange={(e) => setCustomPlace(e.target.value)}
            placeholder="अपनी जगह लिखो (जैसे: नानी का घर, ऑफिस)"
            className="custom-place-input"
          />
        )}

        <label>वो items लिखो जो याद करने हैं (comma से अलग):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="जैसे: hydrogen, helium, lithium, beryllium, boron"
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "बन रही है..." : "Memory Palace बनाओ"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>आपका Memory Palace Walkthrough:</h3>
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
