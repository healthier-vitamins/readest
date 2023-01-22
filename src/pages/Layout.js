import { Outlet } from "react-router";
import CreateBookModal from "../components/modal/CreateBookModal";
import SaveWordModal from "../components/modal/SaveWordModal";
import NavBar from "../components/navBar/NavBar";

function Layout() {
  return (
    <>
      <NavBar></NavBar>
      <Outlet></Outlet>
      <CreateBookModal></CreateBookModal>
      <SaveWordModal></SaveWordModal>
    </>
  );
}

export default Layout;
