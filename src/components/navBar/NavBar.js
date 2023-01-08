import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <div className="navbar">
      <Link className="left-navbar-link" to={"/"}>
        Home
      </Link>
      <Link className="right-navbar-link" to={"/words"}>
        Words
      </Link>
      <Link className="right-navbar-link" to={"/"}>
        Sign up/Login
      </Link>
    </div>
  );
}

export default NavBar;
