import { useState } from "react";
import ChapterLayout from "../components/ChapterLayout";
import LoadingSpinner from "../components/LoadingSpinner";

const API = "http://localhost:8001";

const PHONETIC_MAP = [
  { digit: "0", sounds: "S, Z", example: "Saagar, Zameen" },
  { digit: "1", sounds: "T, D", example: "Taala, Diya" },
  { digit: "2", sounds: "N", example: "Nadi, Naav" },
  { digit: "3", sounds: "M", example: "Moti, Maala" },
  { digit: "4", sounds: "R", example: "Rassi, Raja" },
  { digit: "5", sounds: "L", example: "Laddu, Lota" },
  { digit: "6", sounds: "Chh, Sh, Ch", example: "Chhaata, Sher" },
  { digit: "7", sounds: "K, G", example: "Kamal, Gaay" },
  { digit: "8", sounds: "Ph, V", example: "Phool, Veena" },
  { digit: "9", sounds: "P, B", example: "Patang, Billi" },
];

export default function PhoneticAlphabet() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number || !/^\d+$/.test(number)) return alert("Ek valid number daalo");
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
      setResult("Error: Backend server se connect nahi ho paaya.");
    }
    setLoading(false);
  };

  const theory = (
    <>
      <p>
        <strong>Phonetic Alphabet</strong> (Dhwani Varnamala) numbers ko
        <em> Hindi consonants</em> mein badalta hai. Phir tum vowels daal kar
        asli, picture-worthy shabd banaate ho — abstract numbers ko yaad rakhne laayak images mein badalte ho.
      </p>
      <div className="phonetic-table">
        <h3>Number-Sound Code:</h3>
        <table>
          <thead>
            <tr><th>Number</th><th>Sound</th><th>Example</th></tr>
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
          Vowels (A, Aa, I, Ee, U, Oo etc.) aur H, Y, W ki <strong>koi value nahi</strong> —
          ye sirf fillers hain shabd banane ke liye.
        </p>
      </div>
      <div className="example-box">
        <h3>Example:</h3>
        <p>Number: <strong>84</strong> &rarr; Sounds: Ph/V + R &rarr; Word: <strong>"Phaar" (tear)</strong></p>
        <p>Number: <strong>21</strong> &rarr; Sounds: N + T/D &rarr; Word: <strong>"Naad" (sound)</strong></p>
        <p>Ab socho ek giant <strong>Phaar</strong> (phaadne wala) <strong>Naad</strong> (dhol) par maar raha hai!</p>
      </div>
    </>
  );

  return (
    <ChapterLayout number={3} title="Phonetic Alphabet (Dhwani Varnamala)" icon={"\u{1F522}"} theory={theory}>
      <form onSubmit={handleSubmit} className="tool-form">
        <label>Wo number daalo jise yaad rakhne laayak shabdon mein badalna hai:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="jaise: 7395 ya 2021"
          maxLength={12}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Ban rahi hai..." : "Memory Words Banao"}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {result && (
        <div className="result-box">
          <h3>Aapke Phonetic Words:</h3>
          <div className="result-content" dangerouslySetInnerHTML={{
            __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
          }} />
        </div>
      )}
    </ChapterLayout>
  );
}
