import Nav from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import HomePage from "./Pages/PublicPages/HomePage";
import { useState } from "react";

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return (
    <>
      <Router>
        <Nav isDark={isDark} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<HomePage isDark={isDark} />} />
          <Route path="/about" element={<h1>Aboute</h1>} />
          <Route path="/browsMentor" element={<h1>Brows Mentors</h1>} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
