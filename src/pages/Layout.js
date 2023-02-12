import { Outlet } from "react-router";
import CreateBookModal from "../components/modal/CreateBookModal";
import SaveWordModal from "../components/modal/SaveWordModal";
// import SignUpModal from "../components/modal/SignUpModal";
import NavBar from "../components/navBar/NavBar";
import useWindowDimension from "../utils/useWindowDimension";
import "./Layout.css";

function Layout() {
  const { height } = useWindowDimension();

  function heightLogic() {
    return {
      height: height,
    };
  }

  return (
    <>
      {console.log("height ||||||||||||||||||||||| ", height)}
      <div className="mainest" style={heightLogic()}>
        <div className="all-navbar">
          <NavBar></NavBar>
        </div>
        <div className="outlet">
          <Outlet></Outlet>
        </div>
      </div>
      <CreateBookModal></CreateBookModal>
      <SaveWordModal></SaveWordModal>
    </>
  );
}

export default Layout;
