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
import ChateUser from "./Pages/MentorPages/Chatting";
import Booking from "./Pages/MentorPages/Booking";

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
            <Route
              element={<MainLayout isDark={isDark} toggleTheme={toggleTheme} />}
            >
              <Route path="/" element={<HomePage isDark={isDark} />} />
              <Route path="/about" element={<AboutUsPage isDark={isDark} />} />
              <Route
                path="/browsMentor"
                element={<PublicMentors isDark={isDark} />}
              />
              <Route
                path="/browsMentor"
                element={<PublicMentors isDark={isDark} />}
              />
              <Route path="/contactUs" element={<ContactUs />} />
              <Route
                path="/browsMentor"
                element={<PublicMentors isDark={isDark} />}
              />
              <Route path="/joinUs" element={<JoinUsPage isDark={isDark} />} />
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
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
