import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="app-container">
      <Navbar language={language} setLanguage={setLanguage} />
      <LandingPage language={language} />
      <Footer language={language} />
    </div>
  );
}

export default App;