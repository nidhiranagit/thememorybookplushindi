import { Link } from "react-router-dom";

const chapters = [
  {
    number: 1,
    title: "Link System (Kadi Jodo)",
    icon: "\u{1F517}",
    description: "Items ko bizarre, vivid kahaaniyon se jodo. Koi bhi list daalo aur ek funny yaad rehne wali story paao!",
    path: "/link-system",
  },
  {
    number: 2,
    title: "Peg System (Khunti Vidhi)",
    icon: "\u{1F4CC}",
    description: "Items ko pehle se yaad Hindi pegs (1=Taaj, 2=Naag...) se jodo. Number wise turant yaad karo!",
    path: "/peg-system",
  },
  {
    number: 3,
    title: "Phonetic Alphabet (Dhwani Varnamala)",
    icon: "\u{1F522}",
    description: "Numbers ko Hindi consonants mein badlo, phir yaadgaar words mein. Phone number bhoolna impossible!",
    path: "/phonetic-alphabet",
  },
  {
    number: 4,
    title: "Substitute Words (Badli Shabd)",
    icon: "\u{1F504}",
    description: "Mushkil ya abstract words ko aasan, picture-worthy substitutes mein badlo jo visualize kar sako.",
    path: "/substitute-words",
  },
  {
    number: 5,
    title: "Loci Method (Memory Palace)",
    icon: "\u{1F3F0}",
    description: "Apna Memory Palace banao! Items ko jaani-pehchaani jagahon par rakho aur walk karke yaad karo.",
    path: "/loci-method",
  },
];

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>The Memory Book</h1>
        <p className="subtitle">
          Harry Lorayne & Jerry Lucas ki classic guide par based — Hindi Edition
        </p>
        <p className="tagline">
          5 powerful memory techniques seekho AI-powered practice tools ke saath
        </p>
      </header>

      <div className="chapters-grid">
        {chapters.map((ch) => (
          <Link to={ch.path} key={ch.number} className="chapter-card">
            <span className="card-icon">{ch.icon}</span>
            <span className="card-number">Chapter {ch.number}</span>
            <h2>{ch.title}</h2>
            <p>{ch.description}</p>
            <span className="card-cta">Seekhna shuru karo &rarr;</span>
          </Link>
        ))}
      </div>

      <footer className="home-footer">
        <p>
          <em>The Memory Book</em> by Harry Lorayne & Jerry Lucas (1974) par aadhaarit
        </p>
      </footer>
    </div>
  );
}
