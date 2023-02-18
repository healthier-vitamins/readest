import { Link } from "react-router-dom";
import "./NavBar.scss";
import SearchBar from "../searchBar/SearchBar";
import { RxDoubleArrowRight } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toggleOffCanvasModal } from "../../store/slices/state.slice";
import SignUpPopover from "../modal/SignUpPopover";

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
          <SignUpPopover></SignUpPopover>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
