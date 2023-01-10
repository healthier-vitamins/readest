import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <div className="navbar">
      <div className="right-navbar-box">
        <Link className="left-link" to={"/"}>
          Home
        </Link>
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
