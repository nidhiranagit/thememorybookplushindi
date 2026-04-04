import { Link } from "react-router-dom";

const chapters = [
  {
    number: 1,
    title: "Link System (कड़ी जोड़ो)",
    icon: "\u{1F517}",
    description: "Items को bizarre, vivid कहानियों से जोड़ो। कोई भी list डालो और एक funny याद रहने वाली story पाओ!",
    path: "/link-system",
  },
  {
    number: 2,
    title: "Peg System (खूंटी विधि)",
    icon: "\u{1F4CC}",
    description: "Items को पहले से याद Hindi pegs (1=ताज, 2=नाग...) से जोड़ो। Number wise तुरंत याद करो!",
    path: "/peg-system",
  },
  {
    number: 3,
    title: "Phonetic Alphabet (ध्वनि वर्णमाला)",
    icon: "\u{1F522}",
    description: "Numbers को Hindi व्यंजनों में बदलो, फिर yaadgaar शब्दों में। Phone number भूलना impossible!",
    path: "/phonetic-alphabet",
  },
  {
    number: 4,
    title: "Substitute Words (बदली शब्द)",
    icon: "\u{1F504}",
    description: "Mushkil या abstract words को आसान, picture-worthy substitutes में बदलो जो visualize कर सको।",
    path: "/substitute-words",
  },
  {
    number: 5,
    title: "Loci Method (Memory Palace)",
    icon: "\u{1F3F0}",
    description: "अपना Memory Palace बनाओ! Items को जानी-पहचानी जगहों पर रखो और walk करके याद करो।",
    path: "/loci-method",
  },
];

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>The Memory Book</h1>
        <p className="subtitle">
          Harry Lorayne & Jerry Lucas की classic guide पर based — हिंदी Edition
        </p>
        <p className="tagline">
          5 powerful memory techniques सीखो AI-powered practice tools के साथ
        </p>
      </header>

      <div className="chapters-grid">
        {chapters.map((ch) => (
          <Link to={ch.path} key={ch.number} className="chapter-card">
            <span className="card-icon">{ch.icon}</span>
            <span className="card-number">अध्याय {ch.number}</span>
            <h2>{ch.title}</h2>
            <p>{ch.description}</p>
            <span className="card-cta">सीखना शुरू करो &rarr;</span>
          </Link>
        ))}
      </div>

      <footer className="home-footer">
        <p>
          <em>The Memory Book</em> by Harry Lorayne & Jerry Lucas (1974) पर आधारित
        </p>
      </footer>
    </div>
  );
}
