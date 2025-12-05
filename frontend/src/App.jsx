import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileUpdate from "./pages/ProfileUpdate";
import ResumeBuilder1 from "./pages/ResumeBuilder1";
import Dashboard from "./pages/Dashboard";
import ColdReplyGenerator from "./pages/ColdReplyGenerator";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import "./index.css";

// Placeholder pages
const Pricing = () => (
  <div className="min-h-screen bg-black text-white pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Pricing</h1>
      <p className="text-white/70">Pricing page coming soon...</p>
    </div>
  </div>
);

const ProductPage = ({ productName }) => (
  <div className="min-h-screen bg-black text-white pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 capitalize">{productName}</h1>
      <p className="text-white/70">Product page coming soon...</p>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDashboardPage =
    location.pathname === "/dashboard" ||
    location.pathname === "/resume-builder" ||
    location.pathname === "/products/cold-mail" ||
    location.pathname === "/profile" ||
    location.pathname === "/profile/update" ||
    location.pathname === "/settings";

  return (
    <div className="min-h-screen bg-black">
      {!isHomePage && !isDashboardPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile/update"
          element={
            <ProtectedRoute>
              <ProfileUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/cold-mail"
          element={
            <ProtectedRoute>
              <ColdReplyGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/fillora"
          element={<ProductPage productName="Fillora [Extension]" />}
        />
        <Route
          path="/products/interview-prep"
          element={<ProductPage productName="Interview Prep" />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
