import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import SearchResults from "./pages/SearchResults";
import LocationDetail from "./pages/LocationDetail";
import TravellerRegister from "./pages/TravellerRegister";
import BusinessRegister from "./pages/BusinessRegister";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");

  return (
    <Router>
       <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className="app-container">
          <Navbar language={language} setLanguage={setLanguage} />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<LandingPage language={language} />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/location/:id" element={<LocationDetail />} />
                <Route path="/register" element={<TravellerRegister />} />
                <Route path="/register/business" element={<BusinessRegister />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<UserDashboard />} />
              </Routes>
            </div>
          <Footer language={language} />
        </div>
      </LoadScript>
    </Router>
  );
}

export default App;
