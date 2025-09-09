import { Outlet } from "react-router-dom";
import Nav from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SideBar from "../components/SideBar/SideBarDashboard";

type listLayout = {
  isDark: boolean;
  toggleTheme: () => void;
};

const userProfile = {
  name: "Sara Sayed Ahmad",
  email: "sara@example.com",
};

const MainLayout = ({ isDark, toggleTheme }: listLayout) => {
  return (
    <>
      <SideBar profile={userProfile} role="admin" isDark={false} />
      <Nav isDark={isDark} toggleTheme={toggleTheme} />
      <Outlet />
      <Footer isDark={isDark} />
    </>
  );
};

export default MainLayout;
