import { useState, useEffect, useRef } from "react";

/**
 * TypingKeyboard - Animates typing of a word on a virtual QWERTY keyboard.
 *
 * Props:
 * - word: the word to type out (e.g. "hierarchy")
 */

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const SPEEDS = [
  { label: "🐢 Slow", value: 1200 },
  { label: "🚶 Normal", value: 700 },
  { label: "🏃 Fast", value: 350 },
];

export default function TypingKeyboard({ word }) {
  const cleanWord = (word || "").toUpperCase().replace(/[^A-Z]/g, "");
  const letters = cleanWord.split("");

  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = not started, 0..letters.length-1 = typing, letters.length = finished
  const [speed, setSpeed] = useState(700);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Auto-play once when component mounts
  useEffect(() => {
    if (cleanWord.length > 0) {
      const t = setTimeout(() => start(), 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanWord]);

  // Drive the typing animation
  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= letters.length - 1) {
          clearInterval(intervalRef.current);
          setPlaying(false);
          return letters.length; // mark as finished
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, letters.length]);

  const start = () => {
    setCurrentIndex(-1);
    // small delay before first letter
    setTimeout(() => {
      setCurrentIndex(0);
      setPlaying(true);
    }, 100);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
    setCurrentIndex(-1);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
  };

  const resume = () => {
    if (currentIndex < letters.length - 1) {
      setPlaying(true);
    } else {
      start();
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const currentLetter =
    currentIndex >= 0 && currentIndex < letters.length ? letters[currentIndex] : null;

  if (cleanWord.length === 0) return null;

  return (
    <div className="typing-keyboard">
      <div className="tk-header">
        <h4>⌨️ Spelling Animation: {cleanWord}</h4>
        <div className="tk-progress-text">
          {currentIndex >= 0 && currentIndex < letters.length
            ? `Typing letter ${currentIndex + 1} of ${letters.length}: ${currentLetter}`
            : currentIndex >= letters.length
            ? `✅ Complete! ${letters.length} letters typed.`
            : "Press Play to start"}
        </div>
      </div>

      {/* Typed text display */}
      <div className="tk-typed-display">
        {letters.map((letter, i) => (
          <span
            key={i}
            className={`tk-letter ${
              i < currentIndex
                ? "typed"
                : i === currentIndex
                ? "active"
                : "pending"
            }`}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Virtual Keyboard */}
      <div className="tk-keyboard">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className={`tk-row tk-row-${rowIdx}`}>
            {row.map((key) => (
              <div
                key={key}
                className={`tk-key ${currentLetter === key ? "tk-key-active" : ""}`}
              >
                {key}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="tk-controls">
        {!playing && currentIndex < 0 && (
          <button type="button" className="tk-btn tk-btn-play" onClick={start}>
            ▶ Play
          </button>
        )}
        {!playing && currentIndex >= 0 && currentIndex < letters.length && (
          <button type="button" className="tk-btn tk-btn-play" onClick={resume}>
            ▶ Resume
          </button>
        )}
        {playing && (
          <button type="button" className="tk-btn tk-btn-pause" onClick={pause}>
            ⏸ Pause
          </button>
        )}
        <button type="button" className="tk-btn tk-btn-reset" onClick={reset}>
          ↻ Reset
        </button>
        {(!playing && currentIndex >= letters.length) && (
          <button type="button" className="tk-btn tk-btn-play" onClick={start}>
            🔁 Play Again
          </button>
        )}

        <div className="tk-speed-controls">
          <span style={{ marginRight: "8px", fontSize: "0.85rem", color: "var(--text-light)" }}>
            Speed:
          </span>
          {SPEEDS.map((s) => (
            <button
              type="button"
              key={s.value}
              className={`tk-speed-btn ${speed === s.value ? "active" : ""}`}
              onClick={() => handleSpeedChange(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
