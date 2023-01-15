import { Link } from "react-router-dom";
import "./NavBar.css";
import { CgMenu } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { toggleOffCanvas } from "../../store/actions/states.action";

function NavBar() {
  const dispatch = useDispatch();

  return (
    <div className="navbar">
      <div className="right-navbar-box">
        <CgMenu
          className="menu-btn"
          onClick={() => {
            dispatch(toggleOffCanvas());
          }}
        ></CgMenu>
      </div>
      <div className="left-navbar-box">
        <Link className="right-link" to={"/words"}>
          Words
        </Link>
        <Link className="right-link" to={"/"}>
          Sign up/Login
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
