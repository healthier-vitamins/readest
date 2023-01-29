import { Link } from "react-router-dom";
import "./NavBar.css";
import SearchBar from "../searchBar/SearchBar";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
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
            <BiLeftArrow
              className="arrow-head-icon"
              onClick={handleOffCanvas}
            ></BiLeftArrow>
          ) : (
            <BiRightArrow
              className="arrow-head-icon"
              onClick={handleOffCanvas}
            ></BiRightArrow>
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
