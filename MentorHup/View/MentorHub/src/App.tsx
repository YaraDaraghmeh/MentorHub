import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/PublicPages/HomePage";
import LoginUser from "./Pages/PublicPages/Login";
import MainLayout from "./layouts/MainLayout";
import { useState } from "react";
import AboutUsPage from "./Pages/PublicPages/AboutUs";
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
            <Route path="/about" element={<h1>About</h1>} />
            <Route path="/browsMentor" element={<h1>Brows Mentors</h1>} />
          </Route>
        </Routes>

        {/* Login & Registration */}
        <Routes>
          <Route path="/login" element={<LoginUser />} />
        </Routes>

        {/*  */}
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} />} />
          <Route path="/about" element={<AboutUsPage isDark={isDark} />} />
          <Route path="/browsMentor" element={<h1>Brows Mentors</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
