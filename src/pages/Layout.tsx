import CreateBookModal from "../components/modal/CreateBookModal";
import SaveWordModal from "../components/modal/SaveWordModal";
import NavBar from "../components/navBar/NavBar";
import GeneralToast from "../components/toast/GeneralToast";
import "./Layout.scss";
import { Outlet } from "react-router-dom";

function Layout() {
  // const { height, width } = useWindowDimension();

  // function setHeight() {
  //   return {
  //     height: height,
  //   };
  // }

  return (
    <>
      {/* height: 1287 */}
      {/* width: 1278 */}

      <NavBar></NavBar>
      <Outlet></Outlet>
      <CreateBookModal></CreateBookModal>
      <SaveWordModal></SaveWordModal>
      <GeneralToast></GeneralToast>
    </>
  );
}

export default Layout;
