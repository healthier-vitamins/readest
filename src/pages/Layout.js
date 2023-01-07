import { Outlet } from "react-router";
import NavBar from "../components/navBar/NavBar";

function Layout() {
  return (
    <>
      <NavBar></NavBar>
      <Outlet></Outlet>
    </>
  );
}

export default Layout;
