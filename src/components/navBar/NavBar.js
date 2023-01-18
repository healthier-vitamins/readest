import { Link } from "react-router-dom";
import "./NavBar.css";
import SearchBar from "../searchBar/SearchBar";

function NavBar() {
  return (
    <div>
      <div className="top-navbar">
        <Link className="center-link" to={"/"}>
          <span className="title-span">readest</span>
        </Link>
      </div>
      <div className="bottom-navbar">
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
