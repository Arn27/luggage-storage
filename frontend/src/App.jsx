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
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./pages/AdminPanel";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessLocations from "./pages/BusinessLocations";
import BusinessLocationManage from "./pages/BusinessLocationManage";
import NewLocationForm from "./pages/NewLocationForm";
import PendingBookings from "./pages/PendingBookings";
import PastBookings from "./pages/PastBookings";
import UpcomingBookings from "./pages/UpcomingBookings";
import ActiveBookings from "./pages/ActiveBookings";
import UserActiveBooking from "./pages/UserActiveBooking";
import WalkInBookingPage from "./pages/WalkInBookingPage";
import AdminLocationForm from "./components/admin/AdminLocationForm";
import AdminLocationEdit from "./components/admin/AdminLocationEdit";


import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");

  return (
    <Router>
       <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
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
                <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/locations/new"
                element={
                  <AdminRoute>
                    <AdminLocationForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/locations/:id/edit"
                element={
                  <AdminRoute>
                    <AdminLocationEdit />
                  </AdminRoute>
                }
              />
                <Route path="/business" element={<BusinessDashboard />} />
                <Route path="/business/locations" element={<BusinessLocations />} />
                <Route path="/business/locations/new" element={<NewLocationForm />} />
                <Route path="/business/locations/:id" element={<BusinessLocationManage />} />
                <Route path="/business/bookings/pending" element={<PendingBookings />} />
                <Route path="/business/bookings/past" element={<PastBookings />} />
                <Route path="/business/bookings/upcoming" element={<UpcomingBookings />} />
                <Route path="/user/booking/active" element={<UserActiveBooking />} />
                <Route path="/business/bookings/active" element={<ActiveBookings />} />
                <Route path="/location/:id/walk-in" element={<WalkInBookingPage />} />
              </Routes>
            </div>
          <Footer language={language} />
        </div>
      </LoadScript>
    </Router>
  );
}

export default App;
