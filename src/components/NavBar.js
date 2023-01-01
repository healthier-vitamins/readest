import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <div className="navbar">
      <Link className="navbar-link" to={"/"}>
        Home
      </Link>
      <Link className="signup-login-link" to={"/"}>
        Sign up/Login
      </Link>
    </div>
  );
}

export default NavBar;
