import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./Pages/PublicPages/HomePage";
import LoginUser from "./Pages/PublicPages/Login";
import MainLayout from "./layouts/MainLayout";
import { useState } from "react";
import AboutUsPage from "./Pages/PublicPages/AboutUs";
import PublicMentors from "./Pages/PublicPages/PublicMentors";
import ContactUs from "./components/ContactUsPageComponents/ContactUs";
import ChooseUser from "./components/Cards/ChooseUser";
import SignUpMentee from "./Pages/PublicPages/SignUp/RegistrationMentee";
import SignUpMentor from "./Pages/PublicPages/SignUp/RegistrationMetor";
import JoinUsPage from "./Pages/PublicPages/JoinUsPage";
import { ThemeProvider } from "./Context/ThemeContext";
import BodySystem from "./layouts/bodyPages";
import Dashboard from "./components/Dashboard/dashboard";
import DashboardAd from "./Pages/AdminPages/Dashboard";
import ChateUser from "./Pages/MentorPages/Chatting";
import Booking from "./Pages/MentorPages/Booking";
import MenteeBooking from "./Pages/MenteePages/MenteeBookings";
import BrowseMentor from "./Pages/MenteePages/BrowseMonetor";
import MenteeDashboard from "./Pages/MenteePages/Dashboard";
import Users from "./Pages/AdminPages/Users";
import SessionsAdm from "./Pages/AdminPages/Sessions";
import ChattingAd from "./Pages/AdminPages/Chatting";
import Payments from "./Pages/AdminPages/Payments";
import FeedbackModal from "./components/SessionReview/SessionReview";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./Context/AuthContext";

// Component to handle default redirect
const DefaultRedirect = () => {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (roles) {
    case "Admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "Mentor":
      return <Navigate to="/mentor/dashboard" replace />;
    case "Mentee":
      return <Navigate to="/mentee/main" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Default route - redirect based on authentication */}
              <Route path="/" element={<DefaultRedirect />} />

              {/* Public Pages - accessible to everyone */}
              <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/browsMentor" element={<PublicMentors />} />
                <Route path="/contactUs" element={<ContactUs />} />
                <Route path="/joinUs" element={<JoinUsPage />} />
              </Route>

              {/* Login & Registration - public routes */}
              <Route path="/login" element={<LoginUser />} />
              <Route path="/registration" element={<ChooseUser />} />
              <Route path="/SignUp-mentee" element={<SignUpMentee />} />
              <Route path="/SignUp-mentor" element={<SignUpMentor />} />

              {/* Admin Routes - Protected */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <BodySystem />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardAd />} />
                <Route path="users" element={<Users />} />
                <Route path="chatting" element={<ChattingAd />} />
                <Route path="sessions" element={<SessionsAdm />} />
                <Route path="payment" element={<Payments />} />
              </Route>

              {/* Mentor Routes - Protected */}
              <Route
                path="/mentor/*"
                element={
                  <ProtectedRoute allowedRoles={["Mentor"]}>
                    <BodySystem />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="chatting" element={<ChateUser />} />
                <Route path="booking" element={<Booking />} />
              </Route>

              {/* Mentee Routes - Protected */}
              <Route
                path="/mentee/*"
                element={
                  <ProtectedRoute allowedRoles={["Mentee"]}>
                    <BodySystem />
                  </ProtectedRoute>
                }
              >
                <Route path="main" element={<BrowseMentor />} />
                <Route path="dashboard" element={<MenteeDashboard />} />
                <Route path="mentors" element={<BrowseMentor />} />
                <Route path="chatting" element={<ChateUser />} />
                <Route path="booking" element={<MenteeBooking />} />
              </Route>

              {/* Catch all - redirect to home or login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
