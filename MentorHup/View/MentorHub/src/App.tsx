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
function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <Router>
        {/* Public Pages */}
        <Routes>
          <Route
            element={<MainLayout isDark={isDark} toggleTheme={toggleTheme} />}
          >
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/about" element={<AboutUsPage isDark={isDark} />} />
            <Route path="/browsMentor" element={<PublicMentors isDark={isDark} />} />
            <Route path="/browsMentor" element={<PublicMentors isDark={isDark} />} />
            <Route path="/contactUs" element={<ContactUs isDark={isDark} />} />
            <Route
              path="/browsMentor"
              element={<PublicMentors isDark={isDark} />}
            />
          </Route>
        </Routes>

        {/* Login & Registration */}
        <Routes>
          <Route path="/login" element={<LoginUser />} />
          <Route path="/registration" element={<ChooseUser />} />
          <Route path="/SignUp-mentee" element={<SignUpMentee />} />
          <Route path="/SignUp-mentor" element={<SignUpMentor />} />
        </Routes>

        {/*  */}
        <Routes>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
