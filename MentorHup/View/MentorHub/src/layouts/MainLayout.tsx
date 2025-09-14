import { Outlet } from "react-router-dom";
import Nav from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
//import SideBar from "../components/SideBar/SideBarDashboard";



const MainLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
