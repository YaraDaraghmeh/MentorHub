import { Outlet } from "react-router-dom";
import Nav from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

type listLayout = {
  isDark: boolean;
  toggleTheme: () => void;
};

const MainLayout = ({ isDark, toggleTheme }: listLayout) => {
  return (
    <>
      <Nav isDark={isDark} toggleTheme={toggleTheme} />
      <Outlet />
      <Footer isDark={isDark} />
    </>
  );
};

export default MainLayout;
