import { Link } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchBar/SearchBar";
import { RxDoubleArrowRight } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toggleOffCanvasModal } from "../../store/slices/state.slice";
import SignUpPopover from "../modal/SignUpPopover";
import { userLoggedOut } from "../../store/slices/user.slice";

function NavBar() {
  const dispatch = useDispatch();
  const { offCanvasModalState } = useSelector((state) => state.state);
  const {
    authentication: { isUserLoggedIn },
  } = useSelector((state) => state.user);
  function handleOffCanvas() {
    dispatch(toggleOffCanvasModal());
  }

  function handleLogout() {
    dispatch(userLoggedOut());
  }

  return (
    <div>
      <div className="top-navbar">
        <div className="left-box"></div>
        <Link className="center-link" to={"/"}>
          <span className="title-span">readest</span>
        </Link>
        <div className="right-box">
          {isUserLoggedIn && (
            <>
              <div className="vertical-line"></div>
              <HiOutlineUserCircle className="user-icon"></HiOutlineUserCircle>
            </>
          )}
        </div>
      </div>
      <div className="bottom-navbar">
        <div className="left-box">
          <div className="arrow-head-box">
            {offCanvasModalState ? (
              <RxDoubleArrowRight
                className="arrow-head-icon"
                onClick={handleOffCanvas}
                style={{
                  transition: `transform 0.3s`,
                  transform: `rotate(180deg)`,
                }}
              ></RxDoubleArrowRight>
            ) : (
              <RxDoubleArrowRight
                className="arrow-head-icon"
                onClick={handleOffCanvas}
                style={{
                  transition: `transform 0.3s`,
                  transform: `rotate(360deg)`,
                }}
              ></RxDoubleArrowRight>
            )}
          </div>
        </div>
        <SearchBar className="center-bar"></SearchBar>
        <div className="right-box">
          {!isUserLoggedIn ? (
            <SignUpPopover></SignUpPopover>
          ) : (
            <div className="right-link" onClick={() => handleLogout()}>
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
