import { Link } from "react-router-dom";
import "./NavBar.css";
import SearchBar from "../searchBar/SearchBar";
import { RxDoubleArrowRight } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toggleOffCanvasModal } from "../../store/slices/state.slice";

function NavBar() {
  const dispatch = useDispatch();
  const { offCanvasModalState } = useSelector((state) => state.state);
  function handleOffCanvas() {
    dispatch(toggleOffCanvasModal());
  }

  return (
    <div>
      <div className="top-navbar">
        <Link className="center-link" to={"/"}>
          <span className="title-span">readest</span>
        </Link>
      </div>
      <div className="bottom-navbar">
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
        <p className="left-box"></p>
        <SearchBar className="center-bar"></SearchBar>
        <div className="right-box">
          <Link className="right-link">Sign Up/Login</Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
