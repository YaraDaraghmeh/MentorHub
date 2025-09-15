import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import { ThemeProvider } from "../../MentorHub/src/Context/ThemeContext";
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

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <ThemeProvider>
        <Router>
          {/* Public Pages */}
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/browsMentor" element={<PublicMentors />} />
              <Route path="/browsMentor" element={<PublicMentors />} />
              <Route path="/contactUs" element={<ContactUs />} />
              <Route path="/browsMentor" element={<PublicMentors />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/browsMentor" element={<PublicMentors />} />
              <Route path="/browsMentor" element={<PublicMentors />} />
              <Route path="/contactUs" element={<ContactUs />} />
              <Route path="/browsMentor" element={<PublicMentors />} />
              <Route path="/joinUs" element={<JoinUsPage />} />
            </Route>
          </Routes>

          {/* Login & Registration */}
          <Routes>
            <Route path="/login" element={<LoginUser />} />
            <Route path="/registration" element={<ChooseUser />} />
            <Route path="/SignUp-mentee" element={<SignUpMentee />} />
            <Route path="/SignUp-mentor" element={<SignUpMentor />} />
          </Routes>

          {/* System Pages */}
          <Routes>
            <Route element={<BodySystem />}>
              <Route path="/mentor/dashboard" element={<Dashboard />} />
              <Route path="/mentor/chatting" element={<ChateUser />} />
              <Route path="/mentor/booking" element={<Booking />} />
              <Route path="/admin/dashboard" element={<DashboardAd />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/booking" element={<SessionsAdm />} />
            </Route>
          </Routes>
          <Routes>
            <Route element={<BodySystem />}>
              <Route path="/mentee/main" element={<BrowseMentor />} />
              <Route path="/mentee/dashboard" element={<MenteeDashboard />} />
              <Route path="/mentee/mentors" element={<BrowseMentor />} />
              <Route path="/mentee/chatting" element={<ChateUser />} />

              <Route path="/mentee/booking" element={<MenteeBooking />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
