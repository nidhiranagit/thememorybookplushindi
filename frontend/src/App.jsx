import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LinkSystem from "./pages/LinkSystem";
import PegSystem from "./pages/PegSystem";
import PhoneticAlphabet from "./pages/PhoneticAlphabet";
import SubstituteWords from "./pages/SubstituteWords";
import LociMethod from "./pages/LociMethod";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/link-system" element={<LinkSystem />} />
        <Route path="/peg-system" element={<PegSystem />} />
        <Route path="/phonetic-alphabet" element={<PhoneticAlphabet />} />
        <Route path="/substitute-words" element={<SubstituteWords />} />
        <Route path="/loci-method" element={<LociMethod />} />
      </Routes>
    </div>
  );
}

export default App;
