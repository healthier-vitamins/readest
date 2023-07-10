import { useEffect } from "react";

import Cookies from "universal-cookie";
import CreateBookModal from "../components/modal/CreateBookModal";
import SaveWordModal from "../components/modal/SaveWordModal";
import NavBar from "../components/navBar/NavBar";
// import useWindowDimension from "../utils/useWindowDimension";
import { getEmailFromToken, isTokenExpired } from "../utils/cryptography";
import { userLoggedIn } from "../store/slices/user.slice";
import GeneralToast from "../components/toast/GeneralToast";
import "./Layout.scss";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";

const cookies = new Cookies();

function Layout() {
  // const { height, width } = useWindowDimension();
  const dispatch = useAppDispatch();

  // function setHeight() {
  //   return {
  //     height: height,
  //   };
  // }

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (!isExpired) {
        const email = getEmailFromToken(token);
        if (token) {
          const payload = {
            email: email,
            token: token,
            refreshToken: "",
          };
          dispatch(userLoggedIn(payload));
        }
      }
    }
  }, [dispatch]);

  return (
    <>
      {/* height: 1287 */}
      {/* width: 1278 */}

      <NavBar></NavBar>
      <Outlet></Outlet>

      {/* <div className="mainest">
        <div className="all-navbar">
          <NavBar></NavBar>
        </div>
        <div className="outlet">
          <Outlet></Outlet>
        </div> */}

      <CreateBookModal></CreateBookModal>
      <SaveWordModal></SaveWordModal>
      <GeneralToast></GeneralToast>
    </>
  );
}

export default Layout;
