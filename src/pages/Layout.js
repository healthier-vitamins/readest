import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

function Layout() {
  return (
    <>
      <NavBar></NavBar>
      <Outlet></Outlet>
    </>
  );
}

export default Layout;
