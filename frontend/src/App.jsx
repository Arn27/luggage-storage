import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/landing/LandingPage";
import SearchResults from "./pages/search/SearchResults";
import LocationDetail from "./pages/search/LocationDetail";
import TravellerRegister from "./pages/auth/TravellerRegister";
import BusinessRegister from "./pages/auth/BusinessRegister";
import UserDashboard from "./pages/dashboard/UserDashboard";
import Login from "./pages/auth/Login";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./pages/dashboard/AdminPanel";
import BusinessDashboard from "./pages/dashboard/BusinessDashboard";
import BusinessLocations from "./pages/business/BusinessLocations";
import BusinessLocationManage from "./pages/business/BusinessLocationManage";
import NewLocationForm from "./pages/business/NewLocationForm";
import PendingBookings from "./pages/bookings/PendingBookings";
import PastBookings from "./pages/bookings/PastBookings";
import UpcomingBookings from "./pages/bookings/UpcomingBookings";
import ActiveBookings from "./pages/bookings/ActiveBookings";
import UserActiveBooking from "./pages/bookings/UserActiveBooking";
import AdminLocationForm from "./components/admin/AdminLocationForm";
import AdminLocationEdit from "./components/admin/AdminLocationEdit";
import ChangePassword from "./pages/auth/ChangePassword";
import StartBooking from "./pages/bookings/StartBooking";
import UserBookingDetail from "./pages/bookings/UserBookingDetail";
import QRCheckinPage from "./pages/bookings/QRCheckinPage";

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
                <Route path="/user/change-password" element={<ChangePassword />} />
                <Route path="/booking/:id/start" element={<StartBooking />} />
                <Route path="/user/bookings/:id" element={<UserBookingDetail />} />
                <Route path="/qr-checkin/:qr_token" element={<QRCheckinPage />} />
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
              </Routes>
            </div>
          <Footer language={language} />
        </div>
      </LoadScript>
    </Router>
  );
}

export default App;
