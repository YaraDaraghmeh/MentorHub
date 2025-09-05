import Nav from "./components/Navbar/Navbar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Home</h1>
              </>
            }
          />
          <Route path="/about" element={<h1>Aboute</h1>} />
          <Route path="/browsMentor" element={<h1>Brows Mentors</h1>} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
