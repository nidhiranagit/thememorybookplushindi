import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

const PHONETIC_MAP = [
  { digit: "0", sounds: "स, ज़", example: "सागर, ज़मीन" },
  { digit: "1", sounds: "त, द", example: "ताला, दीया" },
  { digit: "2", sounds: "न", example: "नदी, नाव" },
  { digit: "3", sounds: "म", example: "मोती, माला" },
  { digit: "4", sounds: "र", example: "रस्सी, राजा" },
  { digit: "5", sounds: "ल", example: "लड्डू, लोटा" },
  { digit: "6", sounds: "छ, श, च", example: "छाता, शेर" },
  { digit: "7", sounds: "क, ग", example: "कमल, गाय" },
  { digit: "8", sounds: "फ, व", example: "फूल, वीणा" },
  { digit: "9", sounds: "प, ब", example: "पतंग, बिल्ली" },
];

export default function PhoneticAlphabet() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number || !/^\d+$/.test(number)) return alert("एक valid number डालो");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/phonetic-words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number }),
      });
      const data = await res.json();
      setResult(data.words);
    } catch (err) {
      setResult("Error: Backend server से connect नहीं हो पाया।");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Phonetic Alphabet</strong> (ध्वनि वर्णमाला) numbers को
        <em> Hindi व्यंजनों (consonants)</em> में बदलता है। फिर तुम vowels डाल कर
        असली, picture-worthy शब्द बनाते हो — abstract numbers को याद रखने लायक images में बदलते हो।
      </p>
      <div className="phonetic-table">
        <h3>Number-ध्वनि Code:</h3>
        <table>
          <thead>
            <tr><th>अंक</th><th>व्यंजन</th><th>उदाहरण</th></tr>
          </thead>
          <tbody>
            {PHONETIC_MAP.map((row) => (
              <tr key={row.digit}>
                <td className="digit-cell">{row.digit}</td>
                <td>{row.sounds}</td>
                <td>{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-note">
          स्वर (अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ) और ह, य, व की <strong>कोई value नहीं</strong> —
          ये सिर्फ fillers हैं शब्द बनाने के लिए।
        </p>
      </div>
      <div className="example-box">
        <h3>Example (उदाहरण):</h3>
        <p>Number: <strong>84</strong> &rarr; Sounds: फ/व + र &rarr; शब्द: <strong>"फार" (far)</strong></p>
        <p>Number: <strong>21</strong> &rarr; Sounds: न + त/द &rarr; शब्द: <strong>"नाद" (sound)</strong></p>
        <p>अब सोचो एक giant <strong>फार</strong> (फावड़ा) <strong>नाद</strong> (ढोल) पर मार रहा है!</p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={3} title="Phonetic Alphabet (ध्वनि वर्णमाला)" icon={"\u{1F522}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>वो number डालो जिसे याद रखने लायक शब्दों में बदलना है:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="जैसे: 7395 या 2021"
          maxLength={12}
        />
        <button type="submit" disabled={loading}>
          {loading ? "बन रही है..." : "Memory Words बनाओ"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>आपके Phonetic Words:</h3>
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
